import type { ScheduleFermentationRequest }  from '../../domain/dtos/request/schedule-fermentation.request'
import type { FermentationSessionResponse }  from '../../domain/dtos/response/fermentation-session.response'
import type { FermentationReportData }       from '../../domain/dtos/response/fermentation-report.response'
import type { ReportHistoryItem }            from '../../domain/dtos/response/report-history-item.response'

const BASE_URL = import.meta.env.VITE_API_URL

const getHeaders = () => ({
  'Content-Type':               'application/json',
  'ngrok-skip-browser-warning': 'true',
  'Authorization':              `Bearer ${localStorage.getItem('access_token') ?? ''}`,
})

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const msg = await res.text().catch(() => `HTTP ${res.status}`)
    throw new Error(msg)
  }
  return res.json()
}

export const fermentationApi = {
  scheduleFermentation: (body: ScheduleFermentationRequest): Promise<FermentationSessionResponse> =>
    fetch(`${BASE_URL}/fermentation/schedule`, {
      method:  'POST',
      headers: getHeaders(),
      body:    JSON.stringify(body),
    }).then(handleResponse<FermentationSessionResponse>),

  startFermentation: (sessionId: number): Promise<FermentationSessionResponse> =>
    fetch(`${BASE_URL}/fermentation/${sessionId}/start`, {
      method:  'POST',
      headers: getHeaders(),
    }).then(handleResponse<FermentationSessionResponse>),

  stopFermentation: (sessionId: number, interrupted: boolean): Promise<FermentationSessionResponse> =>
    fetch(`${BASE_URL}/fermentation/${sessionId}/stop`, {
      method:  'POST',
      headers: getHeaders(),
      body:    JSON.stringify({ interrupted }),
    }).then(handleResponse<FermentationSessionResponse>),

  getActiveSession: (): Promise<FermentationSessionResponse | null> =>
    fetch(`${BASE_URL}/fermentation/active`, {
      headers: getHeaders(),
    }).then(handleResponse<FermentationSessionResponse | null>),

  getSessionsHistory: (): Promise<FermentationSessionResponse[]> =>
    fetch(`${BASE_URL}/fermentation/sessions`, {
      headers: getHeaders(),
    }).then(handleResponse<FermentationSessionResponse[]>),

  getReportBySessionId: (sessionId: number): Promise<FermentationReportData> =>
    fetch(`${BASE_URL}/fermentation/${sessionId}/report`, {
      headers: getHeaders(),
    }).then(handleResponse<FermentationReportData>),

  getReportHistory: (): Promise<ReportHistoryItem[]> =>
    fetch(`${BASE_URL}/fermentation/history`, {
      headers: getHeaders(),
    }).then(handleResponse<ReportHistoryItem[]>),
}
