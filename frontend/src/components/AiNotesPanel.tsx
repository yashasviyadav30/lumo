import { ChevronDown, Clock3, CopyPlus, Hourglass, Sparkles, TriangleAlert } from 'lucide-react'
import { LANGS, type AiPoint, type NotesLang } from '../lib/aiNotes'
import { clock } from '../lib/study'
import { notesOf, type AiNotesView, type useAiNotes } from '../lib/useAiNotes'

export function LangPicker({ lang, onPick }: { lang: NotesLang; onPick: (l: NotesLang) => void }) {
  return (
    <select className="ai-lang" aria-label="Notes language" value={lang} onChange={(e) => onPick(e.target.value as NotesLang)}>
      {LANGS.map((l) => (
        <option key={l.id} value={l.id}>
          {l.label}
        </option>
      ))}
    </select>
  )
}

// Everything that isn't "ready": the same messages serve the Notes and Mind map tabs.
export function AiNotesStatus({ view, onGenerate, what }: { view: AiNotesView; onGenerate: () => void; what: string }) {
  if ('kind' in view) {
    if (view.kind === 'loading')
      return (
        <div className="ai-skeleton" aria-busy="true" aria-label="Loading">
          <div className="skeleton" style={{ height: 56 }} />
          <div className="skeleton" style={{ height: 88 }} />
          <div className="skeleton" style={{ height: 88 }} />
        </div>
      )
    if (view.kind === 'error')
      return (
        <div className="ai-state" role="alert">
          <TriangleAlert size={22} aria-hidden="true" />
          <p>{view.message}</p>
        </div>
      )
    return null
  }
  switch (view.status) {
    case 'none':
      return (
        <div className="ai-state ai-start">
          <Sparkles size={24} aria-hidden="true" />
          <h3>Short notes and a mind map for this video</h3>
          <p>Made by AI from the video in about a minute. Everyone who opens this video gets them too.</p>
          <button onClick={onGenerate}>
            <Sparkles size={17} aria-hidden="true" /> Generate {what}
          </button>
        </div>
      )
    case 'queued':
      return view.reason === 'daily_limit' ? (
        <div className="ai-state">
          <Clock3 size={22} aria-hidden="true" />
          <h3>Queued for tomorrow</h3>
          <p>Today’s free AI limit is used up. Your notes will be ready by tomorrow. Take your own notes in My notes meanwhile.</p>
        </div>
      ) : (
        <div className="ai-state" role="status">
          <Hourglass size={22} aria-hidden="true" className="ai-spin" />
          <h3>Making your notes…</h3>
          <p>
            {view.reason === 'busy'
              ? 'The AI is busy right now, so it will try again by itself. Keep watching; this page updates on its own.'
              : 'Usually under a minute. Keep watching; this page updates on its own.'}
          </p>
        </div>
      )
    case 'too_long':
      return (
        <div className="ai-state">
          <Clock3 size={22} aria-hidden="true" />
          <h3>This video is too long for AI notes</h3>
          <p>Notes work on videos up to about 2.5 hours for now. Use My notes for this one.</p>
        </div>
      )
    case 'failed':
      return (
        <div className="ai-state">
          <TriangleAlert size={22} aria-hidden="true" />
          <h3>Couldn’t make notes for this video</h3>
          <p>The AI couldn’t read it after several tries. Use My notes for this one.</p>
        </div>
      )
    default:
      return null
  }
}

// Gemini doesn't always list points in teaching order; points without a time keep their place at the end.
const byTime = (points: AiPoint[]) =>
  [...points].sort((a, b) => (a.seconds ?? Infinity) - (b.seconds ?? Infinity))

export function AiLabel({ offline }: { offline?: boolean }) {
  return (
    <p className="ai-label">
      <Sparkles size={13} aria-hidden="true" /> Made by AI from the video, not by YouTube or the teacher. Check with the video.
      {offline && ' Showing your saved copy (offline).'}
    </p>
  )
}

export default function AiNotesPanel({
  ai,
  onSeek,
  onCopy,
}: {
  ai: ReturnType<typeof useAiNotes>
  onSeek: (t: number) => void
  onCopy: (title: string, body: string, seconds: number | null) => void
}) {
  const notes = notesOf(ai.view)
  return (
    <div className="ai-notes">
      <div className="ai-head">
        <LangPicker lang={ai.lang} onPick={ai.chooseLang} />
      </div>
      {!notes ? (
        <AiNotesStatus view={ai.view} onGenerate={ai.generate} what="notes" />
      ) : (
        <>
          <p className="ai-summary">{notes.summary}</p>
          <ol className="ai-points">
            {byTime(notes.points).map((p, i) => (
              <li key={i}>
                <details>
                  <summary>
                    <span className="ai-point-head">
                      {p.seconds !== null && (
                        <button
                          className="ts-chip"
                          onClick={(e) => {
                            e.preventDefault()
                            onSeek(p.seconds!)
                          }}
                          aria-label={`Play from ${clock(p.seconds)}`}
                        >
                          {clock(p.seconds)}
                        </button>
                      )}
                      <b>{p.title}</b>
                      <ChevronDown size={16} className="ai-chev" aria-hidden="true" />
                    </span>
                    <span className="ai-short">{p.short}</span>
                  </summary>
                  <p className="ai-detail">{p.detail}</p>
                  <button className="link ai-copy" onClick={() => onCopy(p.title, p.short, p.seconds)}>
                    <CopyPlus size={15} aria-hidden="true" /> Copy to my notes
                  </button>
                </details>
              </li>
            ))}
          </ol>
          <AiLabel offline={'kind' in ai.view && ai.view.kind === 'offline'} />
        </>
      )}
    </div>
  )
}
