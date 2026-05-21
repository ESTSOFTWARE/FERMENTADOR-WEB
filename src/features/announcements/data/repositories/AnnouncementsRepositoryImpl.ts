import { announcementsApi } from '../api/announcementsApi'
import type { Announcement } from '../../domain/models/Announcement'

export class AnnouncementsRepositoryImpl {
  getAll(): Promise<Announcement[]> {
    return announcementsApi.getAll()
  }
}
