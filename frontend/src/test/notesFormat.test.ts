import { describe, expect, it } from 'vitest'
import { inlineParts, parseNotes } from '../lib/notesFormat'

describe('the AI notes format', () => {
  it('reads sections, paragraphs and bullet lists', () => {
    const blocks = parseNotes('## Layers\nA network has **layers**.\nEach one transforms.\n\n- input\n- hidden\n\n## Weights\n1. start random')
    expect(blocks).toEqual([
      { kind: 'h', text: 'Layers' },
      { kind: 'p', text: 'A network has **layers**. Each one transforms.' },
      { kind: 'ul', items: ['input', 'hidden'] },
      { kind: 'h', text: 'Weights' },
      { kind: 'ul', items: ['start random'] },
    ])
  })

  it('keeps old plain paragraphs as paragraphs', () => {
    expect(parseNotes('One.\n\nTwo.')).toEqual([{ kind: 'p', text: 'One.' }, { kind: 'p', text: 'Two.' }])
  })

  it('marks bold terms and drops stray asterisks', () => {
    expect(inlineParts('a **term** here')).toEqual([{ text: 'a ' }, { text: 'term', bold: true }, { text: ' here' }])
    expect(inlineParts('half **open')).toEqual([{ text: 'half open' }])
  })
})
