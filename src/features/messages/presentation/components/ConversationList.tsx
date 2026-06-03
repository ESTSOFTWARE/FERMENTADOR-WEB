import { Search, Plus, Users, MessageSquare } from 'lucide-react'
import { MY_ID } from '../constants/current-user.constants'
import { avatarUrl } from '../utils/avatar-url'
import { getConvName } from '../utils/get-conv-name'
import { formatDate } from '../utils/format-date'
import type { ConversationListProps } from '../types/conversation-list.types'

export const ConversationList = ({ conversations, activeId, searchQuery, onSearch, onOpen, onNew }: ConversationListProps) => (
  <div className="w-72 flex-shrink-0 flex flex-col border-r border-neutral-900" style={{ background: '#0d0d0e' }}>
    <div className="px-4 pt-5 pb-4 border-b border-neutral-900 flex items-center justify-between">
      <h1 className="text-white font-bold text-base">Mensajes</h1>
      <button onClick={onNew}
        className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
        <Plus className="w-4 h-4" />
      </button>
    </div>

    <div className="px-3 py-3 flex-shrink-0">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600 pointer-events-none" />
        <input value={searchQuery} onChange={e => onSearch(e.target.value)} placeholder="Buscar…"
          className="w-full pl-9 pr-3 py-2 text-xs text-neutral-300 placeholder-neutral-600 rounded-xl outline-none"
          style={{ background: '#18181b', border: '1px solid #2a2a2d' }} />
      </div>
    </div>

    <div data-lenis-prevent className="flex-1 overflow-y-auto px-2 pb-4 flex flex-col gap-0.5">
      {conversations.length === 0 && (
        <div className="flex flex-col items-center gap-2 pt-16 text-center px-4">
          <MessageSquare className="w-8 h-8 text-neutral-800" />
          <p className="text-xs text-neutral-600">Sin conversaciones.</p>
        </div>
      )}
      {conversations.map(conv => {
        const name  = getConvName(conv)
        const other = conv.members.find(m => m.id !== MY_ID)
        const isAct = conv.id === activeId
        return (
          <button key={conv.id} onClick={() => onOpen(conv.id)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-left"
            style={{ background: isAct ? '#1a1a1d' : 'transparent' }}>
            <div className="relative flex-shrink-0">
              {conv.type === 'group'
                ? <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                    style={{ background: '#0d2212', border: '1px solid rgba(34,197,94,0.2)' }}>
                    {conv.avatar ? <img src={conv.avatar} alt={name} className="w-full h-full object-cover" /> : <Users className="w-4 h-4 text-green-400" />}
                  </div>
                : <img src={avatarUrl(other?.name ?? name)} alt={name} className="w-10 h-10 rounded-full object-cover"
                    style={{ border: '1px solid rgba(34,197,94,0.2)' }} />
              }
              {conv.unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 text-[10px] font-bold text-black flex items-center justify-center">
                  {conv.unreadCount}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-sm font-medium text-white truncate">{name}</span>
                {conv.lastMessage && <span className="text-[10px] text-neutral-600 flex-shrink-0">{formatDate(conv.lastMessage.createdAt)}</span>}
              </div>
              <p className="text-xs text-neutral-500 truncate mt-0.5">
                {conv.lastMessage?.content || (conv.lastMessage?.attachments?.length ? '📎 Archivo' : 'Sin mensajes')}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  </div>
)
