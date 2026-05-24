import { useState, useEffect }        from 'react'
import { AnnouncementsRepositoryImpl } from '../../data/repositories/AnnouncementsRepositoryImpl'
import { GetAnnouncementsUseCase }     from '../../domain/usecases/get-announcements.usecase'
import type { Announcement }           from '../../domain/models/Announcement'

const getAnnouncements = new GetAnnouncementsUseCase(new AnnouncementsRepositoryImpl())

export const useAnnouncementsViewModel = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState<string | null>(null)

  useEffect(() => {
    getAnnouncements.execute()
      .then(setAnnouncements)
      .catch(err => setError(err instanceof Error ? err.message : 'Error al cargar los comunicados.'))
      .finally(() => setLoading(false))
  }, [])

  return { announcements, loading, error }
}
