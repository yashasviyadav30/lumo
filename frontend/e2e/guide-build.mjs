// Turns docs/guide/screens.json (from e2e/guide.mjs) into one self-contained page: docs/guide/app-guide.html.
// Run: node e2e/guide-build.mjs
import fs from 'node:fs'

const root = new URL('../../docs/guide/', import.meta.url)
const path = (name) => new URL(name, root).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const screens = JSON.parse(fs.readFileSync(path('screens.json'), 'utf8'))

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>FocusLearn Guide</title>
<style>
:root {
  --bg: #0a0b09; --surface: #121411; --surface-2: #1a1d18; --text: #f2f5ec; --muted: #9aa294;
  --line: #2a2e27; --lime: #c6f432; --ink: #0a0b09; --orange: #ffa04d;
  color-scheme: dark;
  font-family: system-ui, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: var(--text); background: var(--bg);
}
* { box-sizing: border-box; }
body { margin: 0; background-color: var(--bg);
  background-image: linear-gradient(rgb(255 255 255 / .028) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / .028) 1px, transparent 1px);
  background-size: 56px 56px; }
.wrap { max-width: 1180px; margin: 0 auto; padding: 24px 16px 80px; }
h1, h2, h3 { letter-spacing: -0.02em; line-height: 1.15; }
h1 { font-size: clamp(2rem, 6vw, 3.2rem); margin: 8px 0 8px; }
h2 { font-size: clamp(1.4rem, 4vw, 2rem); margin: 0 0 6px; }
.hl { color: var(--lime); }
.dim { color: var(--muted); }
.lead { color: var(--muted); font-size: 1.08rem; max-width: 46em; margin: 0; }
.kicker { font-size: .75rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); margin: 0; }
.panel { background: var(--surface); border: 1px solid var(--line); border-radius: 22px; padding: 20px; }
.grid2 { display: grid; gap: 14px; grid-template-columns: 1fr; margin: 28px 0; align-items: start; }
@media (min-width: 900px) { .grid2 { grid-template-columns: 1.1fr 1fr; } }
ol.steps { margin: 10px 0 0; padding: 0; list-style: none; counter-reset: s; display: grid; gap: 10px; }
ol.steps li { counter-increment: s; display: grid; grid-template-columns: 40px 1fr; gap: 10px; align-items: start; }
ol.steps li::before { content: counter(s, decimal-leading-zero) "."; font-weight: 800; color: var(--lime); font-size: 1.05rem; }
ol.steps b, dl b { color: var(--text); }
ol.steps span, dd { color: var(--muted); }
dl { margin: 10px 0 0; display: grid; gap: 8px; }
dt { font-weight: 800; color: var(--lime); }
dd { margin: 0 0 4px; }
.toc { display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0 28px; }
.toc a { padding: 8px 14px; border-radius: 999px; border: 1px solid var(--line); background: var(--surface); color: var(--text); text-decoration: none; font-weight: 600; font-size: .9rem; }
.toc a:hover { border-color: var(--lime); }
section.screen { margin: 56px 0 0; scroll-margin-top: 16px; }
.screen-head { display: flex; gap: 14px; align-items: baseline; flex-wrap: wrap; margin-bottom: 4px; }
.screen-head .num { color: var(--lime); font-weight: 800; font-size: 1.1rem; }
.screen > p { color: var(--muted); margin: 0 0 18px; max-width: 46em; }

/* Picture in the middle, notes on both sides, arrows drawn between them. */
.stage { position: relative; display: grid; grid-template-columns: 1fr auto 1fr; gap: 56px; align-items: start; }
.side { position: relative; }
.shot { position: relative; width: 340px; }
.shot img { display: block; width: 100%; border-radius: 26px; border: 6px solid #22261f; box-shadow: 0 24px 60px rgb(0 0 0 / .55); }
.mark { position: absolute; border: 2px solid var(--lime); border-radius: 10px; box-shadow: 0 0 0 3px rgb(198 244 50 / .18); pointer-events: none; }
.badge { position: absolute; width: 24px; height: 24px; border-radius: 50%; background: var(--lime); color: var(--ink);
  font-weight: 800; font-size: .75rem; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%); box-shadow: 0 0 0 3px var(--bg); }
.note { position: absolute; left: 0; right: 0; background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 10px 12px; transition: border-color .15s; }
.note:hover, .note.active { border-color: var(--lime); }
.note h3 { font-size: .98rem; margin: 0 0 2px; display: flex; gap: 8px; align-items: center; }
.note h3 i { font-style: normal; width: 22px; height: 22px; flex: none; border-radius: 50%; background: var(--lime); color: var(--ink); font-size: .72rem; display: inline-flex; align-items: center; justify-content: center; }
.note p { margin: 0; color: var(--muted); font-size: .9rem; }
svg.arrows { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
svg.arrows > path { fill: none; stroke: var(--lime); stroke-width: 1.8; opacity: .85; }
svg.arrows > path.active { stroke-width: 3; opacity: 1; }

/* Narrow screens: no room for arrows, so numbered badges on the picture and the notes underneath. */
@media (max-width: 899px) {
  .stage { display: block; }
  .shot { margin: 0 auto; width: min(340px, 100%); }
  .side { display: none; }
  .list { display: grid; gap: 8px; margin-top: 14px; }
  .note { position: static; }
  svg.arrows { display: none; }
}
footer { margin-top: 64px; color: var(--muted); font-size: .85rem; text-align: center; }
</style>
</head>
<body>
<div class="wrap">
  <p class="kicker">FocusLearn guide</p>
  <h1>Every screen, <span class="hl">every button</span>, <span class="dim">explained.</span></h1>
  <p class="lead">Each picture below is a real screen of the app. A line runs from every button and panel to a note that says what it does. Hover a note (or tap it on a phone) to light up its arrow.</p>

  <div class="grid2">
    <div class="panel">
      <h2>Start here: <span class="hl">your first 10 minutes</span></h2>
      <ol class="steps">
        <li><div><b>Set your goal on Home.</b> <span>Type what you study, e.g. “CMA Inter costing”. Your feed fills with videos for it.</span></div></li>
        <li><div><b>Open a lecture.</b> <span>Tap any video in the feed, or find one in Search.</span></div></li>
        <li><div><b>Tap Mark when something matters.</b> <span>It saves that exact second. Don’t stop the video. Tap Doubt if you didn’t understand.</span></div></li>
        <li><div><b>At the next pause, fill in your marks.</b> <span>Play each moment again and write one line. Then tap “Make a card” on the important ones.</span></div></li>
        <li><div><b>Tonight, open Revision.</b> <span>Answer your cards. If you forget one, the app replays just that bit of the lecture.</span></div></li>
      </ol>
    </div>
    <div class="panel">
      <h2>Words you’ll see</h2>
      <dl>
        <dt>Mark</dt><dd>A bookmark on one second of a lecture. Empty at first; you write the note later.</dd>
        <dt>Doubt</dt><dd>A question you parked while watching. Stays open until you write the answer and tap Solved.</dd>
        <dt>Card</dt><dd>Your own note with a few words hidden. The app asks you to recall them.</dd>
        <dt>Revision</dt><dd>Going through today’s cards. A card comes back after 1 day, then 3 days, then retires.</dd>
        <dt>Feed</dt><dd>Videos for your goal plus new videos from channels you follow.</dd>
        <dt>Hide / Follow channel</dt><dd>Hide = never show this channel. Follow = bring its new videos to your feed.</dd>
      </dl>
    </div>
  </div>

  <nav class="toc" aria-label="Screens">TOC</nav>
  <div id="screens"></div>
  <footer>Made from the real app on ${new Date().toISOString().slice(0, 10)}. Screens were captured with a test account that was then deleted.</footer>
</div>
<script>
const SCREENS = ${JSON.stringify(screens)};
const toc = document.querySelector('.toc');
toc.textContent = '';
const holder = document.getElementById('screens');

SCREENS.forEach((s, si) => {
  const a = document.createElement('a');
  a.href = '#' + s.id;
  a.textContent = s.title;
  toc.appendChild(a);

  const sec = document.createElement('section');
  sec.className = 'screen';
  sec.id = s.id;
  sec.innerHTML = '<div class="screen-head"><span class="num">' + String(si + 1).padStart(2, '0') + '.</span><h2></h2></div><p></p>' +
    '<div class="stage"><div class="side left"></div><div class="shot"><img alt=""></div><div class="side right"></div><svg class="arrows"></svg></div><div class="list"></div>';
  sec.querySelector('h2').textContent = s.title;
  sec.querySelector('p').textContent = s.intro;
  const img = sec.querySelector('img');
  img.src = 'data:image/jpeg;base64,' + s.img;
  img.alt = 'Screenshot: ' + s.title;
  const shot = sec.querySelector('.shot');

  s.callouts.forEach((c, i) => {
    c.n = i + 1;
    c.cx = c.box.x + c.box.width / 2;
    c.cy = c.box.y + c.box.height / 2;
    // Notes go on the side the element sits on; full-width panels alternate.
    const wide = c.box.width > s.width * 0.7;
    c.side = wide ? (i % 2 ? 'right' : 'left') : (c.cx < s.width / 2 ? 'left' : 'right');
    const m = document.createElement('div');
    m.className = 'mark';
    shot.appendChild(m);
    const b = document.createElement('div');
    b.className = 'badge';
    b.textContent = c.n;
    shot.appendChild(b);
    const note = document.createElement('div');
    note.className = 'note';
    note.innerHTML = '<h3><i></i><span></span></h3><p></p>';
    note.querySelector('i').textContent = c.n;
    note.querySelector('span').textContent = c.title;
    note.querySelector('p').textContent = c.text;
    sec.querySelector('.side.' + c.side).appendChild(note);
    c.el = { m, b, note };
  });
  holder.appendChild(sec);
  s.sec = sec;
  img.addEventListener('load', () => layout(s));
});

function layout(s) {
  const sec = s.sec, shot = sec.querySelector('.shot'), img = shot.querySelector('img');
  const k = img.clientWidth / s.width; // picture scale
  const off = img.offsetLeft + 6, offT = img.offsetTop + 6; // inside the phone border
  s.callouts.forEach((c) => {
    Object.assign(c.el.m.style, { left: off + c.box.x * k - 3 + 'px', top: offT + c.box.y * k - 3 + 'px', width: c.box.width * k + 6 + 'px', height: c.box.height * k + 6 + 'px' });
    Object.assign(c.el.b.style, { left: off + c.box.x * k + 'px', top: offT + c.box.y * k + 'px' });
  });
  const svg = sec.querySelector('svg.arrows');
  svg.innerHTML = '';
  const narrow = matchMedia('(max-width: 899px)').matches;
  // Phones: one numbered list under the picture. Wider screens: notes beside the picture, level with their target.
  for (const c of s.callouts) (narrow ? sec.querySelector('.list') : sec.querySelector('.side.' + c.side)).appendChild(c.el.note);
  for (const side of ['left', 'right']) {
    const col = sec.querySelector('.side.' + side);
    if (narrow) { col.style.height = '0px'; continue; }
    let bottom = 0;
    const items = s.callouts.filter((c) => c.side === side).sort((a, b) => a.cy - b.cy);
    for (const c of items) {
      const h = c.el.note.offsetHeight;
      const top = Math.max(offT + c.cy * k - h / 2, bottom + 10);
      c.el.note.style.top = top + 'px';
      bottom = top + h;
    }
    col.style.height = Math.max(bottom, img.offsetHeight) + 'px';
  }
  if (narrow) return;
  const stage = sec.querySelector('.stage').getBoundingClientRect();
  const shotR = shot.getBoundingClientRect();
  for (const c of s.callouts) {
    const n = c.el.note.getBoundingClientRect();
    const left = c.side === 'left';
    const x1 = (left ? n.right : n.left) - stage.left;
    const y1 = n.top + n.height / 2 - stage.top;
    const x2 = shotR.left - stage.left + off + (left ? c.box.x : c.box.x + c.box.width) * k + (left ? -2 : 2);
    const y2 = shotR.top - stage.top + offT + c.cy * k;
    const mid = (x1 + x2) / 2;
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', 'M' + x1 + ',' + y1 + ' C' + mid + ',' + y1 + ' ' + mid + ',' + y2 + ' ' + x2 + ',' + y2);
    p.setAttribute('marker-end', 'url(#tip)');
    svg.appendChild(p);
    c.el.path = p;
    const on = (v) => { p.classList.toggle('active', v); c.el.note.classList.toggle('active', v); c.el.m.style.borderWidth = v ? '3px' : '2px'; };
    c.el.note.onmouseenter = () => on(true);
    c.el.note.onmouseleave = () => on(false);
    c.el.note.onclick = () => on(!p.classList.contains('active'));
  }
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = '<marker id="tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#c6f432" stroke="none"/></marker>';
  svg.prepend(defs);
}
let t;
addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => SCREENS.forEach(layout), 120); });
document.fonts && document.fonts.ready.then(() => SCREENS.forEach(layout));
</script>
</body>
</html>
`
fs.writeFileSync(path('app-guide.html'), html)
console.log('wrote docs/guide/app-guide.html', Math.round(html.length / 1024), 'KB')
