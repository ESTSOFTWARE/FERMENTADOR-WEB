import { useState }                          from 'react'
import { useNavigate }                       from 'react-router-dom'
import { motion }                            from 'motion/react'
import type { Status }                       from '../types/Status'
import { FILTERS }                           from '../constants/filters'
import { REPORTS_STYLES }                    from '../constants/styles'
import StatusPill                            from '../components/StatusPill'
import { useFermentationReportsViewModel }   from '../viewmodels/useFermentationReportsViewModel'
import { useUserAuth }                        from '../../../../core/hooks/userAuth'
import PaginationBar                          from '../../../../shared/components/PaginationBar'
import { pageVariants, sectionVariants, cardVariants, gridVariants } from '../../../../shared/animations/variants'

const VISIBLE_FILTERS = FILTERS.filter(f => f.value !== 'running')
const PAGE_SIZE = 10

const FermentationReportsView = () => {
  const { reports, loading, error, refetch } = useFermentationReportsViewModel()
  const { user } = useUserAuth()
  const navigate = useNavigate()

  const [filter,   setFilter]   = useState<Exclude<Status, 'running'> | 'all'>('all')
  const [page,     setPage]     = useState(1)

  const filtered = reports.filter(r => filter === 'all' || r.status === filter)

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const paged      = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const completadas   = reports.filter(r => r.status === 'completed').length
  const interrumpidas = reports.filter(r => r.status === 'interrupted').length
  const enCurso       = reports.filter(r => r.status === 'running').length

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      style={{
        minHeight: 'calc(100vh - 3.5rem)',
        backgroundColor: '#0A0A0B',
        padding:         '48px',
        display:         'flex',
        flexDirection:   'column',
      }}
    >
      <style>{REPORTS_STYLES}</style>

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

      <motion.div variants={gridVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 32 }}>
        {([
          { label: 'Total sesiones', value: reports.length, color: '#F4F4F5', accent: '#27272A' },
          { label: 'Completadas',    value: completadas,    color: '#22C55E', accent: '#22C55E15' },
          { label: 'Interrumpidas',  value: interrumpidas,  color: '#F59E0B', accent: '#F59E0B15' },
          { label: 'En curso',       value: enCurso,        color: '#3B82F6', accent: '#3B82F615' },
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

      <motion.div variants={sectionVariants} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <p style={{ color: '#3F3F46', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 8px 0 0' }}>
          Filtrar
        </p>
        {VISIBLE_FILTERS.map(f => (
          <button
            key={f.value}
            className="filter-btn"
            onClick={() => { setFilter(f.value as typeof filter); setPage(1) }}
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

      <motion.div
        variants={sectionVariants}
        style={{
          flex:                1,
          display:             'grid',
          gridTemplateColumns: '1fr',
          gap:                 16,
          alignItems:          'start',
        }}
      >
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
                {['N°', 'Circuito', 'Inicio', 'Duración', 'pH', 'Temp.', 'Estado', ''].map(h => (
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
              {loading && Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #17171A' }}>
                  {[40, 80, 100, 50, 40, 50, 72, 14].map((w, j) => (
                    <td key={j} style={{ padding: '14px 20px' }}>
                      <div style={{ height: 11, width: w, borderRadius: 4, backgroundColor: '#1A1A1D' }} />
                    </td>
                  ))}
                </tr>
              ))}

              {!loading && paged.map((r, i) => (
                <tr
                  key={r.id}
                  className="report-row"
                  onClick={() => navigate(`/fermentation-reports/${r.id}`)}
                  style={{
                    borderBottom:    i < paged.length - 1 ? '1px solid #17171A' : 'none',
                    backgroundColor: 'transparent',
                  }}
                >
                  <td style={{ padding: '13px 20px' }}>
                    <span style={{ color: '#4ADE80', fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>{(safePage - 1) * PAGE_SIZE + i + 1}</span>
                  </td>
                  <td style={{ padding: '13px 20px' }}>
                    <span style={{ color: '#71717A', fontSize: 12 }}>{user?.activation_code ?? `#${r.circuit}`}</span>
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
                      stroke="#2E2E32"
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

        {!loading && filtered.length > 0 && (
          <PaginationBar
            page={safePage}
            totalPages={totalPages}
            total={filtered.length}
            pageSize={PAGE_SIZE}
            onPrev={() => setPage(Math.max(1, safePage - 1))}
            onNext={() => setPage(Math.min(totalPages, safePage + 1))}
          />
        )}

      </motion.div>
    </motion.div>
  )
}

export default FermentationReportsView
