/**
 * Composable для аутентификации
 * Объединяет Application (authService) и Infrastructure (authRepository) слои
 */

import { authService } from '../../application'
import type { User } from '../../domain'

export const useAuth = () => {
  const user = useState<User | null>('auth.user', () => null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Вход в систему
   */
  const login = async (username: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authService.login({ username, password })
      user.value = response.user
      return response
    } catch (err: any) {
      error.value = err.message || 'Ошибка входа в систему'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Выход из системы
   */
  const logout = async () => {
    isLoading.value = true
    error.value = null

    try {
      await authService.logout()
      user.value = null
    } catch (err: any) {
      error.value = err.message || 'Ошибка выхода из системы'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Получить текущего пользователя
   */
  const fetchCurrentUser = async () => {
    isLoading.value = true
    error.value = null

    try {
      const currentUser = await authService.getCurrentUser()
      user.value = currentUser
      return currentUser
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки пользователя'
      user.value = null
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Проверить, авторизован ли пользователь
   */
  const isAuthenticated = computed(() => user.value !== null)

  /**
   * Получить роль пользователя
   */
  const userRole = computed(() => user.value?.role || null)

  /**
   * Проверить, является ли пользователь админом
   */
  const isAdmin = computed(() => user.value?.role === 'admin')

  /**
   * Проверить, является ли пользователь преподавателем
   */
  const isTeacher = computed(() => user.value?.role === 'teacher')

  /**
   * Проверить, является ли пользователь студентом
   */
  const isStudent = computed(() => user.value?.role === 'student')

  return {
    // State
    user: readonly(user),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    login,
    logout,
    fetchCurrentUser,

    // Computed
    isAuthenticated,
    userRole,
    isAdmin,
    isTeacher,
    isStudent,
  }
}

