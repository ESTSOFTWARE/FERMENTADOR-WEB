import type { DeviceState }    from '../../domain/models/DeviceState'
import { DEFAULT_STATE }       from '../../domain/constants/default-device-state.constants'
import { SENSOR_KEY_TO_COMMAND } from '../../domain/constants/sensor-key-to-command.constants'

export type { DeviceState }
export { DEFAULT_STATE, SENSOR_KEY_TO_COMMAND }

const WS_URL = (import.meta.env.VITE_WS_URL ?? import.meta.env.VITE_API_URL?.replace(/^http/, 'ws'))

export const createCommandsWebSocket = (circuitId: number): WebSocket =>
  new WebSocket(`${WS_URL}/ws/circuit/${circuitId}/commands`)
