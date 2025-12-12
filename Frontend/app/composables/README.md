# Composables

Composables объединяют Application и Infrastructure слои для удобного использования в Vue компонентах.

## Структура

Все composables находятся в `/app/composables/` и предоставляют:
- Реактивные обертки (ref, computed, useState)
- Интеграцию с Nuxt (useState для сохранения состояния)
- Обработку состояния загрузки и ошибок
- Удобный API для компонентов

## Доступные composables

### useAuth
Работа с аутентификацией

```vue
<script setup>
const { user, isLoading, login, logout, isAuthenticated, isAdmin } = useAuth()

const handleLogin = async () => {
  await login(username.value, password.value)
}
</script>
```

### useUser
Работа с пользователями

```vue
<script setup>
const { users, currentUser, isLoading, fetchUsers, createUser, updateUser } = useUser()

onMounted(() => {
  fetchUsers()
})
</script>
```

### useTopics
Работа с темами

```vue
<script setup>
const { topics, currentTopic, isLoading, fetchTopics, fetchTopic } = useTopics()

onMounted(() => {
  fetchTopics()
})
</script>
```

### useTests
Работа с тестами

```vue
<script setup>
const { tests, currentTest, isLoading, startTest, submitTest } = useTests()

const handleStartTest = async (testId) => {
  await startTest(testId)
}
</script>
```

### useGroups
Работа с группами

```vue
<script setup>
const { groups, currentGroup, isLoading, fetchGroups, createGroup } = useGroups()

onMounted(() => {
  fetchGroups()
})
</script>
```

### useDashboard
Работа с дашбордом (уже существующий)

## Принципы

1. **Composables используют сервисы из Application слоя** - для бизнес-логики и валидации
2. **Composables могут использовать репозитории из Infrastructure** - когда нужен прямой доступ к API
3. **Состояние управляется через useState** - для сохранения между переходами страниц
4. **Все методы обработки ошибок** - автоматически устанавливают error.value
5. **Индикаторы загрузки** - автоматически управляются через isLoading

## Создание нового composable

```typescript
import { someService } from '../../application'
import type { SomeEntity } from '../../domain'

export const useSomeEntity = () => {
  const entities = useState<SomeEntity[]>('someEntity.list', () => [])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchEntities = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const data = await someService.getEntities()
      entities.value = data
      return data
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    entities: readonly(entities),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchEntities,
  }
}
```

## Использование в компонентах

```vue
<script setup lang="ts">
const { user, login, isLoading, error } = useAuth()
const username = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    await login(username.value, password.value)
    // Успешный вход
    navigateTo('/dashboard')
  } catch (err) {
    // Ошибка уже в error.value
  }
}
</script>

<template>
  <div>
    <div v-if="isLoading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <form v-else @submit.prevent="handleLogin">
      <input v-model="username" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Войти</button>
    </form>
  </div>
</template>
```

