import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus } from 'lucide-react'
import { pageVariants } from '../../../../shared/animations/variants'
import { useMessagesViewModel } from '../viewmodels/useMessagesViewModel'
import { NewConversationModal } from '../components/NewConversationModal'
import { MessagesTable } from '../components/MessagesTable'
import { MessageDrawer } from '../components/MessageDrawer'
import { MessageContent } from '../components/MessageContent'
import { ChatComposer } from '../components/ChatComposer'
import { GroupDetailsPanel } from '../components/GroupDetailsPanel'
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

  const [drawerOpen,    setDrawerOpen]    = useState(false)
  const [showDetails,   setShowDetails]   = useState(false)
  const [menuMsgId,     setMenuMsgId]     = useState<string | null>(null)
  const [reactionMsgId, setReactionMsgId] = useState<string | null>(null)
  const [editingId,     setEditingId]     = useState<string | null>(null)
  const [editContent,   setEditContent]   = useState('')
  const [leaveConfirm,  setLeaveConfirm]  = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)

  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!menuMsgId && !reactionMsgId) return
    const h = () => { setMenuMsgId(null); setReactionMsgId(null) }
    document.addEventListener('click', h)
    return () => document.removeEventListener('click', h)
  }, [menuMsgId, reactionMsgId])

  const activeConv  = vm.activeConversation
  const typingUsers = vm.typingUsers

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

  const handleSelectConversation = (conv: { id: string }) => {
    vm.openConversation(conv.id)
    setDrawerOpen(true)
    setShowDetails(false)
  }

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible"
      className="flex flex-col h-[calc(100vh_-_3.5rem)] overflow-hidden" style={{ background: '#0A0A0B' }}>
      
      {/* Header & Controls */}
      <div className="flex-shrink-0 px-8 pt-6 pb-4 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-base">Mensajes</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 focus-within:border-green-500/40 transition-colors">
            <svg className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input 
              value={vm.searchQuery} 
              onChange={e => vm.setSearchQuery(e.target.value)} 
              placeholder="Buscar chat..."
              className="bg-transparent text-xs text-white placeholder:text-neutral-600 outline-none w-44" 
            />
          </div>
          
          <button 
            onClick={() => vm.setNewConvModal(true)}
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-green-500/10"
          >
            <Plus className="w-4 h-4" />
            Nuevo
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <MessagesTable 
          conversations={vm.conversations}
          loading={false} // There's no loading state in VM currently, we assume loaded
          hasSearchQuery={vm.searchQuery.length > 0}
          onSelect={handleSelectConversation}
        />
      </div>

      {/* Drawer */}
      <MessageDrawer
        open={drawerOpen}
        conversation={activeConv}
        typingUsers={typingUsers}
        onClose={() => setDrawerOpen(false)}
        onInfo={activeConv?.type === 'group' ? () => setShowDetails(true) : undefined}
      >
        <MessageContent
          messages={vm.activeMessages}
          typingUsers={typingUsers}
          groupChat={activeConv?.type === 'group'}
          isCreator={vm.isCreator}
          editingId={editingId}
          editContent={editContent}
          menuMsgId={menuMsgId}
          reactionMsgId={reactionMsgId}
          onEditChange={setEditContent}
          onEditSubmit={submitEdit}
          onEditCancel={() => setEditingId(null)}
          onToggleMenu={(id) => setMenuMsgId(prev => prev === id ? null : id)}
          onToggleReaction={(id) => setReactionMsgId(prev => prev === id ? null : id)}
          onCloseMenu={() => setMenuMsgId(null)}
          onReply={(msg) => vm.setReplyTo({ id: msg.id, content: msg.content, senderName: msg.senderName, attachment: !!(msg.attachments?.length && !msg.content) })}
          onReactQuick={(id, emoji) => { vm.addReaction(id, emoji); setReactionMsgId(null) }}
          onEditStart={(msg) => { setEditingId(msg.id); setEditContent(msg.content); setMenuMsgId(null) }}
          onRequestDelete={(msg) => setPendingAction({ type: 'delete', msgId: msg.id, label: '¿Eliminar mensaje?', desc: 'Esta acción no se puede deshacer.' })}
          onRequestPin={(msg) => setPendingAction({ type: 'pin', msgId: msg.id, label: msg.pinned ? '¿Desfijar mensaje?' : '¿Fijar este mensaje?', desc: msg.pinned ? 'El mensaje dejará de estar destacado.' : 'Todos los miembros verán este mensaje.' })}
          onRequestPriority={(msg, p) => setPendingAction({ type: 'priority', msgId: msg.id, payload: p, label: `¿Marcar como ${p === 'important' ? 'Importante' : 'Urgente'}?`, desc: 'Se mostrará un indicador visible en el mensaje.' })}
        />
        <ChatComposer
          replyTo={vm.replyTo}
          onCancelReply={() => vm.setReplyTo(null)}
          onSend={(content) => { vm.sendMessage(content); vm.notifyTyping(false) }}
          onSendFiles={vm.sendFiles}
          onTyping={handleTyping}
        />
      </MessageDrawer>

      {/* Group Details Modal */}
      <AnimatePresence>
        {showDetails && activeConv && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-40" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} 
              onClick={() => setShowDetails(false)} 
            />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 h-full z-50 flex flex-col border-l border-neutral-900 shadow-2xl" 
              style={{ width: 320, background: '#0d0d0e' }}>
              <GroupDetailsPanel conv={activeConv} isCreator={vm.isCreator}
                mediaFiles={vm.mediaFiles} docFiles={vm.docFiles}
                onClose={() => setShowDetails(false)}
                onLeave={() => { setLeaveConfirm(true); setShowDetails(false) }}
                onUpdateInfo={vm.updateGroupInfo} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modals & Dialogs */}
      <NewConversationModal open={vm.newConvModal} members={vm.availableMembers}
        onClose={() => vm.setNewConvModal(false)} onCreate={vm.createConversation} />

      {/* Confirm Action Dialog */}
      <AnimatePresence>
        {pendingAction && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
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

      {/* Leave Group Confirm Dialog */}
      <AnimatePresence>
        {leaveConfirm && activeConv && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="rounded-2xl p-6 max-w-xs w-full mx-4 flex flex-col gap-4" style={{ background: '#111113', border: '1px solid #2a2a2d' }}>
              <div>
                <p className="text-white font-semibold">Abandonar chat</p>
                <p className="text-sm text-neutral-500 mt-1">¿Seguro que quieres salir de <span className="text-white">{getConvName(activeConv)}</span>?</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setLeaveConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-neutral-400" style={{ background: '#1a1a1d' }}>Cancelar</button>
                <button onClick={() => { vm.leaveConversation(activeConv.id); setLeaveConfirm(false); setDrawerOpen(false); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: '#ef4444' }}>Abandonar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default MessagesView
