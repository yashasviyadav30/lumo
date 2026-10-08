import { DeviceMobile } from './icons'
import { useInstall } from '../lib/install'

// One tap to put Thrywe on the home screen like an app (Android, laptops); the two taps it takes on an iPhone.
export default function InstallButton({ className = '' }: { className?: string }) {
  const { state, install } = useInstall()
  if (state === 'ready')
    return (
      <button className={`install-btn ${className}`} onClick={install}>
        <DeviceMobile size={18} aria-hidden="true" /> Install the app
      </button>
    )
  if (state === 'ios')
    return <p className={`help install-ios ${className}`}>On iPhone: tap Share, then “Add to Home Screen”.</p>
  return null
}
