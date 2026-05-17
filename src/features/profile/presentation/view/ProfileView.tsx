import { useState } from 'react'
import { motion } from 'motion/react'
import { useProfileViewModel } from '../viewmodels/useProfileViewModel'
import { avatar as AVATARS } from '../../../../core/avatars/avatars'
import { pageVariants, sectionVariants, gridVariants } from '../../../../shared/animations/variants'
import { PhoneInput } from '../components/PhoneInput'

const STYLES = `
  .profile-input:focus {
    outline: none;
    border-color: #22C55E !important;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.08);
  }
  .profile-input::placeholder { color: #3F3F46; }
  .avatar-option { transition: transform 0.15s ease; cursor: pointer; }
  .avatar-option:hover { transform: scale(1.06); }
`

const inputStyle: React.CSSProperties = {
  width: '100%', backgroundColor: '#0A0A0B', border: '1px solid #2A2A2D',
  borderRadius: 10, color: '#F4F4F5', fontSize: 13, padding: '11px 14px',
  fontFamily: 'Poppins, sans-serif', boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}
const labelStyle: React.CSSProperties = {
  display: 'block', color: '#71717A', fontSize: 10,
  letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8,
}
const readonlyStyle: React.CSSProperties = {
  ...inputStyle, backgroundColor: '#0D0D0F',
  border: '1px solid #1F1F22', color: '#52525B', cursor: 'default',
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador', profesor: 'Profesor', estudiante: 'Estudiante',
}

const avatarList = Object.values(AVATARS)

const EyeBtn = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
  <button type="button" onClick={onToggle}
    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#52525B', padding: 0 }}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      {show
        ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
    </svg>
  </button>
)

const Flash = ({ msg, type }: { msg: string; type: 'success' | 'error' }) => {
  const ok = type === 'success'
  return (
    <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, backgroundColor: ok ? '#22C55E10' : '#F43F5E10', border: `1px solid ${ok ? '#22C55E30' : '#F43F5E30'}`, color: ok ? '#22C55E' : '#F43F5E', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
      {ok
        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>}
      {msg}
    </div>
  )
}

const ProfileView = () => {
  const {
    user, infoForm, pwForm, selectedAvatar, pickingAvatar,
    circuitId, activationCode, hasCircuit,
    editingInfo, loadingInfo, loadingPw, loadingActivation,
    successInfo, successPw, successActivation,
    errorInfo, errorPw, errorActivation,
    pwMismatch, pwValid, infoChanged,
    setInfo, setPw, setEditingInfo, setPickingAvatar, setActivationCode,
    handleSaveInfo, handleCancelInfo, handleSavePw,
    handleSelectAvatar, handleActivateCircuit,
  } = useProfileViewModel()

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext,    setShowNext]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const initials  = [infoForm.name, infoForm.last_name].filter(Boolean).map(s => s[0]).join('').toUpperCase() || '?'
  const roleLabel = user?.role ? (ROLE_LABELS[user.role] ?? user.role) : '—'
  const roleColor = user?.role === 'admin' ? '#A78BFA' : user?.role === 'profesor' ? '#3B82F6' : '#22C55E'

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" style={{ minHeight: '100vh', backgroundColor: '#0A0A0B', padding: '40px 48px' }}>
      <style>{STYLES}</style>

      <motion.div variants={sectionVariants} style={{ marginBottom: 32 }}>
        <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 10px 0' }}>Cuenta</p>
        <h1 style={{ color: '#F4F4F5', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>Mi Perfil</h1>
        <div style={{ marginTop: 10, height: 1, width: 80, backgroundColor: '#22C55E', opacity: 0.4 }} />
      </motion.div>

      <motion.div variants={gridVariants} style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: 32, borderRadius: 16, backgroundColor: '#111113', border: '1px solid #1F1F22', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative' }}>
              {selectedAvatar ? (
                <img src={selectedAvatar} alt="Avatar" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'contain', border: '2px solid #22C55E40', backgroundColor: '#FFFFFF' }} />
              ) : (
                <div style={{ width: 100, height: 100, borderRadius: '50%', backgroundColor: '#16A34A22', border: '2px solid #22C55E30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700, color: '#22C55E' }}>
                  {initials}
                </div>
              )}
              <button onClick={() => setPickingAvatar(!pickingAvatar)} title="Cambiar avatar"
                style={{ position: 'absolute', bottom: 2, right: 2, width: 28, height: 28, borderRadius: '50%', backgroundColor: '#22C55E', border: '2px solid #111113', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A0A0B" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#F4F4F5', fontSize: 16, fontWeight: 600, margin: '0 0 4px 0' }}>{infoForm.name} {infoForm.last_name}</p>
              <p style={{ color: '#52525B', fontSize: 12, margin: '0 0 10px 0' }}>{infoForm.email}</p>
              <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 999, fontSize: 11, fontWeight: 500, color: roleColor, backgroundColor: `${roleColor}15`, border: `1px solid ${roleColor}30` }}>
                {roleLabel}
              </span>
            </div>

            {pickingAvatar && (
              <div style={{ width: '100%', borderTop: '1px solid #1F1F22', paddingTop: 16 }}>
                <p style={{ color: '#3F3F46', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 12px 0' }}>Elige un avatar</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {avatarList.map(path => (
                    <button key={path} className="avatar-option" onClick={() => handleSelectAvatar(path)}
                      style={{ padding: 0, background: 'none', border: `2px solid ${selectedAvatar === path ? '#22C55E' : '#1F1F22'}`, borderRadius: '50%', cursor: 'pointer', boxShadow: selectedAvatar === path ? '0 0 0 3px rgba(34,197,94,0.2)' : 'none' }}>
                      <img src={path} alt="avatar" style={{ width: '100%', aspectRatio: '1', borderRadius: '50%', objectFit: 'contain', display: 'block', backgroundColor: '#FFFFFF' }} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ padding: 24, borderRadius: 16, backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
            <p style={{ color: '#3F3F46', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 16px 0' }}>Información de cuenta</p>
            {[
              { label: 'Rol',        value: roleLabel,                          color: roleColor                          },
              { label: 'Circuito',   value: circuitId ? `#${circuitId}` : '—', color: circuitId ? '#22C55E' : '#52525B'  },
              { label: 'ID usuario', value: user?.id ? `#${user.id}` : '—',    color: '#A1A1AA'                          },
            ].map((item, i, arr) => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid #17171A' : 'none' }}>
                <span style={{ color: '#52525B', fontSize: 12 }}>{item.label}</span>
                <span style={{ color: item.color, fontSize: 12, fontWeight: 500, fontFamily: 'monospace' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ padding: 28, borderRadius: 16, backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <p style={{ color: '#F4F4F5', fontSize: 14, fontWeight: 600, margin: '0 0 2px 0' }}>Información personal</p>
                <p style={{ color: '#52525B', fontSize: 12, margin: 0 }}>Actualiza tu nombre y correo</p>
              </div>
              {!editingInfo && (
                <button onClick={() => setEditingInfo(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, border: '1px solid #2A2A2D', backgroundColor: 'transparent', color: '#71717A', fontSize: 12, fontFamily: 'Poppins, sans-serif', cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Editar
                </button>
              )}
            </div>

            {successInfo && <Flash msg="Información actualizada correctamente." type="success" />}
            {errorInfo   && <Flash msg={errorInfo} type="error" />}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Nombre</label>
                  <input className="profile-input" value={infoForm.name} onChange={e => setInfo('name', e.target.value)} disabled={!editingInfo} style={editingInfo ? inputStyle : readonlyStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Apellido</label>
                  <input className="profile-input" value={infoForm.last_name} onChange={e => setInfo('last_name', e.target.value)} disabled={!editingInfo} style={editingInfo ? inputStyle : readonlyStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Correo electrónico</label>
                <input className="profile-input" type="email" value={infoForm.email} onChange={e => setInfo('email', e.target.value)} disabled={!editingInfo} style={editingInfo ? inputStyle : readonlyStyle} />
              </div>
              <div>
                <label style={labelStyle}>Teléfono</label>
                <PhoneInput
                  dialCode={infoForm.dial_code}
                  phoneNumber={infoForm.phone_number}
                  onChange={(dc, pn) => { setInfo('dial_code', dc); setInfo('phone_number', pn) }}
                  disabled={!editingInfo}
                />
                <p style={{ color: '#3F3F46', fontSize: 10, marginTop: 6 }}>10 dígitos sin espacios</p>
              </div>

              {editingInfo && (
                <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                  <button onClick={handleSaveInfo} disabled={!infoChanged || loadingInfo}
                    style={{ padding: '10px 24px', borderRadius: 10, border: 'none', backgroundColor: !infoChanged || loadingInfo ? '#16A34A40' : '#22C55E', color: '#0A0A0B', fontSize: 13, fontWeight: 600, cursor: !infoChanged || loadingInfo ? 'not-allowed' : 'pointer', fontFamily: 'Poppins, sans-serif', transition: 'background-color 0.2s' }}>
                    {loadingInfo ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                  <button onClick={handleCancelInfo}
                    style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid #2A2A2D', backgroundColor: 'transparent', color: '#71717A', fontSize: 13, fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>

          {!hasCircuit && (
            <div style={{ padding: 28, borderRadius: 16, backgroundColor: '#111113', border: '1px solid #22C55E20' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: '#22C55E15', border: '1px solid #22C55E25', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <p style={{ color: '#F4F4F5', fontSize: 14, fontWeight: 600, margin: '0 0 4px 0' }}>Código de activación</p>
                  <p style={{ color: '#52525B', fontSize: 12, margin: 0 }}>Vincula tu cuenta al biorreactor. Este paso solo ocurre una vez.</p>
                </div>
              </div>

              {successActivation && <Flash msg={`Circuito #${circuitId} vinculado correctamente.`} type="success" />}
              {errorActivation   && <Flash msg={errorActivation} type="error" />}

              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Código del dispositivo</label>
                  <input
                    className="profile-input"
                    value={activationCode}
                    onChange={e => setActivationCode(e.target.value.toUpperCase().slice(0, 8))}
                    onKeyDown={e => e.key === 'Enter' && handleActivateCircuit()}
                    placeholder="Ej: A1B2C3D4"
                    maxLength={8}
                    style={{ ...inputStyle, letterSpacing: '0.25em', fontFamily: 'monospace', fontSize: 14, borderColor: activationCode.length === 8 ? '#22C55E40' : '#2A2A2D' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ color: '#3F3F46', fontSize: 10 }}>Código impreso en tu dispositivo</span>
                    <span style={{ color: activationCode.length === 8 ? '#22C55E' : '#3F3F46', fontSize: 10, fontFamily: 'monospace' }}>{activationCode.length}/8</span>
                  </div>
                </div>
                <button
                  onClick={handleActivateCircuit}
                  disabled={loadingActivation || activationCode.length !== 8}
                  style={{ padding: '11px 24px', borderRadius: 10, border: 'none', backgroundColor: loadingActivation || activationCode.length !== 8 ? '#16A34A30' : '#22C55E', color: loadingActivation || activationCode.length !== 8 ? '#3F3F46' : '#0A0A0B', fontSize: 13, fontWeight: 600, cursor: loadingActivation || activationCode.length !== 8 ? 'not-allowed' : 'pointer', fontFamily: 'Poppins, sans-serif', transition: 'all 0.2s', whiteSpace: 'nowrap', marginBottom: 22 }}>
                  {loadingActivation ? 'Activando...' : 'Activar'}
                </button>
              </div>
            </div>
          )}

          <div style={{ padding: 28, borderRadius: 16, backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
            <div style={{ marginBottom: 24 }}>
              <p style={{ color: '#F4F4F5', fontSize: 14, fontWeight: 600, margin: '0 0 2px 0' }}>Cambiar contraseña</p>
              <p style={{ color: '#52525B', fontSize: 12, margin: 0 }}>Usa una contraseña segura de al menos 6 caracteres</p>
            </div>

            {successPw && <Flash msg="Contraseña actualizada correctamente." type="success" />}
            {errorPw   && <Flash msg={errorPw} type="error" />}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={labelStyle}>Contraseña actual</label>
                <div style={{ position: 'relative' }}>
                  <input className="profile-input" type={showCurrent ? 'text' : 'password'} placeholder="••••••••"
                    value={pwForm.current} onChange={e => setPw('current', e.target.value)}
                    style={{ ...inputStyle, paddingRight: 40 }} />
                  <EyeBtn show={showCurrent} onToggle={() => setShowCurrent(p => !p)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Nueva contraseña</label>
                  <div style={{ position: 'relative' }}>
                    <input className="profile-input" type={showNext ? 'text' : 'password'} placeholder="••••••••"
                      value={pwForm.next} onChange={e => setPw('next', e.target.value)}
                      style={{ ...inputStyle, paddingRight: 40 }} />
                    <EyeBtn show={showNext} onToggle={() => setShowNext(p => !p)} />
                  </div>
                  {pwForm.next !== '' && pwForm.next.length < 6 && (
                    <p style={{ color: '#F59E0B', fontSize: 11, margin: '6px 0 0 2px' }}>Mínimo 6 caracteres</p>
                  )}
                </div>
                <div>
                  <label style={{ ...labelStyle, color: pwMismatch ? '#F43F5E' : '#71717A' }}>Confirmar nueva</label>
                  <div style={{ position: 'relative' }}>
                    <input className="profile-input" type={showConfirm ? 'text' : 'password'} placeholder="••••••••"
                      value={pwForm.confirm} onChange={e => setPw('confirm', e.target.value)}
                      style={{ ...inputStyle, paddingRight: 40, borderColor: pwMismatch ? '#F43F5E40' : '#2A2A2D' }} />
                    <EyeBtn show={showConfirm} onToggle={() => setShowConfirm(p => !p)} />
                  </div>
                  {pwMismatch && <p style={{ color: '#F43F5E', fontSize: 11, margin: '6px 0 0 2px' }}>Las contraseñas no coinciden</p>}
                </div>
              </div>
              <div style={{ paddingTop: 4 }}>
                <button onClick={handleSavePw} disabled={!pwValid || loadingPw}
                  style={{ padding: '10px 24px', borderRadius: 10, border: 'none', backgroundColor: !pwValid || loadingPw ? '#16A34A40' : '#22C55E', color: '#0A0A0B', fontSize: 13, fontWeight: 600, cursor: !pwValid || loadingPw ? 'not-allowed' : 'pointer', fontFamily: 'Poppins, sans-serif', transition: 'background-color 0.2s' }}>
                  {loadingPw ? 'Actualizando...' : 'Actualizar contraseña'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProfileView