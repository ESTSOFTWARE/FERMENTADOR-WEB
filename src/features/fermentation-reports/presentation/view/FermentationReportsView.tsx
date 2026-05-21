import { useState }     from 'react'
import { motion }       from 'motion/react'
import type { Status }  from '../types/Status'
import { FILTERS }      from '../constants/filters'
import StatusPill       from '../components/StatusPill'
import { useFermentationReportsViewModel } from '../viewmodels/useFermentationReportsViewModel'
import { pageVariants, sectionVariants, cardVariants, gridVariants } from '../../../../shared/animations/variants'

/* Filtros sin "running" */
const VISIBLE_FILTERS = FILTERS.filter(f => f.value !== 'running')

const FermentationReportsView = () => {
  const { reports, loading, error, refetch } = useFermentationReportsViewModel()

  const [filter,   setFilter]   = useState<Exclude<Status, 'running'> | 'all'>('all')
  const [selected, setSelected] = useState<number | null>(null)

  const filtered = reports.filter(r => filter === 'all' || r.status === filter)

  const completadas   = reports.filter(r => r.status === 'completed').length
  const interrumpidas = reports.filter(r => r.status === 'interrupted').length
  const enCurso       = reports.filter(r => r.status === 'running').length

  const selectedReport = reports.find(r => r.id === selected) ?? null

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
      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
        .report-row { cursor: pointer; transition: background-color 0.15s; }
        .report-row:hover { background-color: rgba(255,255,255,0.02) !important; }
        .filter-btn { cursor: pointer; transition: all 0.15s; font-family: Poppins, sans-serif; }
        .filter-btn:hover { border-color: #3F3F46 !important; color: #A1A1AA !important; }
      `}</style>

      {/* ── Header ── */}
      <motion.div variants={sectionVariants} style={{ marginBottom: 40 }}>
        <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
          Historial
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ color: '#F4F4F5', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
              Reportes de Fermentación
            </h1>
            <div style={{ marginTop: 12, height: 1, width: 96, backgroundColor: '#22C55E', opacity: 0.4 }} />
          </div>

          <button
            onClick={refetch}
            disabled={loading}
            style={{
              display:         'flex',
              alignItems:      'center',
              gap:             6,
              padding:         '8px 16px',
              borderRadius:    8,
              border:          '1px solid #2A2A2D',
              backgroundColor: 'transparent',
              color:           loading ? '#3F3F46' : '#71717A',
              fontSize:        12,
              cursor:          loading ? 'not-allowed' : 'pointer',
              fontFamily:      'Poppins, sans-serif',
              transition:      'all 0.2s',
            }}
          >
            <svg
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}
            >
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>
      </motion.div>

      {/* ── Error ── */}
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
            justifyContent:  'space-between',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </span>
          <button
            onClick={refetch}
            style={{ background: 'none', border: 'none', color: '#F43F5E', cursor: 'pointer', fontSize: 12, textDecoration: 'underline', fontFamily: 'Poppins, sans-serif' }}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* ── Stats ── */}
      <motion.div variants={gridVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 32 }}>
        {([
          { label: 'Total sesiones', value: reports.length,  color: '#F4F4F5',  accent: '#27272A' },
          { label: 'Completadas',    value: completadas,     color: '#22C55E',  accent: '#22C55E15' },
          { label: 'Interrumpidas',  value: interrumpidas,   color: '#F59E0B',  accent: '#F59E0B15' },
          { label: 'En curso',       value: enCurso,         color: '#3B82F6',  accent: '#3B82F615' },
        ] as const).map(stat => (
          <motion.div
            key={stat.label}
            variants={cardVariants}
            style={{
              padding:         '20px 22px',
              borderRadius:    14,
              backgroundColor: '#111113',
              border:          '1px solid #1F1F22',
              position:        'relative',
              overflow:        'hidden',
            }}
          >
            {/* Accent top bar */}
            <div
              style={{
                position:        'absolute',
                top:             0,
                left:            0,
                right:           0,
                height:          2,
                backgroundColor: stat.color,
                opacity:         loading ? 0 : 0.5,
                transition:      'opacity 0.3s',
              }}
            />
            {loading
              ? <div style={{ height: 32, width: 48, borderRadius: 6, backgroundColor: '#1A1A1D', marginBottom: 8 }} />
              : <p style={{ color: stat.color, fontSize: 30, fontWeight: 700, margin: '0 0 6px 0', letterSpacing: '-0.03em' }}>
                  {stat.value}
                </p>
            }
            <p style={{ color: '#52525B', fontSize: 11, margin: 0, letterSpacing: '0.02em' }}>{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Filtros ── */}
      <motion.div variants={sectionVariants} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <p style={{ color: '#3F3F46', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 8px 0 0' }}>
          Filtrar
        </p>
        {VISIBLE_FILTERS.map(f => (
          <button
            key={f.value}
            className="filter-btn"
            onClick={() => setFilter(f.value as typeof filter)}
            style={{
              padding:         '6px 16px',
              borderRadius:    7,
              border:          `1px solid ${filter === f.value ? '#22C55E' : '#2A2A2D'}`,
              backgroundColor: filter === f.value ? '#22C55E12' : 'transparent',
              color:           filter === f.value ? '#22C55E' : '#52525B',
              fontSize:        12,
              fontWeight:      filter === f.value ? 600 : 400,
            }}
          >
            {f.label}
          </button>
        ))}

        <span style={{ marginLeft: 'auto', color: '#3F3F46', fontSize: 12 }}>
          {loading ? '—' : `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''}`}
        </span>
      </motion.div>

      {/* ── Tabla + panel lateral ── */}
      <motion.div
        variants={sectionVariants}
        style={{
          flex:                1,
          display:             'grid',
          gridTemplateColumns: selected ? '1fr 340px' : '1fr',
          gap:                 16,
          alignItems:          'start',
        }}
      >
        {/* Tabla */}
        <div
          style={{
            borderRadius:    16,
            backgroundColor: '#111113',
            border:          '1px solid #1F1F22',
            overflow:        'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1A1A1D' }}>
                {['ID', 'Circuito', 'Inicio', 'Duración', 'pH', 'Temp.', 'Estado', ''].map(h => (
                  <th
                    key={h}
                    style={{
                      padding:       '13px 20px',
                      textAlign:     'left',
                      color:         '#2E2E32',
                      fontSize:      10,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      fontWeight:    600,
                      whiteSpace:    'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Skeleton */}
              {loading && Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #17171A' }}>
                  {[40, 80, 100, 50, 40, 50, 72, 14].map((w, j) => (
                    <td key={j} style={{ padding: '14px 20px' }}>
                      <div style={{ height: 11, width: w, borderRadius: 4, backgroundColor: '#1A1A1D' }} />
                    </td>
                  ))}
                </tr>
              ))}

              {/* Filas */}
              {!loading && filtered.map((r, i) => (
                <tr
                  key={r.id}
                  className="report-row"
                  onClick={() => setSelected(selected === r.id ? null : r.id)}
                  style={{
                    borderBottom:    i < filtered.length - 1 ? '1px solid #17171A' : 'none',
                    backgroundColor: selected === r.id ? 'rgba(34,197,94,0.04)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '13px 20px' }}>
                    <span style={{ color: '#4ADE80', fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>
                      #{r.id}
                    </span>
                  </td>
                  <td style={{ padding: '13px 20px' }}>
                    <span style={{ color: '#71717A', fontSize: 12 }}>#{r.circuit}</span>
                  </td>
                  <td style={{ padding: '13px 20px' }}>
                    <span style={{ color: '#52525B', fontSize: 12 }}>{r.start}</span>
                  </td>
                  <td style={{ padding: '13px 20px' }}>
                    <span style={{ color: '#A1A1AA', fontSize: 12, fontFamily: 'monospace' }}>{r.duration}</span>
                  </td>
                  <td style={{ padding: '13px 20px' }}>
                    <span style={{ color: '#4ADE80', fontSize: 12, fontWeight: 600, fontFamily: 'monospace' }}>{r.ph}</span>
                  </td>
                  <td style={{ padding: '13px 20px' }}>
                    <span style={{ color: '#A1A1AA', fontSize: 12, fontFamily: 'monospace' }}>{r.temp}°C</span>
                  </td>
                  <td style={{ padding: '13px 20px' }}>
                    <StatusPill status={r.status} />
                  </td>
                  <td style={{ padding: '13px 20px' }}>
                    <svg
                      width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke={selected === r.id ? '#22C55E' : '#2E2E32'}
                      strokeWidth="2" strokeLinecap="round"
                      style={{ transition: 'stroke 0.15s' }}
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </td>
                </tr>
              ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: '56px 20px', textAlign: 'center' }}>
                    <p style={{ color: '#2E2E32', fontSize: 13, margin: 0 }}>Sin resultados</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Panel lateral */}
        {selected && selectedReport && (
          <div
            style={{
              padding:         24,
              borderRadius:    16,
              backgroundColor: '#111113',
              border:          '1px solid #1F1F22',
              display:         'flex',
              flexDirection:   'column',
              gap:             18,
            }}
          >
            {/* Panel header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#52525B', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
                  Detalle
                </p>
                <p style={{ color: '#F4F4F5', fontSize: 15, fontWeight: 600, margin: 0 }}>
                  Sesión #{selectedReport.id}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background:      'none',
                  border:          '1px solid #2A2A2D',
                  borderRadius:    7,
                  cursor:          'pointer',
                  color:           '#52525B',
                  padding:         '5px 7px',
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <StatusPill status={selectedReport.status} />

            {/* Metadata */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {([
                { label: 'Circuito',        value: `#${selectedReport.circuit}` },
                { label: 'Inicio',          value: selectedReport.start },
                { label: 'Fin',             value: selectedReport.end },
                { label: 'Duración',        value: selectedReport.duration },
                { label: 'pH registrado',   value: selectedReport.ph > 0 ? `${selectedReport.ph}` : '—' },
                { label: 'Temperatura',     value: selectedReport.temp > 0 ? `${selectedReport.temp} °C` : '—' },
                { label: 'Azúcar inicial',  value: selectedReport.sugar > 0 ? `${selectedReport.sugar} g/L` : '—' },
                { label: 'Etanol obtenido', value: selectedReport.etanol > 0 ? `${selectedReport.etanol} g/L` : '—' },
              ] as const).map((item, i, arr) => (
                <div
                  key={item.label}
                  style={{
                    display:        'flex',
                    justifyContent: 'space-between',
                    alignItems:     'center',
                    padding:        '10px 0',
                    borderBottom:   i < arr.length - 1 ? '1px solid #17171A' : 'none',
                  }}
                >
                  <span style={{ color: '#3F3F46', fontSize: 12 }}>{item.label}</span>
                  <span style={{ color: '#A1A1AA', fontSize: 12, fontWeight: 500, fontFamily: 'monospace' }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Eficiencia */}
            {selectedReport.efficiency != null && (
              <div
                style={{
                  padding:         '16px 18px',
                  borderRadius:    12,
                  backgroundColor: '#0D0D0F',
                  border:          '1px solid #1A1A1D',
                }}
              >
                <p style={{ color: '#3F3F46', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
                  Eficiencia estimada
                </p>
                <p style={{ color: '#22C55E', fontSize: 28, fontWeight: 700, margin: '0 0 10px 0', letterSpacing: '-0.03em' }}>
                  {selectedReport.efficiency.toFixed(1)}%
                </p>
                <div style={{ height: 5, borderRadius: 999, backgroundColor: '#1A1A1D', overflow: 'hidden' }}>
                  <div
                    style={{
                      height:          '100%',
                      width:           `${Math.min(100, selectedReport.efficiency)}%`,
                      borderRadius:    999,
                      backgroundColor: '#22C55E',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default FermentationReportsView