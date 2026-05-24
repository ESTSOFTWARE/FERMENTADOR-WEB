import { useState, useEffect }          from 'react'
import { ExperimentRepositoryImpl }     from '../../data/repositories/ExperimentRepositoryImpl'
import { GetSimulationUseCase }         from '../../domain/usecases/get-simulation.usecase'
import type { Simulation }              from '../../domain/models/Simulation'

const repository     = new ExperimentRepositoryImpl()
const getSimulation  = new GetSimulationUseCase(repository)

export const useSimulationViewModel = (individualId: string) => {
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [simulation, setSimulation] = useState<Simulation | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getSimulation.execute(individualId)
        setSimulation(data)
      } catch {
        setError('Error al cargar la simulación')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [individualId])

  return { loading, error, simulation }
}
