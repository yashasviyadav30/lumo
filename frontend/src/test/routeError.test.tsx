import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import RouteError from '../components/RouteError'

const renderThrowing = (message: string) => {
  const Broken = () => {
    throw new Error(message)
  }
  const router = createMemoryRouter([{ path: '/', element: <Broken />, errorElement: <RouteError /> }])
  render(<RouterProvider router={router} />)
}

describe('route error screen', () => {
  it('says the app was updated when a screen file is gone, and offers a reload', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {}) // React logs the thrown error
    renderThrowing('Failed to fetch dynamically imported module: /assets/Search-old.js')
    expect(screen.getByRole('heading', { name: 'Lumo was just updated' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument()
  })

  it('shows a plain message and a way home for any other error', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    renderThrowing('boom')
    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to Home' })).toBeInTheDocument()
  })
})
