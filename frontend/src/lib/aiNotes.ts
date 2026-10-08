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
export type AiTerm = { term: string; meaning: string }
export type AiNotesData = { summary: string; brief?: string; points: AiPoint[]; terms?: AiTerm[]; mindmap: MapNode[] }
export type AiNotesState =
  | { status: 'none' | 'failed' | 'too_long' | 'unavailable' }
  | {
      status: 'queued'
      reason: 'busy' | 'daily_limit' | null
      starts_at?: string // daily_limit: when it starts by itself (the free limit resets)
      progress?: { done: number; total: number }
      partial?: AiNotesData // a long video: the notes on its first minutes, while the rest is read
      covered_s?: number
    }
  | { status: 'ready'; notes: AiNotesData; updating?: boolean } // updating: a newer format is on its way

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

// A mind map in the XMind style: the main idea in the middle, its branches shared out left and right (the bigger
// branch goes to the lighter side), each branch's ideas stacked on its own side. `branch` picks the branch's colour.
export const NODE_W = 196
export const GAP_X = 64
export const ROW_H = 76
export type Placed = { x: number; y: number; depth: number; side: 1 | -1; branch: number }
export function layoutMindMap(nodes: MapNode[]): Map<string, Placed> {
  const kids = new Map<string | null, MapNode[]>()
  for (const n of nodes) kids.set(n.parent, [...(kids.get(n.parent) ?? []), n])
  const pos = new Map<string, Placed>()
  const root = (kids.get(null) ?? [])[0]
  if (!root) return pos
  const leaves = (n: MapNode, seen = new Set<string>()): number => {
    if (seen.has(n.id)) return 0
    seen.add(n.id)
    const k = kids.get(n.id) ?? []
    return k.length ? k.reduce((sum, c) => sum + leaves(c, seen), 0) : 1
  }
  const branches = (kids.get(root.id) ?? []).filter((b) => b.id !== root.id)
  const sides: Record<1 | -1, MapNode[]> = { 1: [], [-1]: [] }
  const weight = { 1: 0, [-1]: 0 } as Record<1 | -1, number>
  for (const b of branches) {
    const side: 1 | -1 = weight[1] <= weight[-1] ? 1 : -1
    sides[side].push(b)
    weight[side] += leaves(b)
  }
  pos.set(root.id, { x: 0, y: 0, depth: 0, side: 1, branch: -1 })
  for (const side of [1, -1] as const) {
    let row = 0
    const placed: string[] = []
    const place = (n: MapNode, depth: number, branch: number): number => {
      pos.set(n.id, { x: 0, y: 0, depth, side, branch }) // claim first: a cycle can't loop forever
      placed.push(n.id)
      const ys = (kids.get(n.id) ?? []).filter((c) => !pos.has(c.id)).map((c) => place(c, depth + 1, branch))
      const y = ys.length ? (ys[0] + ys[ys.length - 1]) / 2 : row++ * ROW_H
      pos.set(n.id, { x: side * depth * (NODE_W + GAP_X), y, depth, side, branch })
      return y
    }
    sides[side].forEach((b) => place(b, 1, branches.indexOf(b)))
    const mid = ((row - 1) * ROW_H) / 2 // centre this side on the main idea
    for (const id of placed) pos.set(id, { ...pos.get(id)!, y: pos.get(id)!.y - mid })
  }
  // Anything not reachable from the main idea (a second root) hangs below it, so nothing is lost.
  let extra = Math.max(0, ...[...pos.values()].map((p) => p.y)) + ROW_H * 1.5
  for (const n of nodes) if (!pos.has(n.id)) pos.set(n.id, { x: 0, y: (extra += ROW_H), depth: 1, side: 1, branch: -1 })
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

// Everything the mind map's detail card shows for one idea: where it sits (root › … › idea), its sub-ideas, and the
// summary's key points taught in its stretch of the video (from its own time, or its sub-ideas' earliest, up to the
// next idea outside it).
export function ideaContext(nodes: MapNode[], points: AiPoint[], id: string) {
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const path: MapNode[] = []
  for (let n = byId.get(id); n && path.length < 20; n = n.parent ? byId.get(n.parent) : undefined) path.unshift(n)
  const children = nodes.filter((n) => n.parent === id)
  const inside = new Set<string>([id])
  for (let grew = true; grew; ) {
    grew = false
    for (const n of nodes) {
      if (n.parent && inside.has(n.parent) && !inside.has(n.id)) {
        inside.add(n.id)
        grew = true
      }
    }
  }
  const times = nodes.filter((n) => inside.has(n.id) && n.seconds !== null).map((n) => n.seconds!)
  if (!times.length) return { path, children, points: [] as AiPoint[] }
  const from = Math.min(...times)
  const last = Math.max(...times)
  const after = nodes.filter((n) => !inside.has(n.id) && n.seconds !== null && n.seconds > last).map((n) => n.seconds!)
  const until = after.length ? Math.min(...after) : Infinity
  const related = points.filter((p) => p.seconds !== null && p.seconds >= from && p.seconds < until)
  return { path, children, points: related.slice(0, 6) }
}

// "today at 12:35 pm" / "tomorrow at 12:35 pm" in the user's own time (the free limit resets at midnight in California).
export function startsAt(iso: string | undefined, now = new Date()): string {
  if (!iso) return 'tomorrow'
  const at = new Date(iso)
  const time = at.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  return `${at.toDateString() === now.toDateString() ? 'today' : 'tomorrow'} at ${time}`
}
