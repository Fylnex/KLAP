/**
 * Application: Auth Service
 * Бизнес-логика для аутентификации
 * Координирует действия между репозиториями и валидацией
 */

import { authRepository } from '../../infrastructure/repositories/authRepository'
import type { User } from '../../domain/user'

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthServiceResponse {
  user: User
  accessToken: string
  refreshToken: string
}

/**
 * Сервис аутентификации
 * Содержит бизнес-логику входа, валидации и координации
 */
export const authService = {
  /**
   * Войти в систему
   * Перед входом проверяет валидность данных, затем выполняет вход
   */
  login: async (credentials: LoginCredentials): Promise<AuthServiceResponse> => {
    // Валидация на уровне приложения
    if (!credentials.username || !credentials.password) {
      throw new Error('Username and password are required')
    }

    if (credentials.password.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }

    // Вызов репозитория для общения с API
    const response = await authRepository.login(credentials.username, credentials.password)

    return {
      user: response.user,
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    }
  },

  /**
   * Получить текущего пользователя
   */
  getCurrentUser: async (): Promise<User> => {
    return await authRepository.getCurrentUser()
  },

  /**
   * Выйти из системы
   */
  logout: async (): Promise<void> => {
    await authRepository.logout()
  },

  /**
   * Обновить токен доступа
   */
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    return await authRepository.refreshToken(refreshToken)
  },
}

