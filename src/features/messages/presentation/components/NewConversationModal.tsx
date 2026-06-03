import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Search, Users, User } from 'lucide-react'
import { avatarUrl } from '../utils/avatar-url'
import { ROLE_LABEL } from '../constants/role.constants'
import type { NewConversationModalProps } from '../types/new-conversation-modal.types'

export const NewConversationModal = ({ open, members, onClose, onCreate }: NewConversationModalProps) => {
  const [type,      setType]      = useState<'personal' | 'group'>('personal')
  const [selected,  setSelected]  = useState<string[]>([])
  const [groupName, setGroupName] = useState('')
  const [search,    setSearch]    = useState('')

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    ROLE_LABEL[m.role].toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (id: string) => {
    if (type === 'personal') { setSelected([id]); return }
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const canCreate = selected.length > 0 && (type === 'personal' || groupName.trim())

  const handleCreate = () => {
    if (!canCreate) return
    onCreate(type, selected, groupName.trim() || undefined)
    setSelected([]); setGroupName(''); setSearch('')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}>

          <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="w-full max-w-md rounded-2xl flex flex-col overflow-hidden"
            style={{ background: '#111113', border: '1px solid #2a2a2d', maxHeight: '85vh' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-900 flex-shrink-0">
              <h3 className="text-white font-semibold text-sm">Nueva conversación</h3>
              <button onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4 p-5 overflow-hidden flex-1 min-h-0">
              {/* Type selector */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl flex-shrink-0" style={{ background: '#0A0A0B' }}>
                {(['personal', 'group'] as const).map(t => (
                  <button key={t} onClick={() => { setType(t); setSelected([]) }}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: type === t ? '#1a1a1d' : 'transparent',
                      color:      type === t ? '#fff'    : '#71717a',
                      border:     type === t ? '1px solid #2a2a2d' : '1px solid transparent',
                    }}>
                    {t === 'personal' ? <User className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                    {t === 'personal' ? 'Chat personal' : 'Chat grupal'}
                  </button>
                ))}
              </div>

              {/* Group name */}
              {type === 'group' && (
                <input value={groupName} onChange={e => setGroupName(e.target.value)}
                  placeholder="Nombre del grupo"
                  className="w-full px-4 py-2.5 text-sm text-white placeholder-neutral-600 rounded-xl outline-none flex-shrink-0"
                  style={{ background: '#18181b', border: '1px solid #2a2a2d' }} />
              )}

              {/* Search */}
              <div className="relative flex-shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600 pointer-events-none" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar persona…"
                  className="w-full pl-9 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 rounded-xl outline-none"
                  style={{ background: '#18181b', border: '1px solid #2a2a2d' }} />
              </div>

              {/* Member list — scroll fixed with data-lenis-prevent */}
              <div data-lenis-prevent className="flex flex-col gap-1 overflow-y-auto flex-1 min-h-0 pr-1">
                {filtered.map(member => {
                  const isSelected = selected.includes(member.id)
                  return (
                    <button key={member.id} onClick={() => toggle(member.id)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left flex-shrink-0"
                      style={{ background: isSelected ? 'rgba(34,197,94,0.08)' : 'transparent' }}>
                      <img
                        src={avatarUrl(member.name)}
                        alt={member.name}
                        className="w-9 h-9 rounded-full flex-shrink-0 object-cover"
                        style={{ border: '1px solid rgba(34,197,94,0.2)' }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{member.name}</p>
                        <p className="text-[11px] text-neutral-500">{ROLE_LABEL[member.role]}</p>
                      </div>
                      <div className="w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center"
                        style={{
                          borderColor: isSelected ? '#22c55e' : '#3f3f46',
                          background:  isSelected ? '#22c55e' : 'transparent',
                        }}>
                        {isSelected && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-neutral-900 flex-shrink-0">
              <button onClick={handleCreate} disabled={!canCreate}
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: '#22c55e', color: '#0a0a0b' }}>
                {type === 'personal' ? 'Iniciar chat' : 'Crear grupo'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
