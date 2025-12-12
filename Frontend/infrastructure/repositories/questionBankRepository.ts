/**
 * Infrastructure: Question Bank Repository
 * Репозиторий для общения с API банка вопросов
 */

import { getHttpClient } from '../httpClient'
import type { QuestionBankEntry, TopicAuthorInfo } from '../../domain/question'

export interface QuestionBankEntryPayload {
  topic_id: number
  section_id?: number | null
  question: string
  question_type: 'single_choice' | 'multiple_choice' | 'open_text'
  options?: string[] | null
  correct_answer: string | number | Array<string | number> | null
  hint?: string | null
  image_url?: string | null
  is_final?: boolean
}

export interface QuestionBankUpdatePayload {
  section_id?: number | null
  question?: string
  question_type?: 'single_choice' | 'multiple_choice' | 'open_text'
  options?: string[] | null
  correct_answer?: string | number | Array<string | number> | null
  hint?: string | null
  image_url?: string | null
  is_final?: boolean
}

export const questionBankRepository = {
  createEntry: async (payload: QuestionBankEntryPayload): Promise<QuestionBankEntry> => {
    const http = getHttpClient()
    const { tags, ...payloadWithoutTags } = payload as QuestionBankEntryPayload & { tags?: unknown }
    const { data } = await http.post<QuestionBankEntry>('/question-bank/create', payloadWithoutTags)
    return data
  },

  listEntriesByTopic: async (
    topicId: number,
    options?: { sectionId?: number | null; includeArchived?: boolean; skip?: number; limit?: number }
  ): Promise<QuestionBankEntry[]> => {
    const http = getHttpClient()
    const params = new URLSearchParams()
    if (options?.sectionId) params.append('section_id', String(options.sectionId))
    if (options?.includeArchived) params.append('include_archived', 'true')
    if (typeof options?.skip === 'number') params.append('skip', String(options.skip))
    if (typeof options?.limit === 'number') params.append('limit', String(options.limit))

    const query = params.toString() ? `?${params.toString()}` : ''
    const { data } = await http.get<QuestionBankEntry[]>(`/question-bank/read/topics/${topicId}${query}`)
    return data
  },

  getEntry: async (entryId: number): Promise<QuestionBankEntry> => {
    const http = getHttpClient()
    const { data } = await http.get<QuestionBankEntry>(`/question-bank/read/entries/${entryId}`)
    return data
  },

  updateEntry: async (entryId: number, payload: QuestionBankUpdatePayload): Promise<QuestionBankEntry> => {
    const http = getHttpClient()
    const { tags, ...payloadWithoutTags } = payload as QuestionBankUpdatePayload & { tags?: unknown }
    const { data } = await http.put<QuestionBankEntry>(`/question-bank/update/${entryId}`, payloadWithoutTags)
    return data
  },

  archiveEntry: async (entryId: number): Promise<void> => {
    const http = getHttpClient()
    await http.post(`/question-bank/archive/${entryId}/archive`)
  },

  restoreEntry: async (entryId: number): Promise<void> => {
    const http = getHttpClient()
    await http.post(`/question-bank/archive/${entryId}/restore`)
  },

  deleteEntryPermanently: async (entryId: number): Promise<void> => {
    const http = getHttpClient()
    await http.delete(`/question-bank/archive/${entryId}/permanent`)
  },

  getTopicAuthors: async (topicId: number): Promise<TopicAuthorInfo[]> => {
    const http = getHttpClient()
    const { data } = await http.get<TopicAuthorInfo[]>(`/question-bank/topics/${topicId}/authors`)
    return data
  },

  addTopicAuthors: async (topicId: number, userIds: number[]): Promise<void> => {
    const http = getHttpClient()
    await http.post(`/question-bank/topics/${topicId}/authors`, { user_ids: userIds })
  },

  removeTopicAuthors: async (topicId: number, userIds: number[]): Promise<void> => {
    const http = getHttpClient()
    await http.delete(`/question-bank/topics/${topicId}/authors`, { data: { user_ids: userIds } })
  },
}

