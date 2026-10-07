import { useEffect, useState } from 'react'
import { followChannel, muteChannel, notInterested, unmuteChannel, type VideoCard } from './search'
import { starVideo } from './study'

export type Notice = { text: string; undo?: () => Promise<void> }

// The ⋮ menu actions shared by Home, Search and Shorts: one notice line, with Undo where it makes sense.
export function useVideoActions() {
  const [notice, setNotice] = useState<Notice | null>(null)
  useEffect(() => {
    if (!notice) return
    const t = window.setTimeout(() => setNotice(null), notice.undo ? 6000 : 4000) // a floating message goes by itself
    return () => window.clearTimeout(t)
  }, [notice])
  const [goneVideos, setGoneVideos] = useState<ReadonlySet<string>>(new Set())
  const [goneChannels, setGoneChannels] = useState<ReadonlySet<string>>(new Set())
  const toggled = (set: ReadonlySet<string>, id: string, on: boolean) => {
    const next = new Set(set)
    if (on) next.add(id)
    else next.delete(id)
    return next
  }
  const run = async (work: () => Promise<unknown>, done: Notice) => {
    try {
      await work()
      setNotice(done)
    } catch {
      setNotice({ text: 'Couldn’t save that. Check your connection and try again.' })
    }
  }
  const actions = {
    onStar: (id: string) => run(() => starVideo(id, true), { text: 'Starred. Find it in Library.' }),
    onFollow: (ch: string) =>
      run(() => followChannel(ch), { text: 'Following. Its new videos come to Home, and its Shorts to Shorts.' }),
    onMute: (ch: string) =>
      run(
        async () => {
          await muteChannel(ch)
          setGoneChannels((s) => toggled(s, ch, true))
        },
        {
          text: 'You won’t see this channel again.',
          undo: async () => {
            await unmuteChannel(ch)
            setGoneChannels((s) => toggled(s, ch, false))
          },
        },
      ),
    onNotInterested: (id: string) =>
      run(
        async () => {
          await notInterested(id)
          setGoneVideos((s) => toggled(s, id, true))
        },
        {
          text: 'Got it. This video won’t show again.',
          undo: async () => {
            await notInterested(id, true)
            setGoneVideos((s) => toggled(s, id, false))
          },
        },
      ),
  }
  const visible = (v: VideoCard) => !goneVideos.has(v.video_id) && !goneChannels.has(v.channel_id)
  const undo = async () => {
    const u = notice?.undo
    setNotice(null)
    if (u) await u().catch(() => setNotice({ text: 'Couldn’t undo. Try again.' }))
  }
  return { actions, visible, notice, undo }
}

export type VideoActions = ReturnType<typeof useVideoActions>['actions']
