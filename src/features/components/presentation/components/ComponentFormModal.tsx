import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Plus, Trash2 } from 'lucide-react'
import type { ComponentFormModalProps, ComponentFormState } from '../types/component-form.types'
import { inputCls, inputStyle } from '../constants/component-form.constants'
import { initialState } from '../utils/component-form.utils'
import { categoriesApi, type Category } from '../../data/api/categoriesApi'
import { specificationsApi } from '../../data/api/specificationsApi'
import { includesApi } from '../../data/api/includesApi'
import { benefitsApi } from '../../data/api/benefitsApi'

const ComponentForm = ({ editing, saving, onClose, onSave }: Omit<ComponentFormModalProps, 'open'>) => {
  const [form, setForm] = useState<ComponentFormState>(() => initialState(editing))
  const [categories, setCategories] = useState<Category[]>([])
  const [specs, setSpecs] = useState<{ name: string; value: string }[]>([])
  const [includes, setIncludes] = useState<string[]>([])
  const [benefits, setBenefits] = useState<{ title: string; description: string }[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string>('')
  const set = (k: keyof ComponentFormState, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const onPickFile = (file: File | null) => {
    setImageFile(file)
    setFilePreview(file ? URL.createObjectURL(file) : '')
  }

  useEffect(() => {
    categoriesApi.getAll()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  // En edición, precargar ficha técnica / incluye / beneficios existentes.
  useEffect(() => {
    if (!editing) return
    specificationsApi.getAll(editing.id)
      .then(rows => setSpecs(rows.map(s => ({ name: s.name, value: s.value })))).catch(() => {})
    includesApi.getAll(editing.id)
      .then(rows => setIncludes(rows.map(i => i.description))).catch(() => {})
    benefitsApi.getAll(editing.id)
      .then(rows => setBenefits(rows.map(b => ({ title: b.title, description: b.description ?? '' })))).catch(() => {})
  }, [editing])

  const price = Number(form.price)
  const stock = Number(form.stock)
  const isValid = !!(
    form.name.trim() && form.sku.trim() && form.description.trim() &&
    form.price !== '' && price > 0 && Number.isFinite(price) &&
    form.stock !== '' && stock >= 0 && Number.isInteger(stock)
  )

  const handleSubmit = () => {
    if (!isValid) return
    onSave({
      name:        form.name.trim(),
      description: form.description.trim(),
      sku:         form.sku.trim(),
      price,
      stock,
      image:       form.image.trim() || null,
      category_id: form.category_id.trim() ? Number(form.category_id) : null,
    }, { specs, includes, benefits, imageFile })
  }

  return (
    <>
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-900 flex-shrink-0">
        <h3 className="text-white font-semibold text-sm">{editing ? 'Editar componente' : 'Nuevo componente'}</h3>
        <button onClick={onClose}
          className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-4 p-5 overflow-y-auto" data-lenis-prevent>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5 block">Nombre</label>
          <input value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="Sensor de pH de repuesto" className={inputCls} style={inputStyle} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5 block">SKU</label>
            <input value={form.sku} onChange={e => set('sku', e.target.value)}
              placeholder="NKA-SEN-PH1" className={`${inputCls} font-mono`} style={inputStyle} />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5 block">Categoría</label>
            <select value={form.category_id} onChange={e => set('category_id', e.target.value)}
              className={inputCls} style={{ ...inputStyle, cursor: 'pointer', colorScheme: 'dark' }}>
              <option value="">Sin categoría</option>
              {categories.map(c => (
                <option key={c.id} value={String(c.id)}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5 block">Imagen</label>
          <div className="flex items-center gap-3">
            <div className="flex-1 flex flex-col gap-2">
              <label className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs text-neutral-300 cursor-pointer transition-colors hover:bg-neutral-800/50"
                style={{ background: '#0A0A0B', border: '1px dashed #2A2A2D' }}>
                <Plus className="w-3.5 h-3.5" />
                {imageFile ? imageFile.name : 'Subir imagen (JPG/PNG/WEBP, máx 5 MB)'}
                <input type="file" accept="image/*" className="hidden"
                  onChange={e => onPickFile(e.target.files?.[0] ?? null)} />
              </label>
              <input value={form.image} onChange={e => set('image', e.target.value)}
                placeholder="…o pega una URL" className={inputCls} style={inputStyle} />
            </div>
            {(filePreview || form.image.trim()) && (
              <img src={filePreview || form.image} alt="Vista previa"
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-neutral-800"
                onError={e => { (e.target as HTMLImageElement).style.opacity = '0.2' }} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5 block">Precio (MXN)</label>
            <input value={form.price} onChange={e => set('price', e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="1200" inputMode="decimal" className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5 block">Stock</label>
            <input value={form.stock} onChange={e => set('stock', e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="0" inputMode="numeric" className={inputCls} style={inputStyle} />
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5 block">Descripción</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            rows={3} placeholder="Electrodo de vidrio combinado con compensación de temperatura…"
            className={`${inputCls} resize-none`} style={inputStyle} />
        </div>

        {/* Ficha técnica */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] uppercase tracking-widest text-neutral-500">Ficha técnica</label>
            <button type="button" onClick={() => setSpecs(p => [...p, { name: '', value: '' }])}
              className="flex items-center gap-1 text-[11px] text-green-500 hover:text-green-400">
              <Plus className="w-3 h-3" /> Agregar
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {specs.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={s.name} onChange={e => setSpecs(p => p.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                  placeholder="Rango de medición" className={inputCls} style={inputStyle} />
                <input value={s.value} onChange={e => setSpecs(p => p.map((x, j) => j === i ? { ...x, value: e.target.value } : x))}
                  placeholder="0 – 14 pH" className={inputCls} style={inputStyle} />
                <button type="button" onClick={() => setSpecs(p => p.filter((_, j) => j !== i))}
                  className="text-neutral-600 hover:text-red-400 flex-shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            {specs.length === 0 && <p className="text-[11px] text-neutral-600">Sin especificaciones.</p>}
          </div>
        </div>

        {/* Qué incluye */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] uppercase tracking-widest text-neutral-500">Qué incluye</label>
            <button type="button" onClick={() => setIncludes(p => [...p, ''])}
              className="flex items-center gap-1 text-[11px] text-green-500 hover:text-green-400">
              <Plus className="w-3 h-3" /> Agregar
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {includes.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={d} onChange={e => setIncludes(p => p.map((x, j) => j === i ? e.target.value : x))}
                  placeholder="Guía rápida de calibración" className={inputCls} style={inputStyle} />
                <button type="button" onClick={() => setIncludes(p => p.filter((_, j) => j !== i))}
                  className="text-neutral-600 hover:text-red-400 flex-shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            {includes.length === 0 && <p className="text-[11px] text-neutral-600">Sin elementos incluidos.</p>}
          </div>
        </div>

        {/* Beneficios */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] uppercase tracking-widest text-neutral-500">Beneficios</label>
            <button type="button" onClick={() => setBenefits(p => [...p, { title: '', description: '' }])}
              className="flex items-center gap-1 text-[11px] text-green-500 hover:text-green-400">
              <Plus className="w-3 h-3" /> Agregar
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={b.title} onChange={e => setBenefits(p => p.map((x, j) => j === i ? { ...x, title: e.target.value } : x))}
                  placeholder="Garantía 12 meses" className={inputCls} style={inputStyle} />
                <input value={b.description} onChange={e => setBenefits(p => p.map((x, j) => j === i ? { ...x, description: e.target.value } : x))}
                  placeholder="Cobertura del fabricante" className={inputCls} style={inputStyle} />
                <button type="button" onClick={() => setBenefits(p => p.filter((_, j) => j !== i))}
                  className="text-neutral-600 hover:text-red-400 flex-shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            {benefits.length === 0 && <p className="text-[11px] text-neutral-600">Sin beneficios.</p>}
          </div>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-neutral-900 flex gap-2 flex-shrink-0">
        <button onClick={onClose}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          style={{ background: '#1a1a1d' }}>
          Cancelar
        </button>
        <button onClick={handleSubmit} disabled={!isValid || saving}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: '#22c55e', color: '#0a0a0b' }}>
          {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear componente'}
        </button>
      </div>
    </>
  )
}

export const ComponentFormModal = ({ open, editing, saving, onClose, onSave }: ComponentFormModalProps) => (
  <AnimatePresence>
    {open && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
        onClick={e => { if (e.target === e.currentTarget) onClose() }}>

        <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="w-full max-w-lg rounded-2xl flex flex-col overflow-hidden"
          style={{ background: '#111113', border: '1px solid #2a2a2d', maxHeight: '90vh' }}>
          <ComponentForm key={editing?.id ?? 'new'} editing={editing} saving={saving} onClose={onClose} onSave={onSave} />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)
