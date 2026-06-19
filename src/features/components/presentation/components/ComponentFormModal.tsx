import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import type { ComponentFormModalProps, ComponentFormState } from '../types/component-form.types'
import { inputCls, inputStyle } from '../constants/component-form.constants'
import { initialState } from '../utils/component-form.utils'

const ComponentForm = ({ editing, saving, onClose, onSave }: Omit<ComponentFormModalProps, 'open'>) => {
  const [form, setForm] = useState<ComponentFormState>(() => initialState(editing))
  const set = (k: keyof ComponentFormState, v: string) => setForm(prev => ({ ...prev, [k]: v }))

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
      category_id: form.category_id.trim() ? Number(form.category_id) : null,
    })
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
            <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5 block">Categoría (ID, opcional)</label>
            <input value={form.category_id} onChange={e => set('category_id', e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="—" inputMode="numeric" className={inputCls} style={inputStyle} />
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
