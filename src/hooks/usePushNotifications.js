import { useEffect, useState, useRef } from 'react'

const APP_ID = import.meta.env.VITE_ONESIGNAL_APP_ID || '61db1733-7173-4ddc-8ed4-b3a246671d0a'

// ─── Load OneSignal SDK once ───────────────────────────────────────────────────
let sdkLoaded = false
function loadOneSignal() {
  if (sdkLoaded || !APP_ID || typeof window === 'undefined') return
  sdkLoaded = true
  window.OneSignalDeferred = window.OneSignalDeferred || []
  const s = document.createElement('script')
  s.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'
  s.defer = true
  document.head.appendChild(s)
}

function getStatus(OneSignal) {
  try {
    const opted = OneSignal.User.PushSubscription.optedIn
    const perm = OneSignal.Notifications.permissionNative // 'granted' | 'denied' | 'default'
    if (opted) return 'granted'
    if (perm === 'denied') return 'denied'
    return 'default'
  } catch {
    return 'default'
  }
}

export function usePushNotifications() {
  const [status, setStatus] = useState('loading') // 'loading' | 'unsupported' | 'default' | 'granted' | 'denied'
  const ready = useRef(false)

  useEffect(() => {
    if (!APP_ID) { setStatus('unsupported'); return }
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported'); return
    }

    loadOneSignal()

    window.OneSignalDeferred = window.OneSignalDeferred || []
    window.OneSignalDeferred.push(async (OneSignal) => {
      if (ready.current) return
      ready.current = true
      try {
        await OneSignal.init({
          appId: APP_ID,
          notifyButton: { enable: false },
          allowLocalhostAsSecureOrigin: true,
        })
        setStatus(getStatus(OneSignal))

        // Keep status in sync if subscription changes (e.g. user revokes in browser)
        OneSignal.User.PushSubscription.addEventListener('change', () => {
          setStatus(getStatus(OneSignal))
        })
      } catch {
        setStatus('unsupported')
      }
    })
  }, [])

  const subscribe = async () => {
    if (!window.OneSignal) return
    try {
      // optIn() does BOTH: requests browser permission AND registers with OneSignal
      await window.OneSignal.User.PushSubscription.optIn()
      setStatus(getStatus(window.OneSignal))
    } catch (e) {
      console.error('Push subscribe error:', e)
      setStatus('denied')
    }
  }

  const unsubscribe = async () => {
    if (!window.OneSignal) return
    try {
      await window.OneSignal.User.PushSubscription.optOut()
      setStatus('default')
    } catch (e) {
      console.error('Push unsubscribe error:', e)
    }
  }

  return { status, subscribe, unsubscribe }
}
