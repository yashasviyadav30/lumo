import { YOUTUBE_EMBED_HOST } from '../config'

// Minimal types for the parts of the YouTube IFrame Player API we use.
export type YTPlayer = {
  destroy(): void
  seekTo(seconds: number, allowSeekAhead: boolean): void
  getCurrentTime(): number
  getPlayerState(): number // 1 = playing, 2 = paused
  playVideo(): void
}
type YTNamespace = {
  Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer
}
declare global {
  interface Window {
    YT?: YTNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiPromise: Promise<YTNamespace> | null = null

// Loads https://www.youtube.com/iframe_api once and resolves when it's ready.
export function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (apiPromise) return apiPromise
  apiPromise = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      if (window.YT) resolve(window.YT)
    }
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    script.onerror = () => {
      apiPromise = null
      reject(new Error('Could not load the YouTube player'))
    }
    document.head.appendChild(script)
  })
  return apiPromise
}

// Player options. R7: standard controls, nothing hidden or blocked, no autoplay.
export function playerVars(origin: string, window_?: { start?: number; end?: number }): Record<string, string | number> {
  const range: Record<string, number> = {}
  // The embed's own start/end options: used to resume, and to replay just one part (no code pausing the player).
  if (window_?.start) range.start = Math.floor(window_.start)
  if (window_?.end) range.end = Math.floor(window_.end)
  return {
    ...range,
    autoplay: 0,
    controls: 1,
    playsinline: 1, // play inside the page on iPhone instead of forcing fullscreen
    rel: 0, // end-screen suggestions come from the same channel
    origin, // tells YouTube who embeds it (part of the iPhone "Error 153" fix, step 1.3)
  }
}


// Error codes from the IFrame Player API reference.
export function playerErrorMessage(code: number): string {
  switch (code) {
    case 2:
      return 'This video link is not valid.'
    case 5:
      return 'This video can’t play in this browser.'
    case 100:
      return 'This video was removed or made private.'
    case 101:
    case 150:
      return 'The owner doesn’t allow this video to play outside YouTube.'
    case 152:
    case 153:
      return 'YouTube couldn’t confirm where this player is embedded (error ' + code + ').'
    default:
      return 'The video couldn’t play (error ' + code + ').'
  }
}

// YouTube video IDs are 11 characters of letters, digits, "-" and "_".
export const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/

export { YOUTUBE_EMBED_HOST }
