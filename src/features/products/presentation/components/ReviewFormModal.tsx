import { motion, AnimatePresence } from 'motion/react'
import { X, Star } from 'lucide-react'

interface Props {
  open: boolean
  rating: number
  comment: string
  saving: boolean
  onRatingChange: (r: number) => void
  onCommentChange: (c: string) => void
  onClose: () => void
  onSubmit: () => void
}

export const ReviewFormModal = ({ open, rating, comment, saving, onRatingChange, onCommentChange, onClose, onSubmit }: Props) => (
  <AnimatePresence>
    {open && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
        onClick={e => { if (e.target === e.currentTarget) onClose() }}>
        <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="w-full max-w-md rounded-2xl flex flex-col overflow-hidden"
          style={{ background: '#111113', border: '1px solid #2a2a2d' }}>

          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-900">
            <h3 className="text-white font-semibold text-sm">Escribir reseña</h3>
            <button onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-4 p-5">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block">Calificación</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} type="button" onClick={() => onRatingChange(s)}>
                    <Star className="w-7 h-7 transition-colors" fill={s <= rating ? '#F59E0B' : 'none'} stroke="#F59E0B" strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5 block">Comentario (opcional)</label>
              <textarea value={comment} onChange={e => onCommentChange(e.target.value)}
                rows={4} placeholder="Cuéntanos tu experiencia con este producto…"
                className="w-full px-4 py-2.5 text-sm text-white placeholder-neutral-600 rounded-xl outline-none resize-none"
                style={{ background: '#18181b', border: '1px solid #2a2a2d' }} />
            </div>
          </div>

          <div className="px-5 py-4 border-t border-neutral-900 flex gap-2">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              style={{ background: '#1a1a1d' }}>Cancelar</button>
            <button onClick={onSubmit} disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: '#22c55e', color: '#0a0a0b' }}>
              {saving ? 'Enviando…' : 'Publicar reseña'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)