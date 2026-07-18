import { SENSOR_CONTROLS }                    from '../constants/sensor-controls.constants'
import type { SensorKey }                     from '../../domain/models/SensorKey'
import type { SensorControlSectionProps as Props } from '../types/SensorControlSectionProps'
import ToggleSwitch                           from './ToggleSwitch'

const READONLY_DEVICES = [
  { key: 'motor', label: 'Motor', unit: 'rpm',    color: '#06B6D4' },
  { key: 'pump',  label: 'Bomba', unit: 'ON/OFF', color: '#FB923C' },
] as const

const thStyle: React.CSSProperties = {
  textAlign:     'left',
  padding:       '10px 16px',
  color:         '#52525B',
  fontSize:      10,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  fontWeight:    600,
  borderBottom:  '1px solid #1F1F22',
}

const tdStyle: React.CSSProperties = {
  padding:      '14px 16px',
  fontSize:     13,
  color:        '#E4E4E7',
  borderBottom: '1px solid #1A1A1D',
}

const SensorControlSection = ({ sensorStates, loading, disabled = false, onToggle }: Props) => {
  const total  = Object.keys(sensorStates).length
  const active = Object.values(sensorStates).filter(Boolean).length

  return (
    <section
      style={{
        padding:         28,
        borderRadius:    16,
        backgroundColor: '#111113',
        border:          '1px solid #1F1F22',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p style={{ color: '#52525B', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
            Control de Sensores
          </p>
          <p style={{ color: '#F4F4F5', fontSize: 15, fontWeight: 600, margin: 0 }}>
            Dispositivos conectados
          </p>
        </div>

        <div style={{
          display:         'flex',
          alignItems:      'center',
          gap:             8,
          padding:         '6px 14px',
          borderRadius:    999,
          backgroundColor: active > 0 ? '#22C55E10' : '#18181B',
          border:          `1px solid ${active > 0 ? '#22C55E28' : '#27272A'}`,
        }}>
          <div style={{
            width:           6,
            height:          6,
            borderRadius:    '50%',
            backgroundColor: active > 0 ? '#22C55E' : '#3F3F46',
          }} />
          <span style={{ color: active > 0 ? '#22C55E' : '#52525B', fontSize: 12, fontWeight: 500 }}>
            {active} / {total} activos
          </span>
        </div>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #1A1A1D' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#0D0D0F' }}>
              <th style={{ ...thStyle, width: 56 }}>#</th>
              <th style={thStyle}>Sensor</th>
              <th style={thStyle}>Unidad</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Encendido</th>
            </tr>
          </thead>
          <tbody>
            {SENSOR_CONTROLS.map((sensor, index) => {
              const isOn = sensorStates[sensor.key as SensorKey]
              return (
                <tr key={sensor.key} style={{ backgroundColor: isOn ? `${sensor.color}08` : 'transparent' }}>
                  <td style={{ ...tdStyle, color: '#52525B' }}>{index + 1}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        width:           8,
                        height:          8,
                        borderRadius:    '50%',
                        backgroundColor: isOn ? sensor.color : '#3F3F46',
                        flexShrink:      0,
                      }} />
                      <span style={{ fontWeight: 600, color: isOn ? '#F4F4F5' : '#A1A1AA' }}>
                        {sensor.label}
                      </span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, color: '#71717A' }}>{sensor.unit}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <ToggleSwitch
                      checked={isOn}
                      onChange={() => onToggle(sensor.key as SensorKey)}
                      disabled={loading || disabled}
                    />
                  </td>
                </tr>
              )
            })}

            {READONLY_DEVICES.map((device, index) => (
              <tr key={device.key} style={{ backgroundColor: 'transparent' }}>
                <td style={{ ...tdStyle, color: '#52525B' }}>{SENSOR_CONTROLS.length + index + 1}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3F3F46', flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, color: '#A1A1AA' }}>{device.label}</span>
                    <span style={{
                      padding:         '2px 8px',
                      borderRadius:    999,
                      backgroundColor: `${device.color}10`,
                      border:          `1px solid ${device.color}25`,
                      color:           device.color,
                      fontSize:        9,
                      letterSpacing:   '0.1em',
                      textTransform:   'uppercase',
                      fontWeight:      700,
                    }}>
                      Solo lectura
                    </span>
                  </div>
                </td>
                <td style={{ ...tdStyle, color: '#71717A' }}>{device.unit}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <ToggleSwitch checked={false} onChange={() => {}} disabled />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default SensorControlSection