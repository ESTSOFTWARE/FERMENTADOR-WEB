import type { AnnouncementsRepository } from '../../domain/repositories/AnnouncementsRepository'
import type { Announcement }            from '../../domain/models/Announcement'
import type { AnnouncementBody }        from '../../domain/dtos/announcement-body.dto'
import { announcementsApi }            from '../api/announcementsApi'

export class AnnouncementsRepositoryImpl implements AnnouncementsRepository {
  getAll(): Promise<Announcement[]> {
    return announcementsApi.getAll()
  }

  create(body: AnnouncementBody): Promise<Announcement> {
    return announcementsApi.create(body)
  }

  update(id: number, body: AnnouncementBody): Promise<Announcement> {
    return announcementsApi.update(id, body)
  }

  delete(id: number): Promise<void> {
    return announcementsApi.delete(id)
  }

  pin(id: number, durationDays: number | null): Promise<Announcement> {
    return announcementsApi.pin(id, durationDays)
  }

  unpin(id: number): Promise<Announcement> {
    return announcementsApi.unpin(id)
  }
}
