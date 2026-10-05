import { describe, expect, it } from 'vitest'
import { ROW_H, appendToDoc, copyLine, layoutTree, type MapNode } from '../lib/aiNotes'

const node = (id: string, parent: string | null): MapNode => ({ id, parent, label: id, detail: '', seconds: null })

describe('layoutTree', () => {
  it('puts children right of the parent and the parent between its children', () => {
    const pos = layoutTree([node('root', null), node('a', 'root'), node('b', 'root'), node('a1', 'a'), node('a2', 'a')])
    expect(pos.get('a')!.x).toBeGreaterThan(pos.get('root')!.x)
    expect(pos.get('a1')!.y).toBe(0)
    expect(pos.get('a2')!.y).toBe(ROW_H)
    expect(pos.get('a')!.y).toBe(ROW_H / 2)
    expect(pos.get('b')!.y).toBe(2 * ROW_H)
    expect(pos.get('root')!.y).toBe((ROW_H / 2 + 2 * ROW_H) / 2)
  })

  it('survives a cycle in bad AI output', () => {
    const pos = layoutTree([node('root', null), node('a', 'root'), node('b', 'a'), { ...node('a', 'b') }])
    expect(pos.has('b')).toBe(true)
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

  it('keeps what she already wrote, blank lines included', () => {
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
