import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useConfirmTap } from '../lib/useConfirmTap'

describe('two taps to delete', () => {
  it('the first tap only arms; the second does it; waiting disarms', () => {
    vi.useFakeTimers()
    const done = vi.fn()
    const { result } = renderHook(() => useConfirmTap(3000))
    act(() => result.current.tap('del', done))
    expect(done).not.toHaveBeenCalled()
    expect(result.current.armed).toBe('del')
    act(() => result.current.tap('del', done))
    expect(done).toHaveBeenCalledOnce()
    act(() => result.current.tap('del', done))
    act(() => vi.advanceTimersByTime(3100))
    expect(result.current.armed).toBeNull()
    act(() => result.current.tap('del', done))
    expect(done).toHaveBeenCalledOnce() // armed again, not done again
    vi.useRealTimers()
  })
})
