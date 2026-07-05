import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  X, Pencil, Send, Camera, Users, LayoutGrid, FileText, Film,
  Image as ImageIcon, LogOut, UserPlus, Check,
} from 'lucide-react'
import { ROLE_COLOR, ROLE_LABEL } from '../constants/role.constants'
import { avatarUrl } from '../utils/avatar-url'
import { getConvName } from '../utils/get-conv-name'
import { getConvAvatar } from '../utils/get-conv-avatar'
import { formatSize } from '../utils/format-size'
import type { GroupDetailsPanelProps } from '../types/group-details-panel.types'

type PanelTab = 'members' | 'media' | 'files'

export const GroupDetailsPanel = ({ conv, isCreator, mediaFiles, docFiles, availableMembers, onClose, onLeave, onUpdateInfo, onAddMembers, onUploadImage }: GroupDetailsPanelProps) => {
  const [tab,      setTab]      = useState<PanelTab>('members')
  const [editName, setEditName] = useState(false)
  const [name,     setName]     = useState(conv.name ?? '')
  const [editDesc, setEditDesc] = useState(false)
  const [desc,     setDesc]     = useState(conv.description ?? '')
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [adding,   setAdding]   = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const avatarInputRef           = useRef<HTMLInputElement>(null)

  const notMembers = availableMembers.filter(c => !conv.members.some(m => m.id === c.id))
  const toggleSel  = (id: string) =>
    setSelected(prev => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id); else n.add(id)
      return n
    })
  const confirmAdd = () => {
    if (selected.size === 0) return
    onAddMembers([...selected])
    setSelected(new Set()); setAdding(false)
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    // Subimos la imagen y guardamos la URL real (no un blob local, que al
    // recargar deja de existir y no carga en móvil ni en web).
    const url = await onUploadImage(file)
    if (url) onUpdateInfo({ avatar: url })
  }

  const convAvatar = getConvAvatar(conv)

  return (
    <>
      <div className="px-5 py-4 border-b border-neutral-900 flex items-center justify-between flex-shrink-0">
        <h3 className="text-white font-semibold text-sm">
          {conv.type === 'group' ? 'Info del grupo' : 'Info del chat'}
        </h3>
        <button onClick={onClose}
          className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-3 px-5 py-5 border-b border-neutral-900 flex-shrink-0">
        <div className="relative">
          {conv.type === 'group' ? (
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-green-400 overflow-hidden"
              style={{ background: '#0d2212', border: '2px solid rgba(34,197,94,0.25)' }}>
              {conv.avatar
                ? <img src={conv.avatar} alt="group" className="w-full h-full object-cover" />
                : <Users className="w-7 h-7" />}
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full overflow-hidden" style={{ border: '2px solid rgba(34,197,94,0.25)' }}>
              <img src={convAvatar ?? ''} alt={getConvName(conv)} className="w-full h-full object-cover" />
            </div>
          )}
          {isCreator && conv.type === 'group' && (
            <button onClick={() => avatarInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: '#22c55e' }}>
              <Camera className="w-3 h-3 text-black" />
            </button>
          )}
          <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>

        {editName && isCreator ? (
          <div className="flex items-center gap-2 w-full">
            <input autoFocus value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { onUpdateInfo({ name }); setEditName(false) } if (e.key === 'Escape') setEditName(false) }}
              className="flex-1 text-center text-white text-sm font-bold px-3 py-1.5 rounded-xl outline-none"
              style={{ background: '#1a1a1d', border: '1px solid #22c55e' }} />
            <button onClick={() => { onUpdateInfo({ name }); setEditName(false) }} className="text-green-400 hover:text-green-300">
              <Send className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-white font-bold text-base">{conv.type === 'group' ? conv.name : getConvName(conv)}</p>
            {isCreator && conv.type === 'group' && (
              <button onClick={() => setEditName(true)} className="text-neutral-600 hover:text-neutral-300 transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        <p className="text-neutral-500 text-xs -mt-1">
          {conv.type === 'group'
            ? `${conv.members.length} miembros`
            : ROLE_LABEL[conv.members.find(m => m.id !== 'u1')?.role ?? 'estudiante']}
        </p>

        {conv.type === 'group' && (
          editDesc && isCreator ? (
            <div className="w-full flex flex-col gap-2">
              <textarea autoFocus value={desc} onChange={e => setDesc(e.target.value)}
                rows={3} placeholder="Descripción del grupo…"
                className="w-full text-xs text-white px-3 py-2 rounded-xl outline-none resize-none"
                style={{ background: '#1a1a1d', border: '1px solid #22c55e' }} />
              <div className="flex gap-2">
                <button onClick={() => setEditDesc(false)}
                  className="flex-1 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white transition-colors" style={{ background: '#2a2a2d' }}>
                  Cancelar
                </button>
                <button onClick={() => { onUpdateInfo({ description: desc }); setEditDesc(false) }}
                  className="flex-1 py-1.5 rounded-lg text-xs font-medium text-black" style={{ background: '#22c55e' }}>
                  Guardar
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => isCreator && setEditDesc(true)}
              className={`w-full text-xs text-center leading-relaxed ${isCreator ? 'cursor-pointer' : 'cursor-default'}`}
              style={{ color: conv.description ? '#a1a1aa' : '#52525b' }}>
              {conv.description ?? (isCreator ? '+ Añadir descripción' : 'Sin descripción')}
            </button>
          )
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-900 flex-shrink-0">
        {([
          { id: 'members' as PanelTab, label: 'Miembros',   Icon: Users      },
          { id: 'media'   as PanelTab, label: 'Multimedia', Icon: LayoutGrid },
          { id: 'files'   as PanelTab, label: 'Archivos',   Icon: FileText   },
        ]).map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors border-b-2"
            style={{ color: tab === id ? '#22c55e' : '#52525b', borderColor: tab === id ? '#22c55e' : 'transparent' }}>
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto" data-lenis-prevent>
        {tab === 'members' && (
          <div className="px-5 py-2">
            {/* Agregar integrante */}
            <button onClick={() => setAdding(a => !a)}
              className="w-full flex items-center gap-2 py-3 border-b border-neutral-900 text-green-400 hover:text-green-300 transition-colors">
              <UserPlus className="w-4 h-4" />
              <span className="text-sm font-medium">{adding ? 'Cancelar' : 'Agregar integrante'}</span>
            </button>
            {adding && (
              <div className="py-2 border-b border-neutral-900">
                {notMembers.length === 0 ? (
                  <p className="text-xs text-neutral-600 py-3">No hay contactos para agregar.</p>
                ) : (
                  <>
                    {notMembers.map(c => {
                      const sel = selected.has(c.id)
                      return (
                        <button key={c.id} onClick={() => toggleSel(c.id)}
                          className="w-full flex items-center gap-3 py-2 text-left">
                          <img src={avatarUrl(c.name)} alt={c.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            style={{ border: '1px solid rgba(34,197,94,0.2)' }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{c.name}</p>
                            <p className="text-[11px]" style={{ color: ROLE_COLOR[c.role] }}>{ROLE_LABEL[c.role]}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${sel ? 'bg-green-500 border-green-500' : 'border-neutral-600'}`}>
                            {sel && <Check className="w-3 h-3 text-black" />}
                          </div>
                        </button>
                      )
                    })}
                    <button onClick={confirmAdd} disabled={selected.size === 0}
                      className="w-full mt-3 py-2 rounded-lg bg-green-500 text-black text-sm font-semibold disabled:opacity-40 transition-opacity">
                      Agregar {selected.size > 0 ? `(${selected.size})` : ''}
                    </button>
                  </>
                )}
              </div>
            )}
            {conv.members.map((m, i) => (
              <div key={m.id} className={`flex items-center gap-3 py-3 ${i < conv.members.length - 1 ? 'border-b border-neutral-900' : ''}`}>
                <img src={avatarUrl(m.name)} alt={m.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  style={{ border: '1px solid rgba(34,197,94,0.2)' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{m.name}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: ROLE_COLOR[m.role] }}>{ROLE_LABEL[m.role]}</p>
                </div>
                {conv.createdBy === m.id && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full text-green-400"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                    Admin
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'media' && (
          <div className="p-3">
            {mediaFiles.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-neutral-700">
                <ImageIcon className="w-8 h-8" /><p className="text-xs">Sin fotos ni videos</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {mediaFiles.map(f => (
                  <button key={f.id} onClick={() => setLightbox(f.url)}
                    className="aspect-square rounded-lg overflow-hidden relative" style={{ background: '#18181b' }}>
                    {f.type === 'image'
                      ? <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Film className="w-6 h-6 text-neutral-600" /></div>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'files' && (
          <div className="px-4 py-2">
            {docFiles.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-neutral-700">
                <FileText className="w-8 h-8" /><p className="text-xs">Sin archivos</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {docFiles.map(f => (
                  <a key={f.id} href={f.url} download={f.name} target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 py-3 border-b border-neutral-900 last:border-0">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(34,197,94,0.08)' }}>
                      <FileText className="w-4 h-4 text-green-500/60" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{f.name}</p>
                      <p className="text-[10px] text-neutral-600">{formatSize(f.size)}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {conv.type === 'group' && (
        <div className="px-5 py-4 border-t border-neutral-900 flex-shrink-0">
          <button onClick={onLeave}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-4 h-4" /> Abandonar grupo
          </button>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.92)' }}
            onClick={() => setLightbox(null)}>
            <img src={lightbox} alt="" className="max-w-[90vw] max-h-[90vh] rounded-2xl object-contain" />
            <button onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
