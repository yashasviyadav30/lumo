import { describe, expect, it } from 'vitest'
import { notepadText } from '../lib/exportNotes'

const doc = {
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Neurons' }] },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: '[3:04]', marks: [{ type: 'link', attrs: { href: '#t=184' } }] },
        { type: 'text', text: ' a neuron holds a ' },
        { type: 'text', text: 'number', marks: [{ type: 'bold' }] },
      ],
    },
    { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'input layer: 784' }] }] }] },
    {
      type: 'taskList',
      content: [
        { type: 'taskItem', attrs: { checked: true }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'watched' }] }] },
        { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'revise' }] }] },
      ],
    },
    { type: 'image', attrs: { src: '/api/notepad/images/x.webp' } },
  ],
}

describe('notepadText', () => {
  it('turns the notepad into a WhatsApp-ready message with the Thrywe link', () => {
    const text = notepadText('Neural networks', 'aircAruvnKk', JSON.stringify(doc))
    expect(text).toBe(
      [
        'My notes: Neural networks',
        '',
        '*Neurons*',
        '',
        '[3:04] a neuron holds a *number*',
        '',
        '• input layer: 784',
        '',
        '☑ watched',
        '☐ revise',
        '',
        'Watch it on Thrywe: https://thrywe.pages.dev/watch/aircAruvnKk',
      ].join('\n'),
    )
  })

  it('still shares the title and link when the note is empty or unreadable', () => {
    expect(notepadText('A talk', 'aircAruvnKk', 'not json')).toBe('My notes: A talk\n\nWatch it on Thrywe: https://thrywe.pages.dev/watch/aircAruvnKk')
  })
})
