import { useState, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { pageVariants, sectionVariants } from '../../../../shared/animations/variants'

const API_KEY  = import.meta.env.VITE_API_KEY_CHATBOT
const BOT_NAME = import.meta.env.VITE_NAME_CHATBOT ?? 'Nich-káBot'
const API_URL  = 'https://api.groq.com/openai/v1/chat/completions'

const SYSTEM_PROMPT = `Eres ${BOT_NAME}, el asistente especializado de Fermest, una plataforma de monitoreo y optimización de fermentación de café con inteligencia artificial.

REGLAS ESTRICTAS:
- SOLO responde preguntas relacionadas con: fermentación de café, pH, temperatura, tiempo de fermentación, perfiles de sabor, procesos de beneficio húmedo/seco, microbiología de la fermentación, sensores IoT, algoritmos genéticos aplicados al café, y el uso de la plataforma Nich-ká.
- Si el usuario pregunta algo fuera de estos temas, responde exactamente: "Solo puedo ayudarte con temas relacionados a la fermentación de café y la plataforma Nich-ká. ¿Tienes alguna pregunta sobre eso?"
- Sé conciso, técnico cuando se requiere y siempre responde en español.
- No saludes con "Hola" repetidamente, ve directo al punto.`

type Message = { role: 'user' | 'model'; text: string }

const SUGGESTIONS = [
  '¿Qué pH es ideal para fermentar café?',
  '¿Cómo afecta la temperatura al perfil de sabor?',
  '¿Cuánto tiempo dura la fermentación?',
]

const ChatView = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const bottomRef               = useRef<HTMLDivElement>(null)
  const textareaRef             = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (override?: string) => {
    const text = (override ?? input).trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setLoading(true)

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...updated.map(m => ({
              role: m.role === 'model' ? 'assistant' : 'user',
              content: m.text,
            })),
          ],
        }),
      })

      if (res.status === 429) {
        setMessages(prev => [...prev, { role: 'model', text: 'Límite de solicitudes alcanzado. Espera un momento e intenta de nuevo.' }])
        return
      }

      const data = await res.json()

      if (!res.ok) {
        const msg = data?.error?.message ?? `Error ${res.status}`
        setMessages(prev => [...prev, { role: 'model', text: `Error de API: ${msg}` }])
        return
      }

      const reply = data?.choices?.[0]?.message?.content ?? 'No pude generar una respuesta.'
      setMessages(prev => [...prev, { role: 'model', text: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'model', text: 'Error de conexión. Verifica tu red e intenta de nuevo.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const adjustHeight = () => {
    const el = textareaRef.current; if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col bg-[#0A0A0B]"
      style={{height:'calc(100vh - 0px)'}}
    >

      <motion.div variants={sectionVariants} className="shrink-0 px-8 pt-7 pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center overflow-hidden">
            <img src="/assets/logo.svg" alt={BOT_NAME} className="w-9 h-9 object-contain" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base">{BOT_NAME}</h1>
            <p className="text-neutral-500 text-xs">Asistente de fermentación de café · Nich-ká</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400/70 text-xs">En línea</span>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-4 min-h-0">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center py-16">
            <div className="w-16 h-16 flex items-center justify-center">
              <img src="/assets/logo.svg" alt={BOT_NAME} className="w-16 h-16 object-contain" />
            </div>
            <div>
              <p className="text-white font-semibold text-xl">¿En qué te puedo ayudar?</p>
              <p className="text-neutral-500 text-sm mt-1.5 max-w-sm">Pregúntame sobre pH, temperatura, perfiles de sabor o el proceso de fermentación de café.</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="px-3 py-2 rounded-lg text-xs text-neutral-400 border border-neutral-800 hover:border-green-500/40 hover:text-green-400 transition-all duration-200 bg-neutral-900/50 text-left">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'model' && (
              <div className="w-7 h-7 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                <img src="/assets/logo.svg" alt={BOT_NAME} className="w-7 h-7 object-contain" />
              </div>
            )}
            <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              m.role === 'user'
                ? 'bg-green-500/10 border border-green-500/20 text-white rounded-tr-sm'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 flex items-center justify-center shrink-0 overflow-hidden">
              <img src="/assets/logo.svg" alt={BOT_NAME} className="w-7 h-7 object-contain" />
            </div>
            <div className="bg-neutral-900 border border-neutral-800 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
              {[0,1,2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-green-400/60 animate-bounce" style={{animationDelay:`${i*0.15}s`}} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 px-8 pb-6 pt-3 border-t border-neutral-900">
        <div className="flex gap-3 items-end rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-3 focus-within:border-green-500/40 transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => { setInput(e.target.value); adjustHeight() }}
            onKeyDown={handleKey}
            placeholder="Escribe tu pregunta... (Enter para enviar)"
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-600 outline-none resize-none leading-relaxed"
            style={{minHeight:'24px', maxHeight:'160px'}}
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
            className="shrink-0 w-8 h-8 rounded-xl bg-green-500 hover:bg-green-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
        <p className="text-neutral-700 text-[10px] mt-2 text-center">Shift+Enter para salto de línea · Solo responde temas de fermentación de café</p>
      </div>

    </motion.div>
  )
}

export default ChatView
