import { useState, useCallback, useEffect, useRef } from 'react'
import { FermentationRepositoryImpl }               from '../../data/repositories/FermentationRepositoryImpl'
import { useUserAuth }                              from '../../../../core/hooks/userAuth'
import { useCommandsWebSocket }                     from '../../../sensors/presentation/hooks/useCommandsWebSocket'
import type { FermentationSession }                 from '../../domain/models/FermentationSession'
import type { FermentationReport }                  from '../../domain/models/FermentationReport'
import type { FermentationFormData }                from '../types/FermentationFormData'
import type { SensorKey }                           from '../../../sensors/domain/models/SensorKey'
import type { SensorToggleState }                   from '../../../sensors/domain/models/SensorToggleState'
import { ALL_SENSORS_OFF, ALL_SENSORS_ON }          from '../../../sensors/domain/constants/sensor-toggle-defaults.constants'
import { loadSensorStates, saveSensorStates, clearSensorStates } from '../utils/sensor-state-storage'
import { toDeviceState }                            from '../utils/to-device-state'

const repository = new FermentationRepositoryImpl()

export const useFermentationViewModel = () => {
  const { user } = useUserAuth()
  const commands = useCommandsWebSocket()

  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [session, setSession]               = useState<FermentationSession | null>(null)
  const [report, setReport]                 = useState<FermentationReport | null>(null)
  const [sensorStates, setSensorStates]     = useState<SensorToggleState>(ALL_SENSORS_OFF)
  const [showForm, setShowForm]             = useState(false)

  const hydratedRef = useRef(false)

  const isRunning = session?.status === 'running'
  const circuitId = user?.circuit_id ?? null

  const clearMessages = () => { setError(null); setSuccessMessage(null) }

  useEffect(() => {
    if (!hydratedRef.current) return
    if (session && session.status === 'running') {
      saveSensorStates(session.id, sensorStates)
    }
  }, [sensorStates, session])

  useEffect(() => {
    if (!circuitId) return

    let cancelled = false

    const init = async () => {
      try {
        const active = await repository.getActiveSession()
        if (cancelled) return

        if (active) {
          const stored         = loadSensorStates(active.id)
          const restoredStates = stored ?? ALL_SENSORS_ON

          setSession(active)
          setSensorStates(restoredStates)
          hydratedRef.current = true

          commands.connect(circuitId, {
            initialState: toDeviceState(restoredStates),
          })
        } else {
          hydratedRef.current = true
        }
      } catch {
        hydratedRef.current = true
      }
    }

    init()

    return () => {
      cancelled = true
      commands.disconnect()
    }
  }, [circuitId])

  const startFermentation = useCallback(async (formData: FermentationFormData) => {
    if (!circuitId) { setError('No hay un circuito asociado a tu cuenta'); return }
    setLoading(true); clearMessages()
    try {
      const scheduled = await repository.scheduleFermentation({
        circuit_id:      circuitId,
        scheduled_start: formData.scheduled_start,
        scheduled_end:   formData.scheduled_end,
        initial_sugar:   formData.initial_sugar,
      })
      const started = await repository.startFermentation(scheduled.id)
      setSession(started)
      setSensorStates(ALL_SENSORS_ON)
      hydratedRef.current = true
      saveSensorStates(started.id, ALL_SENSORS_ON)
      commands.connect(circuitId, {
        initialState: toDeviceState(ALL_SENSORS_ON),
        onConnected:  () => commands.sendAllOn(),
      })
      setSuccessMessage('Fermentación iniciada correctamente')
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar la fermentación')
    } finally {
      setLoading(false)
    }
  }, [circuitId, commands])

  const stopFermentation = useCallback(async (interrupted = true) => {
    if (!session) return
    setLoading(true); clearMessages()
    try {
      commands.sendAllOff()
      setTimeout(() => commands.disconnect(), 500)
      const stopped = await repository.stopFermentation(session.id, { interrupted })
      setSession(stopped)
      setSensorStates(ALL_SENSORS_OFF)
      clearSensorStates(session.id)
      setSuccessMessage('Fermentación detenida')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al detener la fermentación')
    } finally {
      setLoading(false)
    }
  }, [session, commands])

  const toggleSensor = useCallback(async (key: SensorKey) => {
    const nextValue = !sensorStates[key]
    setSensorStates((prev: SensorToggleState) => {
      const next = { ...prev, [key]: nextValue }
      if (session && session.status === 'running') {
        saveSensorStates(session.id, next)
      }
      return next
    })
    commands.toggleDevice(key, nextValue)
  }, [sensorStates, commands, session])

  const loadReport = useCallback(async () => {
    if (!session) return
    setLoading(true); clearMessages()
    try {
      const r = await repository.getReport(session.id)
      setReport(r)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el reporte')
    } finally {
      setLoading(false)
    }
  }, [session])

  return {
    loading, error, successMessage,
    session, report, sensorStates,
    showForm, isRunning, circuitId,
    setShowForm,
    startFermentation, stopFermentation,
    toggleSensor, loadReport,
  }
}
