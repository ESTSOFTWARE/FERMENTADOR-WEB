import { useState, useEffect }                         from 'react'
import { AnimatePresence, motion }                       from 'motion/react'
import { INPUT_BASE_STYLE, LABEL_BASE_STYLE }            from '../constants/schedule-form-styles.constants'
import type { ScheduleFormProps as Props }               from '../types/ScheduleFormProps'
import type { FermentationFormData }                     from '../types/FermentationFormData'
import { groupsApi }                                     from '../../../groups/data/api/groupsApi'
import type { Group }                                    from '../../../groups/domain/models/Group'

const ScheduleForm = ({ onSubmit, onCancel, loading }: Props) => {
  const now   = new Date()
  const later = new Date(now.getTime() + 2 * 60 * 60 * 1000)
  const toLocal = (d: Date) =>
    new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)

  const [form, setForm] = useState({
    scheduled_start: toLocal(now),
    scheduled_end:   toLocal(later),
    initial_sugar:   '' as unknown as number,
  })
  const [groups,    setGroups]    = useState<Group[]>([])
  const [groupId,   setGroupId]   = useState<number | null>(null)
  const [loadingG,  setLoadingG]  = useState(true)

  useEffect(() => {
    let active = true
    groupsApi.getAll()
      .then(data => { if (active) setGroups(data) })
      .catch(()  => { /* sin grupos */ })
      .finally(() => { if (active) setLoadingG(false) })
    return () => { active = false }
  }, [])

  const set = (key: keyof typeof form, value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = () => {
    onSubmit({
      scheduled_start: new Date(form.scheduled_start).toISOString(),
      scheduled_end:   new Date(form.scheduled_end).toISOString(),
      initial_sugar:   Number(form.initial_sugar),
      group_id:        groupId,
    } as FermentationFormData)
  }

  // Si el profesor tiene grupos, exigimos elegir uno (la fermentación es por grupo).
  const isValid = Number(form.initial_sugar) > 0 && (groups.length === 0 || groupId !== null)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onCancel}
        style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}
      />
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 34 }}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: 440, zIndex: 51,
          background: '#0d0d0e', borderLeft: '1px solid #1F1F22',
          display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 32px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div style={{ flexShrink: 0, padding: '20px 24px', borderBottom: '1px solid #1A1A1D', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ color: '#F4F4F5', fontSize: 15, fontWeight: 600, margin: 0 }}>Configurar fermentación</h3>
            <p style={{ color: '#52525B', fontSize: 12, margin: '4px 0 0 0' }}>Elige el grupo y los parámetros</p>
          </div>
          <button onClick={onCancel}
            style={{ background: 'transparent', border: 'none', color: '#71717A', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 4 }}>
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Selector de grupo */}
          <div>
            <label style={LABEL_BASE_STYLE}>Grupo</label>
            {loadingG ? (
              <p style={{ color: '#52525B', fontSize: 12, marginTop: 8 }}>Cargando grupos…</p>
            ) : groups.length === 0 ? (
              <p style={{ color: '#52525B', fontSize: 12, marginTop: 8 }}>
                No tienes grupos. La fermentación se iniciará sin grupo asignado.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                {groups.map(g => {
                  const selected = groupId === g.id
                  return (
                    <button key={g.id} onClick={() => setGroupId(g.id)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                        padding: '12px 14px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                        background: selected ? 'rgba(34,197,94,0.08)' : '#0A0A0B',
                        border: `1px solid ${selected ? '#22C55E66' : '#2A2A2D'}`,
                        transition: 'all 0.15s',
                      }}>
                      <span style={{ minWidth: 0 }}>
                        <span style={{ display: 'block', color: '#F4F4F5', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.name}</span>
                        <span style={{ display: 'block', color: '#52525B', fontSize: 11, marginTop: 2 }}>{g.subject} · {g.members.length} alumno{g.members.length === 1 ? '' : 's'}</span>
                      </span>
                      <span style={{
                        width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                        border: `2px solid ${selected ? '#22C55E' : '#3F3F46'}`,
                        background: selected ? '#22C55E' : 'transparent',
                      }} />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div>
            <label style={LABEL_BASE_STYLE}>Azúcar inicial (g/L)</label>
            <input type="number" value={form.initial_sugar}
              onChange={e => set('initial_sugar', e.target.value)}
              placeholder="Ej: 120" style={INPUT_BASE_STYLE} min={0} step={0.1} />
          </div>

          <div>
            <label style={LABEL_BASE_STYLE}>Inicio programado</label>
            <input type="datetime-local" value={form.scheduled_start}
              onChange={e => set('scheduled_start', e.target.value)} style={INPUT_BASE_STYLE} />
          </div>

          <div>
            <label style={LABEL_BASE_STYLE}>Fin programado</label>
            <input type="datetime-local" value={form.scheduled_end}
              onChange={e => set('scheduled_end', e.target.value)} style={INPUT_BASE_STYLE} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ flexShrink: 0, padding: 20, borderTop: '1px solid #1A1A1D', display: 'flex', gap: 12 }}>
          <button onClick={onCancel} disabled={loading}
            style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #3F3F46', background: 'transparent', color: '#71717A', fontSize: 13, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={loading || !isValid}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
              backgroundColor: !isValid || loading ? '#16A34A55' : '#22C55E',
              color: '#0A0A0B', fontSize: 13, fontWeight: 600,
              cursor: !isValid || loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Poppins, sans-serif', transition: 'background-color 0.2s',
            }}>
            {loading ? 'Iniciando...' : 'Confirmar e iniciar'}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ScheduleForm
