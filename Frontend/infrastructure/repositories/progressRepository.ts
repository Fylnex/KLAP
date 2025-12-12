/**
 * Infrastructure: Progress Repository
 * Репозиторий для общения с API прогресса
 */

import { getHttpClient } from '../httpClient'
import type {
  TopicProgress,
  SectionProgress,
  SubsectionProgress,
  TestAttempt,
  StudentProgress,
} from '../../domain/progress'

export const progressRepository = {
  getTopicProgressList: async (userId?: number): Promise<TopicProgress[]> => {
    const http = getHttpClient()
    const { data } = await http.get<TopicProgress[]>('/progress/topics', {
      params: userId ? { user_id: userId } : {},
    })
    return data
  },

  getTopicProgress: async (
    userId: number,
    topicId: number
  ): Promise<{ percentage: number; time_spent: number } | null> => {
    try {
      const progressList = await progressRepository.getTopicProgressList(userId)
      const topicProgress = progressList.find((progress) => progress.topic_id === topicId)
      if (!topicProgress) {
        return null
      }
      return {
        percentage: topicProgress.completion_percentage || 0,
        time_spent: topicProgress.time_spent || 0,
      }
    } catch (error) {
      console.error(`Ошибка получения прогресса для пользователя ${userId} по теме ${topicId}:`, error)
      return null
    }
  },

  getSectionProgressList: async (userId?: number): Promise<SectionProgress[]> => {
    const http = getHttpClient()
    const { data } = await http.get<SectionProgress[]>('/progress/sections', {
      params: userId ? { user_id: userId } : {},
    })
    return data
  },

  getSubsectionProgressList: async (userId?: number): Promise<SubsectionProgress[]> => {
    const http = getHttpClient()
    const { data } = await http.get<SubsectionProgress[]>('/progress/subsections', {
      params: userId ? { user_id: userId } : {},
    })
    return data
  },

  getSubsectionProgress: async (
    userId: number,
    subsectionId: number
  ): Promise<{ percentage: number; time_spent: number } | null> => {
    try {
      const http = getHttpClient()
      const { data: progressList } = await http.get<SubsectionProgress[]>('/progress/subsections', {
        params: {
          user_id: userId,
          subsection_ids: String(subsectionId),
        },
      })

      const subsectionProgress = progressList.find((progress) => progress.subsection_id === subsectionId)
      if (!subsectionProgress) {
        return null
      }

      return {
        percentage: subsectionProgress.completion_percentage || 0,
        time_spent: subsectionProgress.time_spent_seconds || 0,
      }
    } catch (error) {
      console.error(`Ошибка получения прогресса для пользователя ${userId} по подразделу ${subsectionId}:`, error)
      return null
    }
  },

  getTestAttempts: async (userId?: number): Promise<TestAttempt[]> => {
    const http = getHttpClient()
    const { data } = await http.get<TestAttempt[]>('/progress/tests', {
      params: userId ? { user_id: userId } : {},
    })
    return data
  },

  getStudentOverview: async (): Promise<unknown> => {
    const http = getHttpClient()
    const { data } = await http.get('/analytics/student/overview/')
    return data
  },

  getStudentDetailedProgress: async (): Promise<unknown> => {
    const http = getHttpClient()
    const { data } = await http.get('/analytics/student/detailed/')
    return data
  },
}

