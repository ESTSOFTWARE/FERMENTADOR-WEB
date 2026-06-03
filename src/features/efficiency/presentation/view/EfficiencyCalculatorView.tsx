import { motion }                    from 'motion/react'
import { EFFICIENCY_STYLES }         from '../constants/styles'
import { INPUT_STYLE }               from '../constants/input-style.constants'
import { EFFICIENCY_RANGES }         from '../constants/efficiency-ranges.constants'
import { useEfficiencyViewModel }    from '../viewmodels/useEfficiencyViewModel'
import { pageVariants, sectionVariants, cardVariants, gridVariants } from '../../../../shared/animations/variants'

const EfficiencyCalculatorView = () => {
  const {
    azucarInicial,
    setAzucarInicial,
    etanolDetectado,
    setEtanolDetectado,
    azucar,
    etanol,
    etanolTeorico,
    eficienciaPct,
    color,
    label,
    hasResult,
  } = useEfficiencyViewModel()

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      style={{ minHeight: 'calc(100vh - 3.5rem)', backgroundColor: '#0A0A0B', padding: '48px', display: 'flex', flexDirection: 'column' }}
    >
      <style>{EFFICIENCY_STYLES}</style>

      <motion.div variants={sectionVariants} style={{ marginBottom: 40 }}>
        <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
          Herramienta
        </p>
        <h1 style={{ color: '#F4F4F5', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
          Calculadora de Eficiencia
        </h1>
        <div style={{ marginTop: 12, height: 1, width: 96, backgroundColor: '#22C55E', opacity: 0.4 }} />
      </motion.div>

      <motion.div variants={gridVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, flex: 1 }}>

        <motion.div variants={cardVariants} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            className="efficiency-card"
            style={{ padding: 28, borderRadius: 16, backgroundColor: '#111113', border: '1px solid #1F1F22', flex: 1 }}
          >
            <p style={{ color: '#52525B', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 32px 0' }}>
              Parámetros de entrada
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div>
                <label style={{ display: 'block', color: '#71717A', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Azúcar Inicial
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    className="efficiency-input"
                    placeholder="Ej: 120"
                    value={azucarInicial}
                    min={0}
                    step={0.1}
                    onChange={e => setAzucarInicial(e.target.value)}
                    style={INPUT_STYLE}
                  />
                  <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#52525B', fontSize: 12 }}>
                    g/L
                  </span>
                </div>
                <p style={{ color: '#3F3F46', fontSize: 10, margin: '8px 0 0 2px' }}>
                  Concentración de sustrato antes de fermentar
                </p>
              </div>

              <div>
                <label style={{ display: 'block', color: '#71717A', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Etanol Detectado
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    className="efficiency-input"
                    placeholder="Ej: 55"
                    value={etanolDetectado}
                    min={0}
                    step={0.1}
                    onChange={e => setEtanolDetectado(e.target.value)}
                    style={INPUT_STYLE}
                  />
                  <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#52525B', fontSize: 12 }}>
                    g/L
                  </span>
                </div>
                <p style={{ color: '#3F3F46', fontSize: 10, margin: '8px 0 0 2px' }}>
                  Etanol medido al final del proceso
                </p>
              </div>
            </div>

            {hasResult && (
              <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #1F1F22' }}>
                <p style={{ color: '#52525B', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 16px 0' }}>
                  Referencia teórica
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Azúcar inicial',      value: `${azucar} g/L` },
                    { label: 'Etanol teórico máx.', value: `${etanolTeorico.toFixed(2)} g/L` },
                    { label: 'Etanol detectado',    value: `${etanol} g/L` },
                    { label: 'Rendimiento',         value: `${eficienciaPct}%` },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#52525B', fontSize: 12 }}>{item.label}</span>
                      <span style={{ color: '#A1A1AA', fontSize: 12, fontWeight: 500 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          className="efficiency-card"
          style={{
            padding:         28,
            borderRadius:    16,
            backgroundColor: '#111113',
            border:          `1px solid ${hasResult ? `${color}30` : '#1F1F22'}`,
            display:         'flex',
            flexDirection:   'column',
            justifyContent:  'space-between',
          }}
        >
          <p style={{ color: '#52525B', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', margin: 0 }}>
            Resultado
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 10, padding: '40px 0' }}>
            <p style={{ color: '#3F3F46', fontSize: 13, margin: 0 }}>Eficiencia actual</p>
            <p style={{
              color:         hasResult ? color : '#2A2A2D',
              fontSize:      96,
              fontWeight:    800,
              margin:        0,
              letterSpacing: '-0.04em',
              lineHeight:    1,
              transition:    'color 0.4s',
            }}>
              {eficienciaPct}
              <span style={{ fontSize: 40, fontWeight: 600 }}>%</span>
            </p>
            <p style={{ color: label.color, fontSize: 13, margin: 0, fontWeight: 500, transition: 'color 0.4s' }}>
              {label.text}
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#3F3F46', fontSize: 10 }}>0%</span>
              <span style={{ color: '#3F3F46', fontSize: 10 }}>100%</span>
            </div>
            <div style={{ height: 12, borderRadius: 999, backgroundColor: '#1A1A1D', overflow: 'hidden' }}>
              <div
                className="efficiency-bar-fill"
                style={{
                  height:          '100%',
                  width:           `${eficienciaPct}%`,
                  borderRadius:    999,
                  backgroundColor: color,
                  boxShadow:       hasResult ? `0 0 12px ${color}60` : 'none',
                  transition:      'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.4s, box-shadow 0.4s',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              {EFFICIENCY_RANGES.map(r => (
                <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: r.color }} />
                  <span style={{ color: '#3F3F46', fontSize: 10 }}>{r.label} {r.range}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ color: '#2A2A2D', fontSize: 10, margin: '20px 0 0 0', textAlign: 'center', lineHeight: 1.6 }}>
            Fórmula: (Etanol detectado / Etanol teórico) × 100<br />Etanol teórico = Azúcar × 0.511
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default EfficiencyCalculatorView
