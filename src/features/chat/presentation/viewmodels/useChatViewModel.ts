import { useState, useRef, useEffect } from 'react'
import type { Message } from '../../domain/models/Message'
import { ChatRepositoryImpl } from '../../data/repositories/ChatRepositoryImpl'

const repository = new ChatRepositoryImpl()

export const useChatViewModel = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const bottomRef               = useRef<HTMLDivElement>(null)
  const textareaRef             = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const adjustHeight = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }

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
      const reply = await repository.sendMessage(messages, text)
      setMessages(prev => [...prev, { role: 'model', text: reply }])
    } catch (err) {
      const isRateLimit = err instanceof Error && err.message === 'rate_limit'
      const errText = isRateLimit
        ? 'Límite de solicitudes alcanzado. Espera un momento e intenta de nuevo.'
        : 'Error de conexión. Verifica tu red e intenta de nuevo.'
      setMessages(prev => [...prev, { role: 'model', text: errText }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return {
    messages,
    input,
    loading,
    bottomRef,
    textareaRef,
    setInput,
    adjustHeight,
    sendMessage,
    handleKey,
  }
}
