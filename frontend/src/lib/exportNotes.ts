import { APP_URL } from '../config'
import type { AiNotesData, MapNode } from './aiNotes'
import { clock } from './study'

// Export AI notes: a printable page (the phone's print dialog saves it as PDF) or a share to WhatsApp.
const at = (videoId: string, s: number) => `https://youtu.be/${videoId}?t=${s}`

export function notesText(title: string, videoId: string, notes: AiNotesData): string {
  const points = notes.points.map((p) => `• ${p.seconds !== null ? `${clock(p.seconds)} ` : ''}${p.title}: ${p.short}`)
  return [title, '', notes.summary, '', ...points, '', `Watch: https://youtu.be/${videoId}`, `Summary made with Lumo: ${APP_URL}`].join('\n')
}

export async function shareNotes(title: string, videoId: string, notes: AiNotesData): Promise<'shared' | 'whatsapp'> {
  const text = notesText(title, videoId, notes)
  if (navigator.share) {
    try {
      await navigator.share({ title, text })
      return 'shared'
    } catch (e) {
      if ((e as Error).name === 'AbortError') return 'shared' // the user closed the share sheet
    }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  return 'whatsapp'
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

function outline(nodes: MapNode[], parent: string | null, seen = new Set<string>()): string {
  const kids = nodes.filter((n) => n.parent === parent && !seen.has(n.id))
  if (!kids.length) return ''
  kids.forEach((n) => seen.add(n.id))
  return `<ul>${kids
    .map((n) => `<li><b>${esc(n.label)}</b>${n.detail ? `: ${esc(n.detail)}` : ''}${outline(nodes, n.id, seen)}</li>`)
    .join('')}</ul>`
}

export function printableHtml(title: string, videoId: string, notes: AiNotesData): string {
  const time = (s: number | null) => (s === null ? '' : `<a href="${at(videoId, s)}">${clock(s)}</a> `)
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} - summary</title>
<style>
body{font:15px/1.6 system-ui,'Segoe UI',Roboto,'Noto Sans Devanagari',sans-serif;color:#1b2130;background:#fff;max-width:720px;margin:32px auto;padding:0 20px}
h1{font-size:22px;line-height:1.3;margin:0 0 4px}h2{font-size:17px;margin:28px 0 8px}
.sum{background:#eef1fb;border-radius:12px;padding:12px 16px;white-space:pre-line}
ol{padding-left:20px}li{margin:0 0 10px}a{color:#3550d8;text-decoration:none;font-variant-numeric:tabular-nums}
.short{color:#586174}.note{font-size:12px;color:#586174;margin-top:32px}
ul{padding-left:18px}ul ul{border-left:1px solid #e2e5ec;margin:4px 0}
@media print{body{margin:0}}
</style></head><body>
<h1>${esc(title)}</h1><p class="short">Watch: <a href="https://youtu.be/${videoId}">youtu.be/${videoId}</a></p>
<h2>Summary</h2><p class="sum">${esc(notes.summary)}</p>${notes.brief ? `<h2>Brief summary</h2>${notes.brief.split(/\n\s*\n/).map((t) => `<p>${esc(t)}</p>`).join('')}` : ''}
<h2>Key points</h2><ol>${notes.points
    .map((p) => `<li>${time(p.seconds)}<b>${esc(p.title)}</b><br><span class="short">${esc(p.short)}</span><br>${esc(p.detail)}</li>`)
    .join('')}</ol>
<h2>Mind map</h2>${outline(notes.mindmap, null)}
<p class="note">Made by AI from the video, not by YouTube or the teacher. Check with the video. Lumo: ${APP_URL}</p>
<script>window.onload=()=>setTimeout(()=>print(),300)</script>
</body></html>`
}

export function printNotes(title: string, videoId: string, notes: AiNotesData): boolean {
  const w = window.open('', '_blank')
  if (!w) return false // pop-up blocked
  w.document.write(printableHtml(title, videoId, notes))
  w.document.close()
  return true
}

// The message a shared video carries: the Lumo link (opens it here, with its summary) and the plain YouTube link
// for friends who don't use Lumo.
export function videoShareText(title: string, videoId: string): string {
  return `${title}

Watch with its AI summary and mind map on Lumo: ${APP_URL}/watch/${videoId}
On YouTube: https://youtu.be/${videoId}`
}
