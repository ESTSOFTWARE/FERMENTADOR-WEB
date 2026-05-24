import type { Report } from '../../domain/models/Report'

export type ReportWithEfficiency = Report & { efficiency: number | null }
