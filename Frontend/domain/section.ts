/**
 * Domain: Section - модель секции и подсекции с бэкенда
 */

export interface Section {
  id: number
  topic_id: number
  title: string
  content?: string
  description?: string
  order: number
  created_at?: string
  is_archived: boolean
  tests?: unknown[]
}

export interface SectionWithProgress extends Section {
  is_completed: boolean
  is_available: boolean
  completion_percentage: number
}

export interface SectionWithSubsections extends Section {
  subsections: Subsection[]
}

export interface Subsection {
  id: number
  section_id: number
  title: string
  content?: string
  file_path?: string
  type: 'text' | 'pdf' | 'presentation' | 'video'
  order: number
  created_at?: string
  is_archived: boolean
  required_time_minutes?: number | null
  min_time_seconds?: number | null
}

