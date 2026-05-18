import { useRef, useState } from 'react'
import { useProfileViewModel } from '../../../profile/presentation/viewmodels/useProfileViewModel'
import { PhoneInput } from '../../../profile/presentation/components/PhoneInput'
import { cn } from '../../../../lib/utils'

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador', soporte: 'Soporte', profesor: 'Profesor', estudiante: 'Estudiante',
}
const ROLE_COLOR: Record<string, string> = {
  admin: '#A78BFA', soporte: '#3B82F6', profesor: '#3B82F6', estudiante: '#22C55E',
}

const EyeBtn = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
  <button type="button" onClick={onToggle}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      {show
        ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
    </svg>
  </button>
)

const inputCls = 'w-full bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm px-4 py-2.5 outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all placeholder:text-neutral-700'
const readonlyCls = 'w-full bg-neutral-900/50 border border-neutral-900 rounded-xl text-neutral-600 text-sm px-4 py-2.5 cursor-default'
const labelCls = 'block text-[10px] font-semibold uppercase tracking-widest text-neutral-600 mb-2'

const Flash = ({ msg, ok }: { msg: string; ok: boolean }) => (
  <div className={cn('flex items-center gap-2 px-4 py-3 rounded-xl border text-sm mb-4',
    ok ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400')}>
    {ok
      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
    {msg}
  </div>
)

const ProfilePanel = () => {
  const {
    user, infoForm, pwForm,
    circuitId, activationCode, hasCircuit,
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

  // Si el usuario no tiene foto en BD, limpiar el cache de localStorage
  if (user && !user.profile_image) localStorage.removeItem('profile_image')
  const avatar = user?.profile_image ?? null

  const initials   = [infoForm.name, infoForm.last_name].filter(Boolean).map(s => s[0]).join('').toUpperCase() || '?'
  const roleLabel  = ROLE_LABELS[user?.role ?? ''] ?? user?.role ?? '—'
  const roleColor  = ROLE_COLOR[user?.role ?? ''] ?? '#22C55E'
  const isSoporte  = user?.role === 'soporte'

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex-shrink-0 px-8 pt-6 pb-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-base">Mi perfil</h2>
          <p className="text-neutral-600 text-xs mt-0.5">Gestiona tu información y seguridad</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        <div className="grid grid-cols-[280px_1fr] gap-6 items-start">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-4">

            {/* Avatar card */}
            <div className="bg-neutral-900/50 border border-neutral-800/60 rounded-2xl p-6 flex flex-col items-center gap-5">
              <div className="relative">
                {avatar ? (
                  <img src={avatar} alt="avatar"
                    className="w-24 h-24 rounded-full object-cover"
                    style={{ border: '2px solid #22C55E30' }} />
                ) : (
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
                    style={{ backgroundColor: '#16A34A22', border: '2px solid #22C55E30', color: '#22C55E' }}>
                    {initials}
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleUploadImage(f); e.target.value = '' }} />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loadingImage}
                  className="absolute bottom-0.5 right-0.5 w-7 h-7 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#22C55E', border: '2px solid #0A0A0B' }}>
                  {loadingImage
                    ? <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#0A0A0B" strokeWidth="4" opacity=".3"/><path fill="#0A0A0B" d="M4 12a8 8 0 018-8v8z"/></svg>
                    : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0A0A0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>}
                </button>
              </div>
              {errorImage && <p className="text-red-400 text-xs text-center -mt-2">{errorImage}</p>}
              <div className="text-center">
                <p className="text-white font-semibold text-sm">{infoForm.name} {infoForm.last_name}</p>
                <p className="text-neutral-500 text-xs mt-1">{infoForm.email}</p>
                <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full border font-medium"
                  style={{ color: roleColor, backgroundColor: `${roleColor}15`, borderColor: `${roleColor}30` }}>
                  {roleLabel}
                </span>
              </div>
            </div>

            {/* Account info */}
            <div className="bg-neutral-900/50 border border-neutral-800/60 rounded-2xl p-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-600 mb-4">Cuenta</p>
              {[
                { label: 'Rol',        value: roleLabel,                           color: roleColor            },
                { label: 'Circuito',   value: circuitId ? `#${circuitId}` : '—',  color: circuitId ? '#22C55E' : '#52525B' },
                { label: 'ID usuario', value: user?.id ? `#${user.id}` : '—',     color: '#71717A'            },
              ].map((row, i, arr) => (
                <div key={row.label} className={cn('flex items-center justify-between py-3', i < arr.length - 1 && 'border-b border-neutral-800/60')}>
                  <span className="text-neutral-500 text-xs">{row.label}</span>
                  <span className="text-xs font-mono font-medium" style={{ color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-5">

            {/* Personal info */}
            <div className="bg-neutral-900/50 border border-neutral-800/60 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white font-semibold text-sm">Información personal</p>
                  <p className="text-neutral-500 text-xs mt-0.5">Actualiza tu nombre, correo y teléfono</p>
                </div>
                {!editingInfo && (
                  <button onClick={() => setEditingInfo(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 text-xs transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Editar
                  </button>
                )}
              </div>

              {successInfo && <Flash msg="Información actualizada correctamente." ok />}
              {errorInfo   && <Flash msg={errorInfo} ok={false} />}

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Nombre</label>
                    <input value={infoForm.name} onChange={e => setInfo('name', e.target.value)}
                      disabled={!editingInfo} className={editingInfo ? inputCls : readonlyCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Apellido</label>
                    <input value={infoForm.last_name} onChange={e => setInfo('last_name', e.target.value)}
                      disabled={!editingInfo} className={editingInfo ? inputCls : readonlyCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Correo electrónico</label>
                  <input type="email" value={infoForm.email} onChange={e => setInfo('email', e.target.value)}
                    disabled={!editingInfo} className={editingInfo ? inputCls : readonlyCls} />
                </div>
                <div>
                  <label className={labelCls}>Teléfono</label>
                  <PhoneInput
                    dialCode={infoForm.dial_code} phoneNumber={infoForm.phone_number}
                    onChange={(dc, pn) => { setInfo('dial_code', dc); setInfo('phone_number', pn) }}
                    disabled={!editingInfo} />
                </div>

                {editingInfo && (
                  <div className="flex gap-2 pt-1">
                    <button onClick={handleSaveInfo} disabled={!infoChanged || loadingInfo}
                      className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors">
                      {loadingInfo ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button onClick={handleCancelInfo}
                      className="px-5 py-2 rounded-xl border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 text-sm transition-colors">
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Activation code — solo roles que usan fermentador */}
            {!hasCircuit && !isSoporte && (
              <div className="bg-neutral-900/50 border border-green-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Código de activación</p>
                    <p className="text-neutral-500 text-xs mt-0.5">Vincula tu cuenta al biorreactor. Este paso solo ocurre una vez.</p>
                  </div>
                </div>

                {successActivation && <Flash msg={`Circuito #${circuitId} vinculado correctamente.`} ok />}
                {errorActivation   && <Flash msg={errorActivation} ok={false} />}

                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className={labelCls}>Código del dispositivo</label>
                    <input value={activationCode}
                      onChange={e => setActivationCode(e.target.value.toUpperCase().slice(0, 8))}
                      onKeyDown={e => e.key === 'Enter' && handleActivateCircuit()}
                      placeholder="Ej: A1B2C3D4" maxLength={8}
                      className={cn(inputCls, 'font-mono tracking-widest text-sm', activationCode.length === 8 && 'border-green-500/40')} />
                    <div className="flex justify-between mt-1.5">
                      <span className="text-neutral-700 text-[10px]">Código impreso en tu dispositivo</span>
                      <span className={cn('text-[10px] font-mono', activationCode.length === 8 ? 'text-green-400' : 'text-neutral-700')}>{activationCode.length}/8</span>
                    </div>
                  </div>
                  <button onClick={handleActivateCircuit}
                    disabled={loadingActivation || activationCode.length !== 8}
                    className="mb-6 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors whitespace-nowrap">
                    {loadingActivation ? 'Activando...' : 'Activar'}
                  </button>
                </div>
              </div>
            )}

            {/* Change password */}
            <div className="bg-neutral-900/50 border border-neutral-800/60 rounded-2xl p-6">
              <div className="mb-6">
                <p className="text-white font-semibold text-sm">Cambiar contraseña</p>
                <p className="text-neutral-500 text-xs mt-0.5">Mínimo 8 caracteres</p>
              </div>

              {successPw && <Flash msg="Contraseña actualizada correctamente." ok />}
              {errorPw   && <Flash msg={errorPw} ok={false} />}

              <div className="flex flex-col gap-4">
                <div>
                  <label className={labelCls}>Contraseña actual</label>
                  <div className="relative">
                    <input type={showCurrent ? 'text' : 'password'} placeholder="••••••••"
                      value={pwForm.current} onChange={e => setPw('current', e.target.value)}
                      className={cn(inputCls, 'pr-10')} />
                    <EyeBtn show={showCurrent} onToggle={() => setShowCurrent(p => !p)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Nueva contraseña</label>
                    <div className="relative">
                      <input type={showNext ? 'text' : 'password'} placeholder="••••••••"
                        value={pwForm.next} onChange={e => setPw('next', e.target.value)}
                        className={cn(inputCls, 'pr-10')} />
                      <EyeBtn show={showNext} onToggle={() => setShowNext(p => !p)} />
                    </div>
                    {pwForm.next !== '' && pwForm.next.length < 8 && (
                      <p className="text-amber-400 text-[11px] mt-1.5">Mínimo 8 caracteres</p>
                    )}
                  </div>
                  <div>
                    <label className={cn(labelCls, pwMismatch && '!text-red-400')}>Confirmar nueva</label>
                    <div className="relative">
                      <input type={showConfirm ? 'text' : 'password'} placeholder="••••••••"
                        value={pwForm.confirm} onChange={e => setPw('confirm', e.target.value)}
                        className={cn(inputCls, 'pr-10', pwMismatch && '!border-red-500/40')} />
                      <EyeBtn show={showConfirm} onToggle={() => setShowConfirm(p => !p)} />
                    </div>
                    {pwMismatch && <p className="text-red-400 text-[11px] mt-1.5">Las contraseñas no coinciden</p>}
                  </div>
                </div>
                <div className="pt-1">
                  <button onClick={handleSavePw} disabled={!pwValid || loadingPw}
                    className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors">
                    {loadingPw ? 'Actualizando...' : 'Actualizar contraseña'}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePanel
