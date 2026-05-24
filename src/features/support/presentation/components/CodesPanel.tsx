import { useState }             from 'react'
import { useSupportClientsStore } from '../../../../core/store/useSupportClientsStore'
import { cn }                    from '../../../../lib/utils'
import { formatDateTime }        from '../utils/format-date-time'

const CodesPanel = () => {
  const { clients, codes, generateCode } = useSupportClientsStore()
  const [selectedClient, setSelectedClient] = useState('')
  const [search, setSearch]                 = useState('')
  const [copiedId, setCopiedId]             = useState<string | null>(null)
  const [generated, setGenerated]           = useState<string | null>(null)

  const handleGenerate = () => {
    if (!selectedClient) return
    const code = generateCode(selectedClient)
    setGenerated(code)
    setSelectedClient('')
    setTimeout(() => setGenerated(null), 4000)
  }

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredCodes = codes.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    (c.assignedEmail ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const clientsWithoutCode = clients.filter(c => c.codeStatus === 'none')

  return (
    <div className="h-full flex flex-col overflow-hidden">

      <div className="flex-shrink-0 px-8 pt-6 pb-5 border-b border-neutral-900 flex items-center gap-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-base">Códigos de activación</h2>
          <p className="text-neutral-500 text-sm mt-0.5">Genera y administra códigos para activar cuentas de usuarios</p>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          {[
            { label: 'Generados',  value: codes.length },
            { label: 'Asignados',  value: codes.filter(c => c.assignedTo).length },
            { label: 'Sin código', value: clientsWithoutCode.length },
          ].map(stat => (
            <div key={stat.label} className="text-center px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl">
              <p className="text-white font-bold text-xl leading-none">{stat.value}</p>
              <p className="text-neutral-600 text-[10px] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 px-8 py-4 border-b border-neutral-900 flex items-center gap-3">
        {generated && (
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2 mr-2">
            <svg className="w-3.5 h-3.5 text-green-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <code className="text-green-300 font-mono font-bold text-sm tracking-widest">{generated}</code>
          </div>
        )}
        <select
          value={selectedClient}
          onChange={e => setSelectedClient(e.target.value)}
          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-green-500/40 transition-colors appearance-none"
        >
          <option value="">Seleccionar usuario para generar código...</option>
          {clients.filter(c => c.codeStatus === 'none').map(c => (
            <option key={c.id} value={c.id}>
              {c.name} {c.last_name} — {c.email}
            </option>
          ))}
        </select>
        <button
          onClick={handleGenerate}
          disabled={!selectedClient}
          className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
          </svg>
          Generar código
        </button>
      </div>

      <div className="flex-shrink-0 px-8 py-3 border-b border-neutral-900 flex items-center justify-between">
        <div className="grid grid-cols-4 gap-4 flex-1 text-[11px] font-semibold text-neutral-600 uppercase tracking-wider">
          <span>Código</span>
          <span>Usuario</span>
          <span>Fecha</span>
          <span>Estado</span>
        </div>
        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 focus-within:border-green-500/40 transition-colors">
          <svg className="w-3 h-3 text-neutral-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="bg-transparent text-xs text-white placeholder:text-neutral-600 outline-none w-32" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredCodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 h-full text-center">
            <svg className="w-10 h-10 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
            </svg>
            <p className="text-neutral-600 text-sm">{codes.length === 0 ? 'Aún no se han generado códigos' : 'Sin resultados'}</p>
          </div>
        ) : (
          filteredCodes.map(code => (
            <div key={code.id} className="px-8 py-3.5 border-b border-neutral-900 hover:bg-neutral-900/40 transition-colors grid grid-cols-4 gap-4 items-center">
              <code className="font-mono text-sm font-bold text-green-400 tracking-widest">{code.code}</code>
              <div className="min-w-0">
                <p className="text-neutral-300 text-sm truncate">{code.assignedEmail ?? '—'}</p>
              </div>
              <p className="text-neutral-600 text-xs">{formatDateTime(code.createdAt)}</p>
              <div className="flex items-center gap-3">
                <span className={cn('text-[10px] px-2.5 py-1 rounded-full border',
                  code.status === 'available' ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-neutral-500 bg-neutral-800/60 border-neutral-700')}>
                  {code.status === 'available' ? 'Disponible' : 'Usado'}
                </span>
                <button onClick={() => handleCopy(code.id, code.code)}
                  className="text-xs text-neutral-600 hover:text-white transition-colors px-2 py-1 rounded border border-transparent hover:border-neutral-700">
                  {copiedId === code.id ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CodesPanel
