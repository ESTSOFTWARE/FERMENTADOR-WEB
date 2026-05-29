import type { LoginRequest }          from '../dtos/request/login.request'
import type { RegisterRequest }       from '../dtos/request/register.request'
import type { ForgotPasswordRequest } from '../dtos/request/forgot-password.request'
import type { ResetPasswordRequest }  from '../dtos/request/reset-password.request'
import type { RegisterResponse }      from '../dtos/response/register.response'
import type { MessageResponse }       from '../dtos/response/message.response'
import type { AuthUser }              from '../models/Auth'

export interface AuthRepository {
  login(data: LoginRequest): Promise<{ user: AuthUser }>
  register(data: RegisterRequest): Promise<RegisterResponse>
  refreshToken(): Promise<MessageResponse>
  logout(): Promise<MessageResponse>
  forgotPassword(data: ForgotPasswordRequest): Promise<MessageResponse>
  resetPassword(data: ResetPasswordRequest): Promise<MessageResponse>
}
