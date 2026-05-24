import { useState, useEffect }              from 'react'
import { AnnouncementsRepositoryImpl }       from '../../data/repositories/AnnouncementsRepositoryImpl'
import { labelColor }                        from '../utils/label-color'
import type { Announcement }                 from '../../domain/models/Announcement'

const repository = new AnnouncementsRepositoryImpl()

export const useAnnouncementsViewModel = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState<string | null>(null)

  useEffect(() => {
    repository.getAll()
      .then(setAnnouncements)
      .catch(err => setError(err instanceof Error ? err.message : 'Error al cargar los comunicados.'))
      .finally(() => setLoading(false))
  }, [])

  return { announcements, loading, error, labelColor }
}
