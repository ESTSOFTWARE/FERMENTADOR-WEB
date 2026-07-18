import type { ScheduleFermentationRequest } from '../dtos/request/schedule-fermentation.request'
import type { StopFermentationRequest }      from '../dtos/request/stop-fermentation.request'
import type { FermentationSession }          from '../models/FermentationSession'
import type { FermentationReport }           from '../models/FermentationReport'
import type { ReportHistory }                from '../models/ReportHistory'
import type { PredictionResult }             from '../models/PredictionResult'

export interface FermentationRepository {
  getActiveSession():                                              Promise<FermentationSession | null>
  scheduleFermentation(data: ScheduleFermentationRequest):        Promise<FermentationSession>
  startFermentation(sessionId: number):                           Promise<FermentationSession>
  stopFermentation(sessionId: number, data: StopFermentationRequest): Promise<FermentationSession>
  getSessionsHistory():                                            Promise<FermentationSession[]>
  getReport(sessionId: number):                                   Promise<FermentationReport>
  getReportHistory():                                             Promise<ReportHistory[]>
  requestPrediction(sessionId: number):                           Promise<PredictionResult>
}
