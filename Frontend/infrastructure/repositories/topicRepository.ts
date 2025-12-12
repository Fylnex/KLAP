/**
 * Infrastructure: Topic Repository
 * Репозиторий для общения с API тем
 */

import { getHttpClient } from '../httpClient'
import type { Topic, TopicAuthor, MyTopicsResponse } from '../../domain/topic'
import type { Section } from '../../domain/section'

interface TopicPayload extends Partial<Topic> {
  author_ids?: number[]
}

export const topicRepository = {
  createTopic: async (data: TopicPayload): Promise<Topic> => {
    const http = getHttpClient()
    const { data: result } = await http.post<Topic>('/topics/create/', data)
    return result
  },

  getTopics: async (): Promise<Topic[]> => {
    const http = getHttpClient()
    const { data } = await http.get<Topic[]>('/topics/read/')
    return data
  },

  getArchivedTopics: async (): Promise<Topic[]> => {
    const http = getHttpClient()
    const { data } = await http.get<Topic[]>('/topics/read/', {
      params: { include_archived: true },
    })
    return data.filter((topic: Topic) => topic.is_archived)
  },

  getTopic: async (
    id: number,
    options?: {
      includeSections?: boolean
      includeArchivedSections?: boolean
      includeFinalTests?: boolean
    }
  ): Promise<Topic> => {
    const http = getHttpClient()
    const params = new URLSearchParams()
    if (options?.includeSections) params.append('include_sections', 'true')
    if (options?.includeArchivedSections) params.append('include_archived_sections', 'true')
    if (options?.includeFinalTests) params.append('include_final_tests', 'true')

    const query = params.toString() ? `?${params.toString()}` : ''
    const { data } = await http.get<Topic>(`/topics/read/${id}${query}`)
    return data
  },

  updateTopic: async (id: number, data: TopicPayload): Promise<Topic> => {
    const http = getHttpClient()
    const { data: result } = await http.put<Topic>(`/topics/update/${id}`, data)
    return result
  },

  archiveTopic: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.post(`/topics/archive/${id}/archive`)
  },

  restoreTopic: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.post(`/topics/archive/${id}/restore`)
  },

  deleteTopicPermanently: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.delete(`/topics/archive/${id}/permanent`)
  },

  getMyTopics: async (): Promise<MyTopicsResponse> => {
    const http = getHttpClient()
    const { data } = await http.get<MyTopicsResponse>('/topics/my-topics/')
    return data
  },

  assignTopicToGroup: async (topicId: number, groupId: number): Promise<void> => {
    const http = getHttpClient()
    await http.post(`/topics/${topicId}/groups/${groupId}`)
  },

  removeTopicFromGroup: async (topicId: number, groupId: number): Promise<void> => {
    const http = getHttpClient()
    await http.delete(`/topics/${topicId}/groups/${groupId}`)
  },

  getTopicGroups: async (topicId: number): Promise<unknown[]> => {
    const http = getHttpClient()
    const { data } = await http.get<unknown[]>(`/topics/${topicId}/groups`)
    return data
  },

  addAuthorsToTopic: async (topicId: number, authorIds: number[]): Promise<void> => {
    const http = getHttpClient()
    await http.post(`/topics/${topicId}/authors`, { author_ids: authorIds })
  },

  removeAuthorsFromTopic: async (topicId: number, authorIds: number[]): Promise<void> => {
    const http = getHttpClient()
    await http.delete(`/topics/${topicId}/authors`, { data: { author_ids: authorIds } })
  },

  getSectionsByTopic: async (
    topicId: number,
    options?: { include_archived?: boolean }
  ): Promise<Section[]> => {
    const http = getHttpClient()
    const params: any = { topic_id: topicId }
    if (options?.include_archived !== undefined) {
      params.include_archived = options.include_archived
    }
    const { data } = await http.get<Section[]>('/sections/read', { params })
    return data
  },
}

