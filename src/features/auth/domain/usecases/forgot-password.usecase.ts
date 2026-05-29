import type { AuthRepository } from '../repositories/AuthRepository'
import type { MessageResponse } from '../dtos/response/message.response'

export class ForgotPasswordUseCase {
  private readonly repo: AuthRepository

  constructor(repo: AuthRepository) {
    this.repo = repo
  }

  execute(email: string): Promise<MessageResponse> {
    return this.repo.forgotPassword({ email })
  }
}
