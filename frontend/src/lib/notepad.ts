import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { Color, TextStyle } from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import { Mark, mergeAttributes } from '@tiptap/react'

// Underline colours: theme variables, so a note stays readable in light and night.
export const UNDERLINE_COLOURS = [
  { name: 'Red', value: 'var(--np-red)' },
  { name: 'Orange', value: 'var(--np-orange)' },
  { name: 'Green', value: 'var(--np-green)' },
  { name: 'Blue', value: 'var(--np-blue)' },
  { name: 'Purple', value: 'var(--np-purple)' },
]
const UNDERLINE_OK = new Set(UNDERLINE_COLOURS.map((c) => c.value))

// A coloured underline, like a coloured pen. Only our own colours are allowed, so saved notes can't carry styles.
const ColourUnderline = Mark.create({
  name: 'colourUnderline',
  addAttributes() {
    return {
      color: {
        default: UNDERLINE_COLOURS[0].value,
        parseHTML: (el) => el.getAttribute('data-underline'),
        renderHTML: (attrs) => {
          const color = UNDERLINE_OK.has(attrs.color) ? attrs.color : UNDERLINE_COLOURS[0].value
          return { 'data-underline': color, style: `text-decoration: underline 2px ${color}; text-underline-offset: 3px` }
        },
      },
    }
  },
  parseHTML() {
    return [{ tag: 'span[data-underline]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0]
  },
})

// Screenshots: only images uploaded to their own notepad (an outside image could track who opens the note).
export const NOTE_IMAGE_PATH = '/api/notepad/images/'
const NoteImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        parseHTML: (el) => {
          const src = el.getAttribute('src') ?? ''
          return src.startsWith(NOTE_IMAGE_PATH) ? src : null
        },
      },
    }
  },
}).configure({ allowBase64: false, HTMLAttributes: { class: 'np-img', loading: 'lazy', alt: '' } })

// Editor setup shared by the notepad and its read-only view.
export const notepadExtensions = [
  StarterKit.configure({ link: { openOnClick: false, autolink: true } }),
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  TaskList,
  TaskItem.configure({ nested: true }),
  ColourUnderline,
  NoteImage,
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

