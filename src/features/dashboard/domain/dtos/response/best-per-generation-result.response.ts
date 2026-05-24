import type { BestGeneration } from './best-generation.response'

export interface BestPerGenerationResult {
  experiment_id: string
  generations:   BestGeneration[]
}
