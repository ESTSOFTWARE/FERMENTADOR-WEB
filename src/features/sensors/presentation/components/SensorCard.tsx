import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ChartTooltip                      from './ChartTooltip'
import LatestBadge                       from './LatestBadge'
import type { SensorCardProps as Props } from '../types/sensor-card.types'

const SensorCard = ({ label, unit, color, description, data, latestValue }: Props) => {
  const hasData = data.length > 0

  return (
    <div style={{ padding: 24, borderRadius: 16, backgroundColor: '#111113', border: '1px solid #1F1F22', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: hasData ? color : '#3F3F46', boxShadow: hasData ? `0 0 8px ${color}` : 'none', flexShrink: 0 }} />
            <p style={{ color: '#F4F4F5', fontSize: 13, fontWeight: 600, margin: 0 }}>{label}</p>
          </div>
          <p style={{ color: '#3F3F46', fontSize: 11, margin: 0 }}>{description}</p>
        </div>
        <LatestBadge value={latestValue} unit={unit} color={color} />
      </div>

      <div style={{ height: 140 }}>
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={color} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F1F22" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#3F3F46', fontSize: 9 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#3F3F46', fontSize: 9 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<ChartTooltip unit={unit} />} />
              <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#grad-${label})`} dot={false} activeDot={{ r: 4, fill: color }} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#3F3F46', fontSize: 12 }}>Sin datos aún</p>
          </div>
        )}
      </div>

      <p style={{ color: '#3F3F46', fontSize: 10, margin: 0, letterSpacing: '0.05em' }}>
        {data.length} lectura{data.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

export default SensorCard
