import { api } from './api'
import type { VideoCard } from './search'

export type Tag = 'def' | 'sec' | 'pyq' | 'trick'
export const TAGS: Array<{ id: Tag; label: string }> = [
  { id: 'def', label: 'Definition' },
  { id: 'sec', label: 'Section' },
  { id: 'pyq', label: 'Past question' },
  { id: 'trick', label: 'Trick' },
]
export const tagLabel = (t: Tag) => TAGS.find((x) => x.id === t)?.label ?? t

export type Note = {
  id: string
  video_id: string
  t_seconds: number
  kind: 'note' | 'doubt'
  tag: Tag | null
  starred: boolean
  text: string
  solved: boolean
  answer: string
  cards: number
  created_at: string
}

export type NotepadDoc = { content: string; updated_at: string }
export type StudyData = {
  video: VideoCard | null
  position_s: number
  notes: Note[]
  description?: string
  starred?: boolean
  notepad?: NotepadDoc | null
}
export type YtComment = { author: string; author_url: string; text: string; likes: number; published_at: string | null; replies: number }
export type LibraryItem = { video_id: string; video: VideoCard | null; at: string; position_s?: number }
export type HomeSummary = {
  resume: { video_id: string; position_s: number; video: VideoCard | null } | null
  cards_due: number
  doubts_open: number
  marks_to_fill: number
  week: { reviews: number; notes: number }
  totals: { notes: number; lectures: number; cards: number }
}
export type Notebook = {
  lectures: Array<{ video_id: string; video: VideoCard | null; notes: Note[]; notepad?: NotepadDoc | null }>
  total: number
}
export type ReviewCard = {
  id: string
  note_id: string
  front: string
  answer: string
  blanks: string[]
  video_id: string
  t_seconds: number
  replay: { start: number; end: number }
  video?: VideoCard | null
}

// Video IDs always go in the request body, never the URL (R11).
const post = <T,>(path: string, body: unknown) => api<T>(path, { method: 'POST', body: JSON.stringify(body) })

export const openLecture = (video_id: string) => post<StudyData>('/api/study/open', { video_id })
export const addNote = (n: { video_id: string; t_seconds: number; kind?: 'note' | 'doubt'; text?: string; starred?: boolean; tag?: Tag }) =>
  post<Note>('/api/notes', n)
export const updateNote = (n: { id: string; text?: string; tag?: Tag; clear_tag?: boolean; starred?: boolean; solved?: boolean; answer?: string }) =>
  post<Note>('/api/notes/update', n)
export const deleteNote = (id: string) => post<void>('/api/notes/delete', { id })
export const saveProgress = (video_id: string, position_s: number) => post<void>('/api/progress', { video_id, position_s })
export const getComments = (video_id: string) => post<{ comments: YtComment[]; disabled: boolean }>('/api/study/comments', { video_id })
export const starVideo = (video_id: string, starred: boolean) => post<{ starred: boolean }>('/api/videos/star', { video_id, starred })
export const getLibrary = () => api<{ starred: LibraryItem[]; history: LibraryItem[] }>('/api/library')
// keepalive: the browser finishes the save even while the page closes (it allows bodies up to 64 KB).
export const saveNotepad = (video_id: string, content: string, text: string, keepalive = false) => {
  const body = JSON.stringify({ video_id, content, text })
  return api<{ updated_at: string }>('/api/notepad/save', { method: 'POST', body, keepalive: keepalive && body.length < 60_000 })
}
export const homeSummary = () => api<HomeSummary>('/api/home/summary')
export const notebook = (q = '', only?: 'doubts' | 'starred') => post<Notebook>('/api/notebook', { q, only })
export const makeCard = (note_id: string, blanks: string[]) => post<ReviewCard>('/api/cards', { note_id, blanks })
export const dueCards = () => api<{ cards: ReviewCard[] }>('/api/cards/due')
export const gradeCard = (id: string, grade: 'forgot' | 'unsure' | 'knew') =>
  post<{ retired: boolean; due_at: string; replay: { start: number; end: number } | null }>('/api/cards/grade', { id, grade })

export function clock(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return (h ? `${h}:${String(m).padStart(2, '0')}` : `${m}`) + `:${String(s).padStart(2, '0')}`
}

export function lectureTitle(video: VideoCard | null | undefined, videoId: string): string {
  return video?.title || `Lecture ${videoId}`
}

// A plain Markdown export of her notes, with "watch at" links back to YouTube (no YouTube data copied).
export function notebookMarkdown(book: Notebook): string {
  const lines = ['# My notes', '']
  for (const l of book.lectures) {
    lines.push(`## ${lectureTitle(l.video, l.video_id)}`, '')
    for (const n of l.notes) {
      const link = `https://www.youtube.com/watch?v=${l.video_id}&t=${n.t_seconds}s`
      const kind = n.kind === 'doubt' ? (n.solved ? '✅ Doubt' : '❓ Doubt') : n.tag ? n.tag.toUpperCase() : ''
      lines.push(`- [${clock(n.t_seconds)}](${link}) ${n.starred ? '★ ' : ''}${kind ? `**${kind}** ` : ''}${n.text || '(empty mark)'}`)
      if (n.answer) lines.push(`  - Answer: ${n.answer}`)
    }
    lines.push('')
  }
  return lines.join('\n')
}

// Splits text into plain parts and "12:40" / "1:02:05" times, so times can become seek buttons.
export type TextPart = { text: string; t?: number }
const TIME = /\b(?:(\d{1,2}):)?([0-5]?\d):([0-5]\d)\b/g
export function splitTimes(text: string): TextPart[] {
  const parts: TextPart[] = []
  let last = 0
  for (const m of text.matchAll(TIME)) {
    const i = m.index ?? 0
    if (i > last) parts.push({ text: text.slice(last, i) })
    const t = Number(m[1] ?? 0) * 3600 + Number(m[2]) * 60 + Number(m[3])
    parts.push({ text: m[0], t })
    last = i + m[0].length
  }
  if (last < text.length) parts.push({ text: text.slice(last) })
  return parts
}
export const hasTimes = (text: string) => splitTimes(text).some((p) => p.t !== undefined)
