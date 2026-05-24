import { useParams, useNavigate } from 'react-router-dom'
import { useExperimentViewModel } from '../viewmodels/useExperimentViewModel'
import { useState } from 'react'
import { useExperimentStore } from '../../../../core/store/useExperimentStore'
import type { Individual } from '../../domain/models/Individual'

const ExperimentView = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setIndividualId } = useExperimentStore()
  const { loading, error, experiment, bestPerGeneration } = useExperimentViewModel(id!)
  const [selectedGen, setSelectedGen] = useState(0)

  const handleIndividualClick = (individual: Individual) => {
    setIndividualId(individual.id)
    navigate(`/simulation/${individual.id}`)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0B' }}>
      <p className="text-sm tracking-widest uppercase animate-pulse" style={{ color: '#22C55E' }}>Cargando experimento...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0B' }}>
      <p className="text-sm text-red-400">{error}</p>
    </div>
  )

  const currentGeneration = experiment?.generations[selectedGen]
  const bestId = bestPerGeneration?.generations[selectedGen]?.best_individual?.id

  return (
    <div className="min-h-screen flex flex-col px-12 py-12" style={{ backgroundColor: '#0A0A0B' }}>

      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#22C55E' }}>
          Resultados
        </p>
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#F4F4F5' }}>
          Generaciones
        </h1>
        <div className="mt-3 h-px w-24" style={{ backgroundColor: '#22C55E', opacity: 0.4 }} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'pH', value: experiment?.experiment.ph },
          { label: 'Temperatura', value: `${experiment?.experiment.temperature} °C` },
          { label: 'Azúcar', value: `${experiment?.experiment.sugar} g/L` },
        ].map(item => (
          <div key={item.label} className="rounded-xl px-6 py-4" style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#52525B' }}>{item.label}</p>
            <p className="text-xl font-semibold" style={{ color: '#F4F4F5' }}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {experiment?.generations.map((gen, i) => (
          <button
            key={gen.generation}
            onClick={() => setSelectedGen(i)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider transition-all"
            style={{
              backgroundColor: selectedGen === i ? '#22C55E' : '#111113',
              color: selectedGen === i ? '#0A0A0B' : '#71717A',
              border: `1px solid ${selectedGen === i ? '#22C55E' : '#1F1F22'}`,
            }}
          >
            Gen {gen.generation}
          </button>
        ))}
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1" style={{ backgroundColor: '#1F1F22' }} />
        <span className="text-xs tracking-widest uppercase px-3 py-1 rounded-full" style={{ backgroundColor: '#16A34A22', color: '#22C55E', border: '1px solid #16A34A44' }}>
          Mejor fitness: {currentGeneration?.best_fitness.toFixed(4)}
        </span>
        <div className="h-px flex-1" style={{ backgroundColor: '#1F1F22' }} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {currentGeneration?.individuals.map(ind => {
          const isBest = ind.id === bestId
          return (
            <button
              key={ind.id}
              onClick={() => isBest ? handleIndividualClick(ind) : undefined}
              className="rounded-xl p-5 text-left transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: isBest ? '#0D2818' : '#111113',
                border: `1px solid ${isBest ? '#22C55E' : '#1F1F22'}`,
                cursor: isBest ? 'pointer' : 'not-allowed',
                opacity: isBest ? 1 : 0.5,
              }}
            >
              {isBest && (
                <span className="text-xs px-2 py-0.5 rounded-full mb-3 inline-block" style={{ backgroundColor: '#16A34A33', color: '#22C55E' }}>
                  ★ Mejor
                </span>
              )}
              <div className="space-y-2 mt-1">
                {[
                  { label: 'Fitness', value: ind.fitness?.toFixed(4) ?? 'N/A' },
                  { label: 'RPM', value: ind.rpm?.toFixed(1) ?? 'N/A' },
                  { label: 'Temperatura', value: `${ind.temperature?.toFixed(1) ?? 'N/A'} °C` },
                  { label: 'Flujo', value: ind.flow?.toFixed(2) ?? 'N/A' },
                  { label: 'Eficiencia', value: ind.efficiency?.toFixed(3) ?? 'N/A' },
                  { label: 'Etanol', value: `${ind.ethanol?.toFixed(1) ?? 'N/A'} g/L` },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: '#52525B' }}>{item.label}</span>
                    <span className="text-xs font-medium" style={{ color: isBest ? '#22C55E' : '#A1A1AA' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ExperimentView