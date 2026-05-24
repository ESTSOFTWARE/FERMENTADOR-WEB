import type { Experiment } from '../../models/Experiment'
import type { Generation } from '../../models/Generation'

export interface ExperimentResult {
  experiment:  Experiment
  generations: Generation[]
}
