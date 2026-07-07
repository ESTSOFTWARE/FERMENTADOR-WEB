import { AnimatePresence, motion } from 'motion/react'
import { CornerUpLeft, Smile, FileText, Send, X, Check, CheckCheck } from 'lucide-react'
import { MessageMenu } from './MessageMenu'
import { PRIORITY_CONFIG } from '../constants/priority.constants'
import { QUICK_EMOJIS } from '../constants/quick-emojis.constants'
import { ROLE_COLOR } from '../constants/role.constants'
import { MY_ID } from '../constants/current-user.constants'
import { avatarUrl } from '../utils/avatar-url'
import { formatTime } from '../utils/format-time'
import { formatSize } from '../utils/format-size'
import type { MessageBubbleProps } from '../types/message-bubble.types'

export const MessageBubble = (p: MessageBubbleProps) => {
  const { msg, isFirst, isLast, groupChat } = p
  const isMe     = msg.senderId === MY_ID
  const PrioConf = msg.priority && msg.priority !== 'normal'
    ? PRIORITY_CONFIG[msg.priority as keyof typeof PRIORITY_CONFIG] : null
  // Mensaje que es SOLO imagen/video (sin texto ni reply) → se muestra la media sola, sin burbuja.
  const isMediaOnly = !msg.content && !msg.replyTo && !PrioConf
    && (msg.attachments?.length ?? 0) > 0
    && (msg.attachments ?? []).every(a => a.type === 'image' || a.type === 'video')

  return (
    <div className={`flex gap-2 group ${isMe ? 'flex-row-reverse' : 'flex-row'} ${isFirst ? 'mt-3' : 'mt-0.5'}`}>
      {/* Avatar — top-aligned, only on first of a block */}
      {!isMe && (
        <div className="w-7 flex-shrink-0 flex items-start pt-0.5">
          {isFirst && (
            <img src={msg.senderAvatar || avatarUrl(msg.senderName)} alt={msg.senderName} title={msg.senderName}
              className="w-7 h-7 rounded-full object-cover" style={{ border: '1px solid rgba(34,197,94,0.15)' }} />
          )}
        </div>
      )}

      <div className={`flex flex-col max-w-[65%] relative ${isMe ? 'items-end' : 'items-start'}`}>
        {isFirst && !isMe && groupChat && (
          <span className="text-[10px] font-medium mb-1 px-1" style={{ color: ROLE_COLOR[msg.senderRole] }}>
            {msg.senderName}
          </span>
        )}

        {PrioConf && isFirst && (
          <div className="flex items-center gap-1 mb-1 px-2 py-0.5 rounded-full"
            style={{ background: PrioConf.bg, border: `1px solid ${PrioConf.color}30` }}>
            <PrioConf.Icon className="w-2.5 h-2.5" style={{ color: PrioConf.color }} />
            <span className="text-[10px] font-semibold" style={{ color: PrioConf.color }}>{PrioConf.label}</span>
          </div>
        )}

        {p.editing ? (
          <div className="flex gap-2 items-center">
            <input autoFocus value={p.editContent} onChange={e => p.onEditChange(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') p.onEditSubmit(); if (e.key === 'Escape') p.onEditCancel() }}
              className="px-3 py-2 text-sm rounded-xl outline-none text-white"
              style={{ background: '#2a2a2d', border: '1px solid #22c55e', minWidth: 200 }} />
            <button onClick={p.onEditSubmit} className="text-green-400"><Send className="w-4 h-4" /></button>
            <button onClick={p.onEditCancel} className="text-neutral-500"><X className="w-4 h-4" /></button>
          </div>
        ) : (
          <div className="relative">
            {/* Hover actions */}
            <div className={`absolute top-1/2 -translate-y-1/2 ${isMe ? 'right-full mr-2' : 'left-full ml-2'} hidden group-hover:flex items-center gap-1`}>
              <button onClick={p.onReply}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-neutral-600 hover:text-white hover:bg-neutral-800 transition-colors">
                <CornerUpLeft className="w-3.5 h-3.5" />
              </button>
              <button onClick={e => { e.stopPropagation(); p.onToggleReaction() }}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-neutral-600 hover:text-white hover:bg-neutral-800 transition-colors">
                <Smile className="w-3.5 h-3.5" />
              </button>
              <button onClick={e => { e.stopPropagation(); p.onToggleMenu() }}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-neutral-600 hover:text-white hover:bg-neutral-800 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
                </svg>
              </button>
            </div>

            {/* Quick reactions */}
            <AnimatePresence>
              {p.reactionOpen && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute z-30 flex gap-1 px-2 py-1.5 rounded-2xl shadow-xl"
                  style={{ background: '#1a1a1d', border: '1px solid #2a2a2d', [isMe ? 'right' : 'left']: 0, bottom: '100%', marginBottom: 4 }}
                  onClick={e => e.stopPropagation()}>
                  {QUICK_EMOJIS.map(emoji => (
                    <button key={emoji} onClick={() => p.onReactQuick(emoji)}
                      className="text-lg hover:scale-125 transition-transform leading-none">{emoji}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Context menu */}
            <AnimatePresence>
              {p.menuOpen && (
                <MessageMenu msg={msg} isMe={isMe} canEdit={p.canEdit} isCreator={p.isCreator}
                  onReply={p.onReply} onEdit={p.onEditStart} onDelete={p.onRequestDelete}
                  onPin={p.onRequestPin} onPriority={p.onRequestPriority} onClose={p.onCloseMenu} />
              )}
            </AnimatePresence>

            {/* Bubble */}
            <div style={{
              background:   isMediaOnly ? 'transparent' : (isMe ? '#22c55e' : '#18181b'),
              color:        isMe ? '#0a0a0b' : '#e4e4e7',
              borderRadius: isMediaOnly ? 0
                : isFirst && isLast ? (isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px')
                : isFirst ? (isMe ? '18px 18px 6px 18px' : '18px 18px 18px 6px')
                : isLast  ? (isMe ? '6px 18px 4px 6px'  : '6px 18px 18px 4px')
                : '6px 18px 6px 6px',
              border: PrioConf ? `1px solid ${PrioConf.color}40` : 'none',
            }} className={isMediaOnly ? 'text-sm leading-relaxed' : 'px-4 py-2.5 text-sm leading-relaxed'}>
              {/* Reply quote */}
              {msg.replyTo && (
                <div className="flex items-stretch rounded-md overflow-hidden mb-1.5 -mx-2 -mt-1"
                  style={{ background: isMe ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.05)' }}>
                  <div className="w-0.5 flex-shrink-0" style={{ background: isMe ? 'rgba(0,0,0,0.45)' : '#22c55e' }} />
                  <div className="min-w-0 py-1 px-2">
                    <p className="text-[11px] font-semibold truncate leading-tight" style={{ color: isMe ? 'rgba(0,0,0,0.7)' : '#22c55e' }}>
                      {msg.replyTo.senderName}
                    </p>
                    <p className="text-[11px] truncate leading-tight" style={{ color: isMe ? 'rgba(10,10,11,0.6)' : '#a1a1aa' }}>
                      {msg.replyTo.attachment ? '📎 Archivo' : msg.replyTo.content}
                    </p>
                  </div>
                </div>
              )}
              {msg.content && <p>{msg.content}</p>}
              {msg.attachments?.map(att => (
                <div key={att.id} className={isMediaOnly ? '' : 'mt-2'}>
                  {att.type === 'image' && (
                    <img src={att.url} alt={att.name} className="rounded-xl max-w-xs max-h-52 object-cover cursor-pointer"
                      onClick={() => window.open(att.url, '_blank')} />
                  )}
                  {att.type === 'video' && <video src={att.url} controls className="rounded-xl max-w-xs max-h-52" />}
                  {(att.type === 'document' || att.type === 'file') && (
                    <a href={att.url} download={att.name} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: isMe ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.05)' }}>
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate max-w-[160px]">{att.name}</p>
                        <p className="text-[10px] opacity-60">{formatSize(att.size)}</p>
                      </div>
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Reactions */}
            {msg.reactions && Object.keys(msg.reactions).length > 0 && (
              <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                {Object.entries(msg.reactions).map(([emoji, users]) => (
                  <button key={emoji} onClick={() => p.onReactQuick(emoji)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all"
                    style={{
                      background: users.includes(MY_ID) ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${users.includes(MY_ID) ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.1)'}`,
                    }}>
                    <span>{emoji}</span>
                    <span className="text-[10px] text-neutral-400">{users.length}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {isLast && (
          <div className="flex items-center gap-1 mt-1 px-1">
            <span className="text-[10px] text-neutral-700">{formatTime(msg.createdAt)}</span>
            {msg.edited && <span className="text-[10px] text-neutral-700">· editado</span>}
            {isMe && !msg.deleted && (
              msg.status === 'sent'
                ? <Check size={13} className="text-neutral-500" />
                : <CheckCheck size={13} style={{ color: msg.status === 'read' ? '#3399FF' : '#71717A' }} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
