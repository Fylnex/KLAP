/**
 * Domain: Question - модель вопроса с бэкенда
 */

export interface Question {
  id: number
  test_id: number
  question: string
  question_type: string
  options?: string[]
  correct_answer?: string | number | Array<string | number> | null
  hint?: string
  is_final: boolean
  image_url?: string
  created_at?: string
  updated_at?: string
  is_archived: boolean
}

export interface QuestionAuthor {
  user_id: number
  full_name: string
  role: string
  added_at: string
}

export interface QuestionBankEntry {
  id: number
  topic_id: number
  section_id: number | null
  question: string
  question_type: 'single_choice' | 'multiple_choice' | 'open_text'
  options?: string[] | null
  correct_answer: string | number | Array<string | number> | null
  hint?: string | null
  image_url?: string | null
  is_final: boolean
  tags?: string[] | null
  created_by: number
  created_at: string
  updated_at?: string | null
  is_archived: boolean
  section_title?: string | null
  author?: QuestionAuthor | null
}

export interface TopicAuthorInfo {
  topic_id: number
  user_id: number
  full_name?: string | null
  role?: string | null
  is_archived: boolean
  added_at?: string | null
  added_by?: number | null
}

