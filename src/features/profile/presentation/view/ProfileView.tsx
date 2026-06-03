import { useState, useRef }              from 'react'
import { motion }                        from 'motion/react'
import { useProfileViewModel }           from '../viewmodels/useProfileViewModel'
import { pageVariants, sectionVariants, gridVariants } from '../../../../shared/animations/variants'
import { PhoneInput }                    from '../components/PhoneInput'
import { EyeBtn }                        from '../components/EyeBtn'
import { Flash }                         from '../components/Flash'
import { PROFILE_STYLES }                from '../constants/profile-styles.constants'
import { inputStyle, labelStyle, readonlyStyle } from '../constants/profile-input-styles.constants'
import { ROLE_LABELS }                   from '../constants/role-labels.constants'

const ProfileView = () => {
  const {
    user, infoForm, pwForm, selectedAvatar,
    circuitId, activationCode, hasCircuit, isVerified,
    editingInfo, loadingInfo, loadingPw, loadingActivation, loadingImage,
    successInfo, successPw, successActivation,
    errorInfo, errorPw, errorActivation, errorImage,
    pwMismatch, pwValid, infoChanged,
    setInfo, setPw, setEditingInfo, setActivationCode,
    handleSaveInfo, handleCancelInfo, handleSavePw,
    handleUploadImage, handleActivateCircuit,
  } = useProfileViewModel()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext,    setShowNext]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const initials  = [infoForm.name, infoForm.last_name].filter(Boolean).map(s => s[0]).join('').toUpperCase() || '?'
  const roleLabel = user?.role ? (ROLE_LABELS[user.role] ?? user.role) : '—'
  const roleColor = user?.role === 'admin' ? '#A78BFA' : user?.role === 'profesor' ? '#3B82F6' : '#22C55E'

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" style={{ minHeight: 'calc(100vh - 3.5rem)', backgroundColor: '#0A0A0B', padding: '40px 48px' }}>
      <style>{PROFILE_STYLES}</style>

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
                <img src={selectedAvatar} alt="Avatar" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '2px solid #22C55E40', backgroundColor: '#FFFFFF' }} />
              ) : (
                <div style={{ width: 100, height: 100, borderRadius: '50%', backgroundColor: '#16A34A22', border: '2px solid #22C55E30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700, color: '#22C55E' }}>
                  {initials}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleUploadImage(f); e.target.value = '' }}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loadingImage}
                title="Subir foto de perfil"
                style={{ position: 'absolute', bottom: 2, right: 2, width: 28, height: 28, borderRadius: '50%', backgroundColor: loadingImage ? '#16A34A80' : '#22C55E', border: '2px solid #111113', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: loadingImage ? 'not-allowed' : 'pointer', padding: 0 }}>
                {loadingImage
                  ? <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#0A0A0B" strokeWidth="4" opacity=".25"/><path fill="#0A0A0B" d="M4 12a8 8 0 018-8v8z"/></svg>
                  : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A0A0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                }
              </button>
            </div>

            {errorImage && (
              <p style={{ color: '#F43F5E', fontSize: 11, textAlign: 'center', margin: '-8px 0 0 0' }}>{errorImage}</p>
            )}

            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#F4F4F5', fontSize: 16, fontWeight: 600, margin: '0 0 4px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {infoForm.name} {infoForm.last_name}
                {isVerified && (
                  <img src="/assets/icons/verified.svg" alt="verified" style={{ width: 18, height: 18, flexShrink: 0 }} />
                )}
              </p>
              <p style={{ color: '#52525B', fontSize: 12, margin: '0 0 10px 0' }}>{infoForm.email}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 999, fontSize: 11, fontWeight: 500, color: roleColor, backgroundColor: `${roleColor}15`, border: `1px solid ${roleColor}30` }}>
                  {roleLabel}
                </span>
                {(() => {
                  const provider = user?.oauth_provider ?? 'email'
                  const cfg = provider === 'google'
                    ? { color: '#F4F4F5', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', label: 'Google',
                        icon: <svg width="11" height="11" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> }
                    : provider === 'github'
                    ? { color: '#F4F4F5', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', label: 'GitHub',
                        icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="#F4F4F5"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg> }
                    : { color: '#F4F4F5', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', label: 'Correo',
                        icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F4F4F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> }
                  return (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 500, color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
                      {cfg.icon}
                      {cfg.label}
                    </span>
                  )
                })()}
              </div>
            </div>
          </div>

          <div style={{ padding: 24, borderRadius: 16, backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
            <p style={{ color: '#3F3F46', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 16px 0' }}>Información de cuenta</p>
            {[
              { label: 'Rol',        value: roleLabel,                          color: roleColor                          },
              ...(user?.role === 'admin' ? [{ label: 'Circuito', value: circuitId ? `#${circuitId}` : '—', color: circuitId ? '#22C55E' : '#52525B' }] : []),
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

          {!hasCircuit && user?.role === 'admin' && (
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
                  {pwForm.next !== '' && pwForm.next.length < 8 && (
                    <p style={{ color: '#F59E0B', fontSize: 11, margin: '6px 0 0 2px' }}>Mínimo 8 caracteres</p>
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
