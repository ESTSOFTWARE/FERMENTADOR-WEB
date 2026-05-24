import type { Individual } from './Individual'

export interface Generation {
  generation:   number
  best_fitness: number
  individuals:  Individual[]
}
