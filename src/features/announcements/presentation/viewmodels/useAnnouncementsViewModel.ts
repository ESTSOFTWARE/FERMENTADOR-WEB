import { useState, useEffect } from 'react'
import { AnnouncementsRepositoryImpl } from '../../data/repositories/AnnouncementsRepositoryImpl'
import type { Announcement } from '../../domain/models/Announcement'

const repository = new AnnouncementsRepositoryImpl()

const LABEL_COLORS: Record<string, string> = {
  NUEVO:    '#22C55E',
  MEJORA:   '#3B82F6',
  AVISO:    '#F59E0B',
  CRÍTICO:  '#F43F5E',
  CRITICO:  '#F43F5E',
}

export const labelColor = (label: string) =>
  LABEL_COLORS[label.toUpperCase()] ?? '#A855F7'

export const useAnnouncementsViewModel = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    repository.getAll()
      .then(setAnnouncements)
      .catch(err => setError(err instanceof Error ? err.message : 'Error al cargar los comunicados.'))
      .finally(() => setLoading(false))
  }, [])

  return { announcements, loading, error }
}
