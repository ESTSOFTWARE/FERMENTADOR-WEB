import { motion } from 'motion/react'
import { useManageUsersViewModel } from '../viewmodels/useManageUsersViewModel'
import { MANAGE_USERS_STYLES, ROLE_CONFIG } from '../constants/manageUsersStyles'
import type { Role } from '../../models/entities/User'
import { pageVariants, sectionVariants } from '../../../../shared/animations/variants'

const inputStyle: React.CSSProperties = {
  width:           '100%',
  backgroundColor: '#0A0A0B',
  border:          '1px solid #2A2A2D',
  borderRadius:    8,
  color:           '#F4F4F5',
  fontSize:        12,
  padding:         '8px 12px',
  fontFamily:      'Poppins, sans-serif',
  boxSizing:       'border-box',
}

const FILTERS = [
  { label: 'Todos los roles', value: ''              },
  { label: 'Administrador',   value: 'Administrador' },
  { label: 'Profesor',        value: 'Profesor'      },
  { label: 'Estudiante',      value: 'Estudiante'    },
]

const STAT_COLORS: Record<string, string> = {
  '':              '#F4F4F5',
  'Administrador': '#A78BFA',
  'Profesor':      '#22C55E',
  'Estudiante':    '#38BDF8',
}

const ManageUsersView = () => {
  const {
    users, filtered, loading, error,
    search, setSearch,
    roleFilter, setRoleFilter,
    editing, editForm, setField,
    startEdit, cancelEdit, saveEdit, saving,
    deleteId, setDeleteId, confirmDelete, deleting,
    success,
    isProfesor,
  } = useManageUsersViewModel()

  const visibleFilters = isProfesor
    ? FILTERS.filter(f => f.value === '' || f.value === 'Estudiante')
    : FILTERS

  const countFor = (value: string) =>
    value === ''
      ? (isProfesor ? users.filter(u => u.role_name === 'Estudiante') : users).length
      : users.filter(u => u.role_name === value).length

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" style={{ minHeight: '100vh', backgroundColor: '#0A0A0B', padding: '40px 48px' }}>
      <style>{MANAGE_USERS_STYLES}</style>

      {/* ── Header ── */}
      <motion.div variants={sectionVariants} style={{ marginBottom: 32 }}>
        <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
          Gestión de Usuarios
        </p>
        <h1 style={{ color: '#F4F4F5', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
          {isProfesor ? 'Mis Estudiantes' : 'Administrar Usuarios'}
        </h1>
        <div style={{ marginTop: 12, height: 1, width: 96, backgroundColor: '#22C55E', opacity: 0.4 }} />
      </motion.div>

      {/* ── Alertas ── */}
      {success && (
        <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, backgroundColor: '#22C55E10', border: '1px solid #22C55E30', color: '#22C55E', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {success}
        </div>
      )}

      {error && (
        <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, backgroundColor: '#F43F5E10', border: '1px solid #F43F5E30', color: '#F43F5E', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {/* ── Toolbar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>

        {/* Búsqueda + select rol (solo admin) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative', width: 280 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#52525B" strokeWidth="2" strokeLinecap="round"
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              className="manage-input"
              placeholder={isProfesor ? 'Buscar estudiante...' : 'Buscar por nombre, email o rol...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft: 36, paddingRight: 16 }}
            />
          </div>

          {!isProfesor && (
            <div style={{ position: 'relative' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#52525B" strokeWidth="2"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                style={{
                  ...inputStyle,
                  width:        'auto',
                  paddingLeft:  32,
                  paddingRight: 32,
                  cursor:       'pointer',
                  colorScheme:  'dark',
                  appearance:   'none',
                  color:        roleFilter === '' ? '#52525B' : STAT_COLORS[roleFilter],
                  borderColor:  roleFilter === '' ? '#2A2A2D' : `${STAT_COLORS[roleFilter]}50`,
                }}
              >
                {visibleFilters.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#52525B" strokeWidth="2"
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          )}
        </div>

        {/* Pills de filtro */}
        <div style={{ display: 'flex', gap: 6 }}>
          {visibleFilters.map(f => {
            const color  = STAT_COLORS[f.value]
            const count  = countFor(f.value)
            const active = roleFilter === f.value
            return (
              <button
                key={f.value}
                onClick={() => setRoleFilter(f.value)}
                style={{
                  display:         'flex',
                  alignItems:      'center',
                  gap:             6,
                  padding:         '6px 12px',
                  borderRadius:    999,
                  border:          `1px solid ${active ? color : '#2A2A2D'}`,
                  backgroundColor: active ? `${color}12` : '#111113',
                  color:           active ? color : '#3F3F46',
                  fontSize:        11,
                  fontWeight:      500,
                  fontFamily:      'Poppins, sans-serif',
                  cursor:          'pointer',
                  transition:      'all 0.15s',
                  whiteSpace:      'nowrap' as const,
                }}
              >
                <span style={{
                  display:         'inline-flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  width:           18,
                  height:          18,
                  borderRadius:    999,
                  backgroundColor: active ? `${color}25` : '#1F1F22',
                  color:           active ? color : '#52525B',
                  fontSize:        10,
                  fontWeight:      700,
                }}>
                  {count}
                </span>
                {f.label === 'Todos los roles' ? 'Todos' : f.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tabla ── */}
      {loading ? (
        <div style={{ padding: '48px 20px', textAlign: 'center', color: '#3F3F46', fontSize: 13 }}>
          Cargando usuarios...
        </div>
      ) : (
        <div style={{ borderRadius: 16, backgroundColor: '#111113', border: '1px solid #1F1F22', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1F1F22' }}>
                {['ID', 'Nombre', 'Email', 'Rol', 'Circuito', 'Creado', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#3F3F46', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr
                  key={u.id}
                  className="user-row"
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid #17171A' : 'none' }}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ color: '#22C55E', fontSize: 12, fontWeight: 600, fontFamily: 'monospace' }}>#{u.id}</span>
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    {editing === u.id && editForm ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <input className="manage-input" value={editForm.name}      onChange={e => setField('name',      e.target.value)} style={{ ...inputStyle, width: 90  }} placeholder="Nombre"   />
                        <input className="manage-input" value={editForm.last_name} onChange={e => setField('last_name', e.target.value)} style={{ ...inputStyle, width: 90  }} placeholder="Apellido" />
                      </div>
                    ) : (
                      <span style={{ color: '#F4F4F5', fontSize: 13 }}>{u.name} {u.last_name}</span>
                    )}
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    {editing === u.id && editForm ? (
                      <input className="manage-input" type="email" value={editForm.email} onChange={e => setField('email', e.target.value)} style={{ ...inputStyle, width: 180 }} />
                    ) : (
                      <span style={{ color: '#71717A', fontSize: 12 }}>{u.email}</span>
                    )}
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    {editing === u.id && editForm ? (
                      <select
                        value={editForm.role_name}
                        onChange={e => setField('role_name', e.target.value)}
                        style={{ ...inputStyle, width: 140, cursor: 'pointer', colorScheme: 'dark' }}
                      >
                        {isProfesor
                          ? <option value="Estudiante">Estudiante</option>
                          : <>
                              <option value="Administrador">Administrador</option>
                              <option value="Profesor">Profesor</option>
                              <option value="Estudiante">Estudiante</option>
                            </>
                        }
                      </select>
                    ) : (
                      <span style={{
                        display:         'inline-block',
                        padding:         '3px 10px',
                        borderRadius:    999,
                        fontSize:        11,
                        fontWeight:      500,
                        color:           ROLE_CONFIG[u.role_name as Role]?.color ?? '#71717A',
                        backgroundColor: `${ROLE_CONFIG[u.role_name as Role]?.color ?? '#71717A'}15`,
                        border:          `1px solid ${ROLE_CONFIG[u.role_name as Role]?.color ?? '#71717A'}30`,
                      }}>
                        {u.role_name}
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ color: '#52525B', fontSize: 12, fontFamily: 'monospace' }}>
                      {u.circuit_id !== null ? `#${u.circuit_id}` : '—'}
                    </span>
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ color: '#3F3F46', fontSize: 12 }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString('es-MX') : '—'}
                    </span>
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    {editing === u.id ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          className="action-btn"
                          onClick={saveEdit}
                          disabled={saving}
                          style={{ padding: '5px 14px', borderRadius: 7, border: 'none', backgroundColor: '#22C55E', color: '#0A0A0B', fontSize: 11, fontWeight: 600, fontFamily: 'Poppins, sans-serif', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
                        >
                          {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                          className="action-btn"
                          onClick={cancelEdit}
                          style={{ padding: '5px 14px', borderRadius: 7, border: '1px solid #2A2A2D', backgroundColor: 'transparent', color: '#71717A', fontSize: 11, fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button
                          className="action-btn"
                          onClick={() => startEdit(u)}
                          title="Editar"
                          style={{ background: 'none', border: 'none', padding: 4, color: '#52525B', opacity: 0.7, cursor: 'pointer' }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => setDeleteId(u.id)}
                          title="Eliminar"
                          style={{ background: 'none', border: 'none', padding: 4, color: '#F43F5E', opacity: 0.6, cursor: 'pointer' }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4h6v2" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', color: '#3F3F46', fontSize: 13 }}>
                    {isProfesor ? 'No tienes estudiantes registrados' : 'No hay usuarios que coincidan con la búsqueda'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal eliminar ── */}
      {deleteId !== null && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ padding: 32, borderRadius: 16, backgroundColor: '#111113', border: '1px solid #1F1F22', maxWidth: 380, width: '90%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#F43F5E15', border: '1px solid #F43F5E30', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                </svg>
              </div>
              <p style={{ color: '#F4F4F5', fontSize: 15, fontWeight: 600, margin: 0 }}>Eliminar usuario</p>
            </div>
            <p style={{ color: '#71717A', fontSize: 13, margin: '0 0 24px 0', lineHeight: 1.6 }}>
              ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteId(null)}
                style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #2A2A2D', backgroundColor: 'transparent', color: '#71717A', fontSize: 13, fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                style={{ padding: '8px 20px', borderRadius: 8, border: 'none', backgroundColor: '#F43F5E', color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'Poppins, sans-serif', cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.6 : 1 }}
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default ManageUsersView