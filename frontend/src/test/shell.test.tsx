import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { APP_NAME } from '../config'
import { renderAt } from './render'

describe('app shell (1.1)', () => {
  it('shows our own name and the four tabs', () => {
    renderAt('/')
    expect(screen.getByText(APP_NAME)).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Main' })
    for (const label of ['Home', 'Search', 'Library', 'Settings']) {
      expect(nav).toHaveTextContent(label)
    }
  })

  it('switches pages when a tab is tapped', async () => {
    const { router } = renderAt('/')
    await userEvent.click(screen.getByRole('link', { name: 'Library' }))
    expect(router.state.location.pathname).toBe('/library')
    expect(screen.getByRole('heading', { name: 'Library' })).toBeInTheDocument()
  })

  it('marks the current tab as active', () => {
    renderAt('/settings')
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('aria-current', 'page')
  })

  it('says it is not made by YouTube (R9)', () => {
    renderAt('/settings')
    expect(screen.getByText(/not made by YouTube or Google/)).toBeInTheDocument()
  })

  it('shows a not-found page for unknown paths', () => {
    renderAt('/nope')
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
