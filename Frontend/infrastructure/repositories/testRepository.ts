/**
 * Infrastructure: Test Repository
 * Репозиторий для общения с API тестов
 */

import { getHttpClient } from '../httpClient'
import type { Test, TestStartResponse, TestSubmitData, TestResult, TestStatus } from '../../domain/test'
import type { Question } from '../../domain/question'

export const testRepository = {
  getTest: async (id: number): Promise<Test> => {
    const http = getHttpClient()
    const { data } = await http.get<Test>(`/tests/admin/${id}`)
    return data
  },

  getAllTests: async (): Promise<Test[]> => {
    const http = getHttpClient()
    const { data } = await http.get<Test[]>('/tests/admin/')
    return data
  },

  getArchivedTests: async (): Promise<Test[]> => {
    const http = getHttpClient()
    const { data } = await http.get<Test[]>('/tests/admin/', {
      params: { is_archived: true },
    })
    return data
  },

  getTestsBySection: async (sectionId: number): Promise<Test[]> => {
    const http = getHttpClient()
    const { data } = await http.get<Test[]>(`/tests/admin/sections/${sectionId}`)
    return data
  },

  getTestsByTopic: async (topicId: number): Promise<Test[]> => {
    const http = getHttpClient()
    const { data } = await http.get<Test[]>(`/tests/admin/topics/${topicId}`)
    return data
  },

  createTest: async (data: Partial<Test>): Promise<Test> => {
    const http = getHttpClient()
    const { data: result } = await http.post<Test>('/tests/admin/create', data)
    return result
  },

  updateTest: async (id: number, data: Partial<Test>): Promise<Test> => {
    const http = getHttpClient()
    const { data: result } = await http.put<Test>(`/tests/admin/update/${id}`, data)
    return result
  },

  deleteTest: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.delete(`/tests/admin/${id}`)
  },

  archiveTest: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.post(`/tests/admin/archive/${id}/archive`)
  },

  restoreTest: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.post(`/tests/admin/archive/${id}/restore`)
  },

  deleteTestPermanently: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.delete(`/tests/admin/archive/${id}/permanent`)
  },

  startTest: async (testId: number): Promise<TestStartResponse> => {
    const http = getHttpClient()
    const { data } = await http.post<TestStartResponse>(`/tests/start/${testId}`)
    return data
  },

  submitTest: async (submitData: TestSubmitData): Promise<TestResult> => {
    const http = getHttpClient()
    const { data } = await http.post<TestResult>(`/tests/submit`, submitData)
    return data
  },

  getTestStatus: async (testId: number): Promise<TestStatus> => {
    const http = getHttpClient()
    const { data } = await http.get<TestStatus>(`/tests/status/${testId}`)
    return data
  },

  getTestResult: async (attemptId: number): Promise<TestResult> => {
    const http = getHttpClient()
    const { data } = await http.get<TestResult>(`/tests/results/${attemptId}`)
    return data
  },

  getMyTests: async (): Promise<Test[]> => {
    const http = getHttpClient()
    const { data } = await http.get<Test[]>('/tests/my-tests/')
    return data
  },
}

