import { Users } from 'lucide-react'
import { formatDate } from '../utils/format-date'
import type { Conversation } from '../../domain/models/Conversation'
import { getConvName } from '../utils/get-conv-name'
import { avatarUrl } from '../utils/avatar-url'
import { MessageStatusBadge } from './MessageStatusBadge'
import { MessageActionsDropdown } from './MessageActionsDropdown'

interface MessageRowProps {
  conversation: Conversation
  onSelect: (conv: Conversation) => void
}

export const MessageRow = ({ conversation, onSelect }: MessageRowProps) => {
  const name = getConvName(conversation)
  const lastMessage = conversation.lastMessage
  
  return (
    <tr 
      className="border-b border-neutral-900/60 hover:bg-white/[0.02] transition-colors group cursor-pointer"
      onClick={() => onSelect(conversation)}
    >
      <td className="px-6 py-5">
        <div className="flex items-center gap-3 min-w-0">
          {conversation.type === 'group' ? (
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#0d2212', border: '1px solid rgba(34,197,94,0.2)' }}>
              {conversation.avatar 
                ? <img src={conversation.avatar} alt="" className="w-full h-full rounded-full object-cover" /> 
                : <Users className="w-3.5 h-3.5 text-green-400" />
              }
            </div>
          ) : (
            <img src={avatarUrl(name)} alt={name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0" 
              style={{ border: '1px solid rgba(34,197,94,0.2)' }} 
            />
          )}
          <span className="text-sm text-white font-semibold truncate">{name}</span>
        </div>
      </td>
      
      <td className="px-8 py-5 max-w-[260px]">
        <span className="text-sm text-neutral-500 truncate block">
          {lastMessage ? (
             lastMessage.content ? lastMessage.content : '— adjunto —'
          ) : (
            'Nueva conversación'
          )}
        </span>
      </td>
      
      <td className="px-6 py-5">
        <MessageStatusBadge unreadCount={conversation.unreadCount} />
      </td>
      
      <td className="px-6 py-5">
        <div className="flex items-center gap-1.5 text-neutral-500 text-xs whitespace-nowrap">
          <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          {formatDate(lastMessage?.createdAt ?? conversation.createdAt)}
        </div>
      </td>
      
      <td className="px-8 py-5 text-right flex justify-end">
        <MessageActionsDropdown onViewDetail={() => onSelect(conversation)} />
      </td>
    </tr>
  )
}
