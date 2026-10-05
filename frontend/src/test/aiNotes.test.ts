import { describe, expect, it } from 'vitest'
import { ROW_H, appendToDoc, copyLine, layoutTree, type MapNode } from '../lib/aiNotes'
import { notesText, printableHtml } from '../lib/exportNotes'

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
