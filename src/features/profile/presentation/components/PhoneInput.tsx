import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'

type Country = { name: string; code: string; dialCode: string; flag: string }

const COUNTRIES: Country[] = [
  { name: 'México',               code: 'MX', dialCode: '+52',    flag: 'https://flagcdn.com/w40/mx.png' },
  { name: 'Estados Unidos',       code: 'US', dialCode: '+1',     flag: 'https://flagcdn.com/w40/us.png' },
  { name: 'España',               code: 'ES', dialCode: '+34',    flag: 'https://flagcdn.com/w40/es.png' },
  { name: 'Argentina',            code: 'AR', dialCode: '+54',    flag: 'https://flagcdn.com/w40/ar.png' },
  { name: 'Colombia',             code: 'CO', dialCode: '+57',    flag: 'https://flagcdn.com/w40/co.png' },
  { name: 'Chile',                code: 'CL', dialCode: '+56',    flag: 'https://flagcdn.com/w40/cl.png' },
  { name: 'Perú',                 code: 'PE', dialCode: '+51',    flag: 'https://flagcdn.com/w40/pe.png' },
  { name: 'Venezuela',            code: 'VE', dialCode: '+58',    flag: 'https://flagcdn.com/w40/ve.png' },
  { name: 'Ecuador',              code: 'EC', dialCode: '+593',   flag: 'https://flagcdn.com/w40/ec.png' },
  { name: 'Guatemala',            code: 'GT', dialCode: '+502',   flag: 'https://flagcdn.com/w40/gt.png' },
  { name: 'Cuba',                 code: 'CU', dialCode: '+53',    flag: 'https://flagcdn.com/w40/cu.png' },
  { name: 'Bolivia',              code: 'BO', dialCode: '+591',   flag: 'https://flagcdn.com/w40/bo.png' },
  { name: 'República Dominicana', code: 'DO', dialCode: '+1-809', flag: 'https://flagcdn.com/w40/do.png' },
  { name: 'Honduras',             code: 'HN', dialCode: '+504',   flag: 'https://flagcdn.com/w40/hn.png' },
  { name: 'Paraguay',             code: 'PY', dialCode: '+595',   flag: 'https://flagcdn.com/w40/py.png' },
  { name: 'El Salvador',          code: 'SV', dialCode: '+503',   flag: 'https://flagcdn.com/w40/sv.png' },
  { name: 'Nicaragua',            code: 'NI', dialCode: '+505',   flag: 'https://flagcdn.com/w40/ni.png' },
  { name: 'Costa Rica',           code: 'CR', dialCode: '+506',   flag: 'https://flagcdn.com/w40/cr.png' },
  { name: 'Panamá',               code: 'PA', dialCode: '+507',   flag: 'https://flagcdn.com/w40/pa.png' },
  { name: 'Uruguay',              code: 'UY', dialCode: '+598',   flag: 'https://flagcdn.com/w40/uy.png' },
  { name: 'Puerto Rico',          code: 'PR', dialCode: '+1-787', flag: 'https://flagcdn.com/w40/pr.png' },
]

type Props = {
  dialCode:    string
  phoneNumber: string
  onChange:    (dialCode: string, phoneNumber: string) => void
  disabled?:   boolean
}

export function PhoneInput({ dialCode, phoneNumber, onChange, disabled = false }: Props) {
  const [open,   setOpen]   = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const selected = COUNTRIES.find(c => c.dialCode === dialCode) ?? COUNTRIES[0]
  const filtered = COUNTRIES.filter(c => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return c.name.toLowerCase().includes(q) || c.dialCode.includes(q) || c.code.toLowerCase().includes(q)
  })

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="flex gap-2">
      {/* selector de país */}
      <div ref={ref} className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => { setOpen(o => !o); setSearch('') }}
          className="h-full px-3 py-[11px] bg-[#0A0A0B] border border-[#2A2A2D] rounded-[10px] text-[#F4F4F5] flex items-center gap-2 min-w-[110px] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#3F3F46] transition-colors"
        >
          <img src={selected.flag} alt={selected.name} className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
          <span className="text-[13px] font-medium">{selected.dialCode}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-[#52525B] ml-auto transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute top-full left-0 mt-1 w-72 bg-[#111113] border border-[#2A2A2D] rounded-[10px] shadow-2xl z-50">
            <div className="p-2 border-b border-[#1F1F22]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#52525B]" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar país o código..."
                  className="w-full pl-8 pr-3 py-2 bg-[#0A0A0B] border border-[#2A2A2D] rounded-lg text-[#F4F4F5] text-[12px] placeholder:text-[#3F3F46] focus:outline-none focus:border-[#22C55E] transition-colors"
                />
              </div>
            </div>

            <div className="max-h-52 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#22C55E] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              {filtered.length === 0 ? (
                <p className="px-4 py-6 text-center text-[#52525B] text-[12px]">Sin resultados</p>
              ) : filtered.map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => { onChange(c.dialCode, phoneNumber); setOpen(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#1A1A1D] transition-colors border-b border-[#17171A] last:border-0 ${c.code === selected.code ? 'bg-[#22C55E08]' : ''}`}
                >
                  <img src={c.flag} alt={c.name} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                  <span className="flex-1 text-[#F4F4F5] text-[12px] font-medium">{c.name}</span>
                  <span className="text-[#52525B] text-[11px] font-mono">{c.dialCode}</span>
                  {c.code === selected.code && <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* número */}
      <input
        type="tel"
        value={phoneNumber}
        onChange={e => onChange(dialCode, e.target.value.replace(/\D/g, '').slice(0, 10))}
        disabled={disabled}
        placeholder="Nro. de teléfono"
        maxLength={10}
        className="flex-1 bg-[#0A0A0B] border border-[#2A2A2D] rounded-[10px] text-[#F4F4F5] text-[13px] px-3.5 py-[11px] placeholder:text-[#3F3F46] focus:outline-none focus:border-[#22C55E] focus:shadow-[0_0_0_3px_rgba(34,197,94,0.08)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      />
    </div>
  )
}
