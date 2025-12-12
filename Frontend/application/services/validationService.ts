/**
 * Application: Validation Service
 * Общие функции валидации для форм и данных
 */

/**
 * Валидация email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Валидация пароля
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' }
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' }
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' }
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' }
  }

  return { valid: true }
}

/**
 * Валидация username
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' }
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers and underscores' }
  }

  return { valid: true }
}

/**
 * Валидация формы регистрации
 */
export function validateRegistrationForm(data: {
  username: string
  full_name: string
  email?: string
  password: string
  confirmPassword?: string
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  const usernameValidation = validateUsername(data.username)
  if (!usernameValidation.valid) {
    errors.push(usernameValidation.error!)
  }

  if (!data.full_name || data.full_name.trim().length === 0) {
    errors.push('Full name is required')
  }

  if (data.email && !validateEmail(data.email)) {
    errors.push('Invalid email format')
  }

  const passwordValidation = validatePassword(data.password)
  if (!passwordValidation.valid) {
    errors.push(passwordValidation.error!)
  }

  if (data.confirmPassword && data.password !== data.confirmPassword) {
    errors.push('Passwords do not match')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

