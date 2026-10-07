import { useCallback, useEffect, useState } from 'react'
import { getAiNotes, getNotesLang, readOffline, saveOffline, setNotesLang, type AiNotesData, type AiNotesState, type NotesLang } from './aiNotes'
import { ApiError } from './api'

const POLL_MS = 6_000 // most summaries take under a minute now
const POLL_DAILY_LIMIT_MS = 5 * 60_000

export type AiNotesView =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'offline'; notes: AiNotesData }
  | AiNotesState

// One shared state for the Notes and Mind map tabs: peek on open, start a job on "Generate", poll while queued.
export function useAiNotes(videoId: string) {
  const [lang, setLang] = useState<NotesLang>(getNotesLang)
  const [view, setView] = useState<AiNotesView>({ kind: 'loading' })

  const load = useCallback(
    async (create: boolean) => {
      try {
        const s = await getAiNotes(videoId, lang, create)
        if (s.status === 'ready') saveOffline(videoId, lang, s.notes)
        setView(s)
      } catch (e) {
        const saved = readOffline(videoId, lang)
        if (saved) return setView({ kind: 'offline', notes: saved })
        setView({ kind: 'error', message: e instanceof ApiError ? e.message : 'Couldn’t reach the server.' })
      }
    },
    [videoId, lang],
  )

  useEffect(() => {
    load(false)
  }, [load])

  const queued = 'status' in view && view.status === 'queued' ? view.reason : undefined
  const updating = 'status' in view && view.status === 'ready' && !!view.updating // old notes shown, new ones coming
  useEffect(() => {
    if (queued === undefined && !updating) return
    const every = updating ? 20_000 : queued === 'daily_limit' ? POLL_DAILY_LIMIT_MS : POLL_MS
    const t = window.setInterval(() => load(false), every)
    return () => window.clearInterval(t)
  }, [queued, updating, load])

  const chooseLang = (l: NotesLang) => {
    setNotesLang(l)
    setView({ kind: 'loading' })
    setLang(l)
  }
  return { lang, chooseLang, view, generate: () => load(true) }
}

export function notesOf(view: AiNotesView): AiNotesData | null {
  if ('kind' in view) return view.kind === 'offline' ? view.notes : null
  if (view.status === 'queued') return view.partial ?? null // the first minutes of a long video, shown early
  return view.status === 'ready' ? view.notes : null
}
