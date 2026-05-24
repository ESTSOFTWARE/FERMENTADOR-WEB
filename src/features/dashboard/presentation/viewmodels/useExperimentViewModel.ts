import { useState, useEffect }             from 'react'
import { ExperimentRepositoryImpl }        from '../../data/repositories/ExperimentRepositoryImpl'
import { GetExperimentUseCase }            from '../../domain/usecases/get-experiment.usecase'
import { GetBestPerGenerationUseCase }     from '../../domain/usecases/get-best-per-generation.usecase'
import type { ExperimentResult }           from '../../domain/dtos/response/experiment-result.response'
import type { BestPerGenerationResult }    from '../../domain/dtos/response/best-per-generation-result.response'

const repository          = new ExperimentRepositoryImpl()
const getExperiment       = new GetExperimentUseCase(repository)
const getBestPerGeneration = new GetBestPerGenerationUseCase(repository)

export const useExperimentViewModel = (experimentId: string) => {
  const [loading, setLoading]                     = useState(true)
  const [error, setError]                         = useState<string | null>(null)
  const [experiment, setExperiment]               = useState<ExperimentResult | null>(null)
  const [bestPerGeneration, setBestPerGeneration] = useState<BestPerGenerationResult | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [exp, best] = await Promise.all([
          getExperiment.execute(experimentId),
          getBestPerGeneration.execute(experimentId),
        ])
        setExperiment(exp)
        setBestPerGeneration(best)
      } catch {
        setError('Error al cargar el experimento')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [experimentId])

  return { loading, error, experiment, bestPerGeneration }
}
