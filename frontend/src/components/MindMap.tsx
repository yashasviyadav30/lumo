import { Background, Controls, Handle, Position, ReactFlow, type Edge, type Node, type NodeProps } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { CopyPlus, Maximize2, Minimize2, Play, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { NODE_W, layoutTree, type MapNode } from '../lib/aiNotes'
import { clock } from '../lib/study'
import { notesOf, type useAiNotes } from '../lib/useAiNotes'
import { AiLabel, AiNotesStatus, LangPicker } from './AiNotesPanel'

type IdeaData = { label: string; depth: number }

function Idea({ data, selected }: NodeProps<Node<IdeaData>>) {
  return (
    <div className={`mm-node d${Math.min(data.depth, 2)}${selected ? ' on' : ''}`} style={{ width: NODE_W }}>
      <Handle type="target" position={Position.Left} className="mm-handle" />
      {data.label}
      <Handle type="source" position={Position.Right} className="mm-handle" />
    </div>
  )
}
const nodeTypes = { idea: Idea }

// Zoomable mind map of the video (lazy-loaded: the map library is only fetched when this tab opens).
export default function MindMap({
  ai,
  onSeek,
  onCopy,
}: {
  ai: ReturnType<typeof useAiNotes>
  onSeek: (t: number) => void
  onCopy: (title: string, body: string, seconds: number | null) => void
}) {
  const data = notesOf(ai.view)
  const [picked, setPicked] = useState<MapNode | null>(null)
  const [full, setFull] = useState(false)
  const fullBtn = useRef<HTMLButtonElement>(null)

  const { nodes, edges } = useMemo(() => {
    const map = data?.mindmap ?? []
    const pos = layoutTree(map)
    const nodes: Node<IdeaData>[] = map
      .filter((n) => pos.has(n.id))
      .map((n) => {
        const p = pos.get(n.id)!
        return { id: n.id, type: 'idea', position: { x: p.x, y: p.y }, data: { label: n.label, depth: p.depth } }
      })
    const edges: Edge[] = map
      .filter((n) => n.parent && pos.has(n.id))
      .map((n) => ({ id: `${n.parent}-${n.id}`, source: n.parent!, target: n.id, className: 'mm-edge' }))
    return { nodes, edges }
  }, [data])

  useEffect(() => {
    if (!full) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFull(false)
    document.body.classList.add('no-scroll')
    fullBtn.current?.focus() // focus moves into the full-screen map
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('no-scroll')
      window.removeEventListener('keydown', onKey)
    }
  }, [full])

  const pick = (id: string | undefined) => setPicked(data?.mindmap.find((n) => n.id === id) ?? null)
  const play = (t: number) => {
    setFull(false) // the video sits under the full-screen map
    onSeek(t)
  }

  return (
    <div className="ai-notes">
      <div className="ai-head">
        <LangPicker lang={ai.lang} onPick={ai.chooseLang} />
      </div>
      {!data ? (
        <AiNotesStatus view={ai.view} onGenerate={ai.generate} what="mind map" />
      ) : (
        <>
          <div
            className={`mm-wrap${full ? ' full' : ''}`}
            role={full ? 'dialog' : undefined}
            aria-modal={full || undefined}
            aria-label="Mind map"
          >
            <ReactFlow
              key={full ? 'full' : 'inline'} // fit again when the size changes
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.15, minZoom: 0.7 }} // big maps stay readable; drag to see the rest
              onInit={(flow) =>
                // When the map is wider than the screen, start at the main idea (left) instead of the middle.
                requestAnimationFrame(() => {
                  const vp = flow.getViewport()
                  if (vp.x < 16) flow.setViewport({ ...vp, x: 16 })
                })
              }
              minZoom={0.2}
              maxZoom={2}
              nodesDraggable={false}
              nodesConnectable={false}
              onNodeClick={(_e, n) => pick(n.id)}
              onSelectionChange={({ nodes: sel }) => sel[0] && pick(sel[0].id)}
              onPaneClick={() => setPicked(null)}
              proOptions={{ hideAttribution: true }}
            >
              <Background gap={24} size={1} className="mm-bg" />
              <Controls showInteractive={false} position="bottom-left" />
            </ReactFlow>
            <button
              ref={fullBtn}
              className="mm-full-btn"
              onClick={() => setFull(!full)}
              aria-label={full ? 'Close full screen' : 'Open full screen'}
              title={full ? 'Close full screen (Esc)' : 'Full screen'}
            >
              {full ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            {picked && (
              <div className="mm-card" role="region" aria-label={picked.label}>
                <div className="mm-card-head">
                  <h3>{picked.label}</h3>
                  <button className="mm-close" onClick={() => setPicked(null)} aria-label="Close">
                    <X size={18} />
                  </button>
                </div>
                {picked.detail && <p>{picked.detail}</p>}
                <div className="mm-actions">
                  {picked.seconds !== null && (
                    <button className="small" onClick={() => play(picked.seconds!)}>
                      <Play size={15} aria-hidden="true" /> Play this part ({clock(picked.seconds)})
                    </button>
                  )}
                  <button className="small secondary" onClick={() => onCopy(picked.label, picked.detail, picked.seconds)}>
                    <CopyPlus size={15} aria-hidden="true" /> Add to my notes
                  </button>
                </div>
              </div>
            )}
          </div>
          <p className="help mm-hint">Pinch or scroll to zoom, drag to move. Tap a box for details.</p>
          <AiLabel offline={'kind' in ai.view && ai.view.kind === 'offline'} />
        </>
      )}
    </div>
  )
}
