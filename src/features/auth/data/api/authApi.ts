import type { LoginRequest }           from '../../domain/dtos/request/login.request'
import type { RegisterRequest }        from '../../domain/dtos/request/register.request'
import type { RefreshTokenRequest }    from '../../domain/dtos/request/refresh-token.request'
import type { ForgotPasswordRequest }  from '../../domain/dtos/request/forgot-password.request'
import type { ResetPasswordRequest }   from '../../domain/dtos/request/reset-password.request'
import type { TokenResponse }          from '../../domain/dtos/response/token.response'
import type { AccessTokenResponse }    from '../../domain/dtos/response/access-token.response'
import type { RegisterResponse }       from '../../domain/dtos/response/register.response'
import type { MessageResponse }        from '../../domain/dtos/response/message.response'
import { handleResponse }              from '../../../../core/api/http'

const BASE_URL = import.meta.env.VITE_API_URL

const HEADERS = {
  'Content-Type':               'application/json',
  'ngrok-skip-browser-warning': 'true',
}

export const authApi = {
  login: (data: LoginRequest): Promise<TokenResponse> =>
    fetch(`${BASE_URL}/auth/login`, {
      method:  'POST',
      headers: HEADERS,
      body:    JSON.stringify(data),
    }).then(handleResponse<TokenResponse>),

  register: (data: RegisterRequest): Promise<RegisterResponse> =>
    fetch(`${BASE_URL}/auth/register`, {
      method:  'POST',
      headers: HEADERS,
      body:    JSON.stringify(data),
    }).then(handleResponse<RegisterResponse>),

  refreshToken: (data: RefreshTokenRequest): Promise<AccessTokenResponse> =>
    fetch(`${BASE_URL}/auth/refresh`, {
      method:  'POST',
      headers: HEADERS,
      body:    JSON.stringify(data),
    }).then(handleResponse<AccessTokenResponse>),

  forgotPassword: (data: ForgotPasswordRequest): Promise<MessageResponse> =>
    fetch(`${BASE_URL}/auth/forgot-password`, {
      method:  'POST',
      headers: HEADERS,
      body:    JSON.stringify(data),
    }).then(handleResponse<MessageResponse>),

  resetPassword: (data: ResetPasswordRequest): Promise<MessageResponse> =>
    fetch(`${BASE_URL}/auth/reset-password`, {
      method:  'POST',
      headers: HEADERS,
      body:    JSON.stringify(data),
    }).then(handleResponse<MessageResponse>),
}
