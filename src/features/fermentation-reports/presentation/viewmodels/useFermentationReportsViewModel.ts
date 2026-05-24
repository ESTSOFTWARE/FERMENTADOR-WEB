import { useState, useEffect, useCallback }  from 'react'
import { fermentationApi }                   from '../../../fermentation/data/api/fermentationApi'
import type { ReportWithEfficiency }         from '../types/report-with-efficiency.types'
import { mergeReport }                       from '../utils/merge-report'

export const useFermentationReportsViewModel = () => {
  const [reports, setReports] = useState<ReportWithEfficiency[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  const fetchReports = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const sessions = await fermentationApi.getSessionsHistory()

      const reportResults = await Promise.allSettled(
        sessions.map(s =>
          fermentationApi.getReportBySessionId(s.id).catch(() => null)
        )
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
