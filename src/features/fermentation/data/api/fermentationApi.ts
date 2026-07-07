import type { ScheduleFermentationRequest } from '../../domain/dtos/request/schedule-fermentation.request'
import type { FermentationSessionResponse } from '../../domain/dtos/response/fermentation-session.response'
import type { FermentationReportData }      from '../../domain/dtos/response/fermentation-report.response'
import type { ReportHistoryItem }           from '../../domain/dtos/response/report-history-item.response'
import { apiClient }                        from '../../../../core/network/client'

export interface SessionWithReportResponse {
  session: FermentationSessionResponse
  report:  FermentationReportData | null
}

export const fermentationApi = {
  scheduleFermentation: (body: ScheduleFermentationRequest) =>
    apiClient.post<FermentationSessionResponse>('/fermentation/schedule', body),

  startFermentation: (sessionId: number) =>
    apiClient.post<FermentationSessionResponse>(`/fermentation/${sessionId}/start`),

  stopFermentation: (sessionId: number, interrupted: boolean) =>
    apiClient.post<FermentationSessionResponse>(`/fermentation/${sessionId}/stop`, { interrupted }),

  getActiveSession: () =>
    apiClient.get<FermentationSessionResponse | null>('/fermentation/active'),

  getSessionsHistory: () =>
    apiClient.get<FermentationSessionResponse[]>('/fermentation/sessions'),

  // Sesiones + su reporte en una sola petición (evita el N+1)
  getSessionsWithReports: () =>
    apiClient.get<SessionWithReportResponse[]>('/fermentation/sessions-with-reports'),

  getReportBySessionId: (sessionId: number) =>
    apiClient.get<FermentationReportData>(`/fermentation/${sessionId}/report`),

  getReportHistory: () =>
    apiClient.get<ReportHistoryItem[]>('/fermentation/history'),
}
