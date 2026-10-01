import { useEffect, useRef, useState } from 'react'
import { YOUTUBE_EMBED_HOST, loadYouTubeApi, playerErrorMessage, playerVars, type YTPlayer } from '../lib/youtube'

type Props = { videoId: string; start?: number; end?: number; onReady?: (player: YTPlayer) => void }

export default function Player({ videoId, start, end, onReady }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let player: YTPlayer | null = null
    let cancelled = false
    const mount = document.createElement('div')
    hostRef.current?.appendChild(mount)

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled) return
        player = new YT.Player(mount, {
          host: YOUTUBE_EMBED_HOST,
          videoId,
          width: '100%',
          height: '100%',
          playerVars: playerVars(window.location.origin, { start, end }),
          events: {
            onReady: (e: { target: YTPlayer }) => {
              // The page-wide <meta name="referrer"> in index.html is the other half of the "Error 153" fix.
              hostRef.current?.querySelector('iframe')?.setAttribute('title', 'YouTube video player')
              onReady?.(e.target)
            },
            onError: (e: { data: number }) => setError(playerErrorMessage(e.data)),
          },
        })
      })
      .catch((e: Error) => setError(e.message))

    return () => {
      cancelled = true
      player?.destroy()
      mount.remove()
    }
  }, [videoId, start, end, onReady])

  return (
    <div className="player">
      <div className="player-frame" ref={hostRef} data-testid="player-host" />
      {error && (
        <p className="player-error" role="alert">
          {error}{' '}
          <a href={`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`}>Open on YouTube</a>
        </p>
      )}
    </div>
  )
}
