// The AI's detailed notes come as a small, fixed kind of Markdown: "## " section headings, "- " bullets, and
// **bold** key terms. Parsed into plain blocks here and drawn as React elements, so no HTML from the AI is ever
// put on the page.
export type Block = { kind: 'h'; text: string } | { kind: 'p'; text: string } | { kind: 'ul'; items: string[] }

export function parseNotes(text: string): Block[] {
  const blocks: Block[] = []
  let para: string[] = []
  const endPara = () => {
    if (para.length) blocks.push({ kind: 'p', text: para.join(' ') })
    para = []
  }
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line) {
      endPara()
      continue
    }
    const heading = line.match(/^#{1,4}\s+(.*)$/)
    const bullet = line.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/)
    if (heading) {
      endPara()
      blocks.push({ kind: 'h', text: heading[1].replace(/\*\*/g, '') })
    } else if (bullet) {
      endPara()
      const last = blocks[blocks.length - 1]
      if (last?.kind === 'ul') last.items.push(bullet[1])
      else blocks.push({ kind: 'ul', items: [bullet[1]] })
    } else para.push(line)
  }
  endPara()
  return blocks
}

// "a **term** here" → [{ text: 'a ' }, { text: 'term', bold: true }, { text: ' here' }]
export function inlineParts(text: string): Array<{ text: string; bold?: boolean }> {
  return text
    .split(/(\*\*[^*]+\*\*)/)
    .filter(Boolean)
    .map((s) => (s.startsWith('**') && s.endsWith('**') && s.length > 4 ? { text: s.slice(2, -2), bold: true } : { text: s.replace(/\*\*/g, '') }))
}
