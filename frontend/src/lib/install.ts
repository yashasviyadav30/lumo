import { useEffect, useState } from 'react'

// "Install Thrywe": Chrome on Android (and desktop) offers the app's own install prompt once the page qualifies; we
// keep that offer and show it behind our button. iPhones have no prompt: Safari's Share → Add to Home Screen.
type InstallPrompt = Event & { prompt(): Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }

let offer: InstallPrompt | null = null
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault() // ours to show at the right moment, not the browser's mini-bar
  offer = e as InstallPrompt
  window.dispatchEvent(new Event('focuslearn:installable'))
})
window.addEventListener('appinstalled', () => {
  offer = null
  window.dispatchEvent(new Event('focuslearn:installable'))
})

const standalone = () => (typeof matchMedia === 'function' && matchMedia('(display-mode: standalone)').matches) || (navigator as { standalone?: boolean }).standalone === true
const iphone = () => /iPhone|iPad|iPod/.test(navigator.userAgent)

export type InstallState = 'installed' | 'ready' | 'ios' | 'unavailable'

export function useInstall(): { state: InstallState; install: () => Promise<void> } {
  const read = (): InstallState => (standalone() ? 'installed' : offer ? 'ready' : iphone() ? 'ios' : 'unavailable')
  const [state, setState] = useState<InstallState>(read)
  useEffect(() => {
    const update = () => setState(read())
    window.addEventListener('focuslearn:installable', update)
    return () => window.removeEventListener('focuslearn:installable', update)
  }, [])
  const install = async () => {
    if (!offer) return
    await offer.prompt()
    const { outcome } = await offer.userChoice
    if (outcome === 'accepted') offer = null
    setState(read())
  }
  return { state, install }
}
