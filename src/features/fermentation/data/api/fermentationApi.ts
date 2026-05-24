import type { ScheduleFermentationRequest }  from '../../domain/dtos/request/schedule-fermentation.request'
import type { FermentationSessionResponse }  from '../../domain/dtos/response/fermentation-session.response'
import type { FermentationReportData }       from '../../domain/dtos/response/fermentation-report.response'
import type { ReportHistoryItem }            from '../../domain/dtos/response/report-history-item.response'
import { authHeaders, handleResponse }       from '../../../../core/api/http'

const BASE_URL = import.meta.env.VITE_API_URL

export const fermentationApi = {
  scheduleFermentation: (body: ScheduleFermentationRequest): Promise<FermentationSessionResponse> =>
    fetch(`${BASE_URL}/fermentation/schedule`, {
      method:  'POST',
      headers: authHeaders(),
      body:    JSON.stringify(body),
    }).then(handleResponse<FermentationSessionResponse>),

  startFermentation: (sessionId: number): Promise<FermentationSessionResponse> =>
    fetch(`${BASE_URL}/fermentation/${sessionId}/start`, {
      method:  'POST',
      headers: authHeaders(),
    }).then(handleResponse<FermentationSessionResponse>),

  stopFermentation: (sessionId: number, interrupted: boolean): Promise<FermentationSessionResponse> =>
    fetch(`${BASE_URL}/fermentation/${sessionId}/stop`, {
      method:  'POST',
      headers: authHeaders(),
      body:    JSON.stringify({ interrupted }),
    }).then(handleResponse<FermentationSessionResponse>),

  getActiveSession: (): Promise<FermentationSessionResponse | null> =>
    fetch(`${BASE_URL}/fermentation/active`, {
      headers: authHeaders(),
    }).then(handleResponse<FermentationSessionResponse | null>),

  getSessionsHistory: (): Promise<FermentationSessionResponse[]> =>
    fetch(`${BASE_URL}/fermentation/sessions`, {
      headers: authHeaders(),
    }).then(handleResponse<FermentationSessionResponse[]>),

  getReportBySessionId: (sessionId: number): Promise<FermentationReportData> =>
    fetch(`${BASE_URL}/fermentation/${sessionId}/report`, {
      headers: authHeaders(),
    }).then(handleResponse<FermentationReportData>),

  getReportHistory: (): Promise<ReportHistoryItem[]> =>
    fetch(`${BASE_URL}/fermentation/history`, {
      headers: authHeaders(),
    }).then(handleResponse<ReportHistoryItem[]>),
}
