import { authApi } from '../api/authApi'
import type { AuthRepository } from '../../domain/repositories/AuthRepository'
import type { LoginRequest } from '../../domain/dtos/request/login.request'
import type { RegisterRequest } from '../../domain/dtos/request/register.request'
import type { RefreshTokenRequest } from '../../domain/dtos/request/refresh-token.request'
import type { TokenResponse } from '../../domain/dtos/response/token.response'
import type { AccessTokenResponse } from '../../domain/dtos/response/access-token.response'
import type { RegisterResponse } from '../../domain/dtos/response/register.response'

export class AuthRepositoryImpl implements AuthRepository {
  async login(data: LoginRequest): Promise<TokenResponse> {
    return authApi.login(data)
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return authApi.register(data)
  }

  async refreshToken(data: RefreshTokenRequest): Promise<AccessTokenResponse> {
    return authApi.refreshToken(data)
  }
}