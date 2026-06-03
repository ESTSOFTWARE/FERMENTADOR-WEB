import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Smile, Paperclip, Send, CornerUpLeft, X } from 'lucide-react'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import type { ChatComposerProps } from '../types/chat-composer.types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EmojiData = any

export const ChatComposer = ({ replyTo, onCancelReply, onSend, onSendFiles, onTyping }: ChatComposerProps) => {
  const [input,     setInput]     = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const emojiRef = useRef<HTMLDivElement>(null)
  const fileRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!showEmoji) return
    const h = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) setShowEmoji(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [showEmoji])

  const handleChange = (value: string) => { setInput(value); onTyping(value) }

  const handleSend = () => {
    if (!input.trim()) return
    onSend(input)
    setInput('')
    setShowEmoji(false)
    onTyping('')
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSendFiles(Array.from(e.target.files ?? []))
    e.target.value = ''
  }

  return (
    <>
      {/* Emoji picker */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div ref={emojiRef}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-20 left-6 z-20">
            <Picker data={data} onEmojiSelect={(e: EmojiData) => setInput(prev => prev + (e.native as string))}
              theme="dark" locale="es" previewPosition="none" skinTonePosition="none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reply preview */}
      <AnimatePresence>
        {replyTo && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="flex items-center gap-3 px-6 py-2.5 border-t border-neutral-900 flex-shrink-0"
            style={{ background: 'rgba(34,197,94,0.04)' }}>
            <CornerUpLeft className="w-3.5 h-3.5 text-green-500/60 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-green-500 font-medium">{replyTo.senderName}</p>
              <p className="text-xs text-neutral-400 truncate">{replyTo.attachment ? '📎 Archivo' : replyTo.content}</p>
            </div>
            <button onClick={onCancelReply} className="text-neutral-600 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="px-6 py-4 border-t border-neutral-900 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowEmoji(v => !v)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors flex-shrink-0">
            <Smile className="w-4 h-4" />
          </button>
          <button onClick={() => fileRef.current?.click()}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors flex-shrink-0">
            <Paperclip className="w-4 h-4" />
          </button>
          <input ref={fileRef} type="file" multiple className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip" onChange={handleFiles} />
          <input value={input} onChange={e => handleChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Escribe un mensaje…"
            className="flex-1 px-4 py-3 text-sm text-white placeholder-neutral-600 rounded-xl outline-none"
            style={{ background: '#18181b', border: '1px solid #2a2a2d' }} />
          <button onClick={handleSend} disabled={!input.trim()}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 flex-shrink-0"
            style={{ background: '#22c55e' }}>
            <Send className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
    </>
  )
}
