import { fermentationApi }                   from '../api/fermentationApi'
import type { FermentationRepository }        from '../../domain/repositories/FermentationRepository'
import type { ScheduleFermentationRequest }   from '../../domain/dtos/request/schedule-fermentation.request'
import type { StopFermentationRequest }       from '../../domain/dtos/request/stop-fermentation.request'
import type { FermentationSession }           from '../../domain/models/FermentationSession'
import type { FermentationReport }            from '../../domain/models/FermentationReport'
import type { ReportHistory }                 from '../../domain/models/ReportHistory'
import type { PredictionResult }              from '../../domain/models/PredictionResult'

export class FermentationRepositoryImpl implements FermentationRepository {

  async scheduleFermentation(data: ScheduleFermentationRequest): Promise<FermentationSession> {
    return fermentationApi.scheduleFermentation(data) as Promise<FermentationSession>
  }

  async startFermentation(sessionId: number): Promise<FermentationSession> {
    return fermentationApi.startFermentation(sessionId) as Promise<FermentationSession>
  }

  async stopFermentation(sessionId: number, data: StopFermentationRequest): Promise<FermentationSession> {
    return fermentationApi.stopFermentation(sessionId, data.interrupted) as Promise<FermentationSession>
  }

  async getSessionsHistory(): Promise<FermentationSession[]> {
    return fermentationApi.getSessionsHistory() as Promise<FermentationSession[]>
  }

  // Sesiones + su reporte en una sola petición (evita el N+1)
  async getSessionsWithReports(): Promise<{ session: FermentationSession; report: FermentationReport | null }[]> {
    return fermentationApi.getSessionsWithReports() as Promise<
      { session: FermentationSession; report: FermentationReport | null }[]
    >
  }

  async getReport(sessionId: number): Promise<FermentationReport> {
    return fermentationApi.getReportBySessionId(sessionId) as Promise<FermentationReport>
  }

  async getReportHistory(): Promise<ReportHistory[]> {
    return fermentationApi.getReportHistory() as Promise<ReportHistory[]>
  }

  async getActiveSession(): Promise<FermentationSession | null> {
    return fermentationApi.getActiveSession() as Promise<FermentationSession | null>
  }

  async requestPrediction(sessionId: number): Promise<PredictionResult> {
    return fermentationApi.requestPrediction(sessionId) as Promise<PredictionResult>
  }
}
