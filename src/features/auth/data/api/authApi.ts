import type { LoginRequest }          from '../../domain/dtos/request/login.request'
import type { RegisterRequest }       from '../../domain/dtos/request/register.request'
import type { ForgotPasswordRequest } from '../../domain/dtos/request/forgot-password.request'
import type { ResetPasswordRequest }  from '../../domain/dtos/request/reset-password.request'
import type { RegisterResponse }      from '../../domain/dtos/response/register.response'
import type { MessageResponse }       from '../../domain/dtos/response/message.response'
import type { AuthUser }              from '../../domain/models/Auth'
import { apiClient }                  from '../../../../core/network/client'

export const authApi = {
  login:          (data: LoginRequest)          => apiClient.post<{ user: AuthUser }>('/auth/login', data),
  register:       (data: RegisterRequest)       => apiClient.post<RegisterResponse>('/auth/register', data),
  refreshToken:   ()                            => apiClient.post<MessageResponse>('/auth/refresh'),
  logout:         ()                            => apiClient.post<MessageResponse>('/auth/logout'),
  forgotPassword: (data: ForgotPasswordRequest) => apiClient.post<MessageResponse>('/auth/forgot-password', data),
  resetPassword:  (data: ResetPasswordRequest)  => apiClient.post<MessageResponse>('/auth/reset-password', data),
}
