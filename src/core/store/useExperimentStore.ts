import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RunExperimentResponse } from '../../features/dashboard/domain/dtos/response/run-experiment.response'

interface ExperimentStore {
  experimentId: string | null
  individualId: string | null
  lastResult: RunExperimentResponse | null
  setExperimentId: (id: string) => void
  setIndividualId: (id: string) => void
  setLastResult: (result: RunExperimentResponse) => void
}

export const useExperimentStore = create<ExperimentStore>()(
  persist(
    (set) => ({
      experimentId: null,
      individualId: null,
      lastResult: null,
      setExperimentId: (id) => set({ experimentId: id }),
      setIndividualId: (id) => set({ individualId: id }),
      setLastResult: (result) => set({ lastResult: result }),
    }),
    {
      name: 'fermest-store',
    }
  )
)