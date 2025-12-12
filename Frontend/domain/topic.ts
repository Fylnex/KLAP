/**
 * Domain: Topic - модель темы с бэкенда
 */

export interface TopicAuthor {
  id: number
  full_name: string
  username?: string
  email?: string
}

export interface Topic {
  id: number
  title: string
  description?: string
  category?: string
  image?: string
  created_at?: string
  is_archived: boolean
  creator_full_name: string
  authors?: TopicAuthor[]
}

export interface MyTopicsResponse {
  topics: Topic[]
}

