/**
 * Domain: Progress - модели прогресса с бэкенда
 */

export interface StudentProgress {
  completedTests: number
  averageScore: number
  lastActivity: string
  testHistory: {
    testId: number
    score: number
    date: string
  }[]
  lastTestId?: number | null
  lastTestBestScore?: number | null
  lastTestCompletedAt?: string | null
}

export interface TopicProgress {
  id: number
  user_id: number
  topic_id: number
  status: string
  completion_percentage: number
  last_accessed: string
  created_at: string
  updated_at: string
  time_spent: number
}

export interface SectionProgress {
  id: number
  user_id: number
  section_id: number
  status: string
  completion_percentage: number
  last_accessed: string
  created_at: string
  updated_at: string
  time_spent: number
}

export interface SubsectionProgress {
  id: number
  user_id: number
  subsection_id: number
  is_viewed: boolean
  viewed_at?: string
  created_at: string
  updated_at: string
  time_spent_seconds?: number
  completion_percentage?: number
  is_completed?: boolean
}

export interface TestAttempt {
  id: number
  user_id: number
  test_id: number
  attempt_number: number
  score: number | null
  time_spent?: number
  answers?: unknown
  started_at: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  user_id: number
  topics: unknown[]
  sections: unknown[]
  subsections: unknown[]
  tests: unknown[]
  generated_at: string
}

