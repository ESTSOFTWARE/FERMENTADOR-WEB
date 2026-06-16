import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const PACKAGE  = 'com.nichka.app'
const PLAY_URL = `https://play.google.com/store/apps/details?id=${PACKAGE}`

// intent:// abre la app directo (apuntando al paquete, sin depender de la
// verificación de App Links) y cae al Play Store si no está instalada.
const buildIntentUrl = (code: string) => {
  const fallback = encodeURIComponent(PLAY_URL)
  return `intent://nich-ka.space/join?code=${encodeURIComponent(code)}` +
    `#Intent;scheme=https;package=${PACKAGE};S.browser_fallback_url=${fallback};end`
}

const JoinRedirectView = () => {
  const [params]   = useSearchParams()
  const code       = (params.get('code') ?? '').trim().toUpperCase()
  const isAndroid  = /android/i.test(navigator.userAgent)
  const [tried, setTried] = useState(false)

  const openApp = () => {
    if (!code) return
    setTried(true)
    window.location.href = buildIntentUrl(code)
  }

  useEffect(() => {
    if (isAndroid && code) openApp()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: '#0A0A0B' }}>
      <img src="/assets/logo.svg" alt="Nich-Ká" className="w-16 h-16 mb-6" />

      <p className="text-[10px] font-semibold text-green-500/70 uppercase tracking-[0.3em] mb-2">
        Invitación a clase
      </p>
      <h1 className="text-white text-2xl font-black tracking-tight mb-2">Unirte a la clase</h1>

      {code ? (
        <>
          <p className="text-neutral-400 text-sm mb-1">Código de la clase</p>
          <div className="text-green-400 font-mono text-2xl font-bold tracking-widest mb-8">{code}</div>

          {isAndroid ? (
            <>
              <button onClick={openApp}
                className="w-full max-w-xs py-3.5 rounded-xl text-sm font-semibold text-black mb-3"
                style={{ background: '#22C55E' }}>
                Abrir en la app
              </button>
              {tried && (
                <p className="text-neutral-600 text-xs max-w-xs leading-relaxed">
                  Si no se abrió sola, toca “Abrir en la app”. ¿No tienes la app?
                  <a href={PLAY_URL} className="text-green-500 ml-1">Descárgala aquí</a>.
                </p>
              )}
            </>
          ) : (
            <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">
              Abre este enlace desde tu teléfono <span className="text-white">Android</span> con la
              app <span className="text-white">Nich-Ká</span> instalada para unirte a la clase.
            </p>
          )}
        </>
      ) : (
        <p className="text-red-400 text-sm">El enlace no trae un código de clase válido.</p>
      )}
    </div>
  )
}

export default JoinRedirectView
