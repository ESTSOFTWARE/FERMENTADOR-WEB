import type { ProfileRepository }  from '../repositories/ProfileRepository'
import type { UpdateUserRequest }  from '../dtos/request/update-user.request'
import type { UserProfile }        from '../models/UserProfile'

export class UpdateUserInfoUseCase {
  private readonly repository: ProfileRepository

  constructor(repository: ProfileRepository) {
    this.repository = repository
  }

  async execute(userId: number, data: UpdateUserRequest): Promise<UserProfile> {
    const updated = await this.repository.updateUser(userId, data)

    const stored = localStorage.getItem('user_data')
    if (stored) {
      localStorage.setItem('user_data', JSON.stringify({
        ...JSON.parse(stored),
        name:         data.name,
        last_name:    data.last_name,
        email:        data.email,
        dial_code:    data.dial_code,
        phone_number: data.phone_number,
      }))
    }

    return updated
  }
}
