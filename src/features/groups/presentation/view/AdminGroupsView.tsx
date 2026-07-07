import { useNavigate }                from 'react-router-dom'
import { motion }                     from 'motion/react'
import { Users }                      from 'lucide-react'
import { pageVariants, sectionVariants } from '../../../../shared/animations/variants'
import { useAdminGroupsViewModel }    from '../viewmodels/useAdminGroupsViewModel'
import { formatDate }                 from '../utils/format-date'
import { UserAvatar }                 from '../../../../core/components/UserAvatar'

const AdminGroupsView = () => {
  const navigate                     = useNavigate()
  const { loading, search, setSearch, filtered } = useAdminGroupsViewModel()

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible"
      style={{ minHeight: 'calc(100vh - 3.5rem)', backgroundColor: '#0A0A0B', padding: '40px 48px' }}>

      <motion.div variants={sectionVariants} style={{ marginBottom: 32, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
            Administración
          </p>
          <h1 style={{ color: '#F4F4F5', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
            Todos los Grupos
          </h1>
          <div style={{ marginTop: 10, height: 1, width: 80, backgroundColor: '#22C55E', opacity: 0.4 }} />
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre, materia o código..."
          style={{
            width: 280, padding: '9px 14px', borderRadius: 10, fontSize: 12,
            backgroundColor: '#111113', border: '1px solid #2A2A2D',
            color: '#F4F4F5', outline: 'none',
          }}
        />
      </motion.div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
          <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#2A2A2D" strokeWidth="4" />
            <path fill="#22C55E" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', paddingTop: 80, color: '#3F3F46', fontSize: 13 }}>
          No hay grupos registrados.
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <motion.div variants={sectionVariants}
          style={{ border: '1px solid #1F1F22', borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#0d0d0e', borderBottom: '1px solid #1F1F22' }}>
                {['Grupo', 'Materia', 'Código', 'Profesor', 'Alumnos', 'Creado'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525B' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((g, i) => (
                <tr
                  key={g.id}
                  onClick={() => navigate(`/groups/${g.id}`)}
                  style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid #17171A' : 'none',
                    cursor: 'pointer', transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#111113')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', flexShrink: 0, backgroundColor: '#1F1F22' }}>
                        <img src={g.cover_image ?? '/assets/classrooms/banner.png'} alt={g.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <span style={{ color: '#F4F4F5', fontSize: 13, fontWeight: 600 }}>{g.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#A1A1AA', fontSize: 13 }}>{g.subject}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', padding: '3px 8px', borderRadius: 6, backgroundColor: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}>
                      {g.code}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#A1A1AA', fontSize: 13 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <UserAvatar src={g.professor_avatar} name={g.professor_name ?? 'Profesor'}
                        style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#1F1F22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#22C55E', flexShrink: 0 }} />
                      <span>{g.professor_name ?? `Prof. #${g.professor_id}`}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#71717A', fontSize: 13 }}>
                      <Users size={13} />
                      {g.members.length}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#52525B', fontSize: 12 }}>{formatDate(g.created_at, true)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  )
}

export default AdminGroupsView
