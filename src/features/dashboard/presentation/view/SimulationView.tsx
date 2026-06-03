import { useParams } from 'react-router-dom'
import { useSimulationViewModel } from '../viewmodels/useSimulationViewModel'
import { tooltipStyle } from '../constants/chart.constants'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const SimulationView = () => {
  const { id } = useParams<{ id: string }>()
  const { loading, error, simulation } = useSimulationViewModel(id!)

  if (loading) return (
    <div className="min-h-[calc(100vh_-_3.5rem)] flex items-center justify-center" style={{ backgroundColor: '#0A0A0B' }}>
      <p className="text-sm tracking-widest uppercase animate-pulse" style={{ color: '#22C55E' }}>Cargando simulación...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-[calc(100vh_-_3.5rem)] flex items-center justify-center" style={{ backgroundColor: '#0A0A0B' }}>
      <p className="text-sm text-red-400">{error}</p>
    </div>
  )

  if (!simulation || simulation.time.length === 0) return (
    <div className="min-h-[calc(100vh_-_3.5rem)] flex items-center justify-center" style={{ backgroundColor: '#0A0A0B' }}>
      <p className="text-sm" style={{ color: '#71717A' }}>Este individuo no tiene datos de simulación disponibles.</p>
    </div>
  )

  const data = simulation?.time.map((t, i) => ({
    tiempo: parseFloat(t.toFixed(2)),
    biomasa: parseFloat(simulation.biomass[i].toFixed(4)),
    sustrato: parseFloat(simulation.substrate[i].toFixed(4)),
    etanol: parseFloat(simulation.ethanol[i].toFixed(4)),
  }))

  const finalBiomass = simulation?.biomass?.at(-1)?.toFixed(3)
  const finalEthanol = simulation?.ethanol?.at(-1)?.toFixed(3)
  const finalSubstrate = simulation?.substrate?.at(-1)?.toFixed(3)
  const totalTime = simulation?.time?.at(-1)?.toFixed(1)

  return (
    <div className="min-h-[calc(100vh_-_3.5rem)] flex flex-col px-12 py-12" style={{ backgroundColor: '#0A0A0B' }}>

      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#22C55E' }}>
          Individuo
        </p>
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#F4F4F5' }}>
          Simulación
        </h1>
        <div className="mt-3 h-px w-24" style={{ backgroundColor: '#22C55E', opacity: 0.4 }} />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Tiempo total', value: `${totalTime} h` },
          { label: 'Biomasa final', value: `${finalBiomass} g/L`, color: '#22C55E' },
          { label: 'Etanol final', value: `${finalEthanol} g/L`, color: '#F59E0B' },
          { label: 'Sustrato final', value: `${finalSubstrate} g/L`, color: '#3B82F6' },
        ].map(item => (
          <div key={item.label} className="rounded-xl px-6 py-4" style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#52525B' }}>{item.label}</p>
            <p className="text-xl font-semibold" style={{ color: item.color ?? '#F4F4F5' }}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
        <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#71717A' }}>
          Curvas de fermentación
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F1F22" />
            <XAxis
              dataKey="tiempo"
              tick={{ fill: '#52525B', fontSize: 11 }}
              axisLine={{ stroke: '#1F1F22' }}
              tickLine={false}
              label={{ value: 'Tiempo (h)', position: 'insideBottom', offset: -2, fill: '#52525B', fontSize: 10 }}
            />
            <YAxis
              tick={{ fill: '#52525B', fontSize: 11 }}
              axisLine={{ stroke: '#1F1F22' }}
              tickLine={false}
              width={55}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ color: '#71717A', fontSize: '12px', paddingTop: '16px' }} />
            <Line type="monotone" dataKey="biomasa" stroke="#22C55E" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="etanol" stroke="#F59E0B" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="sustrato" stroke="#3B82F6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[
          { key: 'biomasa', label: 'Biomasa (g/L)', color: '#22C55E' },
          { key: 'etanol', label: 'Etanol (g/L)', color: '#F59E0B' },
          { key: 'sustrato', label: 'Sustrato (g/L)', color: '#3B82F6' },
        ].map(chart => (
          <div key={chart.key} className="rounded-xl p-6" style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
            <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#71717A' }}>
              {chart.label}
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F1F22" />
                <XAxis
                  dataKey="tiempo"
                  tick={{ fill: '#52525B', fontSize: 10 }}
                  axisLine={{ stroke: '#1F1F22' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#52525B', fontSize: 10 }}
                  axisLine={{ stroke: '#1F1F22' }}
                  tickLine={false}
                  width={50}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey={chart.key} stroke={chart.color} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SimulationView