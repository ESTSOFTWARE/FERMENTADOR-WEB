import type { WSSensorDataMessage }       from './WSSensorDataMessage'
import type { WSSensorDeactivatedMessage } from './WSSensorDeactivatedMessage'

export type WSMessage = WSSensorDataMessage | WSSensorDeactivatedMessage
