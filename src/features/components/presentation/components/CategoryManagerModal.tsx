import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Plus, Trash2, Pencil, Check } from 'lucide-react'
import { sileo } from 'sileo'
import { categoriesApi, type Category } from '../../data/api/categoriesApi'
import { inputCls, inputStyle } from '../constants/component-form.constants'
import { TOAST_STYLE } from '../constants/toast-style.constants'

interface Props {
  open: boolean
  onClose: () => void
  onChange?: () => void // avisa al padre para refrescar el <select> de categorías del form
}

export const CategoryManagerModal = ({ open, onClose, onChange }: Props) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]       = useState(true)
  const [name, setName]             = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving]         = useState(false)
  const [editingId, setEditingId]   = useState<number | null>(null)
  const [editName, setEditName]     = useState('')
  const [editDescription, setEditDescription] = useState('')

  const load = () => {
    setLoading(true)
    categoriesApi.getAll().then(setCategories).catch(() => setCategories([])).finally(() => setLoading(false))
  }

  useEffect(() => { if (open) load() }, [open])

  const handleCreate = async () => {
    if (!name.trim()) return
    try {
      setSaving(true)
      await categoriesApi.create({ name: name.trim(), description: description.trim() || null })
      setName(''); setDescription('')
      sileo.success({ title: 'Categoría creada', ...TOAST_STYLE })
      load(); onChange?.()
    } catch (e) {
      sileo.error({ title: 'No se pudo crear la categoría', description: (e as Error).message, ...TOAST_STYLE })
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (c: Category) => { setEditingId(c.id); setEditName(c.name); setEditDescription(c.description ?? '') }
  const cancelEdit = () => setEditingId(null)

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return
    try {
      await categoriesApi.update(id, { name: editName.trim(), description: editDescription.trim() || null })
      sileo.success({ title: 'Categoría actualizada', ...TOAST_STYLE })
      setEditingId(null); load(); onChange?.()
    } catch (e) {
      sileo.error({ title: 'No se pudo actualizar', description: (e as Error).message, ...TOAST_STYLE })
    }
  }

  const handleDelete = async (c: Category) => {
    try {
      await categoriesApi.delete(c.id)
      sileo.success({ title: 'Categoría eliminada', description: `"${c.name}" fue eliminada.`, ...TOAST_STYLE })
      load(); onChange?.()
    } catch (e) {
      sileo.error({ title: 'No se pudo eliminar', description: (e as Error).message, ...TOAST_STYLE })
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}>

          <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="w-full max-w-lg rounded-2xl flex flex-col overflow-hidden"
            style={{ background: '#111113', border: '1px solid #2a2a2d', maxHeight: '85vh' }}>

            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-900 flex-shrink-0">
              <h3 className="text-white font-semibold text-sm">Gestionar categorías</h3>
              <button onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4 p-5 overflow-y-auto" data-lenis-prevent>
              <div className="flex flex-col gap-2 pb-4 border-b border-neutral-900">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500">Nueva categoría</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="Sensores" className={inputCls} style={inputStyle} />
                <input value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Descripción (opcional)" className={inputCls} style={inputStyle} />
                <button onClick={handleCreate} disabled={!name.trim() || saving}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: '#22c55e', color: '#0a0a0b' }}>
                  <Plus className="w-4 h-4" /> {saving ? 'Creando…' : 'Agregar categoría'}
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-6">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#2A2A2D" strokeWidth="4" />
                    <path fill="#22C55E" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                </div>
              ) : categories.length === 0 ? (
                <p className="text-sm text-neutral-600 text-center py-4">Aún no hay categorías.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {categories.map(c => (
                    <div key={c.id} className="rounded-xl p-3" style={{ background: '#18181b', border: '1px solid #2a2a2d' }}>
                      {editingId === c.id ? (
                        <div className="flex flex-col gap-2">
                          <input value={editName} onChange={e => setEditName(e.target.value)} className={inputCls} style={inputStyle} />
                          <input value={editDescription} onChange={e => setEditDescription(e.target.value)}
                            placeholder="Descripción" className={inputCls} style={inputStyle} />
                          <div className="flex gap-2">
                            <button onClick={cancelEdit}
                              className="flex-1 py-2 rounded-lg text-xs text-neutral-400 hover:text-white transition-colors"
                              style={{ background: '#1a1a1d' }}>Cancelar</button>
                            <button onClick={() => handleUpdate(c.id)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold"
                              style={{ background: '#22c55e', color: '#0a0a0b' }}>
                              <Check className="w-3.5 h-3.5" /> Guardar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{c.name}</p>
                            {c.description && <p className="text-xs text-neutral-500 truncate mt-0.5">{c.description}</p>}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={() => startEdit(c)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDelete(c)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}