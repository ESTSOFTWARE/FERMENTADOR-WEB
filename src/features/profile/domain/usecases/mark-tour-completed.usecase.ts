import type { ProfileRepository } from '../repositories/ProfileRepository'

export class MarkTourCompletedUseCase {
  private readonly repository: ProfileRepository

  constructor(repository: ProfileRepository) {
    this.repository = repository
  }

  execute(): Promise<{ message: string }> {
    return this.repository.markTourCompleted()
  }
}
