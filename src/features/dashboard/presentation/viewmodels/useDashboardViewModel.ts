import { useState } from 'react'
import type { RunExperimentRequest } from '../../domain/dtos/request/run-experiment.request'
import type { RunExperimentResponse } from '../../domain/dtos/response/run-experiment.response'
import { ExperimentRepositoryImpl } from '../../data/repositories/ExperimentRepositoryImpl'

const repository = new ExperimentRepositoryImpl()

export const useDashboardViewModel = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [result, setResult]   = useState<RunExperimentResponse | null>(null)

  const runExperiment = async (data: RunExperimentRequest) => {
    setLoading(true)
    setError(null)
    try {
      const response = await repository.runExperiment(data)
      setResult(response)
      return response
    } catch {
      setError('Error al ejecutar el experimento')
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, result, runExperiment }
}
