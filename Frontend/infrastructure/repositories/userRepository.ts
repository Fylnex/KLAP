/**
 * Infrastructure: User Repository
 * Репозиторий для общения с API пользователей
 */

import { getHttpClient } from '../httpClient'
import type { User } from '../../domain/user'

interface UserFilters {
  search?: string
  role?: string
  is_active?: boolean
  start_date?: string
  end_date?: string
  exclude_group_id?: number
  available_for_group?: number
}

interface CreateUserPayload {
  username: string
  full_name: string
  password: string
  role: string
  is_active?: boolean
}

interface UpdateUserPayload {
  username?: string
  full_name?: string
  last_login?: string
  is_active?: boolean
  role?: string
}

interface BulkCreateStudentsPayload {
  students: Array<{
    username: string
    full_name: string
    password: string
    role?: string
    is_active?: boolean
  }>
  group_id: number
}

export interface BulkCreateStudentsResponse {
  created_students: User[]
  group_assignments: Array<{
    user_id: number
    group_id: number
    status: string
  }>
  total_created: number
  errors: Array<{
    username: string
    error: string
  }>
}

export const userRepository = {
  createUser: async (userData: CreateUserPayload): Promise<User> => {
    const http = getHttpClient()
    const { data } = await http.post<User>('/users/create', userData)
    return data
  },

  getUser: async (id: number): Promise<User> => {
    const http = getHttpClient()
    const { data } = await http.get<User>(`/users/read/${id}`)
    return data
  },

  getAllUsers: async (filters?: UserFilters): Promise<User[]> => {
    const http = getHttpClient()
    const { data } = await http.get<User[]>('/users/read', { params: filters })
    return data
  },

  updateUser: async (id: number, userData: UpdateUserPayload): Promise<User> => {
    const http = getHttpClient()
    const { data } = await http.put<User>(`/users/update/${id}`, userData)
    return data
  },

  deleteUser: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.delete(`/users/${id}`)
  },

  bulkUpdateRoles: async (userIds: number[], role: string): Promise<User[]> => {
    const http = getHttpClient()
    const { data } = await http.put<User[]>('/users/bulk/roles', {
      userIds,
      role,
    })
    return data
  },

  bulkUpdateStatus: async (userIds: number[], is_active: boolean): Promise<User[]> => {
    const http = getHttpClient()
    const { data } = await http.put<User[]>('/users/bulk/status', {
      userIds,
      is_active,
    })
    return data
  },

  resetPassword: async (id: number): Promise<{ message: string; new_password: string }> => {
    const http = getHttpClient()
    const { data } = await http.post(`/users/password/${id}/reset-password`)
    return data
  },

  archiveUser: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.post(`/users/archive/${id}/archive`)
  },

  restoreUser: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.post(`/users/archive/${id}/restore`)
  },

  deleteUserPermanently: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.delete(`/users/archive/${id}/permanent`)
  },

  exportUsers: async (filters?: UserFilters): Promise<Blob> => {
    const http = getHttpClient()
    const { data } = await http.get<ArrayBuffer>('/users/export', {
      params: filters,
      responseType: 'arraybuffer',
    })
    return new Blob([data], { type: 'text/csv' })
  },

  changePassword: async (
    passwordData: {
      current_password: string
      new_password: string
      user_id?: number
    }
  ): Promise<{ message: string }> => {
    const http = getHttpClient()
    const { data } = await http.put('/users/password/change-password', passwordData)
    return data
  },

  bulkCreateStudents: async (
    payload: BulkCreateStudentsPayload
  ): Promise<BulkCreateStudentsResponse> => {
    const http = getHttpClient()
    const { data } = await http.post('/users/bulk/create-students', payload)
    return data
  },
}

