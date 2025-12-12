/**
 * Domain: User - модель пользователя с бэкенда
 */

export interface User {
  id: number
  username: string
  full_name: string
  patronymic?: string
  role: 'admin' | 'student' | 'teacher'
  is_active: boolean
  created_at: string
  updated_at: string
  last_login?: string
  refresh_token?: string
  is_archived: boolean
  group?: string  // Название активной группы студента
}

