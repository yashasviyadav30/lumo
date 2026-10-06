import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import { forget } from '../lib/api'

// Full-app tests render the whole app in jsdom; on a busy laptop a screen can take over 1 s to appear.
configure({ asyncUtilTimeout: 4000 })

afterEach(() => {
  cleanup()
  localStorage.clear()
  forget('') // what screens kept in memory belongs to that test only
  vi.unstubAllGlobals()
})
