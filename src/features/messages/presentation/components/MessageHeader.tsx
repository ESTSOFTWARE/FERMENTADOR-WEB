import { Users, X } from 'lucide-react'
import type { Conversation } from '../../domain/models/Conversation'
import { getConvName } from '../utils/get-conv-name'
import { avatarUrl } from '../utils/avatar-url'
import { MY_ID } from '../constants/current-user.constants'
import { ROLE_LABEL } from '../constants/role.constants'

interface MessageHeaderProps {
  conversation: Conversation
  typingUsers: string[]
  isOnline?: boolean
  onClose: () => void
  onInfo?: () => void
}

export const MessageHeader = ({ conversation, typingUsers, isOnline, onClose, onInfo }: MessageHeaderProps) => {
  const name = getConvName(conversation)
  const isTyping = typingUsers.length > 0
  const subtitle = isTyping
    ? `${typingUsers[0]} está escribiendo...`
    : conversation.type === 'group'
      ? `${conversation.members.length} miembros`
      : isOnline
        ? 'En línea'
        : ROLE_LABEL[conversation.members.find(m => m.id !== MY_ID)?.role ?? 'estudiante'] || ''

  return (
    <div className="flex-shrink-0 px-5 py-4 border-b border-neutral-800 flex items-center gap-3 bg-[#0f0f10]">
      <div className="relative flex-shrink-0">
        {conversation.type === 'group' ? (
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
            style={{ background: '#0d2212', border: '1px solid rgba(34,197,94,0.2)' }}>
            {conversation.avatar
              ? <img src={conversation.avatar} alt="" className="w-full h-full object-cover" />
              : <Users className="w-5 h-5 text-green-400" />
            }
          </div>
        ) : (
          <>
            <img src={avatarUrl(name)} alt={name}
              className="w-10 h-10 rounded-full object-cover"
              style={{ border: '1px solid rgba(34,197,94,0.2)' }}
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-[#0f0f10]" />
            )}
          </>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate">{name}</p>
        <p className="text-neutral-500 text-xs mt-0.5 truncate">{subtitle}</p>
      </div>
      
      <div className="flex items-center gap-1">
        {conversation.type === 'group' && onInfo && (
          <button 
            onClick={onInfo}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
            </svg>
          </button>
        )}
        <button 
          onClick={onClose}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
