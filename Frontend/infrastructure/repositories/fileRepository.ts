/**
 * Infrastructure: File Repository
 * Репозиторий для общения с API файлов
 */

import { getHttpClient } from '../httpClient'
import type { FileUploadResponse, FileDeleteResponse, FileInfo } from '../../domain/file'

export const fileRepository = {
  uploadImage: async (file: File): Promise<FileUploadResponse> => {
    const http = getHttpClient()
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await http.post<FileUploadResponse>('/files/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  uploadFile: async (file: File): Promise<FileUploadResponse> => {
    const http = getHttpClient()
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await http.post<FileUploadResponse>('/files/upload/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  uploadPdf: async (file: File): Promise<FileUploadResponse> => {
    const http = getHttpClient()
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await http.post<FileUploadResponse>('/files/upload/pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  getFileInfo: async (fileId: string): Promise<FileInfo> => {
    const http = getHttpClient()
    const { data } = await http.get<FileInfo>(`/files/${fileId}`)
    return data
  },

  getFileUrl: async (fileId: string): Promise<string> => {
    const http = getHttpClient()
    const { data } = await http.get<{ file_url: string }>(`/files/${fileId}/url`)
    return data.file_url
  },

  deleteFile: async (fileId: string): Promise<FileDeleteResponse> => {
    const http = getHttpClient()
    const { data } = await http.delete<FileDeleteResponse>(`/files/${fileId}`)
    return data
  },
}

