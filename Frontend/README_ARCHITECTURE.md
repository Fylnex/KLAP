# Clean Architecture для Frontend

Проект использует методологию Clean Architecture с разделением на три основных слоя:

## Структура

```
Frontend/
├── domain/              # Domain Layer - модели данных с бэкенда
│   ├── user.ts
│   ├── group.ts
│   ├── topic.ts
│   ├── test.ts
│   └── ...
├── application/         # Application Layer - бизнес-логика фронтенда
│   └── services/
│       ├── authService.ts
│       ├── userService.ts
│       └── validationService.ts
├── infrastructure/      # Infrastructure Layer - репозитории для API
│   ├── httpClient.ts
│   └── repositories/
│       ├── authRepository.ts
│       ├── userRepository.ts
│       └── ...
└── app/
    └── composables/     # Composables - объединяют Application и Infrastructure
        ├── useAuth.ts
        ├── useUser.ts
        ├── useTopics.ts
        └── ...
```

## Domain Layer (`/domain`)

**Назначение:** Описывает сущности, которые приходят с бэкенда.

Это модели данных, с которыми работает фронтенд:
- `User` - модель пользователя
- `Group` - модель группы
- `Topic` - модель темы
- `Test` - модель теста
- `Question` - модель вопроса
- и т.д.

**Особенности:**
- Только интерфейсы и типы TypeScript
- Не содержит бизнес-логики
- Не знает про существование бэкенда
- Не зависит от других слоев

**Пример:**
```typescript
// domain/user.ts
export interface User {
  id: number
  username: string
  full_name: string
  role: 'admin' | 'student' | 'teacher'
  // ...
}
```

## Application Layer (`/application`)

**Назначение:** Бизнес-логика фронтенда.

Содержит:
- **Валидацию форм** - проверка данных перед отправкой
- **Обработку данных** - преобразование данных перед отправкой
- **Координацию действий** - координация работы нескольких репозиториев

**Особенности:**
- Использует типы из `domain`
- Использует репозитории из `infrastructure`
- Содержит всю бизнес-логику фронтенда
- Не знает про HTTP, $fetch или URL бэкенда

**Пример:**
```typescript
// application/services/authService.ts
import { authRepository } from '../../infrastructure'
import type { User } from '../../domain'

export const authService = {
  login: async (credentials) => {
    // Валидация
    if (!credentials.username || !credentials.password) {
      throw new Error('Username and password are required')
    }
    
    // Координация с репозиторием
    return await authRepository.login(credentials.username, credentials.password)
  }
}
```

## Infrastructure Layer (`/infrastructure`)

**Назначение:** Репозитории для общения с бэкенд API.

Это единственное место, где знаешь про существование бэкенда:
- HTTP клиент (`httpClient.ts`)
- Репозитории для каждого API (`repositories/*`)
- Использует `$fetch` на URL бэкенда

**Особенности:**
- Использует типы из `domain`
- Знает про URL бэкенда (`http://localhost:8000/api/v1`)
- Использует `$fetch` для HTTP запросов
- Не содержит бизнес-логики

**Пример:**
```typescript
// infrastructure/repositories/authRepository.ts
import { getHttpClient } from '../httpClient'
import type { User } from '../../domain'

export const authRepository = {
  login: async (username: string, password: string) => {
    const http = getHttpClient()
    const { data } = await http.post('/auth/login', { username, password })
    return data
  }
}
```

## Правила использования

### ✅ Правильно

**Использование composable (рекомендуется):**
```vue
<script setup>
// В компоненте Vue
const { user, login, isLoading, error } = useAuth()

const handleLogin = async () => {
  await login(username.value, password.value)
  // user автоматически обновлен, isLoading и error управляются автоматически
}
</script>
```

**Использование сервиса напрямую (если нужна кастомная логика):**
```typescript
import { authService } from '@/application'

const handleLogin = async () => {
  try {
    const response = await authService.login({
      username: 'user',
      password: 'password'
    })
    // Обработка успешного входа
  } catch (error) {
    // Обработка ошибок
  }
}
```

### ❌ Неправильно

```typescript
// Прямой вызов репозитория из компонента (пропуская application слой)
import { authRepository } from '@/infrastructure'

const handleLogin = async () => {
  // Плохо: нет валидации и бизнес-логики
  await authRepository.login('user', 'password')
}

// Использование типов не из domain
interface User {
  // Собственная модель вместо domain/User
}

// Бизнес-логика в компонентах
const validatePassword = (password) => {
  // Валидация должна быть в application слое
}

// Прямое использование репозитория в composable без application слоя
export const useAuth = () => {
  const login = async () => {
    // Плохо: должен использовать authService, а не authRepository
    await authRepository.login(...)
  }
}
```

## Composables (`/app/composables`)

**Назначение:** Объединяют Application и Infrastructure слои для удобного использования в Vue компонентах.

Composables предоставляют:
- Реактивные обертки (ref, computed, useState)
- Интеграцию с Nuxt (useState, useAsyncData)
- Обработку состояния загрузки и ошибок
- Удобный API для компонентов

**Особенности:**
- Используют сервисы из `application`
- Используют репозитории из `infrastructure`
- Предоставляют реактивный интерфейс для Vue
- Инкапсулируют состояние и логику

**Пример:**
```typescript
// app/composables/useAuth.ts
import { authService } from '@/application'

export const useAuth = () => {
  const user = useState<User | null>('auth.user', () => null)
  const isLoading = ref(false)

  const login = async (username: string, password: string) => {
    isLoading.value = true
    try {
      const response = await authService.login({ username, password })
      user.value = response.user
      return response
    } finally {
      isLoading.value = false
    }
  }

  return {
    user: readonly(user),
    isLoading: readonly(isLoading),
    login,
  }
}
```

**Использование в компонентах:**
```vue
<script setup>
const { user, isLoading, login } = useAuth()

const handleLogin = async () => {
  await login('username', 'password')
}
</script>

<template>
  <div v-if="isLoading">Загрузка...</div>
  <div v-else-if="user">{{ user.full_name }}</div>
</template>
```

## Поток данных

```
Component/Vue Page
    ↓
Composables (/app/composables) ← Объединяет Application и Infrastructure
    ↓
Application Layer (валидация, бизнес-логика)
    ↓
Infrastructure Layer (HTTP запросы к бэкенду)
    ↓
Backend API
```

## Миграция существующего кода

1. **Типы** → переместить в `domain/`
2. **API клиенты** → переместить в `infrastructure/repositories/`
3. **Валидация и бизнес-логика** → создать сервисы в `application/services/`
4. **Компоненты** → использовать сервисы из `application/`, а не репозитории напрямую

## Примеры миграции

### До
```typescript
// В компоненте
import { authApi } from '@/server/api/authApi'

const login = async () => {
  // Прямой вызов API
  const response = await authApi.login(username, password)
}
```

### После (с использованием composable)
```vue
<script setup>
// В компоненте Vue
const { user, isLoading, login, error } = useAuth()

const handleLogin = async () => {
  try {
    await login(username.value, password.value)
    // Успешный вход, user автоматически обновлен
  } catch (err) {
    // Ошибка доступна в error.value
    console.error('Login failed:', error.value)
  }
}
</script>

<template>
  <div v-if="isLoading">Загрузка...</div>
  <div v-else-if="user">Привет, {{ user.full_name }}!</div>
  <div v-else-if="error" class="error">{{ error }}</div>
</template>
```

### Альтернативный вариант (прямое использование сервиса)
```typescript
// В компоненте, если нужна более сложная логика
import { authService } from '@/application'

const user = ref(null)
const isLoading = ref(false)

const login = async () => {
  isLoading.value = true
  try {
    const response = await authService.login({ username, password })
    user.value = response.user
  } catch (error) {
    // Обработка ошибок валидации
  } finally {
    isLoading.value = false
  }
}
```

