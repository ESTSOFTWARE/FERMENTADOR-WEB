import { useState, useEffect, useCallback }           from 'react'
import { FermentationRepositoryImpl }                 from '../../../fermentation/data/repositories/FermentationRepositoryImpl'
import type { ReportWithEfficiency }                  from '../types/report-with-efficiency.types'
import { mergeReport }                                from '../utils/merge-report'

const repo = new FermentationRepositoryImpl()

export const useFermentationReportsViewModel = () => {
  const [reports, setReports] = useState<ReportWithEfficiency[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  const fetchReports = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Una sola petición trae sesiones + su reporte (antes: 1 + N peticiones).
      const data = await repo.getSessionsWithReports()
      const merged: ReportWithEfficiency[] = data.map(
        ({ session, report }) => mergeReport(session, report)
      )
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
