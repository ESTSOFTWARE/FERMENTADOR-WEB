import { useParams } from 'react-router-dom'
import { useExperimentViewModel } from '../viewmodels/useExperimentViewModel'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const BestPerGenerationView = () => {
  const { id } = useParams<{ id: string }>()
  const { loading, error, bestPerGeneration } = useExperimentViewModel(id!)

  if (loading) return (
    <div className="min-h-[calc(100vh_-_3.5rem)] flex items-center justify-center" style={{ backgroundColor: '#0A0A0B' }}>
      <p className="text-sm tracking-widest uppercase animate-pulse" style={{ color: '#22C55E' }}>Cargando datos...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-[calc(100vh_-_3.5rem)] flex items-center justify-center" style={{ backgroundColor: '#0A0A0B' }}>
      <p className="text-sm text-red-400">{error}</p>
    </div>
  )

  const data = bestPerGeneration?.generations.map(gen => ({
    generacion: gen.generation,
    fitness: parseFloat(gen.best_fitness.toFixed(4)),
    rpm: parseFloat(gen.best_individual.rpm.toFixed(2)),
    temperatura: parseFloat(gen.best_individual.temperature.toFixed(2)),
    flujo: parseFloat(gen.best_individual.flow.toFixed(2)),
    eficiencia: parseFloat(gen.best_individual.efficiency.toFixed(4)),
  }))

  const tooltipStyle = {
    backgroundColor: '#111113',
    border: '1px solid #1F1F22',
    borderRadius: '8px',
    color: '#F4F4F5',
    fontSize: '12px',
    fontFamily: 'Poppins, sans-serif',
  }

  const charts = [
    { key: 'fitness', label: 'Fitness', color: '#22C55E' },
    { key: 'rpm', label: 'RPM', color: '#3B82F6' },
    { key: 'temperatura', label: 'Temperatura (°C)', color: '#F59E0B' },
    { key: 'flujo', label: 'Flujo', color: '#A78BFA' },
  ]

  const bestGen = bestPerGeneration?.generations.reduce((prev, curr) =>
    curr.best_fitness > prev.best_fitness ? curr : prev
  )

  return (
    <div className="min-h-[calc(100vh_-_3.5rem)] flex flex-col px-12 py-12" style={{ backgroundColor: '#0A0A0B' }}>

      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#22C55E' }}>
          Evolución
        </p>
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#F4F4F5' }}>
          Mejor por Generación
        </h1>
        <div className="mt-3 h-px w-24" style={{ backgroundColor: '#22C55E', opacity: 0.4 }} />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Mejor fitness', value: bestGen?.best_fitness.toFixed(4) },
          { label: 'RPM óptimo', value: bestGen?.best_individual.rpm.toFixed(1) },
          { label: 'Temperatura óptima', value: `${bestGen?.best_individual.temperature.toFixed(1)} °C` },
          { label: 'Flujo óptimo', value: bestGen?.best_individual.flow.toFixed(2) },
        ].map(item => (
          <div key={item.label} className="rounded-xl px-6 py-4" style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#52525B' }}>{item.label}</p>
            <p className="text-xl font-semibold" style={{ color: '#22C55E' }}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {charts.map(chart => (
          <div
            key={chart.key}
            className="rounded-xl p-6"
            style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}
          >
            <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#71717A' }}>
              {chart.label}
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F1F22" />
                <XAxis
                  dataKey="generacion"
                  tick={{ fill: '#52525B', fontSize: 11 }}
                  axisLine={{ stroke: '#1F1F22' }}
                  tickLine={false}
                  label={{ value: 'Generación', position: 'insideBottom', offset: -2, fill: '#52525B', fontSize: 10 }}
                />
                <YAxis
                  tick={{ fill: '#52525B', fontSize: 11 }}
                  axisLine={{ stroke: '#1F1F22' }}
                  tickLine={false}
                  width={55}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey={chart.key}
                  stroke={chart.color}
                  strokeWidth={2}
                  dot={{ fill: chart.color, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BestPerGenerationView