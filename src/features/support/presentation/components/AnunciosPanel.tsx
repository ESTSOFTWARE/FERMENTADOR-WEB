import { motion, AnimatePresence }       from 'motion/react'
import { cn }                            from '../../../../lib/utils'
import { linkify }                       from '../../../../shared/utils/linkify'
import PaginationBar                     from '../../../../shared/components/PaginationBar'
import { LABEL_OPTIONS }                 from '../constants/announcement-label-colors.constants'
import { ANUNCIOS_INPUT_CLS }            from '../constants/anuncios-input-cls.constants'
import { PAGE_SIZE }                     from '../constants/pagination.constants'
import { labelColor }                    from '../utils/label-color'
import LabelBadge                        from './LabelBadge'
import { useAnunciosPanelViewModel }     from '../viewmodels/useAnunciosPanelViewModel'

const AnunciosPanel = () => {
  const vm = useAnunciosPanelViewModel()

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">

      <div className="px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-white text-sm font-semibold">Comunicados</h2>
          <p className="text-neutral-600 text-xs mt-0.5">Avisos y novedades visibles para todos los usuarios</p>
        </div>
        <button
          onClick={() => { vm.setShowForm(v => !v) }}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
            vm.showForm
              ? 'bg-neutral-800 text-neutral-400'
              : 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
          )}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d={vm.showForm ? 'M6 18L18 6M6 6l12 12' : 'M12 4v16m8-8H4'} />
          </svg>
          {vm.showForm ? 'Cancelar' : 'Nuevo comunicado'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">

        {vm.showForm && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col gap-4">
            <p className="text-white text-xs font-semibold">Nuevo comunicado</p>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-500 text-[10px] uppercase tracking-widest">Tipo</label>
                <select value={vm.form.label} onChange={e => vm.setForm(p => ({ ...p, label: e.target.value }))} className={ANUNCIOS_INPUT_CLS}>
                  {LABEL_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-500 text-[10px] uppercase tracking-widest">Versión</label>
                <input value={vm.form.version} onChange={e => vm.setForm(p => ({ ...p, version: e.target.value }))} placeholder="v1.2" className={ANUNCIOS_INPUT_CLS} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-500 text-[10px] uppercase tracking-widest">Fecha (opcional)</label>
                <input value={vm.form.date} onChange={e => vm.setForm(p => ({ ...p, date: e.target.value }))} placeholder="Jun 2025" className={ANUNCIOS_INPUT_CLS} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-500 text-[10px] uppercase tracking-widest">Título</label>
              <input value={vm.form.title} onChange={e => vm.setForm(p => ({ ...p, title: e.target.value }))} placeholder="Nombre del comunicado" className={ANUNCIOS_INPUT_CLS} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-500 text-[10px] uppercase tracking-widest">Descripción</label>
              <textarea value={vm.form.description} onChange={e => vm.setForm(p => ({ ...p, description: e.target.value }))} placeholder="Descripción del comunicado..." rows={3} className={`${ANUNCIOS_INPUT_CLS} resize-none`} />
            </div>

            {vm.saveError && <p className="text-red-400 text-xs">{vm.saveError}</p>}

            <div className="border-t border-neutral-800 pt-4">
              <p className="text-neutral-600 text-[10px] uppercase tracking-widest mb-3">Vista previa</p>
              <div className="relative bg-[#111113] border border-neutral-800 rounded-xl p-4 overflow-hidden">
                <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full opacity-60" style={{ backgroundColor: labelColor(vm.form.label) }} />
                <div className="pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <LabelBadge label={vm.form.label} />
                    <span className="text-neutral-700 text-[10px] font-mono">{vm.form.version || 'v?'}</span>
                    <span className="text-neutral-800 text-[10px]">·</span>
                    <span className="text-neutral-700 text-[10px]">{vm.form.date || 'Fecha'}</span>
                  </div>
                  <p className="text-neutral-200 text-xs font-semibold mb-1">{vm.form.title || 'Título del comunicado'}</p>
                  <p className="text-neutral-500 text-[11px] leading-relaxed">{vm.form.description ? linkify(vm.form.description) : 'Descripción...'}</p>
                </div>
              </div>
            </div>

            <button
              onClick={vm.handleCreate} disabled={vm.saving}
              className="self-end flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-black text-xs font-semibold disabled:opacity-50 hover:bg-green-400 transition-colors"
            >
              {vm.saving
                ? <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25"/><path fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                : <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 4v16m8-8H4"/></svg>
              }
              {vm.saving ? 'Publicando...' : 'Publicar comunicado'}
            </button>
          </div>
        )}

        {vm.loading && (
          <div className="flex justify-center pt-12">
            <svg className="animate-spin w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#2A2A2D" strokeWidth="4"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        )}

        {vm.error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-xs">{vm.error}</div>}

        {!vm.loading && !vm.error && vm.items.length === 0 && (
          <div className="text-center pt-16 text-neutral-600 text-sm">No hay comunicados publicados.</div>
        )}

        {!vm.loading && !vm.error && vm.paged.map(item => {
          const color  = labelColor(item.label)
          const pinned = vm.isPinActive(item)
          return (
            <div
              key={item.id}
              onClick={() => { vm.setSelected(item); vm.setEditing(false) }}
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

                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 flex-shrink-0 transition-opacity" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => { vm.setSelected(item); vm.openEdit(item) }}
                    className="p-1.5 rounded-lg text-neutral-600 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                    title="Editar"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => vm.confirmDelete(item)}
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

      <AnimatePresence>
        {vm.selected && (
          <>
            <motion.div
              className="absolute inset-0 bg-black/40 z-10"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { vm.setSelected(null); vm.setEditing(false) }}
            />

            <motion.div
              className="absolute right-0 top-0 bottom-0 w-[460px] z-20 bg-[#0f0f10] border-l border-neutral-800 flex flex-col shadow-2xl"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            >
              <div className="flex-shrink-0 px-5 py-4 border-b border-neutral-800 flex items-center gap-3">
                <LabelBadge label={vm.editing ? vm.editForm.label : vm.selected.label} />
                <span className="flex-1 text-white text-sm font-semibold truncate">
                  {vm.editing ? 'Editar comunicado' : vm.selected.title}
                </span>
                <div className="flex items-center gap-1">
                  {!vm.editing && (
                    <button
                      onClick={() => vm.openEdit(vm.selected!)}
                      className="p-1.5 rounded-lg text-neutral-600 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                      title="Editar"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                  )}
                  {!vm.editing && (
                    <button
                      onClick={() => vm.confirmDelete(vm.selected!)}
                      className="p-1.5 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      title="Eliminar"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => { vm.setSelected(null); vm.setEditing(false) }}
                    className="p-1.5 rounded-lg text-neutral-600 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {!vm.editing ? (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                      <LabelBadge label={vm.selected.label} />
                      <span className="text-neutral-500 text-xs font-mono">{vm.selected.version}</span>
                      <span className="text-neutral-700 text-xs">·</span>
                      <span className="text-neutral-500 text-xs">{vm.selected.date}</span>
                    </div>

                    <div>
                      <p className="text-white font-semibold text-sm mb-1">{vm.selected.title}</p>
                      <div className="h-[3px] w-10 rounded-full opacity-60" style={{ backgroundColor: labelColor(vm.selected.label) }} />
                    </div>

                    <p className="text-neutral-400 text-xs leading-relaxed">{linkify(vm.selected.description)}</p>

                    <div className="border-t border-neutral-800 pt-4 flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 17.021 17.021" fill="#FBBF24">
                          <path d="M16.436,4.599l-3.998-4.02c-0.752-0.756-2.063-0.764-2.83-0.006C9.412,0.769,9.258,1.009,9.19,1.202C8.537,2.564,7.836,3.417,6.936,3.929L6.719,4.034C5.751,4.519,4.434,5.013,2,5.013c-0.266,0-0.521,0.052-0.766,0.152C0.75,5.367,0.355,5.76,0.152,6.249c-0.199,0.484-0.199,1.041,0,1.525c0.104,0.249,0.25,0.471,0.435,0.651l3.235,3.235L0,17.013l5.352-3.822l3.227,3.227c0.186,0.189,0.406,0.339,0.656,0.441c0.247,0.103,0.503,0.154,0.766,0.154s0.519-0.052,0.765-0.154c0.498-0.205,0.883-0.592,1.08-1.078c0.103-0.242,0.155-0.507,0.155-0.768c0-2.436,0.494-3.752,0.978-4.721c0.496-0.992,1.369-1.748,2.754-2.414c0.271-0.104,0.51-0.256,0.711-0.457C17.216,6.639,17.212,5.37,16.436,4.599z M11.188,9.4c-0.819,1.643-1.188,3.37-1.195,5.604L2,7.013c2.139,0,3.814-0.335,5.396-1.084l0.235-0.105c1.399-0.699,2.468-1.893,3.388-3.834l3.924,4.051C13.08,6.934,11.887,8.001,11.188,9.4z"/>
                        </svg>
                        <span className="text-neutral-400 text-xs font-medium">Fijar comunicado</span>
                        {vm.isPinActive(vm.selected) && (
                          <span className="ml-auto text-[10px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">Fijado</span>
                        )}
                      </div>

                      {vm.isPinActive(vm.selected) ? (
                        <div className="flex flex-col gap-2">
                          {vm.selected.pinned_until && (
                            <p className="text-neutral-600 text-[11px]">
                              Expira: {new Date(vm.selected.pinned_until).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          )}
                          {!vm.selected.pinned_until && (
                            <p className="text-neutral-600 text-[11px]">Sin fecha de expiración</p>
                          )}
                          <button
                            onClick={() => vm.handleUnpin(vm.selected!)}
                            disabled={vm.pinning}
                            className="self-start flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-neutral-400 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 transition-colors"
                          >
                            {vm.pinning
                              ? <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25"/><path fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                              : <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            }
                            Desfijar ahora
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { label: '1 día',      days: 1    },
                            { label: '7 días',     days: 7    },
                            { label: '30 días',    days: 30   },
                            { label: 'Sin límite', days: null },
                          ].map(opt => (
                            <button
                              key={opt.label}
                              onClick={() => vm.handlePin(vm.selected!, opt.days)}
                              disabled={vm.pinning}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-neutral-400 bg-neutral-800 hover:bg-amber-500/15 hover:text-amber-300 hover:border-amber-500/30 border border-neutral-700 disabled:opacity-50 transition-colors"
                            >
                              {vm.pinning ? <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25"/><path fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> : null}
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-neutral-500 text-[10px] uppercase tracking-widest">Tipo</label>
                        <select value={vm.editForm.label} onChange={e => vm.setEditForm(p => ({ ...p, label: e.target.value }))} className={ANUNCIOS_INPUT_CLS}>
                          {LABEL_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-neutral-500 text-[10px] uppercase tracking-widest">Versión</label>
                        <input value={vm.editForm.version} onChange={e => vm.setEditForm(p => ({ ...p, version: e.target.value }))} className={ANUNCIOS_INPUT_CLS} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-neutral-500 text-[10px] uppercase tracking-widest">Fecha</label>
                        <input value={vm.editForm.date} onChange={e => vm.setEditForm(p => ({ ...p, date: e.target.value }))} placeholder="Jun 2025" className={ANUNCIOS_INPUT_CLS} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-neutral-500 text-[10px] uppercase tracking-widest">Título</label>
                      <input value={vm.editForm.title} onChange={e => vm.setEditForm(p => ({ ...p, title: e.target.value }))} className={ANUNCIOS_INPUT_CLS} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-neutral-500 text-[10px] uppercase tracking-widest">Descripción</label>
                      <textarea value={vm.editForm.description} onChange={e => vm.setEditForm(p => ({ ...p, description: e.target.value }))} rows={5} className={`${ANUNCIOS_INPUT_CLS} resize-none`} />
                    </div>

                    {vm.editError && <p className="text-red-400 text-xs">{vm.editError}</p>}
                  </div>
                )}
              </div>

              {vm.editing && (
                <div className="flex-shrink-0 px-5 py-4 border-t border-neutral-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => vm.setEditing(false)}
                    className="px-3 py-2 rounded-lg text-xs text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={vm.handleSaveEdit} disabled={vm.savingEdit}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-black text-xs font-semibold disabled:opacity-50 hover:bg-green-400 transition-colors"
                  >
                    {vm.savingEdit ? <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25"/><path fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> : null}
                    {vm.savingEdit ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {!vm.loading && !vm.error && vm.items.length > PAGE_SIZE && (
        <PaginationBar
          page={vm.page} totalPages={vm.totalPages} total={vm.items.length} pageSize={PAGE_SIZE}
          onPrev={() => vm.setPage(p => p - 1)} onNext={() => vm.setPage(p => p + 1)}
        />
      )}
    </div>
  )
}

export default AnunciosPanel
