import { api } from './api'
import { clock } from './study'

// AI notes and mind map made by Gemini from the video (plan v3). Shared by everyone who opens the video.
export type NotesLang = 'en' | 'hi' | 'auto'
export const LANGS: Array<{ id: NotesLang; label: string }> = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'हिन्दी' },
  { id: 'auto', label: 'Same as video' },
]
export type AiPoint = { title: string; seconds: number | null; short: string; detail: string }
export type MapNode = { id: string; parent: string | null; label: string; detail: string; seconds: number | null }
// brief: the longer summary (paragraphs). Summaries made before it existed don't have it.
export type AiNotesData = { summary: string; brief?: string; points: AiPoint[]; mindmap: MapNode[] }
export type AiNotesState =
  | { status: 'none' | 'failed' | 'too_long' | 'unavailable' }
  | { status: 'queued'; reason: 'busy' | 'daily_limit' | null }
  | { status: 'ready'; notes: AiNotesData }

// Video IDs go in the body, never the URL (R11).
export const getAiNotes = (video_id: string, lang: NotesLang, create: boolean) =>
  api<AiNotesState>('/api/ai-notes', { method: 'POST', body: JSON.stringify({ video_id, lang, create }) })

const LANG_KEY = 'focuslearn.notesLang'
export function getNotesLang(): NotesLang {
  try {
    const v = localStorage.getItem(LANG_KEY)
    return v === 'hi' || v === 'auto' ? v : 'en'
  } catch {
    return 'en'
  }
}
export function setNotesLang(lang: NotesLang) {
  try {
    localStorage.setItem(LANG_KEY, lang)
  } catch {
    // private mode: the choice lasts for this visit
  }
}

// Offline copy of ready notes, so revision works without internet. Kept 30 days, like the server (R1).
const OFFLINE_DAYS = 30
const offlineKey = (videoId: string, lang: NotesLang) => `focuslearn.ai.${lang}.${videoId}`
export function saveOffline(videoId: string, lang: NotesLang, notes: AiNotesData) {
  try {
    localStorage.setItem(offlineKey(videoId, lang), JSON.stringify({ at: Date.now(), notes }))
  } catch {
    // storage full or blocked: notes still show while online
  }
}
export function readOffline(videoId: string, lang: NotesLang): AiNotesData | null {
  try {
    const raw = localStorage.getItem(offlineKey(videoId, lang))
    if (!raw) return null
    const { at, notes } = JSON.parse(raw) as { at: number; notes: AiNotesData }
    return Date.now() - at < OFFLINE_DAYS * 86_400_000 ? notes : null
  } catch {
    return null
  }
}

// Left-to-right tree: depth sets x, leaves are stacked on y, a parent sits in the middle of its children.
export const NODE_W = 196
export const GAP_X = 64
export const ROW_H = 76
export function layoutTree(nodes: MapNode[]): Map<string, { x: number; y: number; depth: number }> {
  const kids = new Map<string | null, MapNode[]>()
  for (const n of nodes) kids.set(n.parent, [...(kids.get(n.parent) ?? []), n])
  const pos = new Map<string, { x: number; y: number; depth: number }>()
  let row = 0
  const place = (n: MapNode, depth: number): number => {
    pos.set(n.id, { x: depth * (NODE_W + GAP_X), y: 0, depth }) // claim first: a cycle can't loop forever
    const ys = (kids.get(n.id) ?? []).filter((c) => !pos.has(c.id)).map((c) => place(c, depth + 1))
    const y = ys.length ? (ys[0] + ys[ys.length - 1]) / 2 : row++ * ROW_H
    pos.set(n.id, { x: depth * (NODE_W + GAP_X), y, depth })
    return y
  }
  for (const root of kids.get(null) ?? []) place(root, 0)
  return pos
}

// "Copy to my notes": append paragraphs to the notepad's saved document (TipTap JSON) without loading the editor.
type DocNode = { type: string; text?: string; content?: DocNode[]; marks?: unknown[]; attrs?: unknown }
export function copyLine(title: string, body: string, seconds: number | null): DocNode {
  const content: DocNode[] = []
  if (seconds !== null) {
    content.push({ type: 'text', text: `[${clock(seconds)}]`, marks: [{ type: 'link', attrs: { href: `#t=${seconds}` } }] })
    content.push({ type: 'text', text: ' ' })
  }
  content.push({ type: 'text', text: title, marks: [{ type: 'bold' }] })
  if (body) content.push({ type: 'text', text: `: ${body}` })
  return { type: 'paragraph', content }
}

const isBlank = (n: DocNode) => n.type === 'paragraph' && !n.content?.length

export function appendToDoc(saved: string | null, paragraphs: DocNode[]): { content: string; text: string } {
  let doc: DocNode = { type: 'doc', content: [] }
  try {
    if (saved) doc = JSON.parse(saved) as DocNode
  } catch {
    // unreadable doc: start fresh rather than lose the copy
  }
  const old = doc.content ?? []
  const keep = old.length === 1 && isBlank(old[0]) ? [] : old // an untouched notepad holds one empty line
  const next = { ...doc, content: [...keep, ...paragraphs] }
  return { content: JSON.stringify(next), text: plainText(next) }
}

function plainText(node: DocNode): string {
  if (node.text) return node.text
  const inner = (node.content ?? []).map(plainText)
  return node.type === 'doc' ? inner.join('\n') : inner.join('')
}

// The idea being taught at `seconds`: the latest node whose time has passed. None before the video starts.
export function ideaAt(nodes: MapNode[], seconds: number | null | undefined): string | null {
  if (!seconds) return null
  let best: MapNode | null = null
  for (const n of nodes) if (n.seconds !== null && n.seconds <= seconds && (!best || n.seconds >= best.seconds!)) best = n
  return best?.id ?? null
}
