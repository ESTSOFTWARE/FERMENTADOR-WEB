export type SocketConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error'
  | 'disconnected'

export interface SocketClient {
  connect: () => void
  disconnect: () => void
  send: (data: unknown) => void
  onMessage: (cb: (raw: string) => void) => () => void
  onStatusChange: (cb: (status: SocketConnectionStatus) => void) => () => void
  getStatus: () => SocketConnectionStatus
}