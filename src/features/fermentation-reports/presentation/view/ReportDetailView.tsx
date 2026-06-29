import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useFermentationReportsViewModel } from '../viewmodels/useFermentationReportsViewModel'
import { useUserAuth } from '../../../../core/hooks/userAuth'
import { useEntitlements } from '../../../../core/hooks/useEntitlements'
import StatusPill from '../components/StatusPill'
import { REPORTS_STYLES } from '../constants/styles'
import { pageVariants, sectionVariants } from '../../../../shared/animations/variants'

const ReportDetailView = () => {
  const { id }     = useParams<{ id: string }>()
  const navigate   = useNavigate()
  const { reports, loading } = useFermentationReportsViewModel()
  const { user }   = useUserAuth()
  const { hasFeature } = useEntitlements()
  const canReports = hasFeature('reports')

  const [downloading, setDownloading] = useState(false)

  const report = reports.find(r => String(r.id) === id)
  const lote   = `F-${String(id ?? '').padStart(3, '0')}`

  // Valores para las gráficas
  const eff     = Math.max(0, Math.min(100, report?.efficiency ?? 0))
  const sugarV  = report?.sugar  ?? 0
  const ethV    = report?.etanol ?? 0
  const maxBar  = Math.max(sugarV, ethV, 1)
  const R       = 54
  const CIRC    = 2 * Math.PI * R

  const downloadPdf = async () => {
    setDownloading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/fermentation/${id}/report/pdf`, {
        credentials: 'include',
      })
      if (!res.ok) return
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `fermentacion-${lote}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch { /* sin conexión */ } finally {
      setDownloading(false)
    }
  }

  const rows = report
    ? [
        { label: 'Circuito',        value: user?.activation_code ?? `#${report.circuit}` },
        { label: 'Inicio',          value: report.start },
        { label: 'Fin',             value: report.end },
        { label: 'Duración',        value: report.duration },
        { label: 'pH registrado',   value: report.ph    > 0 ? `${report.ph}`         : '—' },
        { label: 'Temperatura',     value: report.temp  > 0 ? `${report.temp} °C`    : '—' },
        { label: 'Azúcar inicial',  value: report.sugar > 0 ? `${report.sugar} g/L`  : '—' },
        { label: 'Etanol obtenido', value: report.etanol > 0 ? `${report.etanol} g/L` : '—' },
        { label: 'Eficiencia',      value: report.efficiency != null ? `${report.efficiency}%` : '—' },
      ]
    : []

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      style={{
        minHeight:       'calc(100vh - 3.5rem)',
        backgroundColor: '#0A0A0B',
        padding:         '48px',
        display:         'flex',
        flexDirection:   'column',
      }}
    >
      <style>{REPORTS_STYLES}</style>

      {/* ── Header ── */}
      <motion.div variants={sectionVariants} style={{ marginBottom: 40 }}>
        <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
          Detalle del reporte
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ color: '#F4F4F5', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
              Reporte de fermentación · {lote}
            </h1>
            <div style={{ marginTop: 12, height: 1, width: 96, backgroundColor: '#22C55E', opacity: 0.4 }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => navigate('/fermentation-reports')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8,
                border: '1px solid #2A2A2D', backgroundColor: 'transparent', color: '#71717A',
                fontSize: 12, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Volver
            </button>

            {canReports ? (
              <button
                onClick={downloadPdf}
                disabled={!report || downloading}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8,
                  border: 'none', backgroundColor: '#22C55E', color: '#06210F',
                  fontSize: 12, fontWeight: 700,
                  cursor: (report && !downloading) ? 'pointer' : 'not-allowed',
                  opacity: (report && !downloading) ? 1 : 0.6, fontFamily: 'Poppins, sans-serif',
                }}
              >
                {downloading ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Descargando…
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    Descargar PDF
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => navigate('/planes')}
                title="Disponible en planes de pago"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8,
                  border: '1px solid #3F3F46', backgroundColor: '#1A1A1D', color: '#A1A1AA',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Mejora tu plan para descargar PDF
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {loading && <p style={{ color: '#71717A', fontSize: 14 }}>Cargando reporte…</p>}

      {!loading && !report && (
        <p style={{ color: '#71717A', fontSize: 14 }}>No se encontró el reporte.</p>
      )}

      {report && (
        <motion.div variants={sectionVariants} style={{ flex: 1 }}>
          <div style={{ marginBottom: 28 }}>
            <StatusPill status={report.status} />
          </div>

          {/* ── Gráficas ── */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 36 }}>
            <div style={{ padding: 20, borderRadius: 14, border: '1px solid #1F1F22', backgroundColor: '#0D0D0F', minWidth: 200 }}>
              <p style={{ color: '#52525B', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 8px' }}>Eficiencia</p>
              <svg width="150" height="150" viewBox="0 0 150 150">
                <circle cx="75" cy="75" r={R} fill="none" stroke="#1F1F22" strokeWidth="14" />
                <circle
                  cx="75" cy="75" r={R} fill="none" stroke="#22C55E" strokeWidth="14" strokeLinecap="round"
                  strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - eff / 100)} transform="rotate(-90 75 75)"
                />
                <text x="75" y="83" textAnchor="middle" fill="#F4F4F5" fontSize="26" fontWeight="700">{Math.round(eff)}%</text>
              </svg>
            </div>

            <div style={{ padding: 20, borderRadius: 14, border: '1px solid #1F1F22', backgroundColor: '#0D0D0F', minWidth: 240, flex: 1 }}>
              <p style={{ color: '#52525B', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 16px' }}>Azúcar inicial vs Etanol (g/L)</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 40, height: 132, paddingLeft: 8 }}>
                {([['Azúcar', sugarV, '#A1A1AA'], ['Etanol', ethV, '#22C55E']] as const).map(([lbl, val, col]) => (
                  <div key={lbl} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: '#F4F4F5', fontSize: 12, fontWeight: 600 }}>{val}</span>
                    <div style={{ width: 48, height: Math.max(4, (val / maxBar) * 95), backgroundColor: col, borderRadius: '6px 6px 0 0' }} />
                    <span style={{ color: '#71717A', fontSize: 11 }}>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', columnGap: 64 }}>
            {rows.map(item => (
              <div
                key={item.label}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 0', borderBottom: '1px solid #1F1F22',
                }}
              >
                <span style={{ color: '#71717A', fontSize: 14 }}>{item.label}</span>
                <span style={{ color: '#F4F4F5', fontSize: 14, fontWeight: 600, fontFamily: 'monospace' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ReportDetailView
