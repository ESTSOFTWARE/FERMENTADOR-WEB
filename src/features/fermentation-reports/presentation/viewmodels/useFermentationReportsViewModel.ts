import { useState, useEffect, useCallback }           from 'react'
import { FermentationRepositoryImpl }                 from '../../../fermentation/data/repositories/FermentationRepositoryImpl'
import { GetSessionsHistoryUseCase }                  from '../../domain/usecases/get-sessions-history.usecase'
import { GetReportBySessionUseCase }                  from '../../domain/usecases/get-report-by-session.usecase'
import type { ReportWithEfficiency }                  from '../types/report-with-efficiency.types'
import { mergeReport }                                from '../utils/merge-report'

const repo               = new FermentationRepositoryImpl()
const getSessionsHistory = new GetSessionsHistoryUseCase(repo)
const getReportBySession = new GetReportBySessionUseCase(repo)

export const useFermentationReportsViewModel = () => {
  const [reports, setReports] = useState<ReportWithEfficiency[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  const fetchReports = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const sessions = await getSessionsHistory.execute()

      const reportResults = await Promise.allSettled(
        sessions.map(s => getReportBySession.execute(s.id).catch(() => null))
      )

      const merged: ReportWithEfficiency[] = sessions.map((session, i) => {
        const result = reportResults[i]
        const report = result.status === 'fulfilled' ? result.value : null
        return mergeReport(session, report)
      })

      setReports(merged)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los reportes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchReports() }, [fetchReports])

  return { reports, loading, error, refetch: fetchReports }
}
