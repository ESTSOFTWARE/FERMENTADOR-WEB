import { useState, useCallback, useEffect, useRef } from 'react'
import { FermentationRepositoryImpl }               from '../../data/repositories/FermentationRepositoryImpl'
import { GetActiveSessionUseCase }                  from '../../domain/usecases/get-active-session.usecase'
import { ScheduleFermentationUseCase }              from '../../domain/usecases/schedule-fermentation.usecase'
import { StartFermentationUseCase }                 from '../../domain/usecases/start-fermentation.usecase'
import { StopFermentationUseCase }                  from '../../domain/usecases/stop-fermentation.usecase'
import { GetFermentationReportUseCase }             from '../../domain/usecases/get-fermentation-report.usecase'
import { RequestPredictionUseCase }                 from '../../domain/usecases/request-prediction.usecase'
import { showBrowserNotification }                  from '../../../../shared/utils/show-browser-notification'
import { useUserAuth }                              from '../../../../core/hooks/userAuth'
import { useCommandsWebSocket }                     from '../../../sensors/presentation/hooks/useCommandsWebSocket'
import { createSensorWebSocket }                    from '../../../sensors/data/api/sensorApi'
import type { FermentationSession }                 from '../../domain/models/FermentationSession'
import type { FermentationReport }                  from '../../domain/models/FermentationReport'
import type { FermentationFormData }                from '../types/FermentationFormData'
import type { SensorKey }                           from '../../../sensors/domain/models/SensorKey'
import type { SensorToggleState }                   from '../../../sensors/domain/models/SensorToggleState'
import { ALL_SENSORS_OFF, ALL_SENSORS_ON }          from '../../../sensors/domain/constants/sensor-toggle-defaults.constants'
import { loadSensorStates, saveSensorStates, clearSensorStates } from '../utils/sensor-state-storage'
import { toDeviceState }                            from '../utils/to-device-state'

const repo              = new FermentationRepositoryImpl()
const getActiveSession  = new GetActiveSessionUseCase(repo)
const scheduleFerm      = new ScheduleFermentationUseCase(repo)
const startFerm         = new StartFermentationUseCase(repo)
const stopFerm          = new StopFermentationUseCase(repo)
const getReport         = new GetFermentationReportUseCase(repo)
const requestPredict    = new RequestPredictionUseCase(repo)

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
  const [prediction, setPrediction]         = useState<string | null>(null)
  const [predicting, setPredicting]         = useState(false)

  const hydratedRef = useRef(false)

  const isRunning = session?.status === 'running'
  const circuitId = user?.circuit_id ?? null

  const clearMessages = () => { setError(null); setSuccessMessage(null) }

  // El mensaje de éxito se oculta solo después de unos segundos.
  useEffect(() => {
    if (!successMessage) return
    const t = setTimeout(() => setSuccessMessage(null), 4000)
    return () => clearTimeout(t)
  }, [successMessage])

  useEffect(() => {
    if (!hydratedRef.current) return
    if (session && session.status === 'running') {
      saveSensorStates(session.id, sensorStates)
    }
  }, [sensorStates, session])

  // Sin fermentación activa (terminó, se detuvo o nunca arrancó) todos los
  // sensores quedan apagados. Cubre tanto el botón de detener como el auto-stop.
  useEffect(() => {
    if (!isRunning) setSensorStates(ALL_SENSORS_OFF)
  }, [isRunning])

  // Sin polling: escucha por WebSocket. Si el backend detiene la fermentación
  // (fin programado / auto-stop / stop manual), emite `fermentation_stopped` en
  // el canal de sensores del circuito → dejamos de mostrar "en vivo".
  useEffect(() => {
    if (!circuitId || !isRunning) return
    const ws = createSensorWebSocket(circuitId)
    ws.onmessage = (e: MessageEvent) => {
      try {
        const msg = JSON.parse(e.data)
        if (msg.type === 'fermentation_stopped') {
          setSession(prev => (prev?.status === 'running' ? null : prev))
        }
      } catch { /* mensaje no-JSON */ }
    }
    return () => ws.close()
  }, [circuitId, isRunning])

  useEffect(() => {
    if (!circuitId) return

    let cancelled = false

    const init = async () => {
      try {
        const active = await getActiveSession.execute()
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
    // Solo debe correr al cambiar el circuito (conecta/desconecta el WS una vez);
    // incluir `commands` reconectaría el WS en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circuitId])

  const startFermentation = useCallback(async (formData: FermentationFormData) => {
    if (!circuitId) { setError('No hay un circuito asociado a tu cuenta'); return }
    // Validación cruzada: fin posterior al inicio y azúcar inicial > 0.
    if (new Date(formData.scheduled_end) <= new Date(formData.scheduled_start)) {
      setError('La fecha de fin debe ser posterior a la de inicio'); return
    }
    if (!(formData.initial_sugar > 0)) {
      setError('El azúcar inicial debe ser mayor a 0'); return
    }
    setLoading(true); clearMessages()
    try {
      const scheduled = await scheduleFerm.execute({
        circuit_id:      circuitId,
        group_id:        formData.group_id,
        scheduled_start: formData.scheduled_start,
        scheduled_end:   formData.scheduled_end,
        initial_sugar:   formData.initial_sugar,
      })
      const started = await startFerm.execute(scheduled.id)
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
      const stopped = await stopFerm.execute(session.id, { interrupted })
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
    // No se puede encender/apagar ningún sensor si no hay fermentación activa.
    if (!session || session.status !== 'running') return
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

  // Predicción de eficiencia (ML). El mensaje se muestra en la vista y llega
  // también como notificación del navegador. El backend no la emite por WS:
  // cada plataforma lee su propia respuesta HTTP.
  const requestPrediction = useCallback(async () => {
    if (!session || predicting) return
    setPredicting(true); setError(null)
    try {
      const result = await requestPredict.execute(session.id)
      if (result.message) {
        setPrediction(result.message)
        showBrowserNotification('Predicción de eficiencia', result.message)
      } else {
        setError('Aún no hay lecturas suficientes para predecir. Intenta más tarde.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al solicitar la predicción')
    } finally {
      setPredicting(false)
    }
  }, [session, predicting])

  const clearPrediction = useCallback(() => setPrediction(null), [])

  const loadReport = useCallback(async () => {
    if (!session) return
    setLoading(true); clearMessages()
    try {
      const r = await getReport.execute(session.id)
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
    prediction, predicting,
    setShowForm,
    startFermentation, stopFermentation,
    toggleSensor, loadReport,
    requestPrediction, clearPrediction,
  }
}
