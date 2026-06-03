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
  ScatterChart,
  Scatter,
  ZAxis,
  Legend,
  Area, 
  ComposedChart
} from 'recharts'

const ChartsView = () => {
  const { id } = useParams<{ id: string }>()
  const { loading, error, experiment, bestPerGeneration } = useExperimentViewModel(id!)

  if (loading) return (
    <div className="min-h-[calc(100vh_-_3.5rem)] flex items-center justify-center" style={{ backgroundColor: '#0A0A0B' }}>
      <p className="text-sm tracking-widest uppercase animate-pulse" style={{ color: '#22C55E' }}>Cargando gráficas...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-[calc(100vh_-_3.5rem)] flex items-center justify-center" style={{ backgroundColor: '#0A0A0B' }}>
      <p className="text-sm text-red-400">{error}</p>
    </div>
  )

  const fitnessHistory = bestPerGeneration?.generations.map(gen => ({
    generacion: gen.generation,
    fitness: parseFloat(gen.best_fitness.toFixed(4)),
  }))

  const bestPerGenData = bestPerGeneration?.generations.map(gen => ({
    generacion: gen.generation,
    rpm: parseFloat(gen.best_individual.rpm.toFixed(2)),
    temperatura: parseFloat(gen.best_individual.temperature.toFixed(2)),
    flujo: parseFloat(gen.best_individual.flow.toFixed(2)),
  }))

  const allIndividuals = experiment?.generations.flatMap(gen =>
    gen.individuals.map(ind => ({
      rpm: parseFloat(ind.rpm.toFixed(2)),
      temperatura: parseFloat(ind.temperature.toFixed(2)),
      flujo: parseFloat(ind.flow.toFixed(2)),
      fitness: parseFloat(ind.fitness.toFixed(4)),
    }))
  )

  const populationData = bestPerGeneration?.generations.map(gen => ({
    generacion: gen.generation,
    mejor: parseFloat(gen.best_fitness.toFixed(4)),
    peor: parseFloat((gen.worst_fitness ?? 0).toFixed(4)),
    promedio: parseFloat((gen.avg_fitness ?? 0).toFixed(4)),
  }))

  const tooltipStyle = {
    backgroundColor: '#111113',
    border: '1px solid #1F1F22',
    borderRadius: '8px',
    color: '#F4F4F5',
    fontSize: '12px',
    fontFamily: 'Poppins, sans-serif',
  }

  return (
    <div className="min-h-[calc(100vh_-_3.5rem)] flex flex-col px-12 py-12" style={{ backgroundColor: '#0A0A0B' }}>

      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#22C55E' }}>
          Análisis
        </p>
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#F4F4F5' }}>
          Gráficas
        </h1>
        <div className="mt-3 h-px w-24" style={{ backgroundColor: '#22C55E', opacity: 0.4 }} />
      </div>

      <div className="grid grid-cols-2 gap-6">

        <div className="rounded-xl p-6" style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#71717A' }}>Gráfica 1</p>
          <p className="text-sm font-medium mb-6" style={{ color: '#F4F4F5' }}>Evolución del fitness por generación</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={fitnessHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F1F22" />
              <XAxis dataKey="generacion" tick={{ fill: '#52525B', fontSize: 11 }} axisLine={{ stroke: '#1F1F22' }} tickLine={false} />
              <YAxis tick={{ fill: '#52525B', fontSize: 11 }} axisLine={{ stroke: '#1F1F22' }} tickLine={false} width={55} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="fitness" stroke="#22C55E" strokeWidth={2} dot={{ fill: '#22C55E', r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl p-6" style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#71717A' }}>Gráfica 2</p>
          <p className="text-sm font-medium mb-6" style={{ color: '#F4F4F5' }}>Parámetros del mejor individuo</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={bestPerGenData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F1F22" />
              <XAxis dataKey="generacion" tick={{ fill: '#52525B', fontSize: 11 }} axisLine={{ stroke: '#1F1F22' }} tickLine={false} />
              <YAxis tick={{ fill: '#52525B', fontSize: 11 }} axisLine={{ stroke: '#1F1F22' }} tickLine={false} width={55} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: '#71717A', fontSize: '11px' }} />
              <Line type="monotone" dataKey="rpm" stroke="#3B82F6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="temperatura" stroke="#F59E0B" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="flujo" stroke="#A78BFA" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl p-6" style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#71717A' }}>Gráfica 3</p>
          <p className="text-sm font-medium mb-6" style={{ color: '#F4F4F5' }}>Dispersión de individuos — Fitness vs RPM</p>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F1F22" />
              <XAxis dataKey="rpm" name="RPM" tick={{ fill: '#52525B', fontSize: 11 }} axisLine={{ stroke: '#1F1F22' }} tickLine={false} label={{ value: 'RPM', position: 'insideBottom', offset: -2, fill: '#52525B', fontSize: 10 }} />
              <YAxis dataKey="fitness" name="Fitness" tick={{ fill: '#52525B', fontSize: 11 }} axisLine={{ stroke: '#1F1F22' }} tickLine={false} width={55} />
              <ZAxis range={[20, 20]} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3', stroke: '#1F1F22' }} />
              <Scatter data={allIndividuals} fill="#22C55E" fillOpacity={0.5} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl p-6" style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#71717A' }}>Gráfica 4</p>
          <p className="text-sm font-medium mb-6" style={{ color: '#F4F4F5' }}>Dispersión de individuos — Fitness vs Flujo</p>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F1F22" />
              <XAxis dataKey="flujo" name="Flujo" tick={{ fill: '#52525B', fontSize: 11 }} axisLine={{ stroke: '#1F1F22' }} tickLine={false} tickFormatter={(v) => v.toFixed(1)} label={{ value: 'Flujo', position: 'insideBottom', offset: -2, fill: '#52525B', fontSize: 10 }} />
              <YAxis dataKey="fitness" name="Fitness" tick={{ fill: '#52525B', fontSize: 11 }} axisLine={{ stroke: '#1F1F22' }} tickLine={false} width={55} />
              <ZAxis range={[20, 20]} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3', stroke: '#1F1F22' }} />
              <Scatter data={allIndividuals} fill="#A78BFA" fillOpacity={0.5} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl p-6 col-span-2" style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#71717A' }}>Gráfica 5</p>
          <div className="flex items-center gap-2 mb-6">
            <p className="text-sm font-medium" style={{ color: '#F4F4F5' }}>Evolución de la población — Distribución del fitness</p>
            <div className="relative group">
              <div className="w-4 h-4 rounded-full flex items-center justify-center cursor-help" style={{ backgroundColor: '#1F1F22', border: '1px solid #3F3F46' }}>
                <span className="text-xs" style={{ color: '#71717A' }}>?</span>
              </div>
              <div className="absolute bottom-6 left-0 w-64 p-3 rounded-lg text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity z-10"
                style={{ backgroundColor: '#1A1A1C', border: '1px solid #2F2F32', color: '#A1A1AA' }}>
                El área sombreada representa el rango de fitness entre el mejor y peor individuo de cada generación. Cuando se achica, la población está convergiendo.
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={populationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F1F22" />
              <XAxis dataKey="generacion" tick={{ fill: '#52525B', fontSize: 11 }} axisLine={{ stroke: '#1F1F22' }} tickLine={false} />
              <YAxis tick={{ fill: '#52525B', fontSize: 11 }} axisLine={{ stroke: '#1F1F22' }} tickLine={false} width={55} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: '#71717A', fontSize: '11px' }} />
              <Area type="monotone" dataKey="mejor" stroke="#22C55E" fill="#22C55E" fillOpacity={0.15} strokeWidth={2} name="mejor" />
              <Area type="monotone" dataKey="peor" stroke="#EF4444" fill="#0A0A0B" fillOpacity={1} strokeWidth={2} name="peor" />
              <Line type="monotone" dataKey="promedio" stroke="#F59E0B" strokeWidth={2} dot={false} name="promedio" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}

export default ChartsView