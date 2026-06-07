import { useRef, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { ChatMessage } from '../../domain/models/ChatMessage'
import { MessageBubble } from './MessageBubble'
import { MY_ID } from '../constants/current-user.constants'
import type { MessagePriority } from '../../domain/models/Chat.types'

interface MessageContentProps {
  messages: ChatMessage[]
  typingUsers: string[]
  groupChat: boolean
  isCreator: boolean
  editingId: string | null
  editContent: string
  menuMsgId: string | null
  reactionMsgId: string | null
  
  onEditChange: (val: string) => void
  onEditSubmit: () => void
  onEditCancel: () => void
  
  onToggleMenu: (id: string) => void
  onToggleReaction: (id: string) => void
  onCloseMenu: () => void
  
  onReply: (msg: ChatMessage) => void
  onReactQuick: (id: string, emoji: string) => void
  onEditStart: (msg: ChatMessage) => void
  onRequestDelete: (msg: ChatMessage) => void
  onRequestPin: (msg: ChatMessage) => void
  onRequestPriority: (msg: ChatMessage, p: MessagePriority) => void
}

export const MessageContent = ({
  messages, typingUsers, groupChat, isCreator,
  editingId, editContent, menuMsgId, reactionMsgId,
  onEditChange, onEditSubmit, onEditCancel,
  onToggleMenu, onToggleReaction, onCloseMenu,
  onReply, onReactQuick, onEditStart, onRequestDelete,
  onRequestPin, onRequestPriority
}: MessageContentProps) => {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => { 
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) 
  }, [messages, typingUsers])

  const canEdit = (msg: ChatMessage) =>
    msg.senderId === MY_ID && now - new Date(msg.createdAt).getTime() < 20 * 60 * 1000

  return (
    <div data-lenis-prevent className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-1 bg-[#0f0f10]">
      {messages.length === 0 ? (
        <p className="text-neutral-500 text-sm text-center py-8">No hay mensajes en esta conversación.</p>
      ) : (
        messages.map((msg, i) => {
          const prevSender = i > 0 ? messages[i - 1].senderId : null
          const nextSender = i < messages.length - 1 ? messages[i + 1].senderId : null
          return (
            <MessageBubble 
              key={msg.id}
              msg={msg}
              isFirst={prevSender !== msg.senderId}
              isLast={nextSender !== msg.senderId}
              groupChat={groupChat}
              canEdit={canEdit(msg)}
              isCreator={isCreator}
              editing={editingId === msg.id}
              editContent={editContent}
              onEditChange={onEditChange}
              onEditSubmit={onEditSubmit}
              onEditCancel={onEditCancel}
              menuOpen={menuMsgId === msg.id}
              reactionOpen={reactionMsgId === msg.id}
              onToggleMenu={() => onToggleMenu(msg.id)}
              onToggleReaction={() => onToggleReaction(msg.id)}
              onCloseMenu={onCloseMenu}
              onReply={() => onReply(msg)}
              onReactQuick={(emoji) => onReactQuick(msg.id, emoji)}
              onEditStart={() => onEditStart(msg)}
              onRequestDelete={() => onRequestDelete(msg)}
              onRequestPin={() => onRequestPin(msg)}
              onRequestPriority={(p) => onRequestPriority(msg, p)}
            />
          )
        })
      )}

      {/* Typing indicator */}
      <AnimatePresence>
        {typingUsers.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            className="flex items-end gap-2 mt-3 mb-2">
            <div className="flex items-center gap-1 px-4 py-3" style={{ background: '#18181b', borderRadius: '18px 18px 18px 4px' }}>
              {[0, 0.2, 0.4].map((d, i) => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-500" animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: d }} />
              ))}
            </div>
            <span className="text-[10px] text-neutral-600 mb-1">{typingUsers[0]} escribe…</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  )
}
