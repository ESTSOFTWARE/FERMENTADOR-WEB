import { motion } from 'motion/react'
import { useAddUserViewModel } from '../viewmodels/useAddUserViewModel'
import { ROLES }               from '../constants/roles'
import { ADD_USER_STYLES, inputStyle, labelStyle } from '../constants/addUserStyles'
import { pageVariants, sectionVariants } from '../../../../shared/animations/variants'

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    {open
      ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
    }
  </svg>
)

const SectionLabel = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
    <div style={{ marginTop: 2, flexShrink: 0 }}>{icon}</div>
    <div>
      <p style={{ color: '#F4F4F5', fontSize: 13, fontWeight: 600, margin: '0 0 2px 0' }}>{title}</p>
      <p style={{ color: '#3F3F46', fontSize: 11, margin: 0 }}>{description}</p>
    </div>
  </div>
)

const EMAIL_DOMAINS = ['@gmail.com', '@hotmail.com', '@outlook.com', '@yahoo.com', '@icloud.com']

const AddUserView = () => {
  const {
    form, set, mismatch, isValid,
    loading, success, error,
    showPassword, setShowPassword,
    showConfirm,  setShowConfirm,
    handleSubmit,
    isProfesor,
  } = useAddUserViewModel()

  const emailUser   = form.email.includes('@') ? form.email.split('@')[0] : form.email
  const emailDomain = form.email.includes('@') ? '@' + form.email.split('@')[1] : ''

  const iconColor = '#FFF'

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" style={{ minHeight: '100vh', backgroundColor: '#0A0A0B', padding: '40px 48px' }}>
      <style>{ADD_USER_STYLES}</style>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>

      {/* ── Header ── */}
      <motion.div variants={sectionVariants} style={{ marginBottom: 40 }}>
        <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
          Gestión de Usuarios
        </p>
        <h1 style={{ color: '#F4F4F5', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
          {isProfesor ? 'Agregar Estudiante' : 'Agregar Usuario'}
        </h1>
        <div style={{ marginTop: 12, height: 1, width: 96, backgroundColor: '#22C55E', opacity: 0.4 }} />
      </motion.div>

      {/* ── Alertas ── */}
      {success && (
        <div style={{ marginBottom: 24, padding: '14px 18px', borderRadius: 12, backgroundColor: '#22C55E10', border: '1px solid #22C55E30', color: '#22C55E', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#22C55E20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          {isProfesor ? 'Estudiante creado exitosamente.' : 'Usuario creado exitosamente.'}
        </div>
      )}

      {error && (
        <div style={{ marginBottom: 24, padding: '14px 18px', borderRadius: 12, backgroundColor: '#F43F5E10', border: '1px solid #F43F5E30', color: '#F43F5E', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#F43F5E20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── Información personal ── */}
        <div style={{ padding: '28px 32px', borderRadius: 16, backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
          <SectionLabel
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            }
            title="Información personal"
            description="Nombre completo y correo electrónico del usuario"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Nombre</label>
                <input className="add-user-input" placeholder="Juan" value={form.name}
                  onChange={e => set('name', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Apellido</label>
                <input className="add-user-input" placeholder="Pérez" value={form.last_name}
                  onChange={e => set('last_name', e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Correo electrónico</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  className="add-user-input"
                  type="email"
                  placeholder="juan@gmail.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
                  {EMAIL_DOMAINS.map(domain => {
                    const active = emailDomain === domain
                    return (
                      <button
                        key={domain}
                        onClick={() => set('email', emailUser + domain)}
                        style={{
                          padding:         '6px 10px',
                          borderRadius:    6,
                          border:          `1px solid ${active ? '#45ECFF50' : '#2A2A2D'}`,
                          backgroundColor: active ? '#45ECFF10' : '#0A0A0B',
                          color:           active ? '#45ECFF' : '#52525B',
                          fontSize:        11,
                          fontFamily:      'Poppins, sans-serif',
                          cursor:          'pointer',
                          transition:      'all 0.15s',
                          whiteSpace:      'nowrap' as const,
                        }}
                      >
                        {domain}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Seguridad ── */}
        <div style={{ padding: '28px 32px', borderRadius: 16, backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
          <SectionLabel
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            }
            title="Seguridad"
            description="Establece una contraseña segura para la cuenta"
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input className="add-user-input" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  value={form.password} onChange={e => set('password', e.target.value)}
                  style={{ ...inputStyle, paddingRight: 40 }} />
                <button onClick={() => setShowPassword(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#52525B', padding: 0 }}>
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>
            <div>
              <label style={{ ...labelStyle, color: mismatch ? '#F43F5E' : '#71717A' }}>Confirmar contraseña</label>
              <div style={{ position: 'relative' }}>
                <input className="add-user-input" type={showConfirm ? 'text' : 'password'} placeholder="••••••••"
                  value={form.confirm} onChange={e => set('confirm', e.target.value)}
                  style={{ ...inputStyle, paddingRight: 40, borderColor: mismatch ? '#F43F5E40' : '#2A2A2D' }} />
                <button onClick={() => setShowConfirm(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#52525B', padding: 0 }}>
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {mismatch && <p style={{ color: '#F43F5E', fontSize: 11, margin: '6px 0 0 2px' }}>Las contraseñas no coinciden</p>}
            </div>
          </div>
        </div>

        {/* ── Rol y acceso ── */}
        <div style={{ padding: '28px 32px', borderRadius: 16, backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
          <SectionLabel
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            }
            title="Rol y acceso"
            description={isProfesor
              ? 'Los profesores solo pueden registrar cuentas de tipo Estudiante'
              : 'Define el nivel de permisos del nuevo usuario'
            }
          />

          {isProfesor ? (
            /* Profesor — rol fijo, solo lectura */
            <div style={{
              display:         'inline-flex',
              alignItems:      'center',
              gap:             8,
              padding:         '8px 16px',
              borderRadius:    8,
              backgroundColor: '#38BDF815',
              border:          '1px solid #38BDF828',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              <span style={{ color: '#38BDF8', fontSize: 12, fontWeight: 600 }}>Estudiante</span>
            </div>
          ) : (
            /* Admin — selector completo */
            <div style={{ maxWidth: 320 }}>
              <label style={labelStyle}>Rol</label>
              <select
                value={form.role}
                onChange={e => set('role', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer', colorScheme: 'dark' }}
              >
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* ── Acción ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, paddingTop: 4 }}>
          <p style={{ color: '#3F3F46', fontSize: 11, margin: 0 }}>
            {!isValid ? 'Completa todos los campos para continuar' : 'Todo listo para continuar'}
          </p>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            style={{
              padding:         '11px 28px',
              borderRadius:    10,
              border:          'none',
              backgroundColor: !isValid || loading ? '#16A34A40' : '#22C55E',
              color:           !isValid || loading ? '#22C55E60' : '#0A0A0B',
              fontSize:        13,
              fontWeight:      600,
              cursor:          !isValid || loading ? 'not-allowed' : 'pointer',
              fontFamily:      'Poppins, sans-serif',
              transition:      'all 0.2s',
              display:         'flex',
              alignItems:      'center',
              gap:             8,
            }}
          >
            {loading ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Creando...
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                {isProfesor ? 'Crear estudiante' : 'Crear usuario'}
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default AddUserView