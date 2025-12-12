/**
 * Domain: File - модели файлов с бэкенда
 */

export interface FileUploadResponse {
  file_id: string
  filename: string
  minio_path: string
  file_url?: string | null
  file_size?: number | null
  content_type?: string | null
  uploaded_at: string
}

export interface FileDeleteResponse {
  message: string
  file_id: string
}

export interface FileInfo {
  file_id: string
  filename: string
  file_url: string
  file_size?: number | null
  content_type?: string | null
  uploaded_at: string | null
  bucket: string
  object_name: string
}

