/**
 * Infrastructure: Section Repository
 * Репозиторий для общения с API секций и подсекций
 */

import { getHttpClient } from '../httpClient'
import type { Section, Subsection, SectionWithSubsections } from '../../domain/section'

export const sectionRepository = {
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

  getSection: async (sectionId: number): Promise<Section> => {
    const http = getHttpClient()
    const { data } = await http.get<Section>(`/sections/read/${sectionId}`)
    return data
  },

  createSection: async (data: Partial<Section>): Promise<Section> => {
    const http = getHttpClient()
    const { data: result } = await http.post<Section>('/sections/create', data)
    return result
  },

  updateSection: async (id: number, data: Partial<Section>): Promise<Section> => {
    const http = getHttpClient()
    const { data: result } = await http.put<Section>(`/sections/update/${id}`, data)
    return result
  },

  deleteSection: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.delete(`/sections/${id}`)
  },

  archiveSection: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.post(`/sections/archive/${id}/archive`)
  },

  restoreSection: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.post(`/sections/archive/${id}/restore`)
  },

  deleteSectionPermanently: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.delete(`/sections/archive/${id}/permanent`)
  },

  getSubsection: async (subsectionId: number): Promise<Subsection> => {
    const http = getHttpClient()
    const { data } = await http.get<Subsection>(`/subsections/read/${subsectionId}`)
    return data
  },

  getSectionSubsections: async (sectionId: number): Promise<SectionWithSubsections> => {
    const http = getHttpClient()
    const { data } = await http.get<SectionWithSubsections>(`/sections/${sectionId}/subsections`)
    return data
  },

  getSubsectionsBySection: async (
    sectionId: number,
    options?: { include_archived?: boolean }
  ): Promise<Subsection[]> => {
    const http = getHttpClient()
    const params: any = { section_id: sectionId }
    if (options?.include_archived !== undefined) {
      params.include_archived = options.include_archived
    }
    const { data } = await http.get<Subsection[]>('/subsections/read', { params })
    return data
  },

  createSubsection: async (formData: FormData): Promise<Subsection> => {
    const http = getHttpClient()
    const { data } = await http.post<Subsection>('/subsections', formData)
    return data
  },

  createSubsectionJson: async (payload: {
    section_id: number
    title: string
    content: string
    type: 'text'
    order?: number
    required_time_minutes?: number | null
    min_time_seconds?: number
  }): Promise<Subsection> => {
    const http = getHttpClient()
    const { data } = await http.post<Subsection>('/subsections/create/json', payload)
    return data
  },

  updateSubsectionJson: async (
    id: number,
    data: { title?: string; content?: string; type: 'text'; order?: number }
  ): Promise<Subsection> => {
    const http = getHttpClient()
    const { data: result } = await http.put<Subsection>(`/subsections/update/${id}/json`, data)
    return result
  },

  deleteSubsection: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.delete(`/subsections/${id}`)
  },

  archiveSubsection: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.post(`/subsections/archive/${id}/archive`)
  },

  restoreSubsection: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.post(`/subsections/archive/${id}/restore`)
  },

  deleteSubsectionPermanently: async (id: number): Promise<void> => {
    const http = getHttpClient()
    await http.delete(`/subsections/archive/${id}/permanent`)
  },
}

