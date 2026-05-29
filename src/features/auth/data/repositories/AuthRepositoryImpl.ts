import { authApi }                    from '../api/authApi'
import type { AuthRepository }        from '../../domain/repositories/AuthRepository'
import type { LoginRequest }          from '../../domain/dtos/request/login.request'
import type { RegisterRequest }       from '../../domain/dtos/request/register.request'
import type { ForgotPasswordRequest } from '../../domain/dtos/request/forgot-password.request'
import type { ResetPasswordRequest }  from '../../domain/dtos/request/reset-password.request'
import type { RegisterResponse }      from '../../domain/dtos/response/register.response'
import type { MessageResponse }       from '../../domain/dtos/response/message.response'
import type { AuthUser }              from '../../domain/models/Auth'

export class AuthRepositoryImpl implements AuthRepository {
  async login(data: LoginRequest): Promise<{ user: AuthUser }> {
    return authApi.login(data)
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return authApi.register(data)
  }

  async refreshToken(): Promise<MessageResponse> {
    return authApi.refreshToken()
  }

  async logout(): Promise<MessageResponse> {
    return authApi.logout()
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<MessageResponse> {
    return authApi.forgotPassword(data)
  }

  async resetPassword(data: ResetPasswordRequest): Promise<MessageResponse> {
    return authApi.resetPassword(data)
  }
}
