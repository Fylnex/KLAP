/**
 * HTTP клиент для работы с API бэкенда
 * Использует $fetch из Nuxt для универсальной работы на сервере и клиенте
 */

interface HttpClientOptions {
  headers?: Record<string, string>
  [key: string]: unknown
}

interface HttpClientResponse<T> {
  data: T
}

interface HttpClient {
  get<T>(url: string, options?: HttpClientOptions): Promise<HttpClientResponse<T>>
  post<T>(url: string, body?: unknown, options?: HttpClientOptions): Promise<HttpClientResponse<T>>
  put<T>(url: string, body?: unknown, options?: HttpClientOptions): Promise<HttpClientResponse<T>>
  delete<T>(url: string, options?: HttpClientOptions): Promise<HttpClientResponse<T>>
}

/**
 * Получить базовый URL API
 */
function getApiBaseUrl(): string {
  // В production можно использовать переменную окружения
  const apiUrl = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
  return apiUrl
}

/**
 * Получить токен доступа из хранилища
 */
function getAccessToken(): string | null {
  if (import.meta.server) {
    // На сервере пытаемся получить из cookies через useCookie
    // Если это вызывается из server/api файлов без контекста, вернем null
    try {
      const cookie = useCookie('access_token')
      return cookie.value || null
    } catch {
      // Если useCookie недоступен (нет контекста запроса), возвращаем null
      return null
    }
  } else {
    // На клиенте используем localStorage
    try {
      return localStorage.getItem('access_token')
    } catch {
      return null
    }
  }
}

/**
 * Создает HTTP клиент с автоматической авторизацией
 */
export function getHttpClient(): HttpClient {
  const baseUrl = getApiBaseUrl()

  const createHeaders = (customHeaders?: Record<string, string>): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    }

    // Добавляем токен авторизации, если он есть
    const token = getAccessToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  }

  return {
    async get<T>(url: string, options?: HttpClientOptions): Promise<HttpClientResponse<T>> {
      const response = await $fetch<T>(`${baseUrl}${url}`, {
        method: 'GET',
        headers: createHeaders(options?.headers),
        ...options,
      })
      return { data: response }
    },

    async post<T>(url: string, body?: unknown, options?: HttpClientOptions): Promise<HttpClientResponse<T>> {
      const response = await $fetch<T>(`${baseUrl}${url}`, {
        method: 'POST',
        headers: createHeaders(options?.headers),
        body,
        ...options,
      })
      return { data: response }
    },

    async put<T>(url: string, body?: unknown, options?: HttpClientOptions): Promise<HttpClientResponse<T>> {
      const response = await $fetch<T>(`${baseUrl}${url}`, {
        method: 'PUT',
        headers: createHeaders(options?.headers),
        body,
        ...options,
      })
      return { data: response }
    },

    async delete<T>(url: string, options?: HttpClientOptions): Promise<HttpClientResponse<T>> {
      const response = await $fetch<T>(`${baseUrl}${url}`, {
        method: 'DELETE',
        headers: createHeaders(options?.headers),
        ...options,
      })
      return { data: response }
    },
  }
}

