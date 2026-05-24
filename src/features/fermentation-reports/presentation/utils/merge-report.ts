import type { FermentationSessionResponse } from '../../../fermentation/domain/dtos/response/fermentation-session.response'
import type { FermentationReportData }       from '../../../fermentation/domain/dtos/response/fermentation-report.response'
import type { ReportWithEfficiency }         from '../types/report-with-efficiency.types'
import { mapStatus }                         from './map-status'
import { formatDatetime }                    from './format-datetime'
import { calcDuration }                      from './calc-duration'

export const mergeReport = (
  session: FermentationSessionResponse,
  report:  FermentationReportData | null,
): ReportWithEfficiency => {
  const ph   = report?.ph_final          ?? report?.ph_last_reading          ?? report?.ph_initial          ?? 0
  const temp = report?.temperature_final ?? report?.temperature_last_reading ?? report?.temperature_initial ?? 0
  const etanol = report?.ethanol_detected ?? report?.alcohol_final ?? report?.alcohol_last_reading ?? 0

  return {
    id:       session.id,
    circuit:  session.circuit_id,
    start:    session.actual_start
                ? formatDatetime(session.actual_start)
                : formatDatetime(session.scheduled_start),
    end:      session.actual_end ? formatDatetime(session.actual_end) : '—',
    duration: session.actual_start && session.actual_end
                ? calcDuration(session.actual_start, session.actual_end)
                : '—',
    ph:       Math.round(ph    * 100) / 100,
    temp:     Math.round(temp  * 10)  / 10,
    sugar:    report?.initial_sugar ?? 0,
    etanol:   Math.round(etanol * 100) / 100,
    status:   mapStatus(session.status),
    efficiency: report?.efficiency ?? null,
  }
}
