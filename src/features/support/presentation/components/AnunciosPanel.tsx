import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { sileo } from 'sileo'
import { cn } from '../../../../lib/utils'
import { linkify } from '../../../../shared/utils/linkify'
import PaginationBar from '../../../../shared/components/PaginationBar'

const PAGE_SIZE = 10

interface Announcement {
  id:           number
  label:        string
  version:      string
  date:         string
  title:        string
  description:  string
  is_pinned:    boolean
  pinned_until: string | null
}

const BASE_URL = import.meta.env.VITE_API_URL

const authHeaders = () => ({
  'Content-Type':               'application/json',
  'ngrok-skip-browser-warning': 'true',
  Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
})

const LABEL_COLORS: Record<string, string> = {
  NUEVO:   '#22C55E',
  MEJORA:  '#3B82F6',
  AVISO:   '#F59E0B',
  CRÍTICO: '#F43F5E',
  CRITICO: '#F43F5E',
}
const labelColor = (l: string) => LABEL_COLORS[l.toUpperCase()] ?? '#A855F7'

const LABEL_OPTIONS = ['NUEVO', 'MEJORA', 'AVISO', 'CRÍTICO']
const EMPTY_FORM    = { label: 'NUEVO', version: '', date: '', title: '', description: '' }

const LabelBadge = ({ label }: { label: string }) => {
  const color = labelColor(label)
  return (
    <span
      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ color, backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
    >
      {label}
    </span>
  )
}

const AnunciosPanel = () => {
  const [items, setItems]           = useState<Announcement[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [showForm, setShowForm]     = useState(false)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [saving, setSaving]         = useState(false)
  const [saveError, setSaveError]   = useState<string | null>(null)
  const [selected, setSelected]     = useState<Announcement | null>(null)
  const [editing, setEditing]       = useState(false)
  const [editForm, setEditForm]     = useState(EMPTY_FORM)
  const [savingEdit, setSavingEdit] = useState(false)
  const [editError, setEditError]   = useState<string | null>(null)
  const [page, setPage]             = useState(1)
  const [pinning, setPinning]       = useState(false)

  const isPinActive = (item: Announcement) => {
    if (!item.is_pinned) return false
    if (!item.pinned_until) return true
    return new Date(item.pinned_until) > new Date()
  }

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const paged      = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const load = () => {
    setLoading(true); setError(null)
    fetch(`${BASE_URL}/announcements/`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : r.json().then((d: { detail?: string }) => Promise.reject(d?.detail ?? `HTTP ${r.status}`)))
      .then(setItems)
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleCreate = async () => {
    if (!form.title.trim() || !form.version.trim() || !form.description.trim()) {
      setSaveError('Título, versión y descripción son obligatorios.'); return
    }
    setSaving(true); setSaveError(null)
    try {
      const res = await fetch(`${BASE_URL}/announcements/`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          label:       form.label,
          version:     form.version.trim(),
          date:        form.date.trim() || undefined,
          title:       form.title.trim(),
          description: form.description.trim(),
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d?.detail ?? `HTTP ${res.status}`)
      }
      setForm(EMPTY_FORM); setShowForm(false)
      sileo.success({ title: 'Comunicado publicado', description: 'Ya es visible para todos los usuarios.', fill: '#1A1A1A', styles: { title: 'text-white', description: 'text-white' } })
      load()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Error al crear el anuncio.')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = (item: Announcement) => {
    const toastId = sileo.action({
      title: 'Eliminar comunicado',
      description: (
        <div className="flex flex-col gap-2">
          <span style={{ color: '#A1A1AA', fontSize: 12 }}>
            ¿Seguro que quieres eliminar "{item.title}"? Esta acción no se puede deshacer.
          </span>
          <button
            onPointerDown={e => { e.stopPropagation(); sileo.dismiss(toastId) }}
            style={{ fontSize: 11, color: '#52525B', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            No, mantener comunicado
          </button>
        </div>
      ),
      fill:     '#1A1A1A',
      duration: null,
      styles:   { title: 'text-white' },
      button: {
        title:   'Eliminar',
        onClick: () => { sileo.dismiss(toastId); executeDelete(item.id) },
      },
    })
  }

  const executeDelete = async (id: number) => {
    try {
      await fetch(`${BASE_URL}/announcements/${id}`, { method: 'DELETE', headers: authHeaders() })
      setItems(prev => prev.filter(i => i.id !== id))
      if (selected?.id === id) setSelected(null)
      sileo.success({ title: 'Comunicado eliminado', fill: '#1A1A1A', styles: { title: 'text-white' } })
    } catch {
      sileo.error({ title: 'Error al eliminar', description: 'Intenta de nuevo.', fill: '#1A1A1A', styles: { title: 'text-white', description: 'text-white' } })
    }
  }

  const handlePin = async (item: Announcement, durationDays: number | null) => {
    setPinning(true)
    try {
      const res = await fetch(`${BASE_URL}/announcements/${item.id}/pin`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ duration_days: durationDays }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const updated: Announcement = await res.json()
      setItems(prev => prev.map(i => i.id === updated.id ? updated : i))
      setSelected(updated)
      sileo.success({ title: 'Comunicado fijado', description: durationDays ? `Se desfijará en ${durationDays} día${durationDays > 1 ? 's' : ''}.` : 'Fijado indefinidamente.', fill: '#1A1A1A', styles: { title: 'text-white', description: 'text-white' } })
    } catch {
      sileo.error({ title: 'Error al fijar', fill: '#1A1A1A', styles: { title: 'text-white' } })
    } finally {
      setPinning(false)
    }
  }

  const handleUnpin = async (item: Announcement) => {
    setPinning(true)
    try {
      const res = await fetch(`${BASE_URL}/announcements/${item.id}/pin`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const updated: Announcement = await res.json()
      setItems(prev => prev.map(i => i.id === updated.id ? updated : i))
      setSelected(updated)
      sileo.success({ title: 'Comunicado desfijado', fill: '#1A1A1A', styles: { title: 'text-white' } })
    } catch {
      sileo.error({ title: 'Error al desfijar', fill: '#1A1A1A', styles: { title: 'text-white' } })
    } finally {
      setPinning(false)
    }
  }

  const openEdit = (item: Announcement) => {
    setEditForm({ label: item.label, version: item.version, date: item.date, title: item.title, description: item.description })
    setEditError(null)
    setEditing(true)
  }

  const handleSaveEdit = async () => {
    if (!editForm.title.trim() || !editForm.version.trim() || !editForm.description.trim()) {
      setEditError('Título, versión y descripción son obligatorios.'); return
    }
    if (!selected) return
    setSavingEdit(true); setEditError(null)
    try {
      const res = await fetch(`${BASE_URL}/announcements/${selected.id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          label:       editForm.label,
          version:     editForm.version.trim(),
          date:        editForm.date.trim() || undefined,
          title:       editForm.title.trim(),
          description: editForm.description.trim(),
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d?.detail ?? `HTTP ${res.status}`)
      }
      const updated: Announcement = await res.json()
      setItems(prev => prev.map(i => i.id === updated.id ? updated : i))
      setSelected(updated)
      setEditing(false)
      sileo.success({ title: 'Comunicado actualizado', fill: '#1A1A1A', styles: { title: 'text-white' } })
    } catch (e) {
      setEditError(e instanceof Error ? e.message : 'Error al actualizar.')
    } finally {
      setSavingEdit(false)
    }
  }

  const inputCls = 'bg-[#0A0A0B] border border-neutral-800 rounded-lg px-3 py-2 text-white text-xs placeholder-neutral-700 focus:outline-none focus:border-green-500/50'

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">

      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-white text-sm font-semibold">Comunicados</h2>
          <p className="text-neutral-600 text-xs mt-0.5">Avisos y novedades visibles para todos los usuarios</p>
        </div>
        <button
          onClick={() => { setShowForm(v => !v); setSaveError(null) }}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
            showForm
              ? 'bg-neutral-800 text-neutral-400'
              : 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
          )}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d={showForm ? 'M6 18L18 6M6 6l12 12' : 'M12 4v16m8-8H4'} />
          </svg>
          {showForm ? 'Cancelar' : 'Nuevo comunicado'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">

        {/* Formulario de creación */}
        {showForm && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col gap-4">
            <p className="text-white text-xs font-semibold">Nuevo comunicado</p>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-500 text-[10px] uppercase tracking-widest">Tipo</label>
                <select value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} className={inputCls}>
                  {LABEL_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-500 text-[10px] uppercase tracking-widest">Versión</label>
                <input value={form.version} onChange={e => setForm(p => ({ ...p, version: e.target.value }))} placeholder="v1.2" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-500 text-[10px] uppercase tracking-widest">Fecha (opcional)</label>
                <input value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} placeholder="Jun 2025" className={inputCls} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-500 text-[10px] uppercase tracking-widest">Título</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Nombre del comunicado" className={inputCls} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-500 text-[10px] uppercase tracking-widest">Descripción</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Descripción del comunicado..." rows={3} className={`${inputCls} resize-none`} />
            </div>

            {saveError && <p className="text-red-400 text-xs">{saveError}</p>}

            {/* Preview */}
            <div className="border-t border-neutral-800 pt-4">
              <p className="text-neutral-600 text-[10px] uppercase tracking-widest mb-3">Vista previa</p>
              <div className="relative bg-[#111113] border border-neutral-800 rounded-xl p-4 overflow-hidden">
                <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full opacity-60" style={{ backgroundColor: labelColor(form.label) }} />
                <div className="pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <LabelBadge label={form.label} />
                    <span className="text-neutral-700 text-[10px] font-mono">{form.version || 'v?'}</span>
                    <span className="text-neutral-800 text-[10px]">·</span>
                    <span className="text-neutral-700 text-[10px]">{form.date || 'Fecha'}</span>
                  </div>
                  <p className="text-neutral-200 text-xs font-semibold mb-1">{form.title || 'Título del comunicado'}</p>
                  <p className="text-neutral-500 text-[11px] leading-relaxed">{form.description ? linkify(form.description) : 'Descripción...'}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleCreate} disabled={saving}
              className="self-end flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-black text-xs font-semibold disabled:opacity-50 hover:bg-green-400 transition-colors"
            >
              {saving
                ? <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25"/><path fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                : <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 4v16m8-8H4"/></svg>
              }
              {saving ? 'Publicando...' : 'Publicar comunicado'}
            </button>
          </div>
        )}

        {/* Lista */}
        {loading && (
          <div className="flex justify-center pt-12">
            <svg className="animate-spin w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#2A2A2D" strokeWidth="4"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        )}

        {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-xs">{error}</div>}

        {!loading && !error && items.length === 0 && (
          <div className="text-center pt-16 text-neutral-600 text-sm">No hay comunicados publicados.</div>
        )}

        {!loading && !error && paged.map(item => {
          const color  = labelColor(item.label)
          const pinned = isPinActive(item)
          return (
            <div
              key={item.id}
              onClick={() => { setSelected(item); setEditing(false) }}
              className={cn(
                'relative border rounded-xl p-4 overflow-hidden group cursor-pointer transition-colors',
                pinned
                  ? 'bg-[#111113] border-amber-500/25 hover:border-amber-500/50'
                  : 'bg-[#111113] border-neutral-900 hover:border-neutral-700'
              )}
            >
              <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full opacity-60" style={{ backgroundColor: color }} />
              <div className="pl-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <LabelBadge label={item.label} />
                    {pinned && (
                      <span title="Comunicado fijado">
                        <svg className="w-3 h-3" viewBox="0 0 17.021 17.021" fill="#FBBF24">
                          <path d="M16.436,4.599l-3.998-4.02c-0.752-0.756-2.063-0.764-2.83-0.006C9.412,0.769,9.258,1.009,9.19,1.202C8.537,2.564,7.836,3.417,6.936,3.929L6.719,4.034C5.751,4.519,4.434,5.013,2,5.013c-0.266,0-0.521,0.052-0.766,0.152C0.75,5.367,0.355,5.76,0.152,6.249c-0.199,0.484-0.199,1.041,0,1.525c0.104,0.249,0.25,0.471,0.435,0.651l3.235,3.235L0,17.013l5.352-3.822l3.227,3.227c0.186,0.189,0.406,0.339,0.656,0.441c0.247,0.103,0.503,0.154,0.766,0.154s0.519-0.052,0.765-0.154c0.498-0.205,0.883-0.592,1.08-1.078c0.103-0.242,0.155-0.507,0.155-0.768c0-2.436,0.494-3.752,0.978-4.721c0.496-0.992,1.369-1.748,2.754-2.414c0.271-0.104,0.51-0.256,0.711-0.457C17.216,6.639,17.212,5.37,16.436,4.599z M11.188,9.4c-0.819,1.643-1.188,3.37-1.195,5.604L2,7.013c2.139,0,3.814-0.335,5.396-1.084l0.235-0.105c1.399-0.699,2.468-1.893,3.388-3.834l3.924,4.051C13.08,6.934,11.887,8.001,11.188,9.4z"/>
                        </svg>
                      </span>
                    )}
                    <span className="text-neutral-600 text-[10px] font-mono">{item.version}</span>
                    <span className="text-neutral-800 text-[10px]">·</span>
                    <span className="text-neutral-600 text-[10px]">{item.date}</span>
                  </div>
                  <p className="text-neutral-200 text-xs font-semibold mb-1">{item.title}</p>
                  <p className="text-neutral-500 text-[11px] leading-relaxed line-clamp-2">{item.description}</p>
                </div>

                {/* Acciones — visibles en hover */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 flex-shrink-0 transition-opacity" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => { setSelected(item); openEdit(item) }}
                    className="p-1.5 rounded-lg text-neutral-600 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                    title="Editar"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => confirmDelete(item)}
                    className="p-1.5 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Drawer de detalle / edición ── */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              className="absolute inset-0 bg-black/40 z-10"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setSelected(null); setEditing(false) }}
            />

            <motion.div
              className="absolute right-0 top-0 bottom-0 w-[460px] z-20 bg-[#0f0f10] border-l border-neutral-800 flex flex-col shadow-2xl"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            >
              {/* Drawer header */}
              <div className="flex-shrink-0 px-5 py-4 border-b border-neutral-800 flex items-center gap-3">
                <LabelBadge label={editing ? editForm.label : selected.label} />
                <span className="flex-1 text-white text-sm font-semibold truncate">
                  {editing ? 'Editar comunicado' : selected.title}
                </span>
                <div className="flex items-center gap-1">
                  {!editing && (
                    <button
                      onClick={() => openEdit(selected)}
                      className="p-1.5 rounded-lg text-neutral-600 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                      title="Editar"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                  )}
                  {!editing && (
                    <button
                      onClick={() => confirmDelete(selected)}
                      className="p-1.5 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      title="Eliminar"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => { setSelected(null); setEditing(false) }}
                    className="p-1.5 rounded-lg text-neutral-600 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Drawer body */}
              <div className="flex-1 overflow-y-auto p-5">
                {!editing ? (
                  /* Vista detalle */
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                      <LabelBadge label={selected.label} />
                      <span className="text-neutral-500 text-xs font-mono">{selected.version}</span>
                      <span className="text-neutral-700 text-xs">·</span>
                      <span className="text-neutral-500 text-xs">{selected.date}</span>
                    </div>

                    <div>
                      <p className="text-white font-semibold text-sm mb-1">{selected.title}</p>
                      <div
                        className="h-[3px] w-10 rounded-full opacity-60"
                        style={{ backgroundColor: labelColor(selected.label) }}
                      />
                    </div>

                    <p className="text-neutral-400 text-xs leading-relaxed">
                      {linkify(selected.description)}
                    </p>

                    {/* ── Sección de fijado ── */}
                    <div className="border-t border-neutral-800 pt-4 flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 17.021 17.021" fill="#FBBF24">
                          <path d="M16.436,4.599l-3.998-4.02c-0.752-0.756-2.063-0.764-2.83-0.006C9.412,0.769,9.258,1.009,9.19,1.202C8.537,2.564,7.836,3.417,6.936,3.929L6.719,4.034C5.751,4.519,4.434,5.013,2,5.013c-0.266,0-0.521,0.052-0.766,0.152C0.75,5.367,0.355,5.76,0.152,6.249c-0.199,0.484-0.199,1.041,0,1.525c0.104,0.249,0.25,0.471,0.435,0.651l3.235,3.235L0,17.013l5.352-3.822l3.227,3.227c0.186,0.189,0.406,0.339,0.656,0.441c0.247,0.103,0.503,0.154,0.766,0.154s0.519-0.052,0.765-0.154c0.498-0.205,0.883-0.592,1.08-1.078c0.103-0.242,0.155-0.507,0.155-0.768c0-2.436,0.494-3.752,0.978-4.721c0.496-0.992,1.369-1.748,2.754-2.414c0.271-0.104,0.51-0.256,0.711-0.457C17.216,6.639,17.212,5.37,16.436,4.599z M11.188,9.4c-0.819,1.643-1.188,3.37-1.195,5.604L2,7.013c2.139,0,3.814-0.335,5.396-1.084l0.235-0.105c1.399-0.699,2.468-1.893,3.388-3.834l3.924,4.051C13.08,6.934,11.887,8.001,11.188,9.4z"/>
                        </svg>
                        <span className="text-neutral-400 text-xs font-medium">Fijar comunicado</span>
                        {isPinActive(selected) && (
                          <span className="ml-auto text-[10px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                            Fijado
                          </span>
                        )}
                      </div>

                      {isPinActive(selected) ? (
                        <div className="flex flex-col gap-2">
                          {selected.pinned_until && (
                            <p className="text-neutral-600 text-[11px]">
                              Expira: {new Date(selected.pinned_until).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          )}
                          {!selected.pinned_until && (
                            <p className="text-neutral-600 text-[11px]">Sin fecha de expiración</p>
                          )}
                          <button
                            onClick={() => handleUnpin(selected)}
                            disabled={pinning}
                            className="self-start flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-neutral-400 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 transition-colors"
                          >
                            {pinning
                              ? <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25"/><path fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                              : <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            }
                            Desfijar ahora
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { label: '1 día',   days: 1   },
                            { label: '7 días',  days: 7   },
                            { label: '30 días', days: 30  },
                            { label: 'Sin límite', days: null },
                          ].map(opt => (
                            <button
                              key={opt.label}
                              onClick={() => handlePin(selected, opt.days)}
                              disabled={pinning}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-neutral-400 bg-neutral-800 hover:bg-amber-500/15 hover:text-amber-300 hover:border-amber-500/30 border border-neutral-700 disabled:opacity-50 transition-colors"
                            >
                              {pinning
                                ? <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25"/><path fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                                : null
                              }
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Formulario de edición */
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-neutral-500 text-[10px] uppercase tracking-widest">Tipo</label>
                        <select value={editForm.label} onChange={e => setEditForm(p => ({ ...p, label: e.target.value }))} className={inputCls}>
                          {LABEL_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-neutral-500 text-[10px] uppercase tracking-widest">Versión</label>
                        <input value={editForm.version} onChange={e => setEditForm(p => ({ ...p, version: e.target.value }))} className={inputCls} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-neutral-500 text-[10px] uppercase tracking-widest">Fecha</label>
                        <input value={editForm.date} onChange={e => setEditForm(p => ({ ...p, date: e.target.value }))} placeholder="Jun 2025" className={inputCls} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-neutral-500 text-[10px] uppercase tracking-widest">Título</label>
                      <input value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} className={inputCls} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-neutral-500 text-[10px] uppercase tracking-widest">Descripción</label>
                      <textarea value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} rows={5} className={`${inputCls} resize-none`} />
                    </div>

                    {editError && <p className="text-red-400 text-xs">{editError}</p>}
                  </div>
                )}
              </div>

              {/* Drawer footer — solo en modo edición */}
              {editing && (
                <div className="flex-shrink-0 px-5 py-4 border-t border-neutral-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-3 py-2 rounded-lg text-xs text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEdit} disabled={savingEdit}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-black text-xs font-semibold disabled:opacity-50 hover:bg-green-400 transition-colors"
                  >
                    {savingEdit
                      ? <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25"/><path fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                      : null
                    }
                    {savingEdit ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {!loading && !error && items.length > PAGE_SIZE && (
        <PaginationBar
          page={page} totalPages={totalPages} total={items.length} pageSize={PAGE_SIZE}
          onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)}
        />
      )}
    </div>
  )
}

export default AnunciosPanel
