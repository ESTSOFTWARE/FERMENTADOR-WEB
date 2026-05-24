import type { AuthUser } from '../../models/Auth'

export interface TokenResponse {
  access_token:  string
  refresh_token: string
  token_type:    string
  user:          AuthUser
}
