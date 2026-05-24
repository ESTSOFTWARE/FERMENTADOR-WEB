import type { RunExperimentRequest } from '../../domain/dtos/request/run-experiment.request'

export type ExperimentSummaryProps = {
  form:     RunExperimentRequest
  error:    string | null
  onSubmit: () => void
}
