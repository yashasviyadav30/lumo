import type { ReactNode } from 'react'
import { Sparkles, TreeStructure, UsersThree } from './icons'

const BENEFITS = [
  { Icon: Sparkles, text: 'A summary and study notes for any video', short: 'Summaries', tint: 'butter' },
  { Icon: TreeStructure, text: 'The whole lecture as a mind map', short: 'Mind maps', tint: 'lavender' },
  { Icon: UsersThree, text: 'Study groups that talk about the exact second', short: 'Study groups', tint: 'mint' },
] as const

// The frame for sign-in and sign-up, the first screens people see: what Lumo gives on one side (laptops), the card
// on the other. On phones the benefits shrink to three chips above the card.
export default function AuthShell({ title, lead, children }: { title: string; lead: string; children: ReactNode }) {
  return (
    <div className="auth-shell">
      <aside className="auth-side" aria-hidden="true">
        <p className="auth-side-title">
          Learn anything from YouTube. <em>Without the noise.</em>
        </p>
        <ul className="auth-benefits">
          {BENEFITS.map(({ Icon, text, tint }) => (
            <li key={text}>
              <span className={`auth-chip tint-${tint}`}>
                <Icon size={20} weight="fill" />
              </span>
              {text}
            </li>
          ))}
        </ul>
        <img className="auth-phone" src="/screenshots/summary.webp" alt="" width={618} height={1372} />
      </aside>
      <section className="auth card">
        <h1>{title}</h1>
        <p className="auth-lead">{lead}</p>
        <ul className="auth-pills" aria-label="What you get">
          {BENEFITS.map(({ Icon, short, tint }) => (
            <li key={short} className={`tint-${tint}`}>
              <Icon size={15} weight="fill" aria-hidden="true" /> {short}
            </li>
          ))}
        </ul>
        {children}
      </section>
    </div>
  )
}
