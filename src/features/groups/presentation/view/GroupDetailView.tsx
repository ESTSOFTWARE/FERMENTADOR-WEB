import { useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { QRCodeSVG } from 'qrcode.react'
import { sileo } from 'sileo'
import { ArrowLeft, Users, QrCode, Plus, Link, Mail, Hash, Calendar, Phone, AlignLeft } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { pageVariants } from '../../../../shared/animations/variants'
import { useGroupDetailViewModel } from '../viewmodels/useGroupDetailViewModel'
import { useUserAuth } from '../../../../core/hooks/userAuth'
import type { GroupMember } from '../../domain/models/GroupMember'
import PaginationBar from '../../../../shared/components/PaginationBar'
import { UserAvatar } from '../../../../core/components/UserAvatar'
import { JOIN_BASE, PAGE_SIZE } from '../constants/group-detail.constants'
import { TOAST_STYLE } from '../constants/toast-style.constants'
import { modalVariants } from '../constants/modal-variants.constants'
import { formatDate } from '../utils/format-date'
import { exportCSV, exportXLSX, exportPDF } from '../utils/export-members'
import type { Tab } from '../types/tab.types'

const GroupDetailView = () => {
  const { id }       = useParams<{ id: string }>()
  const navigate     = useNavigate()
  const { user }     = useUserAuth()
  const vm           = useGroupDetailViewModel(Number(id))
  const qrRef                         = useRef<HTMLDivElement>(null)
  const [tab, setTab]                 = useState<Tab>('alumnos')
  const [drawer, setDrawer]           = useState<GroupMember | null>(null)
  const [page, setPage]               = useState(1)
  const [showExport, setShowExport]   = useState(false)

  const members    = vm.group?.members ?? []
  const totalPages = Math.max(1, Math.ceil(members.length / PAGE_SIZE))
  const paged      = members.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const copyLink = (code: string) => {
    navigator.clipboard.writeText(`${JOIN_BASE}${code}`)
    sileo.success({ title: 'Link copiado', description: 'El enlace de invitación está en tu portapapeles.', ...TOAST_STYLE })
  }

  const downloadQr = (code: string, name: string) => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return
    const xml  = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([xml], { type: 'image/svg+xml' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `qr-${name.replace(/\s+/g, '-').toLowerCase()}-${code}.svg`
    a.click()
    URL.revokeObjectURL(url)
    sileo.success({ title: 'QR descargado', description: `Código ${code} guardado como SVG.`, ...TOAST_STYLE })
  }

  const professorName = vm.group?.professor_name ?? (user ? `${user.name} ${user.last_name}` : 'Profesor')
  const isAdmin       = user?.role === 'admin'

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'alumnos', label: 'Alumnos', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    ...(!isAdmin ? [{ id: 'qr' as Tab, label: 'QR & Enlace', icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 4h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z' }] : []),
  ]

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col h-[calc(100vh_-_3.5rem)] bg-[#0A0A0B]"
    >
      {/* ── Header ── */}
      <div className="flex-shrink-0 px-8 pt-6 pb-0 border-b border-neutral-800/50">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-5 text-neutral-600 hover:text-white transition-colors text-sm"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a grupos
        </button>

        {vm.loading ? (
          <div className="flex justify-center pt-20">
            <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#2A2A2D" strokeWidth="4" />
              <path fill="#22C55E" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : vm.group && (
          <div className="pb-5">
            <p className="text-green-500 text-[11px] tracking-[0.3em] uppercase mb-2">Detalle del grupo</p>
            <div className="flex items-center justify-between gap-4 mb-1">
              <h1 className="text-white text-3xl font-bold tracking-tight">{vm.group.name}</h1>
              {tab === 'alumnos' && !isAdmin && (
                <button
                  onClick={() => vm.setShowAddMember(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-black transition-opacity hover:opacity-90 flex-shrink-0"
                  style={{ backgroundColor: '#fff', border: 'none', cursor: 'pointer' }}
                >
                  <Plus className="w-4 h-4" />
                  Agregar alumno
                </button>
              )}
            </div>
            <p className="text-neutral-500 text-sm mb-2">{vm.group.subject}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-md"
                style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}>
                {vm.group.code}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-neutral-600">
                <Users className="w-3.5 h-3.5" />
                {vm.group.members.length} {vm.group.members.length === 1 ? 'alumno' : 'alumnos'}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-neutral-700">
                Profesor:
                <UserAvatar src={vm.group.professor_avatar} name={professorName}
                  className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center text-[9px] font-bold text-green-400 flex-shrink-0" />
                {professorName}
              </span>
            </div>
          </div>
        )}

        {/* ── Tab bar ── */}
        {!vm.loading && vm.group && (
          <nav className="flex items-center gap-1 pt-2 pb-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left',
                  tab === t.id
                    ? 'bg-neutral-800 text-white'
                    : 'text-neutral-500 hover:text-white hover:bg-neutral-900'
                )}
                style={{ background: tab === t.id ? '' : undefined, border: 'none', cursor: 'pointer' }}
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d={t.icon} />
                </svg>
                {t.label}
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* ── Contenido ── */}
      {!vm.loading && vm.group && (
        <>
        <div className="flex-1 overflow-y-auto px-6 py-5" data-lenis-prevent>
          <AnimatePresence mode="wait">

            {/* Tab: Alumnos */}
            {tab === 'alumnos' && (
                <motion.div key="alumnos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  {members.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                      <svg className="w-10 h-10 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <p className="text-neutral-600 text-sm">No hay alumnos en este grupo todavía.</p>
                    </div>
                  ) : (
                    <>
                      <div className="border border-neutral-800/60 rounded-2xl overflow-hidden mb-4">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-[#0d0d0e] border-b border-neutral-800/60">
                              {['#', 'Alumno', 'Correo', 'Registrado'].map(h => (
                                <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-600">{h}</th>
                              ))}
                              <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-neutral-600" />
                            </tr>
                          </thead>
                          <tbody>
                            {paged.map((m, i) => (
                              <tr key={m.id} className="border-b border-neutral-900/60 hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4 text-sm text-neutral-600">{(page - 1) * PAGE_SIZE + i + 1}</td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <UserAvatar src={m.avatar} name={`${m.name} ${m.last_name}`}
                                      className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 text-xs font-bold text-neutral-300" />
                                    <span className="text-sm text-white font-semibold">{m.name} {m.last_name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-sm text-neutral-500">{m.email}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-sm text-neutral-500">{formatDate(m.joined_at, true)}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => setDrawer(m)}
                                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors opacity-0 group-hover:opacity-100"
                                  >
                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z"/></svg>
                                    Ver detalle
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </motion.div>
            )}

            {/* Tab: QR & Enlace */}
            {tab === 'qr' && (
              <motion.div key="qr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                className="flex flex-col items-center gap-6 pt-8">
                <div ref={qrRef} className="p-5 rounded-2xl" style={{ backgroundColor: '#fff' }}>
                  <QRCodeSVG value={`${JOIN_BASE}${vm.group.code}`} size={200} bgColor="#ffffff" fgColor="#0A0A0B" level="M" />
                </div>
                <p className="text-neutral-600 text-sm">Escanea este código para unirte al grupo desde la app móvil</p>

                <div className="w-full max-w-md border border-neutral-800/60 rounded-2xl overflow-hidden">
                  <div className="bg-[#0d0d0e] px-5 py-3 border-b border-neutral-800/60">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600">Enlace de invitación</p>
                  </div>
                  <div className="flex items-center gap-3 px-5 py-4">
                    <Link className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                    <p className="flex-1 text-sm text-neutral-400 font-mono truncate">{JOIN_BASE}{vm.group.code}</p>
                    <button
                      onClick={() => copyLink(vm.group!.code)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors whitespace-nowrap"
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => downloadQr(vm.group!.code, vm.group!.name)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors text-sm"
                >
                  <QrCode className="w-4 h-4" />
                  Descargar QR como SVG
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {tab === 'alumnos' && members.length > 0 && (
          <PaginationBar
            page={page} totalPages={totalPages}
            total={members.length} pageSize={PAGE_SIZE}
            onPrev={() => setPage(p => p - 1)}
            onNext={() => setPage(p => p + 1)}
            actions={<>
              <button
                onClick={() => vm.setShowAddMember(true)}
                className="group flex items-center gap-1.5 px-2 py-2 rounded-full bg-green-600 hover:bg-green-500 text-white transition-all duration-200"
              >
                <Plus className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="max-w-0 group-hover:max-w-[80px] overflow-hidden whitespace-nowrap text-[11px] font-semibold transition-all duration-200">
                  Agregar alumno
                </span>
              </button>
              <button
                onClick={() => setShowExport(true)}
                className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-colors whitespace-nowrap"
              >
                Exportar alumnos
                <span className="bg-blue-800/50 text-blue-100 text-[10px] font-bold px-1.5 py-0.5 rounded-md tracking-wide">⌘E</span>
              </button>
            </>}
          />
        )}
        </>
      )}

      {/* Drawer detalle alumno */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawer(null)}
            />
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-[420px] z-50 bg-[#0f0f10] border-l border-neutral-800 flex flex-col shadow-2xl overflow-y-auto"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            >
              {/* Header drawer */}
              <div className="flex-shrink-0 px-5 py-4 border-b border-neutral-800 flex items-center gap-3">
                <UserAvatar src={drawer.avatar} name={`${drawer.name} ${drawer.last_name}`}
                  className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center font-bold text-neutral-300 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{drawer.name} {drawer.last_name}</p>
                  <p className="text-neutral-500 text-xs">{drawer.email}</p>
                </div>
                <button
                  onClick={() => setDrawer(null)}
                  className="p-1.5 rounded-lg text-neutral-600 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Contenido drawer */}
              <div className="flex flex-col gap-5 px-5 py-5">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'ID de alumno', value: String(drawer.student_id) },
                    { label: 'Se unió',      value: formatDate(drawer.joined_at, true) },
                  ].map(s => (
                    <div key={s.label} className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-3 text-center">
                      <p className="text-white font-bold text-base leading-none">{s.value}</p>
                      <p className="text-neutral-600 text-[10px] mt-1.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Info */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl divide-y divide-neutral-800">
                  {[
                    { icon: <Mail className="w-3.5 h-3.5" />,     label: 'Correo',  value: drawer.email },
                    { icon: <Hash className="w-3.5 h-3.5" />,     label: 'ID',      value: String(drawer.student_id) },
                    { icon: <Calendar className="w-3.5 h-3.5" />, label: 'Registro',value: formatDate(drawer.joined_at, true) },
                    ...(drawer.phone_number ? [{ icon: <Phone className="w-3.5 h-3.5" />, label: 'Teléfono', value: `${drawer.dial_code ?? ''} ${drawer.phone_number}`.trim() }] : []),
                  ].map(row => (
                    <div key={row.label} className="flex items-center gap-3 px-4 py-3">
                      <span className="text-neutral-600">{row.icon}</span>
                      <span className="text-neutral-500 text-xs w-16 flex-shrink-0">{row.label}</span>
                      <span className="text-white text-xs font-medium truncate">{row.value}</span>
                    </div>
                  ))}
                  {/* Descripción */}
                  {drawer.description && (
                    <div className="flex items-start gap-3 px-4 py-3">
                      <span className="text-neutral-600 mt-0.5"><AlignLeft className="w-3.5 h-3.5" /></span>
                      <span className="text-neutral-500 text-xs w-16 flex-shrink-0 pt-0.5">Descripción</span>
                      <span className="text-white text-xs leading-relaxed">{drawer.description}</span>
                    </div>
                  )}
                  {/* OAuth provider */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <span className="text-neutral-600">
                      {drawer.oauth_provider === 'google' && (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"/><path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.777L1.24 17.35C3.198 21.302 7.27 24 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987z"/><path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21z"/><path fill="#FBBC05" d="M5.277 14.314A7.12 7.12 0 0 1 4.909 12c0-.81.137-1.588.368-2.314L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.24 5.35l4.037-3.036z"/></svg>
                      )}
                      {drawer.oauth_provider === 'github' && (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                      )}
                      {drawer.oauth_provider === 'email' && (
                        <Mail className="w-3.5 h-3.5" />
                      )}
                    </span>
                    <span className="text-neutral-500 text-xs w-16 flex-shrink-0">Sesión</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      drawer.oauth_provider === 'google' ? 'bg-red-500/10 text-red-400'
                      : drawer.oauth_provider === 'github' ? 'bg-neutral-700/60 text-neutral-300'
                      : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {drawer.oauth_provider === 'google' ? 'Google'
                        : drawer.oauth_provider === 'github' ? 'GitHub'
                        : 'Correo'}
                    </span>
                  </div>
                </div>

                {/* Acción */}
                <button
                  onClick={() => {
                    const toastId = sileo.action({
                      title: `¿Remover a ${drawer.name}?`,
                      description: (
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => sileo.dismiss(toastId)}
                            className="flex-1 py-1.5 rounded-lg text-xs font-semibold"
                            style={{ backgroundColor: '#2A2A2D', color: '#A1A1AA' }}
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => { sileo.dismiss(toastId); vm.removeMember(drawer.student_id); setDrawer(null) }}
                            className="flex-1 py-1.5 rounded-lg text-xs font-semibold"
                            style={{ backgroundColor: '#F43F5E', color: '#fff' }}
                          >
                            Remover
                          </button>
                        </div>
                      ),
                      ...TOAST_STYLE,
                    })
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/20 text-red-400 text-sm hover:bg-red-500/10 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  Remover del grupo
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal exportar alumnos */}
      <AnimatePresence>
        {showExport && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowExport(false)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 50 }} />
            <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 51, pointerEvents: 'none' }}>
              <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit"
                style={{ width: 360, padding: '28px 28px 24px', borderRadius: 16, backgroundColor: '#111113', border: '1px solid #2A2A2D', pointerEvents: 'auto' }}>
                <h3 style={{ color: '#F4F4F5', fontSize: 16, fontWeight: 600, margin: '0 0 6px 0' }}>Exportar alumnos</h3>
                <p style={{ color: '#52525B', fontSize: 13, margin: '0 0 24px 0' }}>Elige el formato de descarga</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  {([
                    { icon: '/assets/icons/pdf.svg',  label: 'PDF',   action: () => { exportPDF(members, vm.group!.name, vm.group!.subject, vm.group!.code); setShowExport(false) } },
                    { icon: '/assets/icons/csv.svg',  label: 'CSV',   action: () => { exportCSV(members, vm.group!.code); setShowExport(false) } },
                    { icon: '/assets/icons/xlsx.svg', label: 'Excel', action: () => { exportXLSX(members, vm.group!.code); setShowExport(false) } },
                  ] as const).map(opt => (
                    <button key={opt.label} onClick={opt.action}
                      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '18px 12px', borderRadius: 12, backgroundColor: '#0A0A0B', border: '1px solid #2A2A2D', cursor: 'pointer', transition: 'border-color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = '#3F3F46')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = '#2A2A2D')}
                    >
                      <img src={opt.icon} alt={opt.label} style={{ width: 32, height: 32 }} />
                      <span style={{ color: '#A1A1AA', fontSize: 12, fontWeight: 600 }}>{opt.label}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowExport(false)}
                  style={{ width: '100%', marginTop: 16, padding: '9px 0', borderRadius: 8, fontSize: 13, backgroundColor: '#1F1F22', border: '1px solid #2A2A2D', color: '#71717A', cursor: 'pointer' }}>
                  Cancelar
                </button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Modal agregar alumno */}
      <AnimatePresence>
        {vm.showAddMember && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => vm.setShowAddMember(false)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 50 }} />
            <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 51, pointerEvents: 'none' }}>
              <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit"
                style={{ width: 400, padding: '28px 28px 24px', borderRadius: 16, backgroundColor: '#111113', border: '1px solid #2A2A2D', pointerEvents: 'auto' }}>
                <h3 style={{ color: '#F4F4F5', fontSize: 16, fontWeight: 600, margin: '0 0 20px 0' }}>Agregar alumno</h3>

                {/* Selected user chip */}
                {vm.selectedUser ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, backgroundColor: '#0A0A0B', border: '1px solid #22C55E40', marginBottom: 16 }}>
                    <UserAvatar src={vm.selectedUser.profile_image} name={`${vm.selectedUser.name} ${vm.selectedUser.last_name}`}
                      style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: '#1F1F22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#A1A1AA', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#F4F4F5', fontSize: 13, fontWeight: 600, margin: 0 }}>{vm.selectedUser.name} {vm.selectedUser.last_name}</p>
                      <p style={{ color: '#52525B', fontSize: 11, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vm.selectedUser.email}</p>
                    </div>
                    <button onClick={() => { vm.setSelectedUser(null); vm.setUserSearch('') }}
                      style={{ background: 'none', border: 'none', color: '#52525B', cursor: 'pointer', padding: 2 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ) : (
                  <div style={{ position: 'relative', marginBottom: 4 }}>
                    <label style={{ color: '#71717A', fontSize: 12, display: 'block', marginBottom: 6 }}>Buscar por nombre, apellido o correo</label>
                    <input
                      autoFocus
                      type="text"
                      value={vm.userSearch}
                      onChange={e => vm.setUserSearch(e.target.value)}
                      placeholder="Ej. Sofía Ramírez"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 13, backgroundColor: '#0A0A0B', border: '1px solid #2A2A2D', color: '#F4F4F5', outline: 'none', boxSizing: 'border-box' }}
                    />

                    {/* Dropdown results */}
                    {vm.filteredUsers.length > 0 && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, backgroundColor: '#161618', border: '1px solid #2A2A2D', borderRadius: 8, overflow: 'hidden', zIndex: 10 }}>
                        {vm.filteredUsers.map(u => (
                          <button
                            key={u.id}
                            onClick={() => { vm.setSelectedUser(u); vm.setUserSearch('') }}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1F1F22')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <UserAvatar src={u.profile_image} name={`${u.name} ${u.last_name}`}
                              style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#2A2A2D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#A1A1AA', flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ color: '#F4F4F5', fontSize: 13, fontWeight: 500, margin: 0 }}>{u.name} {u.last_name}</p>
                              <p style={{ color: '#52525B', fontSize: 11, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {vm.userSearch.trim().length >= 2 && vm.filteredUsers.length === 0 && !vm.loadingUsers && (
                      <p style={{ color: '#52525B', fontSize: 12, marginTop: 8 }}>Sin resultados para "{vm.userSearch}"</p>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                  <button onClick={() => vm.setShowAddMember(false)}
                    style={{ flex: 1, padding: '9px 0', borderRadius: 8, fontSize: 13, backgroundColor: '#1F1F22', border: '1px solid #2A2A2D', color: '#A1A1AA', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                  <button onClick={vm.addMember} disabled={vm.saving || !vm.selectedUser}
                    style={{ flex: 1, padding: '9px 0', borderRadius: 8, fontSize: 13, fontWeight: 600, backgroundColor: vm.saving || !vm.selectedUser ? '#2A2A2D' : '#ffffff', color: vm.saving || !vm.selectedUser ? '#52525B' : '#0A0A0B', border: 'none', cursor: vm.saving || !vm.selectedUser ? 'not-allowed' : 'pointer' }}>
                    {vm.saving ? 'Agregando...' : 'Agregar'}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default GroupDetailView
