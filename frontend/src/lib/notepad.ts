import Highlight from '@tiptap/extension-highlight'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { Color, TextStyle } from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'

// Editor setup shared by the notepad and its read-only view.
export const notepadExtensions = [
  StarterKit.configure({ link: { openOnClick: false, autolink: true } }),
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  TaskList,
  TaskItem.configure({ nested: true }),
]

// A time link inside the notepad looks like "[12:40]" and points at "#t=760".
export function timeFromLink(target: EventTarget | null): number | null {
  const a = (target as HTMLElement | null)?.closest?.('a[href^="#t="]')
  if (!a) return null
  const t = Number(a.getAttribute('href')!.slice(3))
  return Number.isFinite(t) ? t : null
}

export function parseDoc(content: string | undefined | null) {
  if (!content) return ''
  try {
    return JSON.parse(content)
  } catch {
    return ''
  }
}

