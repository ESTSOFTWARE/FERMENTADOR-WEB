import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Users, User, ChevronDown, Pin, LogOut } from 'lucide-react'
import { pageVariants } from '../../../../shared/animations/variants'
import { useMessagesViewModel } from '../viewmodels/useMessagesViewModel'
import { NewConversationModal } from '../components/NewConversationModal'
import { ConversationList } from '../components/ConversationList'
import { MessageBubble } from '../components/MessageBubble'
import { ChatComposer } from '../components/ChatComposer'
import { GroupDetailsPanel } from '../components/GroupDetailsPanel'
import { ROLE_LABEL } from '../constants/role.constants'
import { MY_ID } from '../constants/current-user.constants'
import { avatarUrl } from '../utils/avatar-url'
import { getConvName } from '../utils/get-conv-name'
import type { MessagePriority } from '../../domain/models/Chat.types'

interface PendingAction {
  type: 'delete' | 'pin' | 'priority'
  msgId: string
  payload?: MessagePriority
  label: string
  desc: string
}

const MessagesView = () => {
  const vm = useMessagesViewModel()

  const [showDetails,   setShowDetails]   = useState(false)
  const [menuMsgId,     setMenuMsgId]     = useState<string | null>(null)
  const [reactionMsgId, setReactionMsgId] = useState<string | null>(null)
  const [editingId,     setEditingId]     = useState<string | null>(null)
  const [editContent,   setEditContent]   = useState('')
  const [leaveConfirm,  setLeaveConfirm]  = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)

  const bottomRef   = useRef<HTMLDivElement>(null)
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [vm.activeMessages])

  useEffect(() => {
    if (!menuMsgId && !reactionMsgId) return
    const h = () => { setMenuMsgId(null); setReactionMsgId(null) }
    document.addEventListener('click', h)
    return () => document.removeEventListener('click', h)
  }, [menuMsgId, reactionMsgId])

  const activeConv  = vm.activeConversation
  const typingUsers = vm.typingUsers

  // Typing → avisa por WebSocket, con auto-stop tras 2.5s de inactividad
  const handleTyping = (value: string) => {
    if (typingTimer.current) clearTimeout(typingTimer.current)
    if (!value) { vm.notifyTyping(false); return }
    vm.notifyTyping(true)
    typingTimer.current = setTimeout(() => vm.notifyTyping(false), 2500)
  }

  const submitEdit = () => {
    if (editingId && editContent.trim()) vm.editMessage(editingId, editContent)
    setEditingId(null); setEditContent('')
  }

  const confirmAction = () => {
    if (!pendingAction) return
    if (pendingAction.type === 'delete')                              vm.deleteMessage(pendingAction.msgId)
    if (pendingAction.type === 'pin')                                 vm.pinMessage(pendingAction.msgId)
    if (pendingAction.type === 'priority' && pendingAction.payload)   vm.setPriority(pendingAction.msgId, pendingAction.payload)
    setPendingAction(null)
  }

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible"
      className="flex h-[calc(100vh_-_3.5rem)] overflow-hidden" style={{ background: '#0A0A0B' }}>

      <ConversationList
        conversations={vm.conversations}
        activeId={activeConv?.id ?? null}
        searchQuery={vm.searchQuery}
        onSearch={vm.setSearchQuery}
        onOpen={(id) => { vm.openConversation(id); setShowDetails(false) }}
        onNew={() => vm.setNewConvModal(true)}
      />

      {activeConv ? (
        <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">

          {/* Header */}
          <div className="px-6 py-3.5 border-b border-neutral-900 flex items-center gap-3 flex-shrink-0">
            <button onClick={() => setShowDetails(v => !v)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
              {activeConv.type === 'group'
                ? <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
                    style={{ background: '#0d2212', border: '1px solid rgba(34,197,94,0.2)' }}>
                    {activeConv.avatar ? <img src={activeConv.avatar} alt="" className="w-full h-full object-cover" /> : <Users className="w-4 h-4 text-green-400" />}
                  </div>
                : <img src={avatarUrl(getConvName(activeConv))} alt={getConvName(activeConv)}
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0" style={{ border: '1px solid rgba(34,197,94,0.2)' }} />
              }
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm truncate">{getConvName(activeConv)}</p>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-neutral-500">
                    {activeConv.type === 'group'
                      ? `${activeConv.members.length} miembros`
                      : ROLE_LABEL[activeConv.members.find(m => m.id !== MY_ID)?.role ?? 'estudiante']}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-neutral-600 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </button>
            {activeConv.type === 'group' && (
              <button onClick={() => setLeaveConfirm(true)} title="Abandonar"
                className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-600 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Pinned */}
          <AnimatePresence>
            {vm.pinnedMessage && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="flex items-center gap-3 px-6 py-2.5 border-b border-neutral-900 flex-shrink-0" style={{ background: 'rgba(34,197,94,0.04)' }}>
                <Pin className="w-3.5 h-3.5 text-green-500/60 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-green-500/60 font-medium">Fijado por {vm.pinnedMessage.senderName}</p>
                  <p className="text-xs text-neutral-400 truncate">{vm.pinnedMessage.content}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div data-lenis-prevent className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-1">
            {vm.activeMessages.map((msg, i) => {
              const prevSender = i > 0 ? vm.activeMessages[i - 1].senderId : null
              const nextSender = i < vm.activeMessages.length - 1 ? vm.activeMessages[i + 1].senderId : null
              return (
                <MessageBubble key={msg.id}
                  msg={msg}
                  isFirst={prevSender !== msg.senderId}
                  isLast={nextSender !== msg.senderId}
                  groupChat={activeConv.type === 'group'}
                  canEdit={vm.canEdit(msg)}
                  isCreator={vm.isCreator}
                  editing={editingId === msg.id}
                  editContent={editContent}
                  onEditChange={setEditContent}
                  onEditSubmit={submitEdit}
                  onEditCancel={() => setEditingId(null)}
                  menuOpen={menuMsgId === msg.id}
                  reactionOpen={reactionMsgId === msg.id}
                  onToggleMenu={() => setMenuMsgId(prev => prev === msg.id ? null : msg.id)}
                  onToggleReaction={() => setReactionMsgId(prev => prev === msg.id ? null : msg.id)}
                  onCloseMenu={() => setMenuMsgId(null)}
                  onReply={() => vm.setReplyTo({ id: msg.id, content: msg.content, senderName: msg.senderName, attachment: !!(msg.attachments?.length && !msg.content) })}
                  onReactQuick={(emoji) => { vm.addReaction(msg.id, emoji); setReactionMsgId(null) }}
                  onEditStart={() => { setEditingId(msg.id); setEditContent(msg.content); setMenuMsgId(null) }}
                  onRequestDelete={() => setPendingAction({ type: 'delete', msgId: msg.id, label: '¿Eliminar mensaje?', desc: 'Esta acción no se puede deshacer.' })}
                  onRequestPin={() => setPendingAction({ type: 'pin', msgId: msg.id, label: msg.pinned ? '¿Desfijar mensaje?' : '¿Fijar este mensaje?', desc: msg.pinned ? 'El mensaje dejará de estar destacado.' : 'Todos los miembros verán este mensaje.' })}
                  onRequestPriority={(p) => setPendingAction({ type: 'priority', msgId: msg.id, payload: p, label: `¿Marcar como ${p === 'important' ? 'Importante' : 'Urgente'}?`, desc: 'Se mostrará un indicador visible en el mensaje.' })}
                />
              )
            })}

            {/* Typing */}
            <AnimatePresence>
              {typingUsers.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className="flex items-end gap-2 mt-3">
                  <img src={avatarUrl(typingUsers[0])} alt={typingUsers[0]} className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                    style={{ border: '1px solid rgba(34,197,94,0.15)' }} />
                  <div className="flex items-center gap-1 px-4 py-3" style={{ background: '#18181b', borderRadius: '18px 18px 18px 4px' }}>
                    {[0, 0.2, 0.4].map((d, i) => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-500" animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: d }} />
                    ))}
                  </div>
                  <span className="text-[10px] text-neutral-700 mb-1">{typingUsers[0]} escribe…</span>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          <ChatComposer
            replyTo={vm.replyTo}
            onCancelReply={() => vm.setReplyTo(null)}
            onSend={(content) => { vm.sendMessage(content); vm.notifyTyping(false) }}
            onSendFiles={vm.sendFiles}
            onTyping={handleTyping}
          />

          {/* Details side panel */}
          <AnimatePresence>
            {showDetails && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={() => setShowDetails(false)} />
                <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="absolute right-0 top-0 h-full z-30 flex flex-col border-l border-neutral-900" style={{ width: 320, background: '#0d0d0e' }}>
                  <GroupDetailsPanel conv={activeConv} isCreator={vm.isCreator}
                    mediaFiles={vm.mediaFiles} docFiles={vm.docFiles}
                    onClose={() => setShowDetails(false)}
                    onLeave={() => { setLeaveConfirm(true); setShowDetails(false) }}
                    onUpdateInfo={vm.updateGroupInfo} />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Confirm dialog */}
          <AnimatePresence>
            {pendingAction && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                  className="rounded-2xl p-6 max-w-xs w-full mx-4 flex flex-col gap-4" style={{ background: '#111113', border: '1px solid #2a2a2d' }}>
                  <div>
                    <p className="text-white font-semibold">{pendingAction.label}</p>
                    <p className="text-sm text-neutral-500 mt-1">{pendingAction.desc}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setPendingAction(null)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:text-white transition-colors" style={{ background: '#1a1a1d' }}>
                      Cancelar
                    </button>
                    <button onClick={confirmAction}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                      style={{ background: pendingAction.type === 'delete' ? '#ef4444' : '#22c55e', color: pendingAction.type === 'delete' ? 'white' : '#0a0a0b' }}>
                      {pendingAction.type === 'delete' ? 'Eliminar' : 'Confirmar'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Leave confirm */}
          <AnimatePresence>
            {leaveConfirm && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                  className="rounded-2xl p-6 max-w-xs w-full mx-4 flex flex-col gap-4" style={{ background: '#111113', border: '1px solid #2a2a2d' }}>
                  <div>
                    <p className="text-white font-semibold">Abandonar chat</p>
                    <p className="text-sm text-neutral-500 mt-1">¿Seguro que quieres salir de <span className="text-white">{getConvName(activeConv)}</span>?</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setLeaveConfirm(false)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium text-neutral-400" style={{ background: '#1a1a1d' }}>Cancelar</button>
                    <button onClick={() => { vm.leaveConversation(activeConv.id); setLeaveConfirm(false) }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: '#ef4444' }}>Abandonar</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <User className="w-7 h-7 text-green-500/50" />
          </div>
          <div>
            <p className="text-white font-semibold text-base">Selecciona una conversación</p>
            <p className="text-neutral-500 text-sm mt-1">O crea una nueva con el botón <span className="text-green-500">+</span></p>
          </div>
        </div>
      )}

      <NewConversationModal open={vm.newConvModal} members={vm.availableMembers}
        onClose={() => vm.setNewConvModal(false)} onCreate={vm.createConversation} />
    </motion.div>
  )
}

export default MessagesView
