/**
 * Infrastructure: Group Repository
 * Репозиторий для общения с API групп
 */

import { getHttpClient } from '../httpClient'
import type { Group, GroupStudent, GroupTeacher } from '../../domain/group'

export const groupRepository = {
  getGroups: async (params?: {
    skip?: number
    limit?: number
    search?: string
    include_archived?: boolean
    include_counts?: boolean
  }): Promise<Group[]> => {
    const http = getHttpClient()
    const { data } = await http.get<Group[]>('/groups/management/', { params })
    return data
  },

  getGroup: async (
    groupId: number,
    options?: {
      include_students?: boolean
      include_teachers?: boolean
      include_topics?: boolean
    }
  ): Promise<Group> => {
    const http = getHttpClient()
    const params = {
      include_students: options?.include_students ?? true,
      include_teachers: options?.include_teachers ?? true,
      include_topics: options?.include_topics ?? false,
    }
    const { data } = await http.get<Group>(`/groups/management/${groupId}`, { params })
    return data
  },

  createGroup: async (data: {
    name: string
    start_year: number
    end_year: number
    description?: string
  }): Promise<Group> => {
    const http = getHttpClient()
    const response = await http.post<Group>('/groups/management/', data)
    return response.data
  },

  updateGroup: async (
    groupId: number,
    data: {
      name?: string
      start_year?: number
      end_year?: number
      description?: string
    }
  ): Promise<Group> => {
    const http = getHttpClient()
    const response = await http.put<Group>(`/groups/management/${groupId}`, data)
    return response.data
  },

  deleteGroup: async (groupId: number): Promise<void> => {
    const http = getHttpClient()
    await http.delete(`/groups/management/${groupId}`)
  },

  getGroupStudents: async (groupId: number): Promise<GroupStudent[]> => {
    const http = getHttpClient()
    const { data } = await http.get<GroupStudent[]>(`/groups/management/${groupId}/students`)
    return data
  },

  addStudent: async (groupId: number, userId: number): Promise<GroupStudent> => {
    const http = getHttpClient()
    const { data } = await http.post<GroupStudent>(`/groups/management/${groupId}/students/${userId}`)
    return data
  },

  removeStudent: async (groupId: number, userId: number): Promise<void> => {
    const http = getHttpClient()
    await http.delete(`/groups/management/${groupId}/students/${userId}`)
  },

  getGroupTeachers: async (groupId: number): Promise<GroupTeacher[]> => {
    const http = getHttpClient()
    const { data } = await http.get<GroupTeacher[]>(`/groups/management/${groupId}/teachers`)
    return data
  },

  addTeacher: async (groupId: number, userId: number): Promise<GroupTeacher> => {
    const http = getHttpClient()
    const { data } = await http.post<GroupTeacher>(`/groups/management/${groupId}/teachers/${userId}`)
    return data
  },

  removeTeacher: async (groupId: number, userId: number): Promise<void> => {
    const http = getHttpClient()
    await http.delete(`/groups/management/${groupId}/teachers/${userId}`)
  },

  archiveGroup: async (groupId: number): Promise<void> => {
    const http = getHttpClient()
    await http.post(`/groups/archive/${groupId}/archive`)
  },

  restoreGroup: async (groupId: number): Promise<void> => {
    const http = getHttpClient()
    await http.post(`/groups/archive/${groupId}/restore`)
  },

  deleteGroupPermanently: async (groupId: number): Promise<void> => {
    const http = getHttpClient()
    await http.delete(`/groups/archive/${groupId}/permanent`)
  },

  bulkAddStudents: async (groupId: number, userIds: number[]): Promise<GroupStudent[]> => {
    const http = getHttpClient()
    const { data } = await http.post<GroupStudent[]>(`/groups/management/${groupId}/students/bulk`, {
      user_ids: userIds,
    })
    return data
  },

  bulkRemoveStudents: async (groupId: number, userIds: number[]): Promise<void> => {
    const http = getHttpClient()
    await http.delete(`/groups/management/${groupId}/students/bulk`, {
      data: { user_ids: userIds },
    })
  },

  getStudentGroups: async (userId: number): Promise<Group[]> => {
    const http = getHttpClient()
    const { data } = await http.get<Group[]>(`/groups/students/${userId}/groups`)
    return data
  },
}

