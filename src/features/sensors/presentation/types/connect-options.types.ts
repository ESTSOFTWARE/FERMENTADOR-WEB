import type { DeviceState } from '../../domain/models/DeviceState'

export interface ConnectOptions {
  initialState?: Partial<DeviceState>
  onConnected?:  () => void
}
