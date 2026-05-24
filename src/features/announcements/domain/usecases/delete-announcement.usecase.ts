import type { AnnouncementsRepository } from '../repositories/AnnouncementsRepository'

export class DeleteAnnouncementUseCase {
  private readonly repository: AnnouncementsRepository

  constructor(repository: AnnouncementsRepository) {
    this.repository = repository
  }

  execute(id: number): Promise<void> {
    return this.repository.delete(id)
  }
}
