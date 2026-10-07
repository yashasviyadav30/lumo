import { Background, Controls, Handle, Position, ReactFlow, type Edge, type Node, type NodeProps, type ReactFlowInstance } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { ArrowLeft, CopyPlus, Maximize2, Play, X } from './icons'
import { useEffect, useMemo, useRef, useState, type Ref } from 'react'
import { NODE_W, ideaAt, ideaContext, layoutMindMap, type AiPoint, type MapNode } from '../lib/aiNotes'
import { clock } from '../lib/study'
import { notesOf, type useAiNotes } from '../lib/useAiNotes'
import { useBackToClose } from '../lib/useBackToClose'
import { AiLabel, AiNotesStatus, LangPicker, PartialBanner } from './AiNotesPanel'

type IdeaData = {
  label: string
  depth: number
  now: boolean
  picked: boolean
  side: 1 | -1
  color: string
  time: string
}

// One colour per branch, from the app's pastels; lines use a deeper shade of it so they read on cream and on night.
const BRANCH_COLORS = ['--lavender', '--mint', '--peach', '--sky', '--pink', '--butter', '--sage', '--coral']
const colorOf = (branch: number) => (branch < 0 ? '--ink' : BRANCH_COLORS[branch % BRANCH_COLORS.length])

// Each idea is a real button: a tap or Enter opens its card. (The map's own selection is off: it kept reporting
// the old box after the card was closed, which opened the card again.)
function Idea({ data }: NodeProps<Node<IdeaData>>) {
  const inward = data.side === 1 ? Position.Left : Position.Right // the side facing the main idea
  const outward = data.side === 1 ? Position.Right : Position.Left
  return (
    <button
      type="button"
      className={`mm-node d${Math.min(data.depth, 2)}${data.picked ? ' on' : ''}${data.now ? ' now' : ''}`}
      style={{ width: NODE_W, ['--branch' as string]: `var(${data.color})` }}
      aria-pressed={data.picked} // a tap or Enter here reaches the map's onNodeClick below

    >
      {data.depth === 0 ? (
        <>
          <Handle id="r" type="source" position={Position.Right} className="mm-handle" />
          <Handle id="l" type="source" position={Position.Left} className="mm-handle" />
        </>
      ) : (
        <>
          <Handle type="target" position={inward} className="mm-handle" />
          <Handle type="source" position={outward} className="mm-handle" />
        </>
      )}
      <span className="mm-label">{data.label}</span>
      {data.time && data.depth > 0 && <span className="mm-time">{data.time}</span>}
    </button>
  )
}
const nodeTypes = { idea: Idea }

// Zoomable mind map of the video (lazy-loaded: the map library is only fetched when this tab opens).
export default function MindMap({
  ai,
  onSeek,
  onCopy,
  onFull,
  nowS,
}: {
  ai: ReturnType<typeof useAiNotes>
  onSeek: (t: number) => void
  onCopy: (title: string, body: string, seconds: number | null) => void
  onFull?: () => void // the full-screen map hides the player: Watch pauses it (never play under a cover, R7)
  nowS?: number | null // where the video is playing: that idea is lit on the map
}) {
  const data = notesOf(ai.view)
  const [picked, setPicked] = useState<MapNode | null>(null)
  const [full, setFull] = useState(false)
  const exitBtn = useRef<HTMLButtonElement>(null)
  const detail = useRef<HTMLElement>(null)

  // The idea being taught now: the latest node whose time has passed (only while the video has started).
  const nowId = useMemo(() => (data ? ideaAt(data.mindmap, nowS) : null), [data, nowS])

  // The open card decides which box is marked, so closing the card unmarks it too.
  const pickedId = picked?.id ?? null
  const pickRef = useRef((id: string) => setPicked(data?.mindmap.find((n) => n.id === id) ?? null))
  useEffect(() => {
    pickRef.current = (id: string) => setPicked(data?.mindmap.find((n) => n.id === id) ?? null)
  })
  const { nodes, edges } = useMemo(() => {
    const map = data?.mindmap ?? []
    const pos = layoutMindMap(map)
    const nodes: Node<IdeaData>[] = map
      .filter((n) => pos.has(n.id))
      .map((n) => {
        const p = pos.get(n.id)!
        return {
          id: n.id,
          type: 'idea',
          position: { x: p.x, y: p.y },
          data: {
            label: n.label,
            depth: p.depth,
            now: n.id === nowId,
            picked: n.id === pickedId,
            side: p.side,
            color: colorOf(p.branch),
            time: n.seconds !== null ? clock(n.seconds) : '',
          },
        }
      })
    const edges: Edge[] = map
      .filter((n) => n.parent && pos.has(n.id) && pos.has(n.parent))
      .map((n) => {
        const p = pos.get(n.id)!
        const fromRoot = pos.get(n.parent!)!.depth === 0
        return {
          id: `${n.parent}-${n.id}`,
          source: n.parent!,
          target: n.id,
          sourceHandle: fromRoot ? (p.side === 1 ? 'r' : 'l') : undefined,
          className: 'mm-edge',
          style: {
            stroke: `color-mix(in srgb, var(${colorOf(p.branch)}) 80%, var(--mm-mix))`,
            strokeWidth: fromRoot ? 3.5 : 2.25,
          },
        }
      })
    return { nodes, edges }
  }, [data, nowId, pickedId])

  const overview = useMemo(() => nodes.filter((n) => n.data.depth <= 1).map((n) => ({ id: n.id })), [nodes])

  const context = useMemo(
    () => (data && picked ? ideaContext(data.mindmap, data.points, picked.id) : null),
    [data, picked],
  )

  // Back closes the card first, then full screen; it no longer leaves the page.
  useBackToClose(full, () => setFull(false))
  useBackToClose(picked !== null, () => setPicked(null))

  const pickedOpen = useRef(false)
  useEffect(() => {
    pickedOpen.current = picked !== null
  })
  useEffect(() => {
    if (!full) return
    // Esc closes the top layer first, like Back: the card, then full screen.
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && (pickedOpen.current ? setPicked(null) : setFull(false))
    document.body.classList.add('no-scroll')
    exitBtn.current?.focus() // focus moves into the full-screen map
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('no-scroll')
      window.removeEventListener('keydown', onKey)
    }
  }, [full])

  // Inline, the card opens under the map: bring its top into view (below the pinned player, see scroll-margin).
  // Full screen, the sheet covers the lower part: move the tapped idea into the part above it.
  const flow = useRef<ReactFlowInstance<Node<IdeaData>, Edge> | null>(null)
  useEffect(() => {
    if (!picked) return
    if (!full) {
      detail.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
      return
    }
    const node = flow.current?.getNode(picked.id)
    if (!node || !flow.current) return
    const zoom = Math.max(flow.current.getZoom(), 0.8)
    const sheetPx = window.innerWidth < 900 ? window.innerHeight * 0.31 : 0 // half the sheet's 62%
    flow.current.setCenter(node.position.x + NODE_W / 2, node.position.y + 20 + sheetPx / zoom, { zoom, duration: 350 })
  }, [picked, full])

  const pick = (id: string | undefined) => setPicked(data?.mindmap.find((n) => n.id === id) ?? null)
  const play = (t: number) => {
    setFull(false) // the video sits under the full-screen map
    onSeek(t)
  }
  const copy = (n: MapNode, points: AiPoint[]) =>
    onCopy(n.label, [n.detail, ...points.map((p) => `${p.title}: ${p.short}`)].filter(Boolean).join(' '), n.seconds)

  const card = picked && context && (
    <IdeaCard
      cardRef={detail}
      node={picked}
      context={context}
      sheet={full}
      onPick={(id) => pick(id)}
      onPlay={play}
      onCopy={() => copy(picked, context.points)}
      onClose={() => setPicked(null)}
    />
  )

  return (
    <div className="ai-notes">
      <div className="ai-head">
        <LangPicker lang={ai.lang} onPick={ai.chooseLang} />
      </div>
      {!data ? (
        <AiNotesStatus view={ai.view} onGenerate={ai.generate} what="mind map" />
      ) : (
        <>
          <PartialBanner view={ai.view} />
          <div
            className={`mm-wrap${full ? ' full' : ''}`}
            role={full ? 'dialog' : undefined}
            aria-modal={full || undefined}
            aria-label="Mind map"
          >
            {full && (
              <button ref={exitBtn} className="mm-exit" onClick={() => setFull(false)}>
                <ArrowLeft size={18} aria-hidden="true" /> Exit full screen
              </button>
            )}
            <ReactFlow
              key={full ? 'full' : 'inline'} // fit again when the size changes
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              // First look: the main idea and its branches, big enough to read; the sub-ideas run off to both
              // sides (drag, pinch or − to see the whole map). The whole map at once was unreadable on a phone.
              fitViewOptions={{ padding: 0.12, minZoom: 0.6, maxZoom: 1, nodes: overview }}
              onInit={(rf) => (flow.current = rf)}
              minZoom={0.2}
              maxZoom={2}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              onNodeClick={(_e, n) => pickRef.current(n.id)}
              nodesFocusable={false} // the button inside each idea takes the focus instead
              onPaneClick={() => setPicked(null)}
              proOptions={{ hideAttribution: true }}
            >
              <Background gap={24} size={1} className="mm-bg" />
              <Controls showInteractive={false} position="bottom-left" />
            </ReactFlow>
            {!full && (
              <button
                className="mm-full-btn"
                onClick={() => {
                  onFull?.()
                  setFull(true)
                }}
                aria-label="Open full screen"
                title="Full screen"
              >
                <Maximize2 size={18} />
              </button>
            )}
            {full && card}
          </div>
          {!full && card}
          <p className="help mm-hint">Pinch or scroll to zoom, drag to move. Tap a box to read about it.</p>
          <AiLabel offline={'kind' in ai.view && ai.view.kind === 'offline'} />
        </>
      )}
    </div>
  )
}

// What one idea is about: where it sits, its explanation, the lecture's key points on it, and its sub-ideas.
function IdeaCard({
  cardRef,
  node,
  context,
  sheet,
  onPick,
  onPlay,
  onCopy,
  onClose,
}: {
  cardRef: Ref<HTMLElement>
  node: MapNode
  context: ReturnType<typeof ideaContext>
  sheet: boolean
  onPick: (id: string) => void
  onPlay: (t: number) => void
  onCopy: () => void
  onClose: () => void
}) {
  const trail = context.path.slice(0, -1)
  return (
    <section ref={cardRef} className={sheet ? 'mm-detail mm-sheet' : 'mm-detail'} aria-labelledby="mm-detail-title">
      <div className="mm-detail-head">
        <div>
          {trail.length > 0 && (
            <p className="mm-trail">
              {trail.map((n, i) => (
                <span key={n.id}>
                  {i > 0 && ' › '}
                  <button className="link" onClick={() => onPick(n.id)}>
                    {n.label}
                  </button>
                </span>
              ))}
            </p>
          )}
          <h3 id="mm-detail-title">{node.label}</h3>
        </div>
        <button className="mm-close" onClick={onClose} aria-label="Close">
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      {node.detail && <p className="mm-explain">{node.detail}</p>}
      {context.points.length > 0 && (
        <>
          <h4>In the lecture</h4>
          <ul className="mm-points">
            {context.points.map((p) => (
              <li key={`${p.seconds}-${p.title}`}>
                {p.seconds !== null && (
                  <button className="ts-chip" onClick={() => onPlay(p.seconds!)} aria-label={`Play from ${clock(p.seconds)}`}>
                    {clock(p.seconds)}
                  </button>
                )}
                <div>
                  <b>{p.title}</b>
                  <p>{p.detail || p.short}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      {context.children.length > 0 && (
        <>
          <h4>Inside this idea</h4>
          <div className="chips mm-kids">
            {context.children.map((c) => (
              <button key={c.id} className="chip" onClick={() => onPick(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
        </>
      )}
      <div className="mm-actions">
        {node.seconds !== null && (
          <button className="small" onClick={() => onPlay(node.seconds!)}>
            <Play size={15} aria-hidden="true" /> Play from {clock(node.seconds)}
          </button>
        )}
        <button className="small secondary" onClick={onCopy}>
          <CopyPlus size={15} aria-hidden="true" /> Add to my notes
        </button>
      </div>
    </section>
  )
}
