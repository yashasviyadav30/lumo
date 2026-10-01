import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { APP_NAME } from '../config'
import { renderAt, signInForTest } from './render'

describe('app shell (1.1)', () => {
  beforeEach(() => {
    signInForTest()
  })

  it('shows our own name and the four tabs', async () => {
    renderAt('/')
    expect(await screen.findByText(APP_NAME)).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Main' })
    for (const label of ['Home', 'Search', 'Library', 'Personal']) {
      expect(nav).toHaveTextContent(label)
    }
  })

  it('switches pages when a tab is tapped', async () => {
    const { router } = renderAt('/')
    await userEvent.click(await screen.findByRole('link', { name: 'Library' }))
    expect(router.state.location.pathname).toBe('/library')
    expect(screen.getByRole('heading', { name: 'Library' })).toBeInTheDocument()
  })

  it('marks the current tab as active', async () => {
    renderAt('/personal')
    expect(await screen.findByRole('link', { name: 'Personal' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/settings')
  })

  it('says it is not made by YouTube (R9)', async () => {
    renderAt('/settings')
    expect(await screen.findByText(/not made by YouTube or Google/)).toBeInTheDocument()
  })

  it('shows a not-found page for unknown paths', async () => {
    renderAt('/nope')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
