import type { ScheduleFermentationRequest } from '../dtos/request/schedule-fermentation.request'
import type { StopFermentationRequest }      from '../dtos/request/stop-fermentation.request'
import type { FermentationSession }          from '../models/FermentationSession'
import type { FermentationReport }           from '../models/FermentationReport'
import type { ReportHistory }                from '../models/ReportHistory'

export interface FermentationRepository {
  scheduleFermentation(data: ScheduleFermentationRequest): Promise<FermentationSession>
  startFermentation(sessionId: number): Promise<FermentationSession>
  stopFermentation(sessionId: number, data: StopFermentationRequest): Promise<FermentationSession>
  getReport(sessionId: number): Promise<FermentationReport>
  getReportHistory(): Promise<ReportHistory[]>
}
