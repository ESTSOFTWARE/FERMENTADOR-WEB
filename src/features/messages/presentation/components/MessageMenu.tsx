import { motion } from 'motion/react'
import { CornerUpLeft, Pencil, Trash2, Pin } from 'lucide-react'
import { PRIORITY_CONFIG } from '../constants/priority.constants'
import type { MessagePriority } from '../../domain/models/Chat.types'
import type { MessageMenuProps } from '../types/message-menu.types'

export const MessageMenu = ({ msg, isMe, canEdit, isCreator, onReply, onEdit, onDelete, onPin, onPriority, onClose }: MessageMenuProps) => (
  <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
    className="absolute z-30 rounded-xl overflow-hidden shadow-2xl py-1 min-w-[180px]"
    style={{ background: '#1a1a1d', border: '1px solid #2a2a2d', [isMe ? 'right' : 'left']: 0, bottom: '100%', marginBottom: 4 }}
    onClick={e => e.stopPropagation()}>
    <button onClick={() => { onReply(); onClose() }}
      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">
      <CornerUpLeft className="w-3.5 h-3.5" /> Responder
    </button>
    {isMe && canEdit && <>
      <button onClick={() => { onEdit(); onClose() }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">
        <Pencil className="w-3.5 h-3.5" /> Editar
      </button>
      <button onClick={() => { onDelete(); onClose() }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors">
        <Trash2 className="w-3.5 h-3.5" /> Eliminar
      </button>
    </>}
    {isCreator && (
      <button onClick={() => { onPin(); onClose() }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">
        <Pin className="w-3.5 h-3.5" /> {msg.pinned ? 'Desfijar' : 'Fijar'}
      </button>
    )}
    <div style={{ height: 1, background: '#2a2a2d', margin: '4px 0' }} />
    {(['important', 'urgent'] as MessagePriority[]).map(p => {
      const cfg = PRIORITY_CONFIG[p as keyof typeof PRIORITY_CONFIG]
      const Icon = cfg.Icon
      const active = msg.priority === p
      return (
        <button key={p} onClick={() => { onPriority(p); onClose() }}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs hover:bg-neutral-800 transition-colors"
          style={{ color: active ? cfg.color : '#a1a1aa' }}>
          <Icon className="w-3.5 h-3.5" /> {active ? `Quitar ${cfg.label}` : `Marcar ${cfg.label}`}
        </button>
      )
    })}
  </motion.div>
)
