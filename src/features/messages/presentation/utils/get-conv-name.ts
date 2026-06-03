import { MY_ID } from '../constants/current-user.constants'
import type { Conversation } from '../../domain/models/Conversation'

export const getConvName = (conv: Conversation, myId: string = MY_ID): string =>
  conv.type === 'group'
    ? (conv.name ?? 'Grupo')
    : conv.members.find(m => m.id !== myId)?.name ?? 'Desconocido'
