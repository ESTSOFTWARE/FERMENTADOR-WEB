import { useState }                    from 'react'
import { ExperimentRepositoryImpl }    from '../../data/repositories/ExperimentRepositoryImpl'
import { RunExperimentUseCase }        from '../../domain/usecases/run-experiment.usecase'
import type { RunExperimentRequest }   from '../../domain/dtos/request/run-experiment.request'
import type { RunExperimentResponse }  from '../../domain/dtos/response/run-experiment.response'

const repository     = new ExperimentRepositoryImpl()
const runExperiment  = new RunExperimentUseCase(repository)

export const useDashboardViewModel = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [result, setResult]   = useState<RunExperimentResponse | null>(null)

  const handleRunExperiment = async (data: RunExperimentRequest) => {
    setLoading(true)
    setError(null)
    try {
      const response = await runExperiment.execute(data)
      setResult(response)
      return response
    } catch {
      setError('Error al ejecutar el experimento')
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, result, runExperiment: handleRunExperiment }
}
