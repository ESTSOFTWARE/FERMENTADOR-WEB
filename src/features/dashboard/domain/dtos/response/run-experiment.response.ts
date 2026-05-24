import type { BestIndividual } from './best-individual.response'

export interface RunExperimentResponse {
  experiment_id:   string
  best_individual: BestIndividual
  history:         number[]
  history_worst:   number[]
  history_avg:     number[]
}
