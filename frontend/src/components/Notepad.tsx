import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react'
import {
  Bold,
  Check,
  Clock,
  Heading2,
  Highlighter,
  Italic,
  List,
  ListChecks,
  ListOrdered,
  Palette,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { notepadExtensions, parseDoc, timeFromLink } from '../lib/notepad'
import { clock, saveNotepad } from '../lib/study'

// Colours are theme variables, so a note written in dark mode stays readable in light mode.
const TEXT_COLOURS = [
  { name: 'Default', value: null },
  { name: 'Red', value: 'var(--np-red)' },
  { name: 'Orange', value: 'var(--np-orange)' },
  { name: 'Green', value: 'var(--np-green)' },
  { name: 'Blue', value: 'var(--np-blue)' },
  { name: 'Purple', value: 'var(--np-purple)' },
]
const HIGHLIGHTS = [
  { name: 'Yellow', value: 'var(--hl-yellow)' },
  { name: 'Green', value: 'var(--hl-green)' },
  { name: 'Pink', value: 'var(--hl-pink)' },
  { name: 'Blue', value: 'var(--hl-blue)' },
]

function Tool({ on, label, onClick, children }: { on?: boolean; label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className={`np-tool${on ? ' on' : ''}`}
      aria-label={label}
      aria-pressed={on}
      title={label}
      onMouseDown={(e) => e.preventDefault()} // keep the text selection
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor, onTime }: { editor: Editor; onTime: () => void }) {
  const [menu, setMenu] = useState<'colour' | 'highlight' | null>(null)
  const st = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      h2: e.isActive('heading', { level: 2 }),
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      task: e.isActive('taskList'),
      highlight: e.isActive('highlight'),
      colour: (e.getAttributes('textStyle').color as string | undefined) ?? null,
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  })
  const c = () => editor.chain().focus()
  return (
    <div className="np-toolbar" role="toolbar" aria-label="Formatting">
      <Tool label="Bold" on={st.bold} onClick={() => c().toggleBold().run()}>
        <Bold size={16} />
      </Tool>
      <Tool label="Italic" on={st.italic} onClick={() => c().toggleItalic().run()}>
        <Italic size={16} />
      </Tool>
      <Tool label="Underline" on={st.underline} onClick={() => c().toggleUnderline().run()}>
        <UnderlineIcon size={16} />
      </Tool>
      <Tool label="Strikethrough" on={st.strike} onClick={() => c().toggleStrike().run()}>
        <Strikethrough size={16} />
      </Tool>
      <span className="np-sep" />
      <div className="np-menu-wrap">
        <Tool label="Text colour" on={!!st.colour} onClick={() => setMenu(menu === 'colour' ? null : 'colour')}>
          <Palette size={16} color={st.colour ?? undefined} />
        </Tool>
        {menu === 'colour' && (
          <div className="np-menu" role="menu">
            {TEXT_COLOURS.map((col) => (
              <button
                key={col.name}
                type="button"
                role="menuitem"
                className="np-swatch"
                title={col.name}
                aria-label={`Text colour ${col.name}`}
                style={{ color: col.value ?? 'var(--text)' }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  ;(col.value ? c().setColor(col.value) : c().unsetColor()).run()
                  setMenu(null)
                }}
              >
                A
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="np-menu-wrap">
        <Tool label="Highlight" on={st.highlight} onClick={() => setMenu(menu === 'highlight' ? null : 'highlight')}>
          <Highlighter size={16} />
        </Tool>
        {menu === 'highlight' && (
          <div className="np-menu" role="menu">
            {HIGHLIGHTS.map((h) => (
              <button
                key={h.name}
                type="button"
                role="menuitem"
                className="np-swatch"
                title={h.name}
                aria-label={`Highlight ${h.name}`}
                style={{ background: h.value }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  c().setHighlight({ color: h.value }).run()
                  setMenu(null)
                }}
              />
            ))}
            <button
              type="button"
              role="menuitem"
              className="np-swatch"
              title="No highlight"
              aria-label="Remove highlight"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                c().unsetHighlight().run()
                setMenu(null)
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
      <span className="np-sep" />
      <Tool label="Heading" on={st.h2} onClick={() => c().toggleHeading({ level: 2 }).run()}>
        <Heading2 size={16} />
      </Tool>
      <Tool label="Bullet list" on={st.bullet} onClick={() => c().toggleBulletList().run()}>
        <List size={16} />
      </Tool>
      <Tool label="Numbered list" on={st.ordered} onClick={() => c().toggleOrderedList().run()}>
        <ListOrdered size={16} />
      </Tool>
      <Tool label="Checklist" on={st.task} onClick={() => c().toggleTaskList().run()}>
        <ListChecks size={16} />
      </Tool>
      <span className="np-sep" />
      <Tool label="Insert the video’s current time" onClick={onTime}>
        <Clock size={16} />
      </Tool>
      <span className="np-sep" />
      <Tool label="Undo" onClick={() => c().undo().run()}>
        <Undo2 size={16} opacity={st.canUndo ? 1 : 0.35} />
      </Tool>
      <Tool label="Redo" onClick={() => c().redo().run()}>
        <Redo2 size={16} opacity={st.canRedo ? 1 : 0.35} />
      </Tool>
    </div>
  )
}

// Free-form notes beside a lecture. Saves itself a moment after she stops typing.
export default function Notepad({
  videoId,
  initial,
  getTime,
  onSeek,
  onClose,
  onChange,
}: {
  videoId: string
  initial: string | null
  onChange?: (content: string) => void
  getTime: () => number
  onSeek: (t: number) => void
  onClose?: () => void
}) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const timer = useRef<number | undefined>(undefined)
  const pending = useRef<(() => void) | null>(null)

  const editor = useEditor({
    extensions: notepadExtensions,
    content: parseDoc(initial),
    editorProps: {
      attributes: { class: 'np-doc', 'aria-label': 'Notepad', role: 'textbox', 'aria-multiline': 'true' },
      handleClick: (_view, _pos, event) => {
        const t = timeFromLink(event.target)
        if (t === null) return false
        onSeek(t)
        return true
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange?.(JSON.stringify(e.getJSON()))
      setStatus('saving')
      window.clearTimeout(timer.current)
      pending.current = () => {
        pending.current = null
        saveNotepad(videoId, JSON.stringify(e.getJSON()), e.getText())
          .then(() => setStatus('saved'))
          .catch(() => setStatus('error'))
      }
      timer.current = window.setTimeout(() => pending.current?.(), 800)
    },
  })

  // Leaving the tab (or the page) right after typing still saves.
  useEffect(
    () => () => {
      window.clearTimeout(timer.current)
      pending.current?.()
    },
    [],
  )

  if (!editor) return null
  const insertTime = () => {
    const t = Math.floor(getTime())
    editor
      .chain()
      .focus()
      .insertContent([
        { type: 'text', text: `[${clock(t)}]`, marks: [{ type: 'link', attrs: { href: `#t=${t}` } }] },
        { type: 'text', text: ' ' },
      ])
      .run()
  }

  return (
    <div className="notepad">
      <div className="np-head">
        <h2>{onClose ? 'Notepad' : 'My notes'}</h2>
        <span className={`np-status ${status}`} role="status">
          {status === 'saving' && 'Saving…'}
          {status === 'saved' && (
            <>
              <Check size={14} aria-hidden="true" /> Saved
            </>
          )}
          {status === 'error' && 'Not saved: check your connection'}
        </span>
        {onClose && (
          <button className="np-close" onClick={onClose} aria-label="Close notepad" title="Close notepad">
            <X size={18} />
          </button>
        )}
      </div>
      <Toolbar editor={editor} onTime={insertTime} />
      <EditorContent editor={editor} className="np-body" />
      <p className="np-hint">
        Tip: press <Clock size={12} aria-hidden="true" /> to stamp the video’s time; tap a stamp later to jump back.
      </p>
    </div>
  )
}

// Read-only view of a saved notepad (Personal tab). Time stamps open the lecture at that second.
export function NotepadView({ content, onSeek }: { content: string; onSeek: (t: number) => void }) {
  const editor = useEditor({
    extensions: notepadExtensions,
    content: parseDoc(content),
    editable: false,
    editorProps: {
      attributes: { class: 'np-doc readonly' },
      handleClick: (_view, _pos, event) => {
        const t = timeFromLink(event.target)
        if (t === null) return false
        onSeek(t)
        return true
      },
    },
  })
  return <EditorContent editor={editor} />
}
