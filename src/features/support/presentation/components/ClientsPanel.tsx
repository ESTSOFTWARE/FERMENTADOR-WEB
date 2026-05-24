import { useState }              from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { sileo }                  from 'sileo'
import { useSupportClientsStore, type SupportClient } from '../../../../core/store/useSupportClientsStore'
import { useSupportStore }        from '../../../../core/store/useSupportStore'
import { cn }                     from '../../../../lib/utils'
import PaginationBar              from '../../../../shared/components/PaginationBar'
import { PAGE_SIZE }              from '../constants/pagination.constants'
import { ROLE_LABELS }            from '../constants/role-labels.constants'
import { formatDate }             from '../utils/format-date'

const ClientsPanel = () => {
  const { clients, generateCode, toggleStatus } = useSupportClientsStore()
  const tickets = useSupportStore(s => s.tickets)
  const [selected, setSelected] = useState<SupportClient | null>(null)
  const [search, setSearch]     = useState('')
  const [copied, setCopied]     = useState(false)
  const [page, setPage]         = useState(1)

  const filtered   = clients.filter(c =>
    `${c.name} ${c.last_name} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const clientTickets    = selected ? tickets.filter(t => t.email === selected.email) : []
  const pendingTickets   = clientTickets.filter(t => t.status === 'pending').length
  const activeClients    = clients.filter(c => c.status === 'active').length

  const openClient = (c: SupportClient) => { setSelected(c); setCopied(false) }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGenerate = () => {
    if (!selected) return
    generateCode(selected.id)
    setSelected(s => s ? { ...s, codeStatus: 'used' } : null)
  }

  const handleToggle = () => {
    if (!selected) return
    toggleStatus(selected.id)
    setSelected(s => s ? { ...s, status: s.status === 'active' ? 'suspended' : 'active' } : null)
  }

  return (
    <div className="relative h-full flex flex-col overflow-hidden">

      <div className="flex-shrink-0 px-8 pt-6 pb-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-base">Usuarios registrados</h2>
          <div className="flex items-center gap-4 mt-1.5">
            <span className="flex items-center gap-1.5 text-xs text-neutral-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />{activeClients} activos
            </span>
            <span className="flex items-center gap-1.5 text-xs text-neutral-600">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />{clients.length - activeClients} suspendidos
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 focus-within:border-green-500/40 transition-colors">
          <svg className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Buscar usuario..."
            className="bg-transparent text-xs text-white placeholder:text-neutral-600 outline-none w-44" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="border border-neutral-800/60 rounded-2xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0d0d0e] border-b border-neutral-800/60">
              {[
                { label: 'Usuario', accent: false },
                { label: 'Correo',  accent: false },
                { label: 'Rol',     accent: false },
                { label: 'Estado',  accent: true  },
                { label: 'Código',  accent: true  },
                { label: '',        accent: false },
              ].map(h => (
                <th key={h.label} className={cn('px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider', h.accent ? 'text-green-500' : 'text-neutral-600')}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <svg className="w-10 h-10 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <p className="text-neutral-600 text-sm">Sin resultados</p>
                  </div>
                </td>
              </tr>
            ) : paged.map(client => (
              <tr key={client.id} className="border-b border-neutral-900/60 hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 text-xs font-bold text-neutral-300">
                      {client.name[0]}{client.last_name[0]}
                    </div>
                    <span className="text-sm text-white font-semibold truncate">{client.name} {client.last_name}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm text-neutral-500 truncate block">{client.email}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm text-neutral-400">{ROLE_LABELS[client.role] ?? client.role}</span>
                </td>
                <td className="px-6 py-5">
                  <span className={cn('inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full border whitespace-nowrap',
                    client.status === 'active'
                      ? 'text-green-400 bg-green-400/10 border-green-400/30'
                      : 'text-red-400 bg-red-400/10 border-red-400/30')}>
                    {client.status === 'active'
                      ? <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                      : <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    }
                    {client.status === 'active' ? 'Activo' : 'Suspendido'}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className={cn('text-xs font-mono font-bold tracking-wider',
                    client.activationCode ? 'text-green-400' : 'text-neutral-700')}>
                    {client.activationCode ?? '—'}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button onClick={() => openClient(client)}
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
        actions={<>
          <button onClick={() => { setSearch(''); setPage(1) }}
            className="group flex items-center gap-1.5 px-2 py-2 rounded-full bg-neutral-700 hover:bg-neutral-600 text-white transition-all duration-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>
            <span className="max-w-0 group-hover:max-w-[56px] overflow-hidden whitespace-nowrap text-[11px] font-semibold transition-all duration-200">Limpiar</span>
          </button>
          <button onClick={() => sileo.success({ title: 'Suspendidos', description: 'Usuarios inactivos suspendidos.', fill: '#1A1A1A', styles: { title: 'text-white', description: 'text-white' } })}
            className="group flex items-center gap-1.5 px-2 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white transition-all duration-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            <span className="max-w-0 group-hover:max-w-[72px] overflow-hidden whitespace-nowrap text-[11px] font-semibold transition-all duration-200">Suspender</span>
          </button>
          <button onClick={() => sileo.success({ title: 'Códigos generados', description: 'Códigos asignados a usuarios sin activar.', fill: '#1A1A1A', styles: { title: 'text-white', description: 'text-white' } })}
            className="group flex items-center gap-1.5 px-2 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-white transition-all duration-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-4 0v2M12 12v4M10 14h4"/></svg>
            <span className="max-w-0 group-hover:max-w-[80px] overflow-hidden whitespace-nowrap text-[11px] font-semibold transition-all duration-200">Generar</span>
          </button>
          <button onClick={() => sileo.success({ title: 'Exportando', description: 'Lista de usuarios exportada.', fill: '#1A1A1A', styles: { title: 'text-white', description: 'text-white' } })}
            className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-colors whitespace-nowrap">
            Exportar usuarios
            <span className="bg-blue-800/50 text-blue-100 text-[10px] font-bold px-1.5 py-0.5 rounded-md tracking-wide">⌘E</span>
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
              className="absolute right-0 top-0 bottom-0 w-[460px] z-20 bg-[#0f0f10] border-l border-neutral-800 flex flex-col shadow-2xl overflow-y-auto"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}>

              <div className="flex-shrink-0 px-5 py-4 border-b border-neutral-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center font-bold text-neutral-300">
                  {selected.name[0]}{selected.last_name[0]}
                </div>
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
                    {ROLE_LABELS[selected.role] ?? selected.role}
                  </span>
                  <span className={cn('text-xs px-2.5 py-1 rounded-full border',
                    selected.status === 'active' ? 'text-green-400 bg-neutral-950 border-green-500/60' : 'text-red-400 bg-neutral-950 border-red-500/60')}>
                    {selected.status === 'active' ? 'Activo' : 'Suspendido'}
                  </span>
                  <button onClick={handleToggle}
                    className={cn('ml-auto text-xs px-2.5 py-1 rounded-full border transition-colors',
                      selected.status === 'active'
                        ? 'text-red-400 border-red-400/20 hover:bg-red-400/10'
                        : 'text-green-400 border-green-400/20 hover:bg-green-400/10')}>
                    {selected.status === 'active' ? 'Suspender' : 'Reactivar'}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Registro',    value: formatDate(selected.createdAt) },
                    { label: 'Chats',       value: clientTickets.length.toString() },
                    { label: 'Pendientes',  value: pendingTickets.toString() },
                  ].map(s => (
                    <div key={s.label} className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-center">
                      <p className="text-white font-bold text-base leading-none">{s.value}</p>
                      <p className="text-neutral-600 text-[10px] mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-white text-sm font-semibold">Código de activación</p>
                    {selected.codeStatus === 'none' && (
                      <button onClick={handleGenerate}
                        className="text-xs px-2.5 py-1 rounded-lg bg-green-600 hover:bg-green-500 text-white border-transparent border transition-colors">
                        Generar
                      </button>
                    )}
                  </div>
                  {selected.activationCode ? (
                    <div className="flex items-center gap-2">
                      <code className="flex-1 font-mono text-sm font-bold text-green-400 tracking-widest bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2">
                        {selected.activationCode}
                      </code>
                      <button onClick={() => handleCopy(selected.activationCode!)}
                        className="text-xs px-2.5 py-2 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors">
                        {copied ? '✓' : 'Copiar'}
                      </button>
                    </div>
                  ) : (
                    <p className="text-neutral-600 text-sm">Sin código asignado.</p>
                  )}
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <p className="text-white text-sm font-semibold mb-3">Información personal</p>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { label: 'Nombre',   value: `${selected.name} ${selected.last_name}` },
                      { label: 'Correo',   value: selected.email },
                      { label: 'Rol',      value: ROLE_LABELS[selected.role] ?? selected.role },
                      { label: 'Registro', value: formatDate(selected.createdAt) },
                    ].map(f => (
                      <div key={f.label} className="flex items-center justify-between py-1.5 border-b border-neutral-800 last:border-0">
                        <span className="text-neutral-500 text-xs">{f.label}</span>
                        <span className="text-white text-xs font-medium">{f.value}</span>
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
