/**
 * Infrastructure: Question Repository
 * Репозиторий для общения с API вопросов
 */

import { getHttpClient } from '../httpClient'
import type { Question } from '../../domain/question'

export const questionRepository = {
  createQuestion: async (
    data: Omit<Partial<Question>, 'id' | 'created_at' | 'updated_at' | 'is_archived'>
  ): Promise<Question> => {
    const http = getHttpClient()
    const { data: result } = await http.post<Question>('/questions/create', data)
    return result
  },

  getQuestionsByTestId: async (testId: number): Promise<Question[]> => {
    const http = getHttpClient()
    const { data } = await http.get<Question[]>(`/questions/read/test/${testId}`)
    return data
  },

  getAllQuestions: async (): Promise<Question[]> => {
    const http = getHttpClient()
    const { data } = await http.get<Question[]>('/questions/read/all')
    return data
  },

  getQuestion: async (id: number): Promise<Question> => {
    const http = getHttpClient()
    const { data } = await http.get<Question>(`/questions/read/${id}`)
    return data
  },

  updateQuestion: async (id: number, data: Partial<Question>): Promise<Question> => {
    const http = getHttpClient()
    const { data: result } = await http.put<Question>(`/questions/update/${id}`, data)
    return result
  },

  archiveQuestion: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.post(`/questions/archive/${id}`)
  },

  restoreQuestion: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.post(`/questions/archive/restore/${id}`)
  },

  deleteQuestionPermanently: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.delete(`/questions/archive/permanent/${id}`)
  },

  addQuestionsToTest: async (testId: number, questionIds: number[]): Promise<void> => {
    const http = getHttpClient()
    await http.post(`/questions/tests/${testId}/add-questions`, { question_ids: questionIds })
  },
}

