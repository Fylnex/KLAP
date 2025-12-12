/**
 * Infrastructure: Auth Repository
 * Репозиторий для общения с API аутентификации
 */

import { getHttpClient } from '../httpClient'
import { tokenStorage } from '../utils/tokenStorage'
import { persistAuthCookies } from '../utils/authCookies'
import type { User } from '../../domain/user'

interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: User
}

export const authRepository = {
  /**
   * Вход в систему
   */
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const http = getHttpClient()
    
    const { data: tokenData } = await http.post<LoginResponse>('/auth/login', {
      username,
      password,
    })

    const { access_token, refresh_token } = tokenData

    if (!access_token || !refresh_token) {
      throw new Error('No tokens received from login')
    }

    tokenStorage.setTokens({
      accessToken: access_token,
      refreshToken: refresh_token,
    })
    persistAuthCookies(access_token, refresh_token)

    const { data: user } = await http.get<User>('/auth/me')

    return {
      access_token,
      refresh_token,
      user,
    }
  },

  /**
   * Получить текущего пользователя
   */
  getCurrentUser: async (): Promise<User> => {
    const http = getHttpClient()
    const { data } = await http.get<User>('/auth/me')
    return data
  },

  /**
   * Обновить токен доступа
   */
  refreshToken: async (
    refreshToken: string
  ): Promise<{ access_token: string; refresh_token: string }> => {
    const http = getHttpClient()
    
    const { data } = await http.post<LoginResponse>(
      '/auth/refresh',
      {},
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
      }
    )

    const { access_token, refresh_token } = data

    if (access_token && refresh_token) {
      tokenStorage.setTokens({
        accessToken: access_token,
        refreshToken: refresh_token,
      })
      persistAuthCookies(access_token, refresh_token)
    }

    return { access_token, refresh_token }
  },

  /**
   * Выход из системы
   */
  logout: async (): Promise<void> => {
    const http = getHttpClient()
    try {
      await http.post('/auth/logout')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  },
}

