import { useMemo, useState }      from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn }                     from '../../../../lib/utils'
import PaginationBar              from '../../../../shared/components/PaginationBar'
import { PAGE_SIZE }              from '../constants/pagination.constants'
import { ROLE_LABELS }            from '../constants/role-labels.constants'
import { formatDate }             from '../utils/format-date'
import { useAdminsViewModel }     from '../viewmodels/useAdminsViewModel'
import type { Admin }             from '../../domain/models/Admin'

const phoneOf = (a: Admin): string =>
  a.phone.number ? `${a.phone.dial_code ?? ''} ${a.phone.number}`.trim() : '—'

const initialsOf = (a: Admin): string =>
  `${a.name[0] ?? ''}${a.last_name[0] ?? ''}`.toUpperCase()

const circuitLabel = (a: Admin): string =>
  a.circuit.has_circuit ? (a.circuit.code ?? `#${a.circuit.id}`) : 'Sin circuito'

const ClientsPanel = () => {
  const { admins, loading, error } = useAdminsViewModel()
  const [selected, setSelected] = useState<Admin | null>(null)
  const [search, setSearch]     = useState('')
  const [page, setPage]         = useState(1)

  const filtered = useMemo(() => admins.filter(a =>
    `${a.name} ${a.last_name} ${a.email}`.toLowerCase().includes(search.toLowerCase())
  ), [admins, search])

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged       = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const withCircuit = admins.filter(a => a.circuit.has_circuit).length

  return (
    <div className="relative h-full flex flex-col overflow-hidden">

      <div className="flex-shrink-0 px-8 pt-6 pb-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-base">Administradores</h2>
          <div className="flex items-center gap-4 mt-1.5">
            <span className="flex items-center gap-1.5 text-xs text-neutral-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />{admins.length} en total
            </span>
            <span className="flex items-center gap-1.5 text-xs text-neutral-600">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />{withCircuit} con circuito
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 focus-within:border-green-500/40 transition-colors">
          <svg className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Buscar administrador..."
            className="bg-transparent text-xs text-white placeholder:text-neutral-600 outline-none w-44" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="border border-neutral-800/60 rounded-2xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0d0d0e] border-b border-neutral-800/60">
              {[
                { label: 'Administrador', accent: false },
                { label: 'Correo',        accent: false },
                { label: 'Teléfono',      accent: false },
                { label: 'Circuito',      accent: true  },
                { label: 'Registro',      accent: true  },
                { label: '',              accent: false },
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
            ) : error ? (
              <tr><td colSpan={6}><div className="py-16 text-center text-red-400/80 text-sm">No se pudo cargar la lista de administradores.</div></td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <svg className="w-10 h-10 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <p className="text-neutral-600 text-sm">{admins.length === 0 ? 'Sin administradores' : 'Sin resultados'}</p>
                  </div>
                </td>
              </tr>
            ) : paged.map(admin => (
              <tr key={admin.id} className="border-b border-neutral-900/60 hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3 min-w-0">
                    {admin.profile_image ? (
                      <img src={admin.profile_image} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 text-xs font-bold text-neutral-300">
                        {initialsOf(admin)}
                      </div>
                    )}
                    <span className="text-sm text-white font-semibold truncate">{admin.name} {admin.last_name}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm text-neutral-500 truncate block">{admin.email}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm text-neutral-500 whitespace-nowrap">{phoneOf(admin)}</span>
                </td>
                <td className="px-6 py-5">
                  {admin.circuit.has_circuit
                    ? <span className="font-mono text-sm text-neutral-300 whitespace-nowrap">{admin.circuit.code ?? `#${admin.circuit.id}`}</span>
                    : <span className="text-sm text-neutral-600">Sin circuito</span>}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1.5 text-neutral-500 text-xs whitespace-nowrap">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    {admin.created_at ? formatDate(admin.created_at) : '—'}
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button onClick={() => setSelected(admin)}
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
          <button onClick={() => { setSearch(''); setPage(1) }}
            className="group flex items-center gap-1.5 px-2 py-2 rounded-full bg-neutral-700 hover:bg-neutral-600 text-white transition-all duration-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>
            <span className="max-w-0 group-hover:max-w-[56px] overflow-hidden whitespace-nowrap text-[11px] font-semibold transition-all duration-200">Limpiar</span>
          </button>
        }
      />

      <AnimatePresence>
        {selected && (
          <>
            <motion.div className="absolute inset-0 bg-black/40 z-10"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)} />

            <motion.div
              className="absolute right-0 top-0 bottom-0 w-[460px] z-20 bg-[#0f0f10] border-l border-neutral-800 flex flex-col shadow-2xl overflow-y-auto"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}>

              <div className="flex-shrink-0 px-5 py-4 border-b border-neutral-800 flex items-center gap-3">
                {selected.profile_image ? (
                  <img src={selected.profile_image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center font-bold text-neutral-300">
                    {initialsOf(selected)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{selected.name} {selected.last_name}</p>
                  <p className="text-neutral-500 text-xs">{selected.email}</p>
                </div>
                <button onClick={() => setSelected(null)}
                  className="p-1.5 rounded-lg text-neutral-600 hover:text-white hover:bg-neutral-800 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-5 px-5 py-5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-neutral-500 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-full">
                    {ROLE_LABELS[selected.role.name] ?? selected.role.name}
                  </span>
                  <span className="text-xs text-neutral-500 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-full capitalize">
                    {selected.auth_provider}
                  </span>
                  <span className={cn('text-xs px-2.5 py-1 rounded-full border',
                    selected.circuit.has_circuit ? 'text-green-400 bg-neutral-950 border-green-500/60' : 'text-neutral-500 bg-neutral-950 border-neutral-700')}>
                    {selected.circuit.has_circuit ? `Circuito ${circuitLabel(selected)}` : 'Sin circuito'}
                  </span>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <p className="text-white text-sm font-semibold mb-3">Información personal</p>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { label: 'Nombre',    value: `${selected.name} ${selected.last_name}` },
                      { label: 'Correo',    value: selected.email },
                      { label: 'Teléfono',  value: phoneOf(selected) },
                      { label: 'Rol',       value: ROLE_LABELS[selected.role.name] ?? selected.role.name },
                      { label: 'Proveedor', value: selected.auth_provider },
                      { label: 'Registro',  value: selected.created_at ? formatDate(selected.created_at) : '—' },
                    ].map(f => (
                      <div key={f.label} className="flex items-center justify-between py-1.5 border-b border-neutral-800 last:border-0 gap-3">
                        <span className="text-neutral-500 text-xs flex-shrink-0">{f.label}</span>
                        <span className="text-white text-xs font-medium truncate text-right">{f.value}</span>
                      </div>
                    ))}
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

export default ClientsPanel
