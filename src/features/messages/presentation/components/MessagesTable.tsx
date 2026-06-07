import { cn } from '../../../../lib/utils'
import type { Conversation } from '../../domain/models/Conversation'
import { MessageRow } from './MessageRow'
import { LoadingMessagesState } from './LoadingMessagesState'
import { EmptyMessagesState } from './EmptyMessagesState'

interface MessagesTableProps {
  conversations: Conversation[]
  loading: boolean
  hasSearchQuery: boolean
  onSelect: (conv: Conversation) => void
}

export const MessagesTable = ({ conversations, loading, hasSearchQuery, onSelect }: MessagesTableProps) => {
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
            conversations.map(conv => (
              <MessageRow 
                key={conv.id} 
                conversation={conv} 
                onSelect={onSelect} 
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
