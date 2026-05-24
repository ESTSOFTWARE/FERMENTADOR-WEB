import { useState, useEffect } from 'react'
import type { LoadingScreenProps } from '../types/LoadingScreenProps'
import { AGD_MESSAGES } from '../constants/agdMessages'
import { BUBBLES } from '../constants/loading-screen.constants'

const LoadingScreen = ({ elapsed }: LoadingScreenProps) => {
  const [msgIndex, setMsgIndex] = useState(0)
  const [visible, setVisible]   = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setMsgIndex(prev => (prev + 1) % AGD_MESSAGES.length)
        setVisible(true)
      }, 300)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#0A0A0B' }}>
      <div className="absolute inset-0 pointer-events-none">
        {BUBBLES.map((style, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{ ...style, bottom: '-20px' }}
          />
        ))}
      </div>

      <div className="absolute rounded-full blur-3xl" style={{ width: '400px', height: '400px', backgroundColor: '#22C55E', opacity: 0.04, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />

      <div className="relative z-10 flex flex-col items-center gap-8 px-8 text-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: '#1F1F22' }} />
          <div className="absolute inset-0 rounded-full border-2 border-transparent" style={{ borderTopColor: '#22C55E', animation: 'spin 1s linear infinite' }} />
          <div className="absolute inset-3 rounded-full border-2 border-transparent" style={{ borderTopColor: '#16A34A', animation: 'spin 1.5s linear infinite reverse' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
            </svg>
          </div>
        </div>

        <div>
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#22C55E' }}>Algoritmo Genético en ejecución</p>
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#F4F4F5' }}>Optimizando fermentación</h2>
          <p className="text-sm" style={{ color: '#52525B' }}>Tiempo transcurrido: <span style={{ color: '#71717A' }}>{elapsed}s</span></p>
        </div>

        <div className="px-6 py-3 rounded-xl" style={{ backgroundColor: '#111113', border: '1px solid #1F1F22', transition: 'opacity 0.3s ease', opacity: visible ? 1 : 0, minWidth: '320px' }}>
          <p className="text-sm" style={{ color: '#A1A1AA' }}>{AGD_MESSAGES[msgIndex]}</p>
        </div>

        <div className="flex gap-2">
          {Array.from({ length: 20 }).map((_, i) => {
            const filled = Math.floor(elapsed / 1.5)
            return (
              <div key={i} className="rounded-full transition-all duration-500" style={{ width: '6px', height: '6px', backgroundColor: i < filled ? '#22C55E' : '#1F1F22', transform: i < filled ? 'scale(1.2)' : 'scale(1)' }} />
            )
          })}
        </div>

        <p className="text-xs" style={{ color: '#3F3F46' }}>Este proceso puede tomar entre 20 y 60 segundos</p>
      </div>

      <style>{`
        @keyframes bubble {
          0%   { transform: translateY(0) scale(1); opacity: 0.2; }
          50%  { opacity: 0.4; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default LoadingScreen
