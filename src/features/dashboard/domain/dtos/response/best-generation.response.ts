import type { Individual } from '../../models/Individual'

export interface BestGeneration {
  generation:      number
  best_fitness:    number
  worst_fitness:   number
  avg_fitness:     number
  best_individual: Individual
}
