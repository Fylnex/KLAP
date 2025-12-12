/**
 * Composable для работы с темами
 * Объединяет Application и Infrastructure слои
 */

import { topicRepository } from '../../infrastructure'
import type { Topic } from '../../domain'

export const useTopics = () => {
  const topics = useState<Topic[]>('topics.list', () => [])
  const currentTopic = useState<Topic | null>('topics.current', () => null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Получить все темы
   */
  const fetchTopics = async () => {
    isLoading.value = true
    error.value = null

    try {
      const data = await topicRepository.getTopics()
      topics.value = data
      return data
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки тем'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Получить тему по ID
   */
  const fetchTopic = async (id: number, options?: {
    includeSections?: boolean
    includeArchivedSections?: boolean
    includeFinalTests?: boolean
  }) => {
    isLoading.value = true
    error.value = null

    try {
      const data = await topicRepository.getTopic(id, options)
      currentTopic.value = data
      return data
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки темы'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Создать тему
   */
  const createTopic = async (topicData: {
    title: string
    description?: string
    category?: string
    author_ids?: number[]
  }) => {
    isLoading.value = true
    error.value = null

    try {
      const newTopic = await topicRepository.createTopic(topicData)
      topics.value.push(newTopic)
      return newTopic
    } catch (err: any) {
      error.value = err.message || 'Ошибка создания темы'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Обновить тему
   */
  const updateTopic = async (id: number, topicData: Partial<Topic>) => {
    isLoading.value = true
    error.value = null

    try {
      const updatedTopic = await topicRepository.updateTopic(id, topicData)
      const index = topics.value.findIndex(t => t.id === id)
      if (index !== -1) {
        topics.value[index] = updatedTopic
      }
      if (currentTopic.value?.id === id) {
        currentTopic.value = updatedTopic
      }
      return updatedTopic
    } catch (err: any) {
      error.value = err.message || 'Ошибка обновления темы'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Получить мои темы
   */
  const fetchMyTopics = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await topicRepository.getMyTopics()
      return response.topics
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки моих тем'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    topics: readonly(topics),
    currentTopic: readonly(currentTopic),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    fetchTopics,
    fetchTopic,
    createTopic,
    updateTopic,
    fetchMyTopics,
  }
}

