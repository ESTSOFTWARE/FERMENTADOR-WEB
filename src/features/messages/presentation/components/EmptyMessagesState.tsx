import { Users } from 'lucide-react'

interface EmptyMessagesStateProps {
  hasQuery: boolean
}

export const EmptyMessagesState = ({ hasQuery }: EmptyMessagesStateProps) => {
  return (
    <tr>
      <td colSpan={5}>
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <Users className="w-6 h-6 text-green-500/50" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">
              {hasQuery ? 'Sin resultados' : 'Aún no tienes mensajes'}
            </p>
            <p className="text-neutral-500 text-xs mt-1">
              {hasQuery ? 'Intenta buscar con otro término' : 'Crea una nueva conversación para empezar'}
            </p>
          </div>
        </div>
      </td>
    </tr>
  )
}
