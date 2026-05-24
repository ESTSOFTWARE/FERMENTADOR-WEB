import type { AnnouncementsRepository } from '../repositories/AnnouncementsRepository'
import type { Announcement }            from '../models/Announcement'

export class PinAnnouncementUseCase {
  private readonly repository: AnnouncementsRepository

  constructor(repository: AnnouncementsRepository) {
    this.repository = repository
  }

  execute(id: number, durationDays: number | null): Promise<Announcement> {
    return this.repository.pin(id, durationDays)
  }
}
