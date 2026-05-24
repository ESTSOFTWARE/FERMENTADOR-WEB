import type { CircuitInputProps as Props } from '../types/circuit-input.types'

const CircuitInput = ({ value, onChange, onApply, loading }: Props) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div>
      <label style={{ display: 'block', color: '#52525B', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
        Circuit ID
      </label>
      <input
        type="number"
        value={value}
        min={1}
        onChange={e => onChange(Number(e.target.value))}
        onKeyDown={e => e.key === 'Enter' && onApply()}
        style={{ width: 80, backgroundColor: '#111113', border: '1px solid #2A2A2D', borderRadius: 8, color: '#F4F4F5', fontSize: 13, padding: '8px 10px', outline: 'none', fontFamily: 'Poppins, sans-serif' }}
      />
    </div>
    <button
      onClick={onApply}
      disabled={loading}
      style={{ marginTop: 20, padding: '9px 18px', borderRadius: 8, border: 'none', backgroundColor: loading ? '#16A34A55' : '#22C55E', color: '#0A0A0B', fontSize: 12, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Poppins, sans-serif' }}
    >
      {loading ? 'Cargando…' : 'Conectar'}
    </button>
  </div>
)

export default CircuitInput
