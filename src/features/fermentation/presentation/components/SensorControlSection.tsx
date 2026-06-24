import { SENSOR_CONTROLS }                    from '../constants/sensor-controls.constants'
import { getSensorIcon }                      from '../utils/get-sensor-icon'
import type { SensorKey }                     from '../../domain/models/SensorKey'
import type { SensorControlSectionProps as Props } from '../types/SensorControlSectionProps'
import ToggleSwitch                           from './ToggleSwitch'

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

      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap:                 12,
      }}>
        {SENSOR_CONTROLS.map(sensor => {
          const isOn = sensorStates[sensor.key as SensorKey]
          return (
            <div
              key={sensor.key}
              style={{
                position:        'relative',
                padding:         '18px 20px',
                borderRadius:    14,
                backgroundColor: isOn ? `${sensor.color}0A` : '#0D0D0F',
                border:          `1px solid ${isOn ? `${sensor.color}35` : '#1F1F22'}`,
                display:         'flex',
                flexDirection:   'column',
                gap:             14,
                transition:      'border-color 0.25s, background-color 0.25s',
                overflow:        'hidden',
              }}
            >
              <div style={{
                position:        'absolute',
                top:             0,
                left:            20,
                right:           20,
                height:          1,
                borderRadius:    1,
                backgroundColor: sensor.color,
                opacity:         isOn ? 0.55 : 0,
                transition:      'opacity 0.3s',
              }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width:           38,
                  height:          38,
                  borderRadius:    10,
                  backgroundColor: isOn ? `${sensor.color}18` : '#1A1A1D',
                  border:          `1px solid ${isOn ? `${sensor.color}30` : '#2A2A2D'}`,
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  flexShrink:      0,
                  transition:      'all 0.25s',
                }}>
                  <svg
                    width="18" height="18" viewBox="0 0 24 24"
                    fill="none"
                    stroke={isOn ? sensor.color : '#52525B'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transition: 'stroke 0.25s' }}
                  >
                    <path d={getSensorIcon(sensor.key)} />
                  </svg>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    color:        isOn ? '#F4F4F5' : '#71717A',
                    fontSize:     13,
                    fontWeight:   600,
                    margin:       0,
                    transition:   'color 0.25s',
                    whiteSpace:   'nowrap',
                    overflow:     'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {sensor.label}
                  </p>
                  <p style={{ color: '#3F3F46', fontSize: 11, margin: '2px 0 0 0' }}>
                    {sensor.unit}
                  </p>
                </div>

                <ToggleSwitch
                  checked={isOn}
                  onChange={() => onToggle(sensor.key as SensorKey)}
                  disabled={loading || disabled}
                />
              </div>

              <div style={{ height: 1, backgroundColor: '#1A1A1D' }} />

              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
                <p style={{ color: '#52525B', fontSize: 11, margin: 0, lineHeight: 1.55, flex: 1 }}>
                  {sensor.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  {sensor.isHardware && (
                    <span style={{
                      padding:         '2px 6px',
                      borderRadius:    4,
                      backgroundColor: '#1F1F22',
                      color:           '#3F3F46',
                      fontSize:        9,
                      letterSpacing:   '0.1em',
                      textTransform:   'uppercase',
                      fontWeight:      700,
                    }}>
                      HW
                    </span>
                  )}
                  <span style={{
                    fontSize:      11,
                    fontWeight:    600,
                    color:         isOn ? sensor.color : '#3F3F46',
                    letterSpacing: '0.04em',
                    transition:    'color 0.25s',
                  }}>
                    {isOn ? '● activo' : '○ inactivo'}
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        {([
          { key: 'motor', label: 'Motor', description: 'Velocidad de agitación', unit: 'rpm',    color: '#06B6D4' },
          { key: 'pump',  label: 'Bomba', description: 'Control de flujo',       unit: 'ON/OFF', color: '#FB923C' },
        ] as const).map(device => (
          <div
            key={device.key}
            style={{
              position:        'relative',
              padding:         '18px 20px',
              borderRadius:    14,
              backgroundColor: '#0D0D0F',
              border:          '1px solid #1F1F22',
              display:         'flex',
              flexDirection:   'column',
              gap:             14,
              overflow:        'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width:           38,
                height:          38,
                borderRadius:    10,
                backgroundColor: `${device.color}12`,
                border:          `1px solid ${device.color}28`,
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                flexShrink:      0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={device.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={getSensorIcon(device.key)} />
                </svg>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#71717A', fontSize: 13, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {device.label}
                </p>
                <p style={{ color: '#3F3F46', fontSize: 11, margin: '2px 0 0 0' }}>
                  {device.unit}
                </p>
              </div>

              <span style={{
                padding:         '3px 8px',
                borderRadius:    6,
                backgroundColor: `${device.color}10`,
                border:          `1px solid ${device.color}25`,
                color:           device.color,
                fontSize:        9,
                letterSpacing:   '0.12em',
                textTransform:   'uppercase',
                fontWeight:      700,
                flexShrink:      0,
              }}>
                Solo lectura
              </span>
            </div>

            <div style={{ height: 1, backgroundColor: '#1A1A1D' }} />

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
              <p style={{ color: '#52525B', fontSize: 11, margin: 0, lineHeight: 1.55, flex: 1 }}>
                {device.description}
              </p>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#3F3F46', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                HW
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SensorControlSection
