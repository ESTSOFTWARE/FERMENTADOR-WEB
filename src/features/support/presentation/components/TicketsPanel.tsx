import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn }                     from '../../../../lib/utils'
import PaginationBar              from '../../../../shared/components/PaginationBar'
import { PAGE_SIZE }              from '../constants/pagination.constants'
import { timeAgo }                from '../utils/time-ago'
import { useSupportAgentViewModel } from '../../../support-chat/presentation/viewmodels/useSupportAgentViewModel'
import { deriveStatus, type SupportConversation, type SupportMessage } from '../../../support-chat/domain/models/SupportChat'

const TicketsPanel = () => {
  const {
    conversations, loading,
    selected, selectConversation, closeSelected,
    messages, loadingMessages, adminTyping,
    sending, sendReply, sendAttachment, notifyTyping,
  } = useSupportAgentViewModel()

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'answered'>('all')
  const [reply, setReply]   = useState('')
  const [page, setPage]     = useState(1)
  const fileRef             = useRef<HTMLInputElement | null>(null)

  const pending  = conversations.filter(c => deriveStatus(c) === 'pending').length
  const answered = conversations.filter(c => deriveStatus(c) === 'answered').length

  const filtered = useMemo(() => conversations.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = c.adminName.toLowerCase().includes(q) ||
      c.adminEmail.toLowerCase().includes(q) ||
      (c.lastMessage?.content ?? '').toLowerCase().includes(q)
    const matchFilter = filter === 'all' || deriveStatus(c) === filter
    return matchSearch && matchFilter
  }), [conversations, search, filter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleReply = () => {
    if (!reply.trim()) return
    sendReply(reply)
    setReply('')
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) sendAttachment(f)
    e.target.value = ''
  }

  const renderAttachment = (a: SupportMessage['attachments'][number]) =>
    a.type === 'image'
      ? <a key={a.id} href={a.url} target="_blank" rel="noreferrer"><img src={a.url} alt={a.name} className="max-w-[180px] rounded-lg mt-1" /></a>
      : <a key={a.id} href={a.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 mt-1 text-xs underline text-blue-300">📎 {a.name}</a>

  return (
    <div className="relative h-full flex flex-col overflow-hidden">

      <div className="flex-shrink-0 px-8 pt-6 pb-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-base">Chats de soporte</h2>
          <div className="flex items-center gap-4 mt-1.5">
            <button onClick={() => setFilter('all')}
              className={cn('text-xs transition-colors', filter === 'all' ? 'text-white font-medium' : 'text-neutral-600 hover:text-neutral-400')}>
              Todos ({conversations.length})
            </button>
            <button onClick={() => setFilter('pending')}
              className={cn('flex items-center gap-1.5 text-xs transition-colors', filter === 'pending' ? 'text-amber-400 font-medium' : 'text-neutral-600 hover:text-neutral-400')}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Pendientes ({pending})
            </button>
            <button onClick={() => setFilter('answered')}
              className={cn('flex items-center gap-1.5 text-xs transition-colors', filter === 'answered' ? 'text-green-400 font-medium' : 'text-neutral-600 hover:text-neutral-400')}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Respondidos ({answered})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 focus-within:border-green-500/40 transition-colors">
          <svg className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Buscar chat..."
            className="bg-transparent text-xs text-white placeholder:text-neutral-600 outline-none w-44" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="border border-neutral-800/60 rounded-2xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0d0d0e] border-b border-neutral-800/60">
              {[
                { label: 'Admin',    accent: false },
                { label: 'Correo',   accent: false },
                { label: 'Mensaje',  accent: false },
                { label: 'Estado',   accent: true  },
                { label: 'Recibido', accent: true  },
                { label: '',         accent: false },
              ].map(h => (
                <th key={h.label} className={cn('px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider', h.accent ? 'text-green-500' : 'text-neutral-600')}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6}><div className="py-16 text-center text-neutral-600 text-sm">Cargando...</div></td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <svg className="w-10 h-10 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                    <p className="text-neutral-600 text-sm">{conversations.length === 0 ? 'Sin chats aún' : 'Sin resultados'}</p>
                  </div>
                </td>
              </tr>
            ) : paged.map((conv: SupportConversation) => {
              const status = deriveStatus(conv)
              return (
              <tr key={conv.id} className="border-b border-neutral-900/60 hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 text-xs font-bold text-neutral-300">
                      {conv.adminName[0] ?? '?'}
                    </div>
                    <span className="text-sm text-white font-semibold truncate">{conv.adminName}</span>
                    {conv.unreadCount > 0 && (
                      <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-500 text-black">{conv.unreadCount}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm text-neutral-500 truncate block">{conv.adminEmail}</span>
                </td>
                <td className="px-8 py-5 max-w-[260px]">
                  <span className="text-sm text-neutral-500 truncate block">{conv.lastMessage?.content ?? '— adjunto —'}</span>
                </td>
                <td className="px-6 py-5">
                  <span className={cn('inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full border whitespace-nowrap',
                    status === 'pending'
                      ? 'text-amber-400 bg-amber-400/10 border-amber-400/30'
                      : 'text-green-400 bg-green-400/10 border-green-400/30')}>
                    {status === 'pending'
                      ? <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                      : <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                    }
                    {status === 'pending' ? 'Pendiente' : 'Respondido'}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1.5 text-neutral-500 text-xs whitespace-nowrap">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    {timeAgo(conv.lastMessage?.createdAt ?? conv.createdAt)}
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button onClick={() => selectConversation(conv)}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d={status === 'pending' ? 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' : 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z'}/>
                    </svg>
                    {status === 'pending' ? 'Responder' : 'Ver'}
                  </button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
        </div>
      </div>

      <PaginationBar
        page={page} totalPages={totalPages} total={filtered.length} pageSize={PAGE_SIZE}
        onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)}
        actions={
          <button onClick={() => { setSearch(''); setFilter('all'); setPage(1) }}
            className="group flex items-center gap-1.5 px-2 py-2 rounded-full bg-neutral-700 hover:bg-neutral-600 text-white transition-all duration-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>
            <span className="max-w-0 group-hover:max-w-[56px] overflow-hidden whitespace-nowrap text-[11px] font-semibold transition-all duration-200">Limpiar</span>
          </button>
        }
      />

      <AnimatePresence>
        {selected && (
          <>
            <motion.div className="absolute inset-0 bg-black/40 z-10"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeSelected} />

            <motion.div
              className="absolute right-0 top-0 bottom-0 w-[480px] z-20 bg-[#0f0f10] border-l border-neutral-800 flex flex-col shadow-2xl"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}>

              <div className="flex-shrink-0 px-5 py-4 border-b border-neutral-800 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{selected.adminName}</p>
                  <p className="text-neutral-500 text-xs mt-0.5">{adminTyping ? 'escribiendo...' : selected.adminEmail}</p>
                </div>
                <button onClick={closeSelected}
                  className="p-1.5 rounded-lg text-neutral-600 hover:text-white hover:bg-neutral-800 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                {loadingMessages ? (
                  <p className="text-neutral-600 text-sm text-center py-8">Cargando mensajes...</p>
                ) : messages.length === 0 ? (
                  <p className="text-neutral-600 text-sm text-center py-8">Sin mensajes aún</p>
                ) : messages.map((msg) => {
                  const mine = msg.senderRole === 'soporte'  // soporte (yo) a la derecha
                  return (
                    <div key={msg.id} className={cn('flex gap-2', mine ? 'justify-end' : 'justify-start')}>
                      <div className={cn('max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                        mine
                          ? 'bg-blue-500/10 border border-blue-500/20 text-blue-100 rounded-tr-sm'
                          : 'bg-neutral-800 text-neutral-200 rounded-tl-sm')}>
                        {!mine && <p className="text-[10px] text-neutral-500 mb-1 font-medium">{msg.senderName}</p>}
                        {msg.content && <span>{msg.content}</span>}
                        {msg.attachments.map(renderAttachment)}
                      </div>
                    </div>
                  )
                })}
                {adminTyping && (
                  <div className="flex gap-2 justify-start">
                    <div className="bg-neutral-800 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                      {[0, 150, 300].map(delay => (
                        <span key={delay} className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 px-5 pb-5 pt-3 border-t border-neutral-800">
                <div className="flex gap-2 items-end rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2.5 focus-within:border-blue-500/40 transition-all">
                  <input ref={fileRef} type="file" className="hidden"
                    accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.zip" onChange={handleFile} />
                  <button onClick={() => fileRef.current?.click()} disabled={sending}
                    className="flex-shrink-0 w-8 h-8 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 flex items-center justify-center transition-colors disabled:opacity-40">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
                    </svg>
                  </button>
                  <textarea value={reply} onChange={e => { setReply(e.target.value); notifyTyping() }}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply() } }}
                    placeholder="Escribe tu respuesta..." rows={1}
                    className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder:text-neutral-600 outline-none resize-none leading-relaxed"
                    style={{ minHeight: '22px', maxHeight: '100px' }} />
                  <button onClick={handleReply} disabled={!reply.trim() || sending}
                    className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TicketsPanel
