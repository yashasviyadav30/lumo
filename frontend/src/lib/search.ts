import { api } from './api'

export type VideoCard = {
  video_id: string
  title: string
  channel_id: string
  channel_title: string
  thumbnail_url: string
  duration_s: number | null
  published_at: string | null
  live: string
  has_captions: boolean
}

export type HiddenCard = VideoCard & { reasons: string[]; playable: boolean }

export type SearchResponse = {
  mode: 'live' | 'cache' | 'cache_stale' | 'quota_exhausted'
  results: VideoCard[]
  hidden: HiddenCard[]
  hidden_count: number
  searches_left: number
  note: string | null
}

export function searchVideos(q: string): Promise<SearchResponse> {
  // POST so the search text never appears in a URL or request log (R11).
  return api<SearchResponse>('/api/search', { method: 'POST', body: JSON.stringify({ q }) })
}

export type FeedResponse = { results: VideoCard[]; hidden: HiddenCard[]; hidden_count: number }

// Home feed: new uploads from channels she follows + her goal's topics, with the same hide list as search.
export const getFeed = () => api<FeedResponse>('/api/feed')

export function muteChannel(channelId: string) {
  return api('/api/mutes', { method: 'POST', body: JSON.stringify({ kind: 'channel', value: channelId }) })
}

export function unmuteChannel(channelId: string) {
  return api('/api/mutes/remove', { method: 'POST', body: JSON.stringify({ kind: 'channel', value: channelId }) })
}

export const listMutes = () => api<Array<{ kind: string; value: string }>>('/api/mutes')

export function followChannel(channelId: string) {
  return api('/api/follows', { method: 'POST', body: JSON.stringify({ channel_id: channelId }) })
}

export function formatDuration(seconds: number | null): string {
  if (seconds == null) return ''
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const mm = h ? String(m).padStart(2, '0') : String(m)
  return (h ? `${h}:` : '') + `${mm}:${String(s).padStart(2, '0')}`
}

// Groups hidden videos by reason for the "Why" list: [["YouTube lists this as Music", 3], ...].
export function reasonCounts(hidden: HiddenCard[]): Array<[string, number]> {
  const counts = new Map<string, number>()
  for (const h of hidden) for (const r of h.reasons) counts.set(r, (counts.get(r) ?? 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1])
}
