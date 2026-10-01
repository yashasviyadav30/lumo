import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import Player from '../components/Player'
import { VIDEO_ID, type YTPlayer } from '../lib/youtube'
import {
  TAGS,
  addNote,
  clock,
  deleteNote,
  lectureTitle,
  makeCard,
  openLecture,
  saveProgress,
  updateNote,
  type Note,
  type StudyData,
  type Tag,
} from '../lib/study'

const PROGRESS_EVERY_MS = 15000

export default function Watch() {
  const { videoId = '' } = useParams()
  if (!VIDEO_ID.test(videoId)) {
    return (
      <section>
        <h1>Video not found</h1>
        <p>That link doesn’t point to a YouTube video.</p>
        <Link to="/search">Search instead</Link>
      </section>
    )
  }
  return <StudyPage key={videoId} videoId={videoId} />
}

function StudyPage({ videoId }: { videoId: string }) {
  const player = useRef<YTPlayer | null>(null)
  const [data, setData] = useState<StudyData | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [start, setStart] = useState<number | undefined>(undefined)
  const [ready, setReady] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [doubtFor, setDoubtFor] = useState<Note | null>(null)
  const [cardFor, setCardFor] = useState<Note | null>(null)

  useEffect(() => {
    openLecture(videoId)
      .then((d) => {
        setData(d)
        setNotes(d.notes)
        setStart(d.position_s > 15 ? d.position_s : undefined)
      })
      .catch(() => setData({ video: null, position_s: 0, notes: [] }))
      .finally(() => setReady(true))
  }, [videoId])

  const onReady = useCallback((p: YTPlayer) => {
    player.current = p
  }, [])

  const now = () => Math.floor(player.current?.getCurrentTime() ?? 0)

  // Save where she is every 15 s while playing, and when she leaves (resume next time).
  useEffect(() => {
    const save = () => {
      const p = player.current
      if (p && p.getCurrentTime() > 5) saveProgress(videoId, Math.floor(p.getCurrentTime())).catch(() => {})
    }
    const timer = window.setInterval(() => {
      if (player.current?.getPlayerState() === 1) save()
    }, PROGRESS_EVERY_MS)
    const onHide = () => document.visibilityState === 'hidden' && save()
    document.addEventListener('visibilitychange', onHide)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onHide)
      save()
    }
  }, [videoId])

  const flash = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2200)
  }

  const upsert = (n: Note) =>
    setNotes((all) => [...all.filter((x) => x.id !== n.id), n].sort((a, b) => a.t_seconds - b.t_seconds))

  const mark = useCallback(
    async (starred = false) => {
      const n = await addNote({ video_id: videoId, t_seconds: now(), starred })
      upsert(n)
      flash(`${starred ? '★ Starred' : 'Marked'} at ${clock(n.t_seconds)}`)
    },
    [videoId],
  )

  const doubt = useCallback(async () => {
    const n = await addNote({ video_id: videoId, t_seconds: now(), kind: 'doubt' })
    upsert(n)
    setDoubtFor(n)
    flash(`Doubt parked at ${clock(n.t_seconds)}. Keep going.`)
  }, [videoId])

  const back10 = () => player.current?.seekTo(Math.max(0, now() - 10), true)
  const jump = (t: number) => {
    player.current?.seekTo(Math.max(0, t), true)
    player.current?.playVideo()
  }

  // Laptop shortcuts: N = mark, D = doubt, S = starred mark (not while typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement
      if (el.closest('input, textarea, select, [contenteditable]') || e.ctrlKey || e.metaKey || e.altKey) return
      const key = e.key.toLowerCase()
      if (key === 'n') mark()
      else if (key === 'd') doubt()
      else if (key === 's') mark(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mark, doubt])

  const empty = notes.filter((n) => n.kind === 'note' && !n.text)
  const title = lectureTitle(data?.video, videoId)

  return (
    <section className="study">
      {ready ? (
        <Player videoId={videoId} start={start} onReady={onReady} />
      ) : (
        <div className="player-frame" aria-busy="true" />
      )}
      {start && (
        <p className="help">
          Starting where you stopped ({clock(start)}).{' '}
          <button className="link" onClick={() => setStart(undefined)}>
            Start from the beginning
          </button>
        </p>
      )}

      <div className="capture" role="toolbar" aria-label="Capture while you watch">
        <button onClick={() => mark()} aria-keyshortcuts="N">
          <span aria-hidden="true">📍</span>Mark
        </button>
        <button className="doubt" onClick={doubt} aria-keyshortcuts="D">
          <span aria-hidden="true">❓</span>Doubt
        </button>
        <button onClick={() => mark(true)} aria-keyshortcuts="S">
          <span aria-hidden="true">★</span>Star
        </button>
        <button onClick={back10}>
          <span aria-hidden="true">↺</span>−10s
        </button>
      </div>
      {toast && (
        <p className="toast" role="status">
          {toast}
        </p>
      )}

      {doubtFor && <DoubtLine note={doubtFor} onSaved={(n) => { upsert(n); setDoubtFor(null) }} onClose={() => setDoubtFor(null)} />}

      {empty.length > 0 && (
        <div className="tray">
          <p>
            <b>
              {empty.length} mark{empty.length > 1 ? 's' : ''} to fill in
            </b>{' '}
            <span className="help">Play each one again, then write one line.</span>
          </p>
          {empty.map((n) => (
            <FillMark key={n.id} note={n} onPlay={() => jump(n.t_seconds - 5)} onSaved={upsert} />
          ))}
        </div>
      )}

      <h2 className="lecture-title">{title}</h2>
      <p className="help">Your notes on this lecture. Tap a time to jump back to it.</p>
      {notes.filter((n) => n.text || n.kind === 'doubt').length === 0 && (
        <p className="help">Nothing yet. Tap Mark while you listen; fill it in at the next pause.</p>
      )}
      <ul className="notes">
        {notes
          .filter((n) => n.text || n.kind === 'doubt')
          .map((n) => (
            <NoteRow
              key={n.id}
              note={n}
              onJump={() => jump(n.t_seconds)}
              onChange={upsert}
              onDelete={async () => {
                await deleteNote(n.id)
                setNotes((all) => all.filter((x) => x.id !== n.id))
              }}
              onMakeCard={() => setCardFor(n)}
            />
          ))}
      </ul>

      {cardFor && (
        <CardMaker
          note={cardFor}
          onClose={() => setCardFor(null)}
          onMade={() => {
            upsert({ ...cardFor, cards: cardFor.cards + 1 })
            setCardFor(null)
            flash('Card made. It will come back for review.')
          }}
        />
      )}
      <p className="attribution">
        Video plays from YouTube.{' '}
        <a href={`https://www.youtube.com/watch?v=${videoId}`} rel="noopener">
          Watch on YouTube
        </a>
      </p>
    </section>
  )
}

function TagPicker({ value, onPick }: { value: Tag | null; onPick: (t: Tag | null) => void }) {
  return (
    <div className="tags" role="group" aria-label="Type">
      {TAGS.map((t) => (
        <button key={t.id} className={`tag-btn${value === t.id ? ' on' : ''}`} aria-pressed={value === t.id} onClick={() => onPick(value === t.id ? null : t.id)}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

function FillMark({ note, onPlay, onSaved }: { note: Note; onPlay: () => void; onSaved: (n: Note) => void }) {
  const [text, setText] = useState('')
  const [tag, setTag] = useState<Tag | null>(null)
  const save = async () => {
    if (!text.trim()) return
    onSaved(await updateNote({ id: note.id, text, ...(tag ? { tag } : {}) }))
  }
  return (
    <div className="fill">
      <div className="row">
        <button className="time-chip" onClick={onPlay} aria-label={`Play again from ${clock(Math.max(0, note.t_seconds - 5))}`}>
          ▶ {clock(note.t_seconds)}
        </button>
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && save()} placeholder="One line: what was this?" aria-label={`Note at ${clock(note.t_seconds)}`} />
      </div>
      <div className="row">
        <TagPicker value={tag} onPick={setTag} />
        <button className="small" onClick={save} disabled={!text.trim()}>
          Save
        </button>
      </div>
    </div>
  )
}

function DoubtLine({ note, onSaved, onClose }: { note: Note; onSaved: (n: Note) => void; onClose: () => void }) {
  const [text, setText] = useState('')
  return (
    <div className="fill doubt-line">
      <label htmlFor="doubt-text">
        Doubt at {clock(note.t_seconds)}: what didn’t make sense? <span className="help">(optional)</span>
      </label>
      <div className="row">
        <input id="doubt-text" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Is a Section 8 company covered?" />
        <button className="small" onClick={async () => onSaved(await updateNote({ id: note.id, text }))} disabled={!text.trim()}>
          Save
        </button>
        <button className="link" onClick={onClose}>
          Later
        </button>
      </div>
    </div>
  )
}

function NoteRow({ note, onJump, onChange, onDelete, onMakeCard }: {
  note: Note
  onJump: () => void
  onChange: (n: Note) => void
  onDelete: () => void
  onMakeCard: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(note.text)
  const [answer, setAnswer] = useState(note.answer)
  const isDoubt = note.kind === 'doubt'
  return (
    <li className={`note${isDoubt ? ' is-doubt' : ''}`}>
      <button className="time-chip" onClick={onJump} aria-label={`Jump to ${clock(note.t_seconds)}`}>
        {clock(note.t_seconds)}
      </button>
      <div className="note-body">
        <div className="note-head">
          {isDoubt && <span className={`badge ${note.solved ? 'good' : 'bad'}`}>{note.solved ? 'Doubt · solved' : 'Doubt'}</span>}
          {note.tag && <span className="badge">{note.tag.toUpperCase()}</span>}
          <button className={`star${note.starred ? ' on' : ''}`} aria-pressed={note.starred} aria-label="Star" onClick={async () => onChange(await updateNote({ id: note.id, starred: !note.starred }))}>
            ★
          </button>
        </div>
        {editing ? (
          <div className="row">
            <input value={text} onChange={(e) => setText(e.target.value)} aria-label="Edit note" />
            <button className="small" onClick={async () => { onChange(await updateNote({ id: note.id, text })); setEditing(false) }}>
              Save
            </button>
          </div>
        ) : (
          <p className="note-text">{note.text || <span className="help">(no text yet)</span>}</p>
        )}
        {isDoubt && note.answer && <p className="answer">Answer: {note.answer}</p>}
        {isDoubt && !note.solved && (
          <div className="row">
            <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Found the answer? Write it here" aria-label="Doubt answer" />
            <button className="small" onClick={async () => onChange(await updateNote({ id: note.id, solved: true, answer }))}>
              Solved
            </button>
          </div>
        )}
        <div className="note-actions">
          {note.text && !isDoubt && (
            <button className="link" onClick={onMakeCard}>
              {note.cards ? `Make another card (${note.cards})` : 'Make a card'}
            </button>
          )}
          <button className="link" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit'}
          </button>
          <button className="link danger-link" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </li>
  )
}

// Tap the words to hide; the card asks her to recall them (her own words only).
export function CardMaker({ note, onClose, onMade }: { note: Note; onClose: () => void; onMade: () => void }) {
  const words = note.text.split(/\s+/).filter(Boolean)
  const [picked, setPicked] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const toggle = (i: number) => setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : p.length < 5 ? [...p, i] : p))
  const clean = (w: string) => w.replace(/^[^\p{L}\p{N}₹%]+|[^\p{L}\p{N}%]+$/gu, '')
  const save = async () => {
    try {
      await makeCard(note.id, picked.map((i) => clean(words[i])).filter(Boolean))
      onMade()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Couldn’t make the card.')
    }
  }
  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label="Make a card">
      <div className="sheet-inner">
        <h2>Make a card</h2>
        <p className="help">Tap the words to hide. You’ll try to recall them later.</p>
        <p className="word-pick">
          {words.map((w, i) => (
            <button key={i} className={`word${picked.includes(i) ? ' on' : ''}`} aria-pressed={picked.includes(i)} onClick={() => toggle(i)}>
              {picked.includes(i) ? '_____' : w}
            </button>
          ))}
        </p>
        {error && <p className="error">{error}</p>}
        <div className="row">
          <button onClick={save} disabled={picked.length === 0}>
            Save card
          </button>
          <button className="secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
