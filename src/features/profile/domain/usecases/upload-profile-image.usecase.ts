import type { ProfileRepository } from '../repositories/ProfileRepository'

export class UploadProfileImageUseCase {
  private readonly repository: ProfileRepository

  constructor(repository: ProfileRepository) {
    this.repository = repository
  }

  async execute(file: File): Promise<string> {
    const { profile_image } = await this.repository.uploadProfileImage(file)

    localStorage.setItem('profile_image', profile_image)
    const stored = localStorage.getItem('user_data')
    if (stored) {
      localStorage.setItem('user_data', JSON.stringify({ ...JSON.parse(stored), profile_image }))
    }

    return profile_image
  }
}
