import { useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue } from 'motion/react'
import { ChevronLeft, ChevronRight, Users } from 'lucide-react'
import type { Group } from '../../domain/models/Group'
import type { AuthUser } from '../../../auth/domain/models/Auth'

const COVER_IMAGES = [
  'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
  'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=800&q=80',
  'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=800&q=80',
  'https://images.unsplash.com/photo-1559525839-8c4c01c1dee2?w=800&q=80',
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80',
]

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'Sin fecha'
  return new Date(dateStr).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

interface Props {
  groups:          Group[]
  user:            AuthUser | null
  selected:        Group | null
  onSelect:        (group: Group) => void
  onShowQr:        (group: Group) => void
  onConfirmDelete: (id: number, name: string) => void
}

export const GroupsSlider = ({ groups, user, selected, onSelect, onShowQr, onConfirmDelete }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragWidth, setDragWidth] = useState(0)
  const x = useMotionValue(0)

  useEffect(() => {
    if (containerRef.current) {
      setDragWidth(containerRef.current.scrollWidth - containerRef.current.offsetWidth)
    }
  }, [groups])

  const scrollTo = (direction: 'left' | 'right') => {
    const currentX      = x.get()
    const containerWidth = containerRef.current?.offsetWidth || 0
    const scrollAmount  = containerWidth * 0.75
    let newX = direction === 'left' ? currentX + scrollAmount : currentX - scrollAmount
    newX = Math.max(Math.min(newX, 0), -dragWidth)
    animate(x, newX, { type: 'spring', stiffness: 300, damping: 30, mass: 1 })
  }

  const professorInitials = user ? `${user.name[0]}${user.last_name[0]}`.toUpperCase() : '?'
  const professorName     = user ? `${user.name} ${user.last_name}` : 'Profesor'

  return (
    <div className="w-full relative group/slider">
      {/* Flecha izquierda */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-5 z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => scrollTo('left')}
          className="h-10 w-10 rounded-full flex items-center justify-center transition-all active:scale-95 hover:scale-110"
          style={{ backgroundColor: '#111113', border: '1px solid #2A2A2D', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5 text-neutral-400" />
        </button>
      </div>

      {/* Flecha derecha */}
      <div className="absolute top-1/2 -translate-y-1/2 -right-5 z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => scrollTo('right')}
          className="h-10 w-10 rounded-full flex items-center justify-center transition-all active:scale-95 hover:scale-110"
          style={{ backgroundColor: '#111113', border: '1px solid #2A2A2D', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
          aria-label="Siguiente"
        >
          <ChevronRight className="w-5 h-5 text-neutral-400" />
        </button>
      </div>

      <motion.div
        ref={containerRef}
        className="cursor-grab active:cursor-grabbing overflow-hidden py-6 -my-6"
        whileTap={{ cursor: 'grabbing' }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -dragWidth }}
          dragElastic={0.08}
          style={{ x }}
          className="flex gap-5"
        >
          {groups.map((group, index) => {
            const cover      = COVER_IMAGES[index % COVER_IMAGES.length]
            const isSelected = selected?.id === group.id

            return (
              <motion.div
                key={group.id}
                className="min-w-[300px] max-w-[300px] h-[400px]"
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
              >
                <div
                  className="group relative h-full overflow-hidden rounded-2xl flex flex-col transition-all duration-500"
                  style={{
                    backgroundColor: '#111113',
                    border: isSelected ? '1px solid rgba(34,197,94,0.45)' : '1px solid #1F1F22',
                    boxShadow: isSelected ? '0 0 20px rgba(34,197,94,0.08)' : 'none',
                  }}
                >
                  {/* Imagen portada */}
                  <div className="relative h-44 overflow-hidden flex-shrink-0">
                    <img
                      src={cover}
                      alt={group.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-[#111113]/30 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300" />

                    {/* Badge código */}
                    <div className="absolute top-3 left-3">
                      <span
                        className="text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-md"
                        style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)' }}
                      >
                        {group.code}
                      </span>
                    </div>

                    {/* Overlay hover con acciones */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/25 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onPointerDown={e => { e.stopPropagation(); onSelect(group) }}
                        className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-black shadow-lg"
                        style={{ backgroundColor: 'rgba(255,255,255,0.93)' }}
                      >
                        Ver grupo
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onPointerDown={e => { e.stopPropagation(); onShowQr(group) }}
                        className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold shadow-lg"
                        style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.4)' }}
                      >
                        Ver QR
                      </motion.button>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div className="space-y-2">
                      <h3
                        className="text-base font-bold leading-tight tracking-tight transition-colors duration-300 group-hover:text-green-400"
                        style={{ color: '#F4F4F5' }}
                      >
                        {group.name}
                      </h3>
                      <div className="flex items-center gap-1.5" style={{ color: '#52525B' }}>
                        <Users className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="text-xs">
                          {group.members.length} {group.members.length === 1 ? 'alumno inscrito' : 'alumnos inscritos'}
                        </span>
                      </div>
                    </div>

                    {/* Footer: profesor + fecha | eliminar */}
                    <div
                      className="pt-4 mt-auto flex items-center justify-between"
                      style={{ borderTop: '1px solid #1F1F22' }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Avatar profesor */}
                        <div
                          className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 overflow-hidden"
                          style={{ backgroundColor: '#1F1F22', border: '2px solid #2A2A2D', color: '#A1A1AA' }}
                        >
                          {user?.profile_image
                            ? <img src={user.profile_image} alt={professorName} className="h-full w-full object-cover" draggable={false} />
                            : professorInitials
                          }
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold truncate" style={{ color: '#F4F4F5' }}>
                            {professorName}
                          </span>
                          <span className="text-[10px]" style={{ color: '#52525B' }}>
                            {formatDate(group.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Eliminar */}
                      <button
                        onPointerDown={e => { e.stopPropagation(); onConfirmDelete(group.id, group.name) }}
                        className="p-1.5 rounded-lg transition-colors flex-shrink-0"
                        style={{ color: '#F43F5E' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(244,63,94,0.1)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>
    </div>
  )
}
