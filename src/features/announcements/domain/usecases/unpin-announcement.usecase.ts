import type { AnnouncementsRepository } from '../repositories/AnnouncementsRepository'
import type { Announcement }            from '../models/Announcement'

export class UnpinAnnouncementUseCase {
  private readonly repository: AnnouncementsRepository

  constructor(repository: AnnouncementsRepository) {
    this.repository = repository
  }

  execute(id: number): Promise<Announcement> {
    return this.repository.unpin(id)
  }
}
