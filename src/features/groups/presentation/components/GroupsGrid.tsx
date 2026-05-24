import { motion }                    from 'motion/react'
import { Users }                     from 'lucide-react'
import { useNavigate }               from 'react-router-dom'
import { gridVariants, cardVariants } from '../../../../shared/animations/variants'
import type { GroupsGridProps as Props } from '../types/groups-grid.types'
import { formatDate }                from '../utils/format-date'

export const GroupsGrid = ({ groups, user, onConfirmDelete }: Props) => {
  const navigate = useNavigate()

  const professorInitials = user ? `${user.name[0]}${user.last_name[0]}`.toUpperCase() : '?'
  const professorName     = user ? `${user.name} ${user.last_name}` : 'Profesor'

  return (
    <motion.div
      variants={gridVariants}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}
    >
      {groups.map((group) => {
        const cover = group.cover_image ?? '/assets/classrooms/banner.png'

        return (
          <motion.div
            key={group.id}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.22 } }}
            style={{ height: 400 }}
          >
            <div
              className="group relative h-full overflow-hidden rounded-2xl flex flex-col transition-all duration-500"
              style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}
            >
              <div className="relative h-44 overflow-hidden flex-shrink-0">
                <img
                  src={cover}
                  alt={group.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-[#111113]/30 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300" />
                <div className="absolute top-3 left-3">
                  <span
                    className="text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-md"
                    style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)' }}
                  >
                    {group.code}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between">
                <div className="space-y-2">
                  <h3
                    className="text-base font-bold leading-tight tracking-tight transition-colors duration-300 group-hover:text-green-400 cursor-pointer w-fit"
                    style={{ color: '#F4F4F5' }}
                    onClick={() => navigate(`/groups/${group.id}`)}
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

                <div className="pt-4 mt-auto flex items-center justify-between" style={{ borderTop: '1px solid #1F1F22' }}>
                  <div className="flex items-center gap-2 min-w-0">
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
                      <span className="text-xs font-semibold truncate" style={{ color: '#F4F4F5' }}>{professorName}</span>
                      <span className="text-[10px]" style={{ color: '#52525B' }}>{formatDate(group.created_at)}</span>
                    </div>
                  </div>

                  <button
                    onClick={e => { e.stopPropagation(); onConfirmDelete(group.id, group.name) }}
                    className="p-1.5 rounded-lg transition-colors flex-shrink-0"
                    style={{ color: '#F43F5E' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(244,63,94,0.1)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
  )
}
