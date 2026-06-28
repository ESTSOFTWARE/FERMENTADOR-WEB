import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, Plus, Pencil, Trash2, Cpu } from 'lucide-react'
import { pageVariants, sectionVariants } from '../../../../shared/animations/variants'
import { useComponentsViewModel } from '../viewmodels/useComponentsViewModel'
import { ComponentFormModal } from '../components/ComponentFormModal'
import type { Component } from '../../domain/models/Component'

const ComponentsView = () => {
  const vm = useComponentsViewModel()
  const [toDelete, setToDelete] = useState<Component | null>(null)

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible"
      className="min-h-[calc(100vh-3.5rem)] px-12 py-10" style={{ backgroundColor: '#0A0A0B' }}>

      {/* Header */}
      <motion.div variants={sectionVariants} className="flex items-end justify-between gap-6 flex-wrap mb-8">
        <div>
          <p className="text-[11px] text-green-500/80 uppercase tracking-[0.3em] mb-2">Catálogo</p>
          <h1 className="text-white text-3xl font-bold tracking-tight">Componentes</h1>
          <div className="mt-2.5 h-px w-20 bg-green-500/40" />
        </div>
        <button onClick={vm.openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
          style={{ background: '#22C55E', color: '#0A0A0B' }}>
          <Plus className="w-4 h-4" /> Nuevo componente
        </button>
      </motion.div>

      {/* Search + count */}
      <motion.div variants={sectionVariants} className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" />
          <input value={vm.search} onChange={e => vm.setSearch(e.target.value)}
            placeholder="Buscar por nombre, SKU o descripción…"
            className="w-full pl-10 pr-4 py-2.5 text-sm text-neutral-300 placeholder-neutral-600 rounded-xl outline-none"
            style={{ background: '#111113', border: '1px solid #2A2A2D' }} />
        </div>
        <span className="text-xs text-neutral-500">{vm.total} componente{vm.total === 1 ? '' : 's'}</span>
      </motion.div>

      {/* Loading */}
      {vm.loading && (
        <div className="flex justify-center pt-20">
          <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#2A2A2D" strokeWidth="4" />
            <path fill="#22C55E" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}

      {/* Table */}
      {!vm.loading && (
        <motion.div variants={sectionVariants} className="rounded-2xl border border-white/8 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.02)' }}>
          {/* head */}
          <div className="grid grid-cols-[80px_1fr_140px_110px_90px_100px] gap-3 px-5 py-3 border-b border-white/6">
            {['N°', 'Nombre', 'SKU', 'Precio', 'Stock', 'Acciones'].map(h => (
              <span key={h} className="text-[10px] uppercase tracking-widest text-neutral-600">{h}</span>
            ))}
          </div>

          {vm.components.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Cpu className="w-8 h-8 text-neutral-700" />
              <p className="text-sm text-neutral-500">
                {vm.search ? `Sin resultados para "${vm.search}"` : 'No hay componentes todavía. Crea el primero.'}
              </p>
            </div>
          ) : (
            vm.components.map((c, i) => (
              <div key={c.id}
                className={`grid grid-cols-[80px_1fr_140px_110px_90px_100px] gap-3 px-5 py-3.5 items-center ${i < vm.components.length - 1 ? 'border-b border-white/6' : ''}`}>
                <span className="text-green-400 font-mono text-sm">{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{c.name}</p>
                  <p className="text-xs text-neutral-600 truncate mt-0.5">{c.description}</p>
                </div>
                <span className="text-xs text-neutral-400 font-mono truncate">{c.sku}</span>
                <span className="text-sm font-semibold text-white">${c.price.toLocaleString('es-MX')}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${c.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="text-sm text-neutral-300">{c.stock}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => vm.openEdit(c)} title="Editar"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setToDelete(c)} title="Eliminar"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}

      {/* Form modal */}
      <ComponentFormModal
        open={vm.showForm}
        editing={vm.editing}
        saving={vm.saving}
        onClose={vm.closeForm}
        onSave={vm.saveComponent}
      />

      {/* Delete confirm */}
      <AnimatePresence>
        {toDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="rounded-2xl p-6 max-w-xs w-full flex flex-col gap-4"
              style={{ background: '#111113', border: '1px solid #2a2a2d' }}>
              <div>
                <p className="text-white font-semibold">¿Eliminar componente?</p>
                <p className="text-sm text-neutral-500 mt-1">
                  Se eliminará <span className="text-white">{toDelete.name}</span> del catálogo. No se puede deshacer.
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                  style={{ background: '#1a1a1d' }}>
                  Cancelar
                </button>
                <button onClick={() => { vm.deleteComponent(toDelete); setToDelete(null) }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
                  style={{ background: '#ef4444' }}>
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ComponentsView
