import { cn } from '../../../../lib/utils'
import type { Conversation } from '../../domain/models/Conversation'
import { MessageRow } from './MessageRow'
import { LoadingMessagesState } from './LoadingMessagesState'
import { EmptyMessagesState } from './EmptyMessagesState'
import { MY_ID } from '../constants/current-user.constants'

interface MessagesTableProps {
  conversations: Conversation[]
  loading: boolean
  hasSearchQuery: boolean
  onlineUserIds: Set<string>
  onSelect: (conv: Conversation) => void
}

export const MessagesTable = ({ conversations, loading, hasSearchQuery, onlineUserIds, onSelect }: MessagesTableProps) => {
  return (
    <div className="border border-neutral-800/60 rounded-2xl overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#0d0d0e] border-b border-neutral-800/60">
            {[
              { label: 'Remitente', accent: false },
              { label: 'Asunto',    accent: false },
              { label: 'Estado',    accent: true  },
              { label: 'Fecha',     accent: true  },
              { label: '',          accent: false },
            ].map(h => (
              <th 
                key={h.label} 
                className={cn('px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider', 
                  h.accent ? 'text-green-500' : 'text-neutral-600'
                )}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <LoadingMessagesState />
          ) : conversations.length === 0 ? (
            <EmptyMessagesState hasQuery={hasSearchQuery} />
          ) : (
            conversations.map(conv => {
              const otherId = conv.members.find(m => m.id !== MY_ID)?.id
              const isOnline = conv.type === 'personal' && !!otherId && onlineUserIds.has(otherId)
              return (
                <MessageRow
                  key={conv.id}
                  conversation={conv}
                  isOnline={isOnline}
                  onSelect={onSelect}
                />
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
