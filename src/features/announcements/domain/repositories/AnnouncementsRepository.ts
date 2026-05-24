import type { Announcement }     from '../models/Announcement'
import type { AnnouncementBody } from '../dtos/announcement-body.dto'

export interface AnnouncementsRepository {
  getAll():                                             Promise<Announcement[]>
  create(body: AnnouncementBody):                       Promise<Announcement>
  update(id: number, body: AnnouncementBody):           Promise<Announcement>
  delete(id: number):                                   Promise<void>
  pin(id: number, durationDays: number | null):         Promise<Announcement>
  unpin(id: number):                                    Promise<Announcement>
}
