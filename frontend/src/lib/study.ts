import { api } from './api'
import type { VideoCard } from './search'

export type Tag = 'def' | 'sec' | 'pyq' | 'trick'
export const TAGS: Array<{ id: Tag; label: string }> = [
  { id: 'def', label: 'Def' },
  { id: 'sec', label: 'Sec' },
  { id: 'pyq', label: 'PYQ' },
  { id: 'trick', label: 'Trick' },
]

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

export type StudyData = { video: VideoCard | null; position_s: number; notes: Note[] }
export type HomeSummary = {
  resume: { video_id: string; position_s: number; video: VideoCard | null } | null
  cards_due: number
  doubts_open: number
  marks_to_fill: number
}
export type Notebook = { lectures: Array<{ video_id: string; video: VideoCard | null; notes: Note[] }>; total: number }
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
