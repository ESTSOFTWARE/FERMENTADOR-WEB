import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '../../../../lib/utils'
import { useSupportAdminViewModel } from '../viewmodels/useSupportAdminViewModel'
import type { SupportMessage } from '../../domain/models/SupportChat'

interface Props {
  open:    boolean
  onClose: () => void
}

const renderAttachment = (a: SupportMessage['attachments'][number]) =>
  a.type === 'image'
    ? <a key={a.id} href={a.url} target="_blank" rel="noreferrer"><img src={a.url} alt={a.name} className="max-w-[180px] rounded-lg mt-1" /></a>
    : <a key={a.id} href={a.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 mt-1 text-xs underline">📎 {a.name}</a>

// El cuerpo (con hook + WS) solo se monta cuando el drawer está abierto.
const SupportChatBody = ({ onClose }: { onClose: () => void }) => {
  const { messages, loading, sending, supportTyping, send, sendAttachment, notifyTyping } = useSupportAdminViewModel()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const inputRef  = useRef<HTMLInputElement | null>(null)
  const fileRef   = useRef<HTMLInputElement | null>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, supportTyping])

  const handleSend = () => {
    if (!input.trim()) return
    send(input)
    setInput('')
  }
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) sendAttachment(f)
    e.target.value = ''
  }

  return (
    <motion.div
      className="fixed right-0 top-0 z-50 h-full w-full max-w-sm flex flex-col bg-neutral-950 border-l border-neutral-800 shadow-2xl"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 35 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-800">
        <div className="relative flex-shrink-0">
          <img src="/assets/logo.svg" alt="Nich-Ká" className="w-8 h-8 object-contain" />
          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border-2 border-neutral-950" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-none">Equipo Nich-Ká</p>
          <p className="text-xs text-green-400 mt-0.5">{supportTyping ? 'escribiendo...' : 'En línea'}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3">
        {loading ? (
          <p className="text-neutral-600 text-sm text-center py-8">Cargando...</p>
        ) : messages.length === 0 ? (
          <p className="text-neutral-500 text-sm text-center py-8">Escríbenos y el equipo de soporte te responderá.</p>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const mine = msg.senderRole === 'admin'  // el admin (yo) a la derecha
              return (
                <motion.div
                  key={msg.id}
                  className={cn('flex items-end gap-2', mine ? 'justify-end' : 'justify-start')}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {!mine && <img src="/assets/logo.svg" alt="" className="w-5 h-5 object-contain flex-shrink-0 mb-0.5" />}
                  <div className={cn(
                    'max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                    mine
                      ? 'bg-green-600 text-white rounded-br-sm'
                      : 'bg-neutral-800 text-neutral-200 rounded-bl-sm'
                  )}>
                    {msg.content && <span>{msg.content}</span>}
                    {msg.attachments.map(renderAttachment)}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}

        {/* Indicador "escribiendo" de soporte */}
        <AnimatePresence>
          {supportTyping && (
            <motion.div
              key="typing"
              className="flex items-end gap-2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <img src="/assets/logo.svg" alt="" className="w-5 h-5 object-contain flex-shrink-0 mb-0.5" />
              <div className="bg-neutral-800 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                {[0, 150, 300].map(delay => (
                  <span
                    key={delay}
                    className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-5 pt-3 border-t border-neutral-800 flex items-center gap-2">
        <input ref={fileRef} type="file" className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.zip" onChange={handleFile} />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={sending}
          className="flex-shrink-0 w-9 h-9 rounded-xl text-neutral-500 hover:text-white hover:bg-neutral-800 flex items-center justify-center transition-colors disabled:opacity-40"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => { setInput(e.target.value); notifyTyping() }}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Escribe tu mensaje..."
          className={cn(
            'flex-1 min-w-0 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600',
            'bg-neutral-900 border border-neutral-800 outline-none',
            'focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all duration-200'
          )}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="flex-shrink-0 w-9 h-9 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </motion.div>
  )
}

const SupportChatModal = ({ open, onClose }: Props) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        />
        <SupportChatBody onClose={onClose} />
      </>
    )}
  </AnimatePresence>
)

export default SupportChatModal
