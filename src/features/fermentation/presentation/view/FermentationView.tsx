import { motion } from 'motion/react'
import { useFermentation } from '../hooks/useFermentation'
import { useUserAuth } from '../../../../core/hooks/userAuth'
import type { SensorKey } from '../../../sensors/domain/models/SensorKey'
import MainControlSection from '../components/MainControlSection'
import SensorControlSection from '../components/SensorControlSection'
import { pageVariants, sectionVariants } from '../../../../shared/animations/variants'

const FermentationView = () => {
  const {
    loading,
    error,
    successMessage,
    session,
    sensorStates,
    showForm,
    isRunning,
    circuitId,
    prediction,
    predicting,
    authLoading,
    setShowForm,
    startFermentation,
    stopFermentation,
    toggleSensor,
    requestPrediction,
    clearPrediction,
  } = useFermentation()

  const { user } = useUserAuth()

  const handleMainToggle = () => {
    if (isRunning) {
      stopFermentation(true)
    } else {
      setShowForm(true)
    }
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      style={{
        minHeight: 'calc(100vh - 3.5rem)',
        backgroundColor: '#0A0A0B',
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Header ── */}
      <motion.div
        variants={sectionVariants}
        style={{
          marginBottom: 40,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        <div>
          <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 12 }}>
            Control
          </p>
          <h1 style={{ color: '#F4F4F5', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
            Iniciar Fermentación
          </h1>
          <div style={{ marginTop: 12, height: 1, width: 96, backgroundColor: '#22C55E', opacity: 0.4 }} />
        </div>

        {/* ── Botón: solicitar predicción ML (solo con fermentación activa) ── */}
        {isRunning && (
          <button
            onClick={requestPrediction}
            disabled={predicting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 10,
              backgroundColor: '#22C55E15',
              border: '1px solid #22C55E40',
              color: '#22C55E',
              fontSize: 13,
              fontWeight: 600,
              cursor: predicting ? 'wait' : 'pointer',
              opacity: predicting ? 0.6 : 1,
              transition: 'opacity 0.2s',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            {predicting ? 'Analizando lecturas…' : 'Solicitar predicción de eficiencia'}
          </button>
        )}
      </motion.div>

      {/* ── Alerts ── */}
      {error && (
        <div
          style={{
            marginBottom: 24,
            padding: '12px 16px',
            borderRadius: 10,
            backgroundColor: '#F43F5E10',
            border: '1px solid #F43F5E30',
            color: '#F43F5E',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {/* ── Predicción de eficiencia (ML) ── */}
      {prediction && (
        <div
          style={{
            marginBottom: 24,
            padding: '14px 16px',
            borderRadius: 10,
            backgroundColor: '#22C55E10',
            border: '1px solid #22C55E30',
            color: '#E4E4E7',
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#22C55E', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Predicción de eficiencia
            </span>
            <button
              onClick={clearPrediction}
              style={{ background: 'none', border: 'none', color: '#71717A', cursor: 'pointer', padding: 4, lineHeight: 0 }}
              aria-label="Cerrar predicción"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          {prediction}
        </div>
      )}

      {successMessage && (
        <div
          style={{
            marginBottom: 24,
            padding: '12px 16px',
            borderRadius: 10,
            backgroundColor: '#22C55E10',
            border: '1px solid #22C55E30',
            color: '#22C55E',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {successMessage}
        </div>
      )}

      <motion.div variants={sectionVariants}>
        <MainControlSection
          isRunning={isRunning}
          loading={loading}
          showForm={showForm}
          session={session}
          circuitId={circuitId}
          circuitCode={user?.activation_code ?? null}
          authLoading={authLoading}
          onMainToggle={handleMainToggle}
          onSubmit={startFermentation}
          onCancelForm={() => setShowForm(false)}
        />
      </motion.div>

      <motion.div variants={sectionVariants}>
        <SensorControlSection
          sensorStates={sensorStates}
          loading={loading}
          disabled={!isRunning}
          onToggle={(key: SensorKey) => toggleSensor(key)}
        />
      </motion.div>
    </motion.div>
  )
}

export default FermentationView