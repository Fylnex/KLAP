/**
 * Application: User Service
 * Бизнес-логика для работы с пользователями
 * Валидация, обработка данных перед отправкой на бэкенд
 */

import { userRepository } from '../../infrastructure/repositories/userRepository'
import type { User } from '../../domain/user'

export interface CreateUserInput {
  username: string
  full_name: string
  password: string
  role: 'admin' | 'student' | 'teacher'
  is_active?: boolean
}

export interface UpdateUserInput {
  username?: string
  full_name?: string
  is_active?: boolean
  role?: 'admin' | 'student' | 'teacher'
}

/**
 * Сервис пользователей
 * Содержит бизнес-логику работы с пользователями
 */
export const userService = {
  /**
   * Создать пользователя
   * Валидирует данные перед отправкой на бэкенд
   */
  createUser: async (input: CreateUserInput): Promise<User> => {
    // Бизнес-валидация
    if (!input.username || input.username.length < 3) {
      throw new Error('Username must be at least 3 characters')
    }

    if (!input.full_name || input.full_name.trim().length === 0) {
      throw new Error('Full name is required')
    }

    if (!input.password || input.password.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }

    if (!['admin', 'student', 'teacher'].includes(input.role)) {
      throw new Error('Invalid role')
    }

    // Обработка данных перед отправкой
    const userData = {
      username: input.username.trim(),
      full_name: input.full_name.trim(),
      password: input.password,
      role: input.role,
      is_active: input.is_active ?? true,
    }

    // Вызов репозитория
    return await userRepository.createUser(userData)
  },

  /**
   * Обновить пользователя
   * Валидирует и обрабатывает данные перед обновлением
   */
  updateUser: async (id: number, input: UpdateUserInput): Promise<User> => {
    // Бизнес-валидация
    if (input.username && input.username.length < 3) {
      throw new Error('Username must be at least 3 characters')
    }

    if (input.full_name && input.full_name.trim().length === 0) {
      throw new Error('Full name cannot be empty')
    }

    if (input.role && !['admin', 'student', 'teacher'].includes(input.role)) {
      throw new Error('Invalid role')
    }

    // Обработка данных
    const updateData: any = {}
    if (input.username) updateData.username = input.username.trim()
    if (input.full_name) updateData.full_name = input.full_name.trim()
    if (input.is_active !== undefined) updateData.is_active = input.is_active
    if (input.role) updateData.role = input.role

    // Вызов репозитория
    return await userRepository.updateUser(id, updateData)
  },

  /**
   * Получить пользователя
   */
  getUser: async (id: number): Promise<User> => {
    if (!id || id <= 0) {
      throw new Error('Invalid user ID')
    }
    return await userRepository.getUser(id)
  },

  /**
   * Получить всех пользователей
   */
  getAllUsers: async (filters?: {
    search?: string
    role?: string
    is_active?: boolean
  }): Promise<User[]> => {
    return await userRepository.getAllUsers(filters)
  },

  /**
   * Удалить пользователя
   */
  deleteUser: async (id: number): Promise<void> => {
    if (!id || id <= 0) {
      throw new Error('Invalid user ID')
    }
    await userRepository.deleteUser(id)
  },
}

