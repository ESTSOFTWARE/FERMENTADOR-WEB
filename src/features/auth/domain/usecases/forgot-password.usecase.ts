import type { AuthRepository } from '../repositories/AuthRepository'
import type { MessageResponse } from '../dtos/response/message.response'

export class ForgotPasswordUseCase {
  constructor(private readonly repo: AuthRepository) {}

  execute(email: string): Promise<MessageResponse> {
    return this.repo.forgotPassword({ email })
  }
}
