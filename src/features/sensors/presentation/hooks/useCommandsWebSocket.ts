import { useRef, useCallback }          from 'react'
import { createCommandsWebSocket }      from '../../data/api/commandsWebSocket'
import { DEFAULT_STATE }                from '../../domain/constants/default-device-state.constants'
import { SENSOR_KEY_TO_COMMAND }        from '../../domain/constants/sensor-key-to-command.constants'
import type { DeviceState }             from '../../domain/models/DeviceState'
import type { ConnectOptions }          from '../types/connect-options.types'

export const useCommandsWebSocket = () => {
  const wsRef      = useRef<WebSocket | null>(null)
  const stateRef   = useRef<DeviceState>({ ...DEFAULT_STATE })
  const pendingRef = useRef<Partial<DeviceState> | null>(null)

  const syncState = useCallback((changes: Partial<DeviceState>) => {
    stateRef.current = { ...stateRef.current, ...changes }
  }, [])

  const connect = useCallback((circuitId: number, options?: ConnectOptions | (() => void)) => {
    const opts: ConnectOptions =
      typeof options === 'function' ? { onConnected: options } : (options ?? {})

    if (wsRef.current) wsRef.current.close()
    stateRef.current   = { ...DEFAULT_STATE, ...(opts.initialState ?? {}) }
    pendingRef.current = null

    const ws = createCommandsWebSocket(circuitId)
    wsRef.current = ws

    ws.onopen = () => {
      if (pendingRef.current) {
        stateRef.current = { ...stateRef.current, ...pendingRef.current }
        ws.send(JSON.stringify(stateRef.current))
        pendingRef.current = null
      }
      opts.onConnected?.()
    }

    ws.onerror = () => {}
    ws.onclose = () => {}
  }, [])

  const disconnect = useCallback(() => {
    wsRef.current?.close()
    wsRef.current      = null
    stateRef.current   = { ...DEFAULT_STATE }
    pendingRef.current = null
  }, [])

  const sendCommand = useCallback((changes: Partial<DeviceState>) => {
    stateRef.current = { ...stateRef.current, ...changes }

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      pendingRef.current = { ...(pendingRef.current ?? {}), ...changes }
      return
    }

    wsRef.current.send(JSON.stringify(stateRef.current))
  }, [])

  const toggleDevice = useCallback((key: string, active: boolean) => {
    const cmdKey = SENSOR_KEY_TO_COMMAND[key]
    if (!cmdKey) return
    sendCommand({ [cmdKey]: active ? 'encendido' : 'apagado' } as Partial<DeviceState>)
  }, [sendCommand])

  const sendAllOn = useCallback(() => {
    sendCommand({
      motor: 'encendido', bomba: 'encendido',
      sensor_temperatura: 'encendido', sensor_ph: 'encendido',
      sensor_alcohol: 'encendido', sensor_conductividad: 'encendido',
      sensor_turbidez: 'encendido',
    })
  }, [sendCommand])

  const sendAllOff = useCallback(() => {
    sendCommand({ ...DEFAULT_STATE })
  }, [sendCommand])

  return { connect, disconnect, toggleDevice, sendAllOn, sendAllOff, syncState }
}
