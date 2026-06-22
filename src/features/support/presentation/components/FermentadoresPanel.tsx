import { useMemo, useState }      from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn }                     from '../../../../lib/utils'
import PaginationBar              from '../../../../shared/components/PaginationBar'
import { PAGE_SIZE }              from '../constants/pagination.constants'
import { ESTADO_STYLE }          from '../constants/estado-style.constants'
import { formatDate }            from '../utils/format-date'
import { useFermentadoresViewModel } from '../viewmodels/useFermentadoresViewModel'
import type { Fermentador, FermentadorEstado } from '../../domain/models/Fermentador'

const AVATAR_COLORS = ['#22C55E', '#3B82F6', '#A78BFA', '#F59E0B', '#EC4899', '#14B8A6']

const initialsOf = (name: string | null): string =>
  name ? name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase() : '?'

const colorOf = (name: string | null): string => {
  if (!name) return '#52525B'
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

const Avatar = ({ name }: { name: string | null }) => {
  const color = colorOf(name)
  return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
      style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40`, color }}>
      {initialsOf(name)}
    </div>
  )
}

const FermentadoresPanel = () => {
  const { items, loading, register, updateField } = useFermentadoresViewModel()
  const [selected, setSelected] = useState<Fermentador | null>(null)
  const [search, setSearch]     = useState('')
  const [page, setPage]         = useState(1)
  const [copied, setCopied]     = useState(false)

  // Registro de un nuevo fermentador
  const [registerOpen, setRegisterOpen] = useState(false)
  const [registering,  setRegistering]  = useState(false)
  const [created,      setCreated]      = useState<Fermentador | null>(null)

  const vendidos  = items.filter(f => f.vendido).length
  const asignados = items.filter(f => f.estado === 'asignado').length

  const filtered = useMemo(() => items.filter(f =>
    `${f.serial} ${f.cliente_nombre ?? ''} ${f.alta_por ?? ''} ${f.codigo ?? ''}`.toLowerCase().includes(search.toLowerCase())
  ), [items, search])
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleEstado = (f: Fermentador, estado: FermentadorEstado) => {
    updateField(f.id, { estado })
    if (selected?.id === f.id) setSelected({ ...f, estado })
  }
  const handleVendido = (f: Fermentador) => {
    updateField(f.id, { vendido: !f.vendido })
    if (selected?.id === f.id) setSelected({ ...f, vendido: !f.vendido })
  }

  const closeRegister = () => { setRegisterOpen(false); setCreated(null) }
  const handleRegister = async () => {
    setRegistering(true)
    try { setCreated(await register()) } catch { /* ignore */ }
    finally { setRegistering(false) }
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative h-full flex flex-col overflow-hidden">

      <div className="flex-shrink-0 px-8 pt-6 pb-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-base">Fermentadores</h2>
          <div className="flex items-center gap-4 mt-1.5">
            <span className="flex items-center gap-1.5 text-xs text-neutral-600"><span className="w-1.5 h-1.5 rounded-full bg-green-400" />{vendidos} vendidos</span>
            <span className="flex items-center gap-1.5 text-xs text-neutral-600"><span className="w-1.5 h-1.5 rounded-full bg-blue-400" />{asignados} asignados</span>
            <span className="flex items-center gap-1.5 text-xs text-neutral-600"><span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />{items.length - vendidos} en inventario</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 focus-within:border-green-500/40 transition-colors">
          <svg className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Buscar fermentador..."
            className="bg-transparent text-xs text-white placeholder:text-neutral-600 outline-none w-44" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="border border-neutral-800/60 rounded-2xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0d0d0e] border-b border-neutral-800/60">
              {[
                { label: 'Fermentador', accent: false },
                { label: 'Código',      accent: true  },
                { label: 'Vendido',     accent: false },
                { label: 'Estado',      accent: true  },
                { label: 'Alta por',    accent: false },
                { label: '',            accent: false },
              ].map(h => (
                <th key={h.label} className={cn('px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider', h.accent ? 'text-green-500' : 'text-neutral-600')}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6}><div className="py-16 text-center text-neutral-600 text-sm">Cargando...</div></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6}>
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                  <svg className="w-10 h-10 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 3h6M9 3v6l-4 10h14l-4-10V3"/></svg>
                  <p className="text-neutral-600 text-sm">{items.length === 0 ? 'Sin fermentadores. Registra el primero.' : 'Sin resultados'}</p>
                </div>
              </td></tr>
            ) : paged.map(f => (
              <tr key={f.id} className="border-b border-neutral-900/60 hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-300">{f.serial.slice(-2)}</div>
                    <span className="text-sm text-white font-bold font-mono">{f.serial}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={cn('text-xs font-mono font-bold tracking-wider', f.codigo ? 'text-green-400' : 'text-neutral-700')}>{f.codigo ?? '—'}</span>
                </td>
                <td className="px-6 py-5">
                  <button onClick={() => handleVendido(f)}
                    className={cn('inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors hover:opacity-80',
                    f.vendido ? 'text-green-400 bg-green-400/10 border-green-400/30' : 'text-neutral-500 bg-neutral-800/40 border-neutral-700')}>
                    {f.vendido
                      ? <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                      : <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    }
                    {f.vendido ? 'Sí' : 'No'}
                  </button>
                </td>
                <td className="px-6 py-5">
                  <select
                    value={f.estado}
                    onChange={e => handleEstado(f, e.target.value as FermentadorEstado)}
                    onClick={e => e.stopPropagation()}
                    className={cn(
                      'text-[11px] font-medium px-3 py-1.5 rounded-full border appearance-none cursor-pointer outline-none transition-opacity hover:opacity-75 bg-neutral-950 [&>option]:bg-neutral-950 [&>option]:text-white',
                      ESTADO_STYLE[f.estado].text, ESTADO_STYLE[f.estado].border,
                    )}
                  >
                    <option value="asignado">Asignado</option>
                    <option value="disponible">Disponible</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={f.alta_por} />
                    <span className="text-sm text-neutral-400">{f.alta_por ?? '—'}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button onClick={() => setSelected(f)}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z"/></svg>
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <PaginationBar
        page={page} totalPages={totalPages} total={filtered.length} pageSize={PAGE_SIZE}
        onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)}
        actions={
          <button onClick={() => setRegisterOpen(true)}
            className="flex items-center gap-2 pl-3 pr-3 py-2 rounded-full bg-green-600 hover:bg-green-500 text-white text-[11px] font-semibold transition-colors whitespace-nowrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Registrar
          </button>
        }
      />

      {/* Detalle */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div className="absolute inset-0 bg-black/40 z-10"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)} />
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-[460px] z-20 bg-[#0f0f10] border-l border-neutral-800 flex flex-col shadow-2xl"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}>

              <div className="flex-shrink-0 px-5 py-4 border-b border-neutral-800 flex items-center gap-3">
                <Avatar name={selected.alta_por} />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm font-mono">{selected.serial}</p>
                  <p className="text-neutral-500 text-xs">Alta por <span className="text-neutral-400">{selected.alta_por ?? '—'}</span></p>
                </div>
                <button onClick={() => setSelected(null)}
                  className="p-1.5 rounded-lg text-neutral-600 hover:text-white hover:bg-neutral-800 transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn('text-xs px-2.5 py-1 rounded-full border bg-neutral-950', ESTADO_STYLE[selected.estado].text, ESTADO_STYLE[selected.estado].border)}>
                    {ESTADO_STYLE[selected.estado].label}
                  </span>
                  <button onClick={() => handleVendido(selected)}
                    className={cn('text-xs px-2.5 py-1 rounded-full border bg-neutral-950 transition-colors hover:opacity-80', selected.vendido ? 'text-green-400 border-green-500/60' : 'text-neutral-500 border-neutral-700')}>
                    {selected.vendido ? 'Vendido' : 'En inventario'}
                  </button>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <p className="text-white text-sm font-semibold mb-3">Código de activación</p>
                  {selected.codigo ? (
                    <div className="flex items-center gap-2">
                      <code className="flex-1 font-mono text-sm font-bold text-green-400 tracking-widest bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2">{selected.codigo}</code>
                      <button onClick={() => handleCopy(selected.codigo!)}
                        className="text-xs px-2.5 py-2 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors">
                        {copied ? '✓' : 'Copiar'}
                      </button>
                    </div>
                  ) : (
                    <p className="text-neutral-600 text-xs">Sin código de activación.</p>
                  )}
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <p className="text-white text-sm font-semibold mb-3">Información del equipo</p>
                  <div className="flex flex-col gap-0">
                    {[
                      { label: 'Serial',            value: selected.serial },
                      { label: 'Fecha de registro', value: selected.created_at ? formatDate(selected.created_at) : '—' },
                      { label: 'Vendido',           value: selected.vendido ? 'Sí' : 'No' },
                      { label: 'Cliente asignado',  value: selected.cliente_nombre ?? '—' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between py-2.5 border-b border-neutral-800 last:border-0 gap-3">
                        <span className="text-neutral-500 text-xs flex-shrink-0">{label}</span>
                        <span className="text-white text-xs font-medium text-right truncate">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Registrar */}
      <AnimatePresence>
        {registerOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={e => { if (e.target === e.currentTarget) closeRegister() }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
              style={{ background: '#111113', border: '1px solid #2a2a2d' }}>
              {!created ? (
                <>
                  <div>
                    <p className="text-white font-semibold">Registrar fermentador</p>
                    <p className="text-sm text-neutral-500 mt-1">Se generará un <span className="text-white">serial</span> y un <span className="text-white">código de activación</span> únicos.</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={closeRegister} disabled={registering}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:text-white transition-colors disabled:opacity-50" style={{ background: '#1a1a1d' }}>
                      Cancelar
                    </button>
                    <button onClick={handleRegister} disabled={registering}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60" style={{ background: '#22C55E', color: '#0A0A0B' }}>
                      {registering
                        ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#0A0A0B" strokeWidth="4" opacity=".25"/><path fill="#0A0A0B" d="M4 12a8 8 0 018-8v8z"/></svg>
                        : 'Registrar'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-white font-semibold">Fermentador registrado ✓</p>
                    <p className="text-sm text-neutral-500 mt-1"><span className="font-mono text-white">{created.serial}</span> — comparte el código para activarlo:</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 font-mono text-base font-bold text-green-400 tracking-widest bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-center">{created.codigo}</code>
                    <button onClick={() => created.codigo && handleCopy(created.codigo)}
                      className="text-xs px-3 py-2.5 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors">
                      {copied ? '✓' : 'Copiar'}
                    </button>
                  </div>
                  <button onClick={closeRegister} className="w-full py-2.5 rounded-xl text-sm font-semibold" style={{ background: '#22C55E', color: '#0A0A0B' }}>Listo</button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FermentadoresPanel
