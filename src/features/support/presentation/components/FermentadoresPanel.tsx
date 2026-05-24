import { useState }              from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { sileo }                  from 'sileo'
import { cn }                     from '../../../../lib/utils'
import PaginationBar              from '../../../../shared/components/PaginationBar'
import { PAGE_SIZE }              from '../constants/pagination.constants'
import { FERMENTADOR_STATUS_STYLE } from '../constants/fermentador-status-style.constants'
import { RESPONSABLE_COLOR }      from '../constants/responsable-color.constants'
import { RESPONSABLE_INITIALS }   from '../constants/responsable-initials.constants'
import { MOCK_FERMENTADORES }     from '../constants/mock-fermentadores.constants'
import { formatDate }             from '../utils/format-date'
import { generateCode }           from '../utils/generate-code'
import { ResponsableAvatar }      from './ResponsableAvatar'
import type { CodigoStatus } from '../types/codigo-status.types'
import type { Fermentador }  from '../types/fermentador.types'

const FermentadoresPanel = () => {
  const [items, setItems]         = useState<Fermentador[]>(MOCK_FERMENTADORES)
  const [selected, setSelected]   = useState<Fermentador | null>(null)
  const [search, setSearch]       = useState('')
  const [page, setPage]           = useState(1)
  const [copied, setCopied]       = useState(false)
  const [generando, setGenerando] = useState(false)

  const vendidos  = items.filter(f => f.vendido).length
  const asignados = items.filter(f => f.codigoStatus === 'activo-asignado').length

  const filtered   = items.filter(f =>
    `${f.serial} ${f.clienteNombre ?? ''} ${f.altaPor} ${f.codigo}`.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleStatusChange = (id: string, newStatus: CodigoStatus) => {
    setItems(prev => prev.map(f => f.id === id ? { ...f, codigoStatus: newStatus } : f))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, codigoStatus: newStatus } : prev)
    sileo.success({ title: 'Estado actualizado', description: `${FERMENTADOR_STATUS_STYLE[newStatus].label}`, fill: '#1A1A1A', styles: { title: 'text-white', description: 'text-white' } })
  }

  const handleGenerarCodigo = () => {
    if (!selected) return
    setGenerando(true)
    setTimeout(() => {
      const codigo  = generateCode()
      const updated = { ...selected, codigo, codigoStatus: 'activo-libre' as CodigoStatus }
      setItems(prev => prev.map(i => i.id === updated.id ? updated : i))
      setSelected(updated)
      setGenerando(false)
      sileo.success({ title: 'Código generado', description: `${codigo} asignado a ${selected.serial}.`, fill: '#1A1A1A', styles: { title: 'text-white', description: 'text-white' } })
    }, 900)
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
            {filtered.length === 0 ? (
              <tr><td colSpan={6}>
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                  <svg className="w-10 h-10 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 3h6M9 3v6l-4 10h14l-4-10V3"/></svg>
                  <p className="text-neutral-600 text-sm">Sin resultados</p>
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
                  <span className={cn('text-xs font-mono font-bold tracking-wider', f.codigo !== '—' ? 'text-green-400' : 'text-neutral-700')}>{f.codigo}</span>
                </td>
                <td className="px-6 py-5">
                  <span className={cn('inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full border whitespace-nowrap',
                    f.vendido ? 'text-green-400 bg-green-400/10 border-green-400/30' : 'text-neutral-500 bg-neutral-800/40 border-neutral-700')}>
                    {f.vendido
                      ? <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                      : <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    }
                    {f.vendido ? 'Sí' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <select
                    value={f.codigoStatus}
                    onChange={e => handleStatusChange(f.id, e.target.value as CodigoStatus)}
                    onClick={e => e.stopPropagation()}
                    className={cn(
                      'text-[11px] font-medium px-3 py-1.5 rounded-full border appearance-none cursor-pointer outline-none transition-opacity hover:opacity-75 [&>option]:bg-neutral-950 [&>option]:text-white',
                      f.codigoStatus === 'activo-asignado' ? 'text-green-400 bg-neutral-950 border-green-400/30' :
                      f.codigoStatus === 'activo-libre'    ? 'text-blue-400 bg-neutral-950 border-blue-400/30'   :
                                                             'text-neutral-500 bg-neutral-950 border-neutral-700'
                    )}
                  >
                    <option value="activo-asignado">Asignado</option>
                    <option value="activo-libre">Disponible</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2.5">
                    <ResponsableAvatar name={f.altaPor} />
                    <span className="text-sm text-neutral-400">{f.altaPor}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button
                    onClick={() => setSelected(f)}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors opacity-0 group-hover:opacity-100 whitespace-nowrap"
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
      </div>

      <PaginationBar
        page={page} totalPages={totalPages} total={filtered.length} pageSize={PAGE_SIZE}
        onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)}
        actions={<>
          <button onClick={() => { setSearch(''); setPage(1) }}
            className="group flex items-center gap-1.5 px-2 py-2 rounded-full bg-neutral-700 hover:bg-neutral-600 text-white transition-all duration-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>
            <span className="max-w-0 group-hover:max-w-[56px] overflow-hidden whitespace-nowrap text-[11px] font-semibold transition-all duration-200">Limpiar</span>
          </button>
          <button onClick={() => sileo.success({ title: 'Inactivados', description: 'Fermentadores sin cliente marcados como inactivos.', fill: '#1A1A1A', styles: { title: 'text-white', description: 'text-white' } })}
            className="group flex items-center gap-1.5 px-2 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white transition-all duration-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            <span className="max-w-0 group-hover:max-w-[72px] overflow-hidden whitespace-nowrap text-[11px] font-semibold transition-all duration-200">Inactivar</span>
          </button>
          <button onClick={() => sileo.success({ title: 'Códigos generados', description: 'Códigos asignados a fermentadores disponibles.', fill: '#1A1A1A', styles: { title: 'text-white', description: 'text-white' } })}
            className="group flex items-center gap-1.5 px-2 py-2 rounded-full bg-green-600 hover:bg-green-500 text-white transition-all duration-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-4 0v2M12 12v4M10 14h4"/></svg>
            <span className="max-w-0 group-hover:max-w-[80px] overflow-hidden whitespace-nowrap text-[11px] font-semibold transition-all duration-200">Generar</span>
          </button>
          <button onClick={() => sileo.success({ title: 'Exportando', description: 'Inventario de fermentadores exportado.', fill: '#1A1A1A', styles: { title: 'text-white', description: 'text-white' } })}
            className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-full bg-green-600 hover:bg-green-500 text-white text-[11px] font-semibold transition-colors whitespace-nowrap">
            Exportar inventario
            <span className="bg-green-800/50 text-green-100 text-[10px] font-bold px-1.5 py-0.5 rounded-md tracking-wide">⌘E</span>
          </button>
        </>}
      />

      <AnimatePresence>
        {selected && (
          <>
            <motion.div className="absolute inset-0 bg-black/40 z-10"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)} />

            <motion.div
              className="absolute right-0 top-0 bottom-0 w-[460px] z-20 bg-[#0f0f10] border-l border-neutral-800 flex flex-col shadow-2xl"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            >
              <div className="flex-shrink-0 px-5 py-4 border-b border-neutral-800 flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: `${RESPONSABLE_COLOR[selected.altaPor]}20`, border: `1px solid ${RESPONSABLE_COLOR[selected.altaPor]}40`, color: RESPONSABLE_COLOR[selected.altaPor] }}
                  >
                    {RESPONSABLE_INITIALS[selected.altaPor]}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm font-mono">{selected.serial}</p>
                  <p className="text-neutral-500 text-xs">
                    Alta por <span className="text-neutral-400">{selected.altaPor}</span>
                  </p>
                </div>
                <button onClick={() => setSelected(null)}
                  className="p-1.5 rounded-lg text-neutral-600 hover:text-white hover:bg-neutral-800 transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn('text-xs px-2.5 py-1 rounded-full border bg-neutral-950', FERMENTADOR_STATUS_STYLE[selected.codigoStatus].text, FERMENTADOR_STATUS_STYLE[selected.codigoStatus].border)}>
                    {FERMENTADOR_STATUS_STYLE[selected.codigoStatus].label}
                  </span>
                  <span className={cn('text-xs px-2.5 py-1 rounded-full border bg-neutral-950', selected.vendido ? 'text-green-400 border-green-500/60' : 'text-neutral-500 border-neutral-700')}>
                    {selected.vendido ? 'Vendido' : 'En inventario'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Registro', value: formatDate(selected.creadoEn) },
                    { label: 'Vendido',  value: selected.vendido ? 'Sí' : 'No'  },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-center">
                      <p className="text-white font-bold text-base leading-none truncate">{value}</p>
                      <p className="text-neutral-600 text-[10px] mt-1">{label}</p>
                    </div>
                  ))}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 flex flex-col items-center justify-center gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                        style={{ backgroundColor: `${RESPONSABLE_COLOR[selected.altaPor]}20`, border: `1px solid ${RESPONSABLE_COLOR[selected.altaPor]}40`, color: RESPONSABLE_COLOR[selected.altaPor] }}
                      >
                        {RESPONSABLE_INITIALS[selected.altaPor]}
                      </div>
                      <span className="text-white font-bold text-xs leading-none truncate">{selected.altaPor.split(' ')[0]}</span>
                    </div>
                    <p className="text-neutral-600 text-[10px]">Alta por</p>
                  </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-white text-sm font-semibold">Código de activación</p>
                    <span className={cn('flex items-center gap-1.5 text-xs', FERMENTADOR_STATUS_STYLE[selected.codigoStatus].text)}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', FERMENTADOR_STATUS_STYLE[selected.codigoStatus].dot)} />
                      {FERMENTADOR_STATUS_STYLE[selected.codigoStatus].label}
                    </span>
                  </div>
                  {selected.codigo !== '—' ? (
                    <div className="flex items-center gap-2">
                      <code className="flex-1 font-mono text-sm font-bold text-green-400 tracking-widest bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2">
                        {selected.codigo}
                      </code>
                      <button onClick={() => handleCopy(selected.codigo)}
                        className="text-xs px-2.5 py-2 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors">
                        {copied ? '✓' : 'Copiar'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <p className="text-neutral-600 text-xs">Este fermentador no tiene código de activación.</p>
                      <button onClick={handleGenerarCodigo} disabled={generando}
                        className="self-start flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors disabled:opacity-50">
                        {generando
                          ? <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25"/><path fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                          : <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 4v16m8-8H4"/></svg>
                        }
                        {generando ? 'Generando...' : 'Generar código'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <p className="text-white text-sm font-semibold mb-3">Información del equipo</p>
                  <div className="flex flex-col gap-0">
                    {[
                      { label: 'Serial',            value: selected.serial },
                      { label: 'Fecha de registro', value: formatDate(selected.creadoEn) },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between py-2.5 border-b border-neutral-800">
                        <span className="text-neutral-500 text-xs">{label}</span>
                        <span className="text-white text-xs font-medium text-right max-w-[55%] truncate">{value}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between py-2.5 border-b border-neutral-800">
                      <span className="text-neutral-500 text-xs">Dado de alta por</span>
                      <div className="flex items-center gap-2">
                        <ResponsableAvatar name={selected.altaPor} />
                        <span className="text-white text-xs font-medium">{selected.altaPor}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2.5 border-b border-neutral-800">
                      <span className="text-neutral-500 text-xs">Cliente asignado</span>
                      {selected.clienteNombre ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-[11px] font-bold text-violet-400">
                            {selected.clienteNombre.split(' ').map(w => w[0]).slice(0, 2).join('')}
                          </div>
                          <span className="text-white text-xs font-medium">{selected.clienteNombre}</span>
                        </div>
                      ) : (
                        <span className="text-white text-xs font-medium">—</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FermentadoresPanel
