import { describe, expect, it } from 'vitest'
import { appendToDoc, copyLine, ideaAt, ideaContext, layoutMindMap, type MapNode } from '../lib/aiNotes'
import { notesText, printableHtml, videoShareText } from '../lib/exportNotes'

const node = (id: string, parent: string | null): MapNode => ({ id, parent, label: id, detail: '', seconds: null })

describe('layoutMindMap', () => {
  it('shares branches out to both sides of the main idea, heavier branch on the lighter side', () => {
    const map = [
      node('root', null),
      node('a', 'root'), node('a1', 'a'), node('a2', 'a'), node('a3', 'a'),
      node('b', 'root'), node('b1', 'b'),
      node('c', 'root'), node('c1', 'c'), node('c2', 'c'),
    ]
    const pos = layoutMindMap(map)
    expect(pos.get('root')).toMatchObject({ x: 0, y: 0, depth: 0 })
    expect(pos.get('a')!.side).toBe(1) // first branch goes right
    expect(pos.get('b')!.side).toBe(-1) // right now holds 3 leaves, left 0
    expect(pos.get('c')!.side).toBe(-1) // still lighter on the left (1 leaf)
    expect(pos.get('a')!.x).toBeGreaterThan(0)
    expect(pos.get('b')!.x).toBeLessThan(0)
    expect(pos.get('a2')!.x).toBeGreaterThan(pos.get('a')!.x) // further out from the middle
    expect(pos.get('a1')!.branch).toBe(0) // its branch's colour
    expect(pos.get('c2')!.branch).toBe(2)
    // each side is centred on the main idea
    expect(pos.get('a')!.y).toBe(0)
  })

  it('survives a cycle and a second root in bad AI output', () => {
    const pos = layoutMindMap([node('root', null), node('a', 'root'), node('b', 'a'), { ...node('a', 'b') }, node('lost', null)])
    expect(pos.has('b')).toBe(true)
    expect(pos.has('lost')).toBe(true)
  })
})

describe('Copy to my notes', () => {
  it('replaces an untouched empty notepad and links the time', () => {
    const empty = JSON.stringify({ type: 'doc', content: [{ type: 'paragraph' }] })
    const { content, text } = appendToDoc(empty, [copyLine('Layers', 'Input to output', 220)])
    const doc = JSON.parse(content)
    expect(doc.content).toHaveLength(1)
    expect(doc.content[0].content[0]).toMatchObject({ text: '[3:40]', marks: [{ type: 'link', attrs: { href: '#t=220' } }] })
    expect(text).toBe('[3:40] Layers: Input to output')
  })

  it('keeps what the user already wrote, blank lines included', () => {
    const mine = JSON.stringify({
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'My line' }] }, { type: 'paragraph' }],
    })
    const doc = JSON.parse(appendToDoc(mine, [copyLine('Idea', '', null)]).content)
    expect(doc.content).toHaveLength(3)
    expect(doc.content[2].content).toEqual([{ type: 'text', text: 'Idea', marks: [{ type: 'bold' }] }])
  })

  it('starts fresh when the saved notepad is unreadable', () => {
    expect(JSON.parse(appendToDoc('not json', [copyLine('X', 'y', null)]).content).content).toHaveLength(1)
  })
})

describe('export', () => {
  const notes = {
    summary: 'Line one',
    points: [{ title: 'Ohm <law>', seconds: 760, short: 'V = IR', detail: 'Current & voltage.' }],
    mindmap: [
      { id: 'r', parent: null, label: 'Circuits', detail: '', seconds: 0 },
      { id: 'a', parent: 'r', label: 'Ohm', detail: 'V = IR', seconds: 760 },
    ],
  }

  it('shares plain text with times and links', () => {
    const text = notesText('Lecture 1', 'abcdefghijk', notes)
    expect(text).toContain('• 12:40 Ohm <law>: V = IR')
    expect(text).toContain('Watch: https://youtu.be/abcdefghijk')
  })

  it('escapes AI text in the printable page and links each time to that second', () => {
    const html = printableHtml('Lecture <1>', 'abcdefghijk', notes)
    expect(html).toContain('Ohm &lt;law&gt;')
    expect(html).not.toContain('<law>')
    expect(html).toContain('href="https://youtu.be/abcdefghijk?t=760"')
    expect(html).toContain('<li><b>Circuits</b><ul><li><b>Ohm</b>: V = IR</li></ul></li>')
  })
})

describe('ideaAt', () => {
  const at = (id: string, seconds: number | null): MapNode => ({ id, parent: null, label: id, detail: '', seconds })
  const map = [at('root', 0), at('layers', 220), at('weights', 540), at('untimed', null)]
  it('lights the latest idea whose time has passed', () => {
    expect(ideaAt(map, 300)).toBe('layers')
    expect(ideaAt(map, 540)).toBe('weights')
  })
  it('lights nothing before the video starts', () => {
    expect(ideaAt(map, 0)).toBeNull()
    expect(ideaAt(map, null)).toBeNull()
  })
})

describe('sharing a video', () => {
  it('carries the Lumo link and the plain YouTube link', () => {
    const text = videoShareText('Neural networks', 'aircAruvnKk')
    expect(text).toContain('/watch/aircAruvnKk')
    expect(text).toContain('https://youtu.be/aircAruvnKk')
    expect(text.startsWith('Neural networks')).toBe(true)
  })
})

describe('ideaContext', () => {
  const n = (id: string, parent: string | null, seconds: number | null): MapNode => ({ id, parent, label: id, detail: '', seconds })
  const map = [n('root', null, 0), n('layers', 'root', 200), n('input', 'layers', 220), n('hidden', 'layers', 300), n('weights', 'root', 500)]
  const p = (title: string, seconds: number) => ({ title, seconds, short: '', detail: '' })
  const points = [p('Intro', 10), p('Input layer', 230), p('Hidden layer', 320), p('Weights', 510)]

  it('gives the path, the sub-ideas and the key points in its stretch of the video', () => {
    const c = ideaContext(map, points, 'layers')
    expect(c.path.map((x) => x.id)).toEqual(['root', 'layers'])
    expect(c.children.map((x) => x.id)).toEqual(['input', 'hidden'])
    expect(c.points.map((x) => x.title)).toEqual(['Input layer', 'Hidden layer']) // up to "weights" at 500
  })

  it('a leaf gets the points from its time to the next idea', () => {
    expect(ideaContext(map, points, 'input').points.map((x) => x.title)).toEqual(['Input layer'])
    expect(ideaContext(map, points, 'weights').points.map((x) => x.title)).toEqual(['Weights'])
  })
})
