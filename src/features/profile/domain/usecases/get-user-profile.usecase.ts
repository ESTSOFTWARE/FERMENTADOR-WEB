import type { ProfileRepository } from '../repositories/ProfileRepository'
import type { UserProfile }       from '../models/UserProfile'

export class GetUserProfileUseCase {
  private readonly repository: ProfileRepository

  constructor(repository: ProfileRepository) {
    this.repository = repository
  }

  execute(userId: number): Promise<UserProfile> {
    return this.repository.getUser(userId)
  }
}
