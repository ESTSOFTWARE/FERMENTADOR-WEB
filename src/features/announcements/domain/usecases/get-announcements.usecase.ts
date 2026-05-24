import type { AnnouncementsRepository } from '../repositories/AnnouncementsRepository'
import type { Announcement }            from '../models/Announcement'

export class GetAnnouncementsUseCase {
  private readonly repository: AnnouncementsRepository

  constructor(repository: AnnouncementsRepository) {
    this.repository = repository
  }

  execute(): Promise<Announcement[]> {
    return this.repository.getAll()
  }
}
