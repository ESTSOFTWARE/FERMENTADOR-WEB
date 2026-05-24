import type { AnnouncementsRepository } from '../repositories/AnnouncementsRepository'
import type { Announcement }            from '../models/Announcement'
import type { AnnouncementBody }        from '../dtos/announcement-body.dto'

export class CreateAnnouncementUseCase {
  private readonly repository: AnnouncementsRepository

  constructor(repository: AnnouncementsRepository) {
    this.repository = repository
  }

  execute(body: AnnouncementBody): Promise<Announcement> {
    return this.repository.create(body)
  }
}
