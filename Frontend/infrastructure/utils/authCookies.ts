/**
 * Infrastructure: Auth Cookies
 * Утилиты для работы с cookies аутентификации
 */

export function persistAuthCookies(accessToken: string, refreshToken: string): void {
  if (import.meta.server) {
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

    accessTokenCookie.value = accessToken
    refreshTokenCookie.value = refreshToken
  } else {
    try {
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)
    } catch (error) {
      console.error('Failed to persist tokens:', error)
    }
  }
}

export function clearAuthCookies(): void {
  if (import.meta.server) {
    const accessTokenCookie = useCookie('access_token')
    const refreshTokenCookie = useCookie('refresh_token')

    accessTokenCookie.value = null
    refreshTokenCookie.value = null
  } else {
    try {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    } catch (error) {
      console.error('Failed to clear auth cookies:', error)
    }
  }
}

