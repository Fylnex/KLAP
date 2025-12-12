/**
 * Composable для работы с группами
 * Объединяет Application и Infrastructure слои
 */

import { groupRepository } from '../../infrastructure'
import type { Group } from '../../domain'

export const useGroups = () => {
  const groups = useState<Group[]>('groups.list', () => [])
  const currentGroup = useState<Group | null>('groups.current', () => null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Получить все группы
   */
  const fetchGroups = async (params?: {
    skip?: number
    limit?: number
    search?: string
    include_archived?: boolean
    include_counts?: boolean
  }) => {
    isLoading.value = true
    error.value = null

    try {
      const data = await groupRepository.getGroups(params)
      groups.value = data
      return data
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки групп'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Получить группу по ID
   */
  const fetchGroup = async (groupId: number, options?: {
    include_students?: boolean
    include_teachers?: boolean
    include_topics?: boolean
  }) => {
    isLoading.value = true
    error.value = null

    try {
      const data = await groupRepository.getGroup(groupId, options)
      currentGroup.value = data
      return data
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки группы'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Создать группу
   */
  const createGroup = async (groupData: {
    name: string
    start_year: number
    end_year: number
    description?: string
  }) => {
    isLoading.value = true
    error.value = null

    try {
      const newGroup = await groupRepository.createGroup(groupData)
      groups.value.push(newGroup)
      return newGroup
    } catch (err: any) {
      error.value = err.message || 'Ошибка создания группы'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Обновить группу
   */
  const updateGroup = async (groupId: number, groupData: {
    name?: string
    start_year?: number
    end_year?: number
    description?: string
  }) => {
    isLoading.value = true
    error.value = null

    try {
      const updatedGroup = await groupRepository.updateGroup(groupId, groupData)
      const index = groups.value.findIndex(g => g.id === groupId)
      if (index !== -1) {
        groups.value[index] = updatedGroup
      }
      if (currentGroup.value?.id === groupId) {
        currentGroup.value = updatedGroup
      }
      return updatedGroup
    } catch (err: any) {
      error.value = err.message || 'Ошибка обновления группы'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Добавить студента в группу
   */
  const addStudent = async (groupId: number, userId: number) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await groupRepository.addStudent(groupId, userId)
      // Обновить текущую группу, если она открыта
      if (currentGroup.value?.id === groupId) {
        await fetchGroup(groupId, { include_students: true })
      }
      return result
    } catch (err: any) {
      error.value = err.message || 'Ошибка добавления студента'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    groups: readonly(groups),
    currentGroup: readonly(currentGroup),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    fetchGroups,
    fetchGroup,
    createGroup,
    updateGroup,
    addStudent,
  }
}

