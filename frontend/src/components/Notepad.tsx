import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react'
import {
  Bold,
  Check,
  Clock,
  Heading2,
  Highlighter,
  ImagePlus,
  Maximize2,
  Minimize2,
  Italic,
  List,
  ListChecks,
  ListOrdered,
  Palette,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  PenLine,
  Undo2,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { api } from '../lib/api'
import { UNDERLINE_COLOURS, notepadExtensions, parseDoc, timeFromLink } from '../lib/notepad'
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

function Toolbar({ editor, onTime, onImages }: { editor: Editor; onTime: () => void; onImages: (files: File[]) => void }) {
  const [menu, setMenu] = useState<'colour' | 'highlight' | 'underline' | null>(null)
  const picker = useRef<HTMLInputElement>(null)
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
      penUnderline: e.isActive('colourUnderline'),
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
      <div className="np-menu-wrap">
        <Tool label="Coloured underline" on={st.penUnderline} onClick={() => setMenu(menu === 'underline' ? null : 'underline')}>
          <PenLine size={16} />
        </Tool>
        {menu === 'underline' && (
          <div className="np-menu" role="menu">
            {UNDERLINE_COLOURS.map((u) => (
              <button
                key={u.name}
                type="button"
                role="menuitem"
                className="np-swatch np-underline-swatch"
                title={`${u.name} underline`}
                aria-label={`${u.name} underline`}
                style={{ textDecorationColor: u.value }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  c().setMark('colourUnderline', { color: u.value }).run()
                  setMenu(null)
                }}
              >
                U
              </button>
            ))}
            <button
              type="button"
              role="menuitem"
              className="np-swatch"
              title="No underline"
              aria-label="Remove coloured underline"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                c().unsetMark('colourUnderline').run()
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
      <Tool label="Add a picture or screenshot" onClick={() => picker.current?.click()}>
        <ImagePlus size={16} />
      </Tool>
      <input
        ref={picker}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        hidden
        onChange={(e) => {
          onImages([...(e.target.files ?? [])])
          e.target.value = ''
        }}
      />
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

const MAX_SIDE = 1600

// Screenshots are shrunk on the phone (at most 1600 px, WebP) before they're sent: fast on mobile data.
async function compressImage(file: File): Promise<{ mime: string; data: string }> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('compress'))), 'image/webp', 0.82),
  )
  const bytes = new Uint8Array(await blob.arrayBuffer())
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return { mime: blob.type === 'image/webp' ? 'image/webp' : 'image/png', data: btoa(binary) }
}

const imagesIn = (list: FileList | null | undefined) => [...(list ?? [])].filter((f) => f.type.startsWith('image/'))

// Free-form notes beside a lecture, like a small Google Doc. Saves itself a moment after she stops typing.
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
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'image' | 'image-error'>('idle')
  const [full, setFull] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const pending = useRef<((closing?: boolean) => void) | null>(null)
  const editorRef = useRef<Editor | null>(null)

  const addImages = async (files: File[]) => {
    if (!files.length) return
    setStatus('image')
    try {
      for (const file of files) {
        const { url } = await api<{ url: string }>('/api/notepad/images', { method: 'POST', body: JSON.stringify(await compressImage(file)) })
        editorRef.current?.chain().focus().setImage({ src: url }).run()
      }
    } catch {
      setStatus('image-error')
    }
  }

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
      // Paste or drop a screenshot, like in Google Docs.
      handlePaste: (_view, event) => {
        const files = imagesIn(event.clipboardData?.files)
        if (!files.length) return false
        addImages(files)
        return true
      },
      handleDrop: (_view, event) => {
        const files = imagesIn((event as DragEvent).dataTransfer?.files)
        if (!files.length) return false
        addImages(files)
        return true
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange?.(JSON.stringify(e.getJSON()))
      setStatus('saving')
      window.clearTimeout(timer.current)
      pending.current = (closing = false) => {
        pending.current = null
        saveNotepad(videoId, JSON.stringify(e.getJSON()), e.getText(), closing)
          .then(() => setStatus('saved'))
          .catch(() => setStatus('error'))
      }
      timer.current = window.setTimeout(() => pending.current?.(), 800)
    },
  })

  // Leaving the tab, the app or the page right after typing still saves (a reload or a swipe-away included).
  useEffect(() => {
    const flush = () => {
      window.clearTimeout(timer.current)
      pending.current?.(true)
    }
    const onHide = () => document.visibilityState === 'hidden' && flush()
    document.addEventListener('visibilitychange', onHide)
    window.addEventListener('pagehide', flush)
    return () => {
      document.removeEventListener('visibilitychange', onHide)
      window.removeEventListener('pagehide', flush)
      window.clearTimeout(timer.current)
      pending.current?.()
    }
  }, [])

  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  // Full screen: the notepad takes the whole screen for long writing; Esc or the button brings it back.
  useEffect(() => {
    if (!full) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setFull(false)
    document.body.classList.add('no-scroll')
    window.addEventListener('keydown', esc)
    return () => {
      document.body.classList.remove('no-scroll')
      window.removeEventListener('keydown', esc)
    }
  }, [full])

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
    <div className={`notepad${full ? ' full' : ''}`} role={full ? 'dialog' : undefined} aria-modal={full || undefined} aria-label={full ? 'My notes, full screen' : undefined}>
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
          {status === 'image' && 'Adding picture…'}
          {status === 'image-error' && 'Couldn’t add the picture. Try again.'}
        </span>
        <button
          className="np-close"
          onClick={() => setFull(!full)}
          aria-pressed={full}
          aria-label={full ? 'Exit full screen' : 'Full screen'}
          title={full ? 'Exit full screen (Esc)' : 'Full screen'}
        >
          {full ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
        {onClose && (
          <button className="np-close" onClick={onClose} aria-label="Close notepad" title="Close notepad">
            <X size={18} />
          </button>
        )}
      </div>
      <Toolbar editor={editor} onTime={insertTime} onImages={addImages} />
      <EditorContent editor={editor} className="np-body" />
      <p className="np-hint">
        Tip: <Clock size={12} aria-hidden="true" /> stamps the video’s time (tap it later to jump back). Paste or drop
        screenshots straight in.
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
