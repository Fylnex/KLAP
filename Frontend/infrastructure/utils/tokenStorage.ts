/**
 * Infrastructure: Token Storage
 * Хранилище токенов авторизации
 */

interface Tokens {
  accessToken: string
  refreshToken: string
}

export function setTokens(tokens: Tokens): void {
  if (import.meta.server) {
    try {
      const accessTokenCookie = useCookie('access_token', {
        maxAge: 60 * 60 * 24,
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
      const refreshTokenCookie = useCookie('refresh_token', {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })

      accessTokenCookie.value = tokens.accessToken
      refreshTokenCookie.value = tokens.refreshToken
    } catch (error) {
      console.warn('Cannot set cookies in server context:', error)
    }
  } else {
    try {
      localStorage.setItem('access_token', tokens.accessToken)
      localStorage.setItem('refresh_token', tokens.refreshToken)
    } catch (error) {
      console.error('Failed to save tokens to localStorage:', error)
    }
  }
}

export function getTokens(): Tokens | null {
  if (import.meta.server) {
    try {
      const accessTokenCookie = useCookie('access_token')
      const refreshTokenCookie = useCookie('refresh_token')

      const accessToken = accessTokenCookie.value
      const refreshToken = refreshTokenCookie.value

      if (accessToken && refreshToken) {
        return {
          accessToken: accessToken as string,
          refreshToken: refreshToken as string,
        }
      }
      return null
    } catch {
      return null
    }
  } else {
    try {
      const accessToken = localStorage.getItem('access_token')
      const refreshToken = localStorage.getItem('refresh_token')

      if (accessToken && refreshToken) {
        return {
          accessToken,
          refreshToken,
        }
      }
      return null
    } catch {
      return null
    }
  }
}

export function clearTokens(): void {
  if (import.meta.server) {
    try {
      const accessTokenCookie = useCookie('access_token')
      const refreshTokenCookie = useCookie('refresh_token')

      accessTokenCookie.value = null
      refreshTokenCookie.value = null
    } catch (error) {
      console.warn('Cannot clear cookies in server context:', error)
    }
  } else {
    try {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    } catch (error) {
      console.error('Failed to clear tokens from localStorage:', error)
    }
  }
}

export const tokenStorage = {
  setTokens,
  getTokens,
  clearTokens,
}

