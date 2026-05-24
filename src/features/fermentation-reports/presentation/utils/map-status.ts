import type { Status } from '../types/Status'

export const mapStatus = (s: string): Status =>
  (['running', 'completed', 'interrupted', 'scheduled'].includes(s)
    ? s
    : 'completed') as Status
