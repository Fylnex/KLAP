/**
 * Domain: Group - модель группы с бэкенда
 */

export interface Group {
  id: number
  name: string
  start_year: number
  end_year: number
  description?: string
  creator_id?: number
  created_at: string
  updated_at: string
  is_archived: boolean
  students_count?: number
  teachers_count?: number
  students?: unknown[]
  teachers?: unknown[]
  topics?: unknown[]
  demo_students?: { id: number; full_name: string; patronymic: string; username: string }[]
  demo_teacher?: { id: number; full_name: string; patronymic: string; username: string }
}

export interface GroupStudent {
  group_id: number
  user_id: number
  status: 'active' | 'inactive'
  joined_at: string
  left_at?: string
  is_archived: boolean
}

export interface GroupTeacher {
  group_id: number
  user_id: number
  created_at: string
  assigned_at: string
  is_archived: boolean
}

