import { SENSOR_CONTROLS } from '../../domain/models/Fermentation'
import type { SensorKey } from '../../domain/models/Fermentation'
import type { SensorControlSectionProps as Props } from '../types/SensorControlSectionProps'
import ToggleSwitch from './ToggleSwitch'

const SENSOR_ICONS: Record<string, string> = {
  temperature: 'M12 2a3 3 0 0 0-3 3v7a5 5 0 1 0 6 0V5a3 3 0 0 0-3-3zm0 16a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM11 5h2v7.17A5.02 5.02 0 0 0 11 12.1V5z',
  ph:          'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18',
  sugar:       'M8.5 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm7 9a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z',
  co2:         'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zm0 0v9',
  turbidity:   'M2 12h20M2 12a10 10 0 0 1 20 0M2 12a10 10 0 0 0 20 0M12 2v20',
  pump:        'M5 12H2m3 0a7 7 0 1 0 14 0 7 7 0 0 0-14 0zm14 0h3M12 5V2m0 3a7 7 0 0 1 0 14m0-14a7 7 0 0 0 0 14m0 0v3',
  motor:       'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
}

const getIcon = (key: string) =>
  SENSOR_ICONS[key] ?? 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6v4l3 3'

const SensorControlSection = ({ sensorStates, loading, onToggle }: Props) => {
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
      {/* Header */}
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

      {/* Grid */}
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
              {/* Accent line */}
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

              {/* Row 1: icon + name + toggle */}
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
                    <path d={getIcon(sensor.key)} />
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
                  disabled={loading}
                />
              </div>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: '#1A1A1D' }} />

              {/* Row 2: description + badges */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
                <p style={{ color: '#52525B', fontSize: 11, margin: 0, lineHeight: 1.55, flex: 1 }}>
                  {sensor.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  {sensor.isHardware && (
                    <span style={{
                      padding:       '2px 6px',
                      borderRadius:  4,
                      backgroundColor: '#1F1F22',
                      color:         '#3F3F46',
                      fontSize:      9,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontWeight:    700,
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

        {/* Read-only Motor card */}
        {([
          { key: 'motor', label: 'Motor',  description: 'Velocidad de agitación', unit: 'rpm',    color: '#06B6D4' },
          { key: 'pump',  label: 'Bomba',  description: 'Control de flujo',       unit: 'ON/OFF', color: '#FB923C' },
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
            {/* Row 1: icon + name + info badge */}
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
                  <path d={getIcon(device.key)} />
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

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: '#1A1A1D' }} />

            {/* Row 2: description */}
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