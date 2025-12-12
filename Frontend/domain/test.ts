/**
 * Domain: Test - модель теста с бэкенда
 */

import type { Question } from './question'

export interface Test {
  id: number
  title: string
  description?: string
  type: string
  duration?: number
  section_id?: number
  topic_id?: number
  questions?: Question[]
  questions_count?: number
  target_questions?: number | null
  question_ids?: number[] | null
  completion_percentage?: number
  max_attempts?: number
  max_questions_per_attempt?: number | null
  created_at?: string
  updated_at?: string
  is_archived: boolean
  is_available?: boolean
}

export interface TestStartResponse {
  attempt_id: number
  questions: Question[]
  randomized_config: Record<string, unknown>
}

export interface TestSubmitData {
  attempt_id: number
  answers: Array<{
    question_id: number
    answer: string | number | Array<string | number> | null
  }>
  time_spent: number
}

export interface TestResult {
  id: number
  user_id: number
  test_id: number
  attempt_number: number
  score: number
  time_spent: number
  started_at: string
  completed_at: string
  status: string
  correctCount: number
  totalQuestions: number
}

export interface TestStatus {
  is_available: boolean
  max_attempts: number
  used_attempts: number
  can_start: boolean
  last_attempt?: TestResult
}

