import type { AuthRepository } from '../repositories/AuthRepository'
import type { MessageResponse } from '../dtos/response/message.response'

export class ResetPasswordUseCase {
  private readonly repo: AuthRepository

  constructor(repo: AuthRepository) {
    this.repo = repo
  }

  execute(email: string, code: string, new_password: string): Promise<MessageResponse> {
    return this.repo.resetPassword({ email, code, new_password })
  }
}
