/**
 * Composable для работы с пользователями
 * Объединяет Application (userService) и Infrastructure (userRepository) слои
 */

import { userService } from '../../application'
import type { User } from '../../domain'

export const useUser = () => {
  const users = useState<User[]>('users.list', () => [])
  const currentUser = useState<User | null>('users.current', () => null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Получить всех пользователей
   */
  const fetchUsers = async (filters?: {
    search?: string
    role?: string
    is_active?: boolean
  }) => {
    isLoading.value = true
    error.value = null

    try {
      const data = await userService.getAllUsers(filters)
      users.value = data
      return data
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки пользователей'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Получить пользователя по ID
   */
  const fetchUser = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      const data = await userService.getUser(id)
      currentUser.value = data
      return data
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки пользователя'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Создать пользователя
   */
  const createUser = async (userData: {
    username: string
    full_name: string
    password: string
    role: 'admin' | 'student' | 'teacher'
    is_active?: boolean
  }) => {
    isLoading.value = true
    error.value = null

    try {
      const newUser = await userService.createUser(userData)
      users.value.push(newUser)
      return newUser
    } catch (err: any) {
      error.value = err.message || 'Ошибка создания пользователя'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Обновить пользователя
   */
  const updateUser = async (id: number, userData: {
    username?: string
    full_name?: string
    is_active?: boolean
    role?: 'admin' | 'student' | 'teacher'
  }) => {
    isLoading.value = true
    error.value = null

    try {
      const updatedUser = await userService.updateUser(id, userData)
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
      if (currentUser.value?.id === id) {
        currentUser.value = updatedUser
      }
      return updatedUser
    } catch (err: any) {
      error.value = err.message || 'Ошибка обновления пользователя'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Удалить пользователя
   */
  const deleteUser = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      await userService.deleteUser(id)
      users.value = users.value.filter(u => u.id !== id)
      if (currentUser.value?.id === id) {
        currentUser.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Ошибка удаления пользователя'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    users: readonly(users),
    currentUser: readonly(currentUser),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
  }
}

