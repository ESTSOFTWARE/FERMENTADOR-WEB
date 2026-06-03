import { Star, AlertTriangle } from 'lucide-react'

export const PRIORITY_CONFIG = {
  important: { label: 'Importante', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', Icon: Star          },
  urgent:    { label: 'Urgente',    color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  Icon: AlertTriangle },
} as const
