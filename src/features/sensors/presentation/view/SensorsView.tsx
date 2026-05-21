import { motion }              from 'motion/react'
import { useSensorsViewModel } from '../viewmodels/useSensorsViewModel'
import { useFermentation }     from '../../../fermentation/presentation/context/FermentationContext'
import { useUserAuth }            from '../../../../core/hooks/userAuth'
import { SENSOR_META }         from '../../domain/models/Sensor'
import SensorCard              from '../components/SensorCard'
import { pageVariants, sectionVariants, cardVariants, gridVariants } from '../../../../shared/animations/variants'

// ── Status dot ───────────────────────────────────────────────────────────────
const statusConfig = {
  connected:    { label: 'En vivo',      color: '#22C55E', pulse: true  },
  connecting:   { label: 'Conectando…',  color: '#F59E0B', pulse: true  },
  disconnected: { label: 'Desconectado', color: '#3F3F46', pulse: false },
  error:        { label: 'Error',        color: '#F43F5E', pulse: false },
}

const SensorsView = () => {
  const { user }    = useUserAuth()
  const { session } = useFermentation()

  const {
    wsStatus,
    chartData,
    latestValues,
    loading,
    error,
  } = useSensorsViewModel({
    autoCircuitId: user?.circuit_id ?? undefined,
    autoSessionId: session?.id,
  })

  const status = statusConfig[wsStatus]

  // Separar sensores en dos grupos para layout asimétrico
  const primarySensors   = SENSOR_META.slice(0, 2)  // temperatura, ph — más importantes
  const secondarySensors = SENSOR_META.slice(2)      // resto

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      style={{
        minHeight:       '100vh',
        backgroundColor: '#0A0A0B',
        padding:         '48px',
        display:         'flex',
        flexDirection:   'column',
        gap:             32,
      }}
    >
      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sensor-card-wrap {
          animation: fade-in 0.4s ease both;
        }
        .sensor-card-wrap:nth-child(1) { animation-delay: 0.05s; }
        .sensor-card-wrap:nth-child(2) { animation-delay: 0.10s; }
        .sensor-card-wrap:nth-child(3) { animation-delay: 0.15s; }
        .sensor-card-wrap:nth-child(4) { animation-delay: 0.20s; }
        .sensor-card-wrap:nth-child(5) { animation-delay: 0.25s; }
        .sensor-card-wrap:nth-child(6) { animation-delay: 0.30s; }
      `}</style>

      {/* ── Header ── */}
      <motion.div variants={sectionVariants}>
        <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
          Monitoreo
        </p>
        <h1 style={{ color: '#F4F4F5', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
          Sensores en Tiempo Real
        </h1>
        <div style={{ marginTop: 12, height: 1, width: 96, backgroundColor: '#22C55E', opacity: 0.4 }} />
      </motion.div>

      {/* ── Info bar — circuito activo ── */}
      <motion.div variants={sectionVariants} style={{
        display:         'flex',
        alignItems:      'center',
        gap:             24,
        padding:         '14px 20px',
        borderRadius:    10,
        backgroundColor: '#0D0D0F',
        border:          '1px solid #1A1A1D',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3F3F46" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <path d="M8 21h8M12 17v4"/>
          </svg>
          <span style={{ color: '#52525B', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Circuito
          </span>
          <span style={{ color: '#A1A1AA', fontSize: 12, fontFamily: 'monospace', fontWeight: 600 }}>
            #{user?.circuit_id ?? '—'}
          </span>
        </div>

        <div style={{ width: 1, height: 16, backgroundColor: '#1F1F22' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3F3F46" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
          </svg>
          <span style={{ color: '#52525B', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Sensores activos
          </span>
          <span style={{ color: '#22C55E', fontSize: 12, fontFamily: 'monospace', fontWeight: 600 }}>
            {Object.values(latestValues).filter(v => v !== undefined).length} / {SENSOR_META.length}
          </span>
        </div>

        {session && (
          <>
            <div style={{ width: 1, height: 16, backgroundColor: '#1F1F22' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22C55E' }} />
              <span style={{ color: '#52525B', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Fermentación activa
              </span>
            </div>
          </>
        )}

        {/* Status pill — lado derecho */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: '6px 14px', borderRadius: 999, backgroundColor: '#111113', border: `1px solid ${status.color}30` }}>
          <div style={{ position: 'relative', width: 7, height: 7 }}>
            {status.pulse && (
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: status.color, animation: 'pulse-ring 1.4s ease-out infinite' }} />
            )}
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: status.color }} />
          </div>
          <span style={{ color: status.color, fontSize: 11, fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>
            {status.label}
          </span>
          {session && wsStatus === 'connected' && (
            <>
              <div style={{ width: 1, height: 12, backgroundColor: '#2A2A2D' }} />
              <span style={{ color: '#52525B', fontSize: 10, fontFamily: 'monospace' }}>
                sesión #{session.id}
              </span>
            </>
          )}
        </div>
      </motion.div>

      {/* ── Error ── */}
      {error && (
        <div style={{ padding: '12px 16px', borderRadius: 10, backgroundColor: '#F43F5E10', border: '1px solid #F43F5E30', color: '#F43F5E', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {/* ── Sensores primarios — full width cards ── */}
      <motion.div variants={gridVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {primarySensors.map((sensor, i) => (
          <motion.div key={sensor.key} variants={cardVariants} className="sensor-card-wrap" style={{ animationDelay: `${i * 0.05}s` }}>
            <SensorCard
              label={sensor.label}
              unit={sensor.unit}
              color={sensor.color}
              description={sensor.description}
              data={chartData[sensor.key]}
              latestValue={latestValues[sensor.key]}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* ── Separador con label ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, height: 1, backgroundColor: '#1A1A1D' }} />
        <span style={{ color: '#2A2A2D', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Sensores adicionales
        </span>
        <div style={{ flex: 1, height: 1, backgroundColor: '#1A1A1D' }} />
      </div>

      {/* ── Sensores secundarios — grid 3 columnas ── */}
      <motion.div variants={gridVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {secondarySensors.map((sensor, i) => (
          <motion.div key={sensor.key} variants={cardVariants} className="sensor-card-wrap" style={{ animationDelay: `${(i + 2) * 0.05}s` }}>
            <SensorCard
              label={sensor.label}
              unit={sensor.unit}
              color={sensor.color}
              description={sensor.description}
              data={chartData[sensor.key]}
              latestValue={latestValues[sensor.key]}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* ── Estado vacío — sin datos aún ── */}
      {!loading && wsStatus === 'connecting' && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#3F3F46', fontSize: 13 }}>
          <div style={{ marginBottom: 8 }}>Estableciendo conexión con el circuito #{user?.circuit_id}…</div>
          <div style={{ fontSize: 11, color: '#2A2A2D' }}>Los datos aparecerán automáticamente</div>
        </div>
      )}
    </motion.div>
  )
}

export default SensorsView