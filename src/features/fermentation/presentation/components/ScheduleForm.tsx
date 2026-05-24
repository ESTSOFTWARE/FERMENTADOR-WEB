import { useState }                                    from 'react'
import { INPUT_BASE_STYLE, LABEL_BASE_STYLE }          from '../constants/schedule-form-styles.constants'
import type { ScheduleFormProps as Props }             from '../types/ScheduleFormProps'
import type { FermentationFormData }                   from '../types/FermentationFormData'

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

  const set = (key: keyof typeof form, value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = () => {
    onSubmit({
      scheduled_start: new Date(form.scheduled_start).toISOString(),
      scheduled_end:   new Date(form.scheduled_end).toISOString(),
      initial_sugar:   Number(form.initial_sugar),
    } as FermentationFormData)
  }

  const isValid = Number(form.initial_sugar) > 0

  return (
    <div
      style={{
        marginTop:       16,
        padding:         24,
        borderRadius:    12,
        backgroundColor: '#0A0A0B',
        border:          '1px solid #2A2A2D',
      }}
    >
      <p style={{ color: '#A1A1AA', fontSize: 12, fontWeight: 500, marginBottom: 20, marginTop: 0 }}>
        Configurar sesión de fermentación
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={LABEL_BASE_STYLE}>Azúcar inicial (g/L)</label>
          <input
            type="number"
            value={form.initial_sugar}
            onChange={e => set('initial_sugar', e.target.value)}
            placeholder="Ej: 120"
            style={INPUT_BASE_STYLE}
            min={0}
            step={0.1}
            autoFocus
          />
        </div>
        <div>
          <label style={LABEL_BASE_STYLE}>Inicio programado</label>
          <input
            type="datetime-local"
            value={form.scheduled_start}
            onChange={e => set('scheduled_start', e.target.value)}
            style={INPUT_BASE_STYLE}
          />
        </div>
        <div>
          <label style={LABEL_BASE_STYLE}>Fin programado</label>
          <input
            type="datetime-local"
            value={form.scheduled_end}
            onChange={e => set('scheduled_end', e.target.value)}
            style={INPUT_BASE_STYLE}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={handleSubmit}
          disabled={loading || !isValid}
          style={{
            flex:            1,
            padding:         '10px 0',
            borderRadius:    8,
            border:          'none',
            backgroundColor: !isValid || loading ? '#16A34A55' : '#22C55E',
            color:           '#0A0A0B',
            fontSize:        13,
            fontWeight:      600,
            cursor:          !isValid || loading ? 'not-allowed' : 'pointer',
            fontFamily:      'Poppins, sans-serif',
            transition:      'background-color 0.2s',
          }}
        >
          {loading ? 'Iniciando...' : 'Confirmar e iniciar'}
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          style={{
            padding:         '10px 20px',
            borderRadius:    8,
            border:          '1px solid #3F3F46',
            backgroundColor: 'transparent',
            color:           '#71717A',
            fontSize:        13,
            cursor:          'pointer',
            fontFamily:      'Poppins, sans-serif',
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default ScheduleForm
