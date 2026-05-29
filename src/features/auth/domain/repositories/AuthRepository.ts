import type { LoginRequest }          from '../dtos/request/login.request'
import type { RegisterRequest }       from '../dtos/request/register.request'
import type { RefreshTokenRequest }   from '../dtos/request/refresh-token.request'
import type { ForgotPasswordRequest } from '../dtos/request/forgot-password.request'
import type { ResetPasswordRequest }  from '../dtos/request/reset-password.request'
import type { TokenResponse }         from '../dtos/response/token.response'
import type { AccessTokenResponse }   from '../dtos/response/access-token.response'
import type { RegisterResponse }      from '../dtos/response/register.response'
import type { MessageResponse }       from '../dtos/response/message.response'

export interface AuthRepository {
  login(data: LoginRequest): Promise<TokenResponse>
  register(data: RegisterRequest): Promise<RegisterResponse>
  refreshToken(data: RefreshTokenRequest): Promise<AccessTokenResponse>
  forgotPassword(data: ForgotPasswordRequest): Promise<MessageResponse>
  resetPassword(data: ResetPasswordRequest): Promise<MessageResponse>
}