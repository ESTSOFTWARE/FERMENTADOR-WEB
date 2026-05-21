import { motion } from 'motion/react'
import { useFermentation } from '../context/FermentationContext'
import type { SensorKey } from '../../../sensors/domain/models/Sensor'
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
    setShowForm,
    startFermentation,
    stopFermentation,
    toggleSensor,
  } = useFermentation()

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
        minHeight:       '100vh',
        backgroundColor: '#0A0A0B',
        padding:         '48px',
        display:         'flex',
        flexDirection:   'column',
      }}
    >
      {/* ── Header ── */}
      <motion.div variants={sectionVariants} style={{ marginBottom: 40 }}>
        <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 12 }}>
          Control
        </p>
        <h1 style={{ color: '#F4F4F5', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
          Iniciar Fermentación
        </h1>
        <div style={{ marginTop: 12, height: 1, width: 96, backgroundColor: '#22C55E', opacity: 0.4 }} />
      </motion.div>

      {/* ── Alerts ── */}
      {error && (
        <div
          style={{
            marginBottom:    24,
            padding:         '12px 16px',
            borderRadius:    10,
            backgroundColor: '#F43F5E10',
            border:          '1px solid #F43F5E30',
            color:           '#F43F5E',
            fontSize:        13,
            display:         'flex',
            alignItems:      'center',
            gap:             8,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {successMessage && (
        <div
          style={{
            marginBottom:    24,
            padding:         '12px 16px',
            borderRadius:    10,
            backgroundColor: '#22C55E10',
            border:          '1px solid #22C55E30',
            color:           '#22C55E',
            fontSize:        13,
            display:         'flex',
            alignItems:      'center',
            gap:             8,
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
        onMainToggle={handleMainToggle}
        onSubmit={startFermentation}
        onCancelForm={() => setShowForm(false)}
      />
      </motion.div>

      <motion.div variants={sectionVariants}>
      <SensorControlSection
        sensorStates={sensorStates}
        loading={loading}
        onToggle={(key: SensorKey) => toggleSensor(key)}
      />
      </motion.div>
    </motion.div>
  )
}

export default FermentationView