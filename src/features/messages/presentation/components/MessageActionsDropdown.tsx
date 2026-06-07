import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Eye, Archive, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface MessageActionsDropdownProps {
  onViewDetail: () => void
}

export const MessageActionsDropdown = ({ onViewDetail }: MessageActionsDropdownProps) => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [open])

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-full mt-1 w-48 bg-[#111113] border border-neutral-800 rounded-xl shadow-xl z-10 py-1 overflow-hidden"
          >
            <button 
              onClick={(e) => { e.stopPropagation(); setOpen(false); onViewDetail() }}
              className="w-full text-left px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 flex items-center gap-2 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Ver detalle
            </button>
            <button 
              disabled
              className="w-full text-left px-4 py-2 text-xs font-medium text-neutral-600 flex items-center gap-2 cursor-not-allowed"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Marcar como no leído (Próximamente)
            </button>
            <button 
              disabled
              className="w-full text-left px-4 py-2 text-xs font-medium text-neutral-600 flex items-center gap-2 cursor-not-allowed"
            >
              <Archive className="w-3.5 h-3.5" />
              Archivar (Próximamente)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
