# Application Layer

Этот слой содержит бизнес-логику фронтенда:

- **Валидация форм** - проверка данных перед отправкой
- **Обработка данных** - преобразование данных перед отправкой на бэкенд
- **Координация действий** - координация работы нескольких репозиториев

## Примеры использования

### AuthService

```typescript
import { authService } from '@/application'

// Вход в систему с валидацией
try {
  const response = await authService.login({
    username: 'user123',
    password: 'password123'
  })
  console.log('User logged in:', response.user)
} catch (error) {
  console.error('Login failed:', error.message)
}
```

### UserService

```typescript
import { userService } from '@/application'

// Создание пользователя с валидацией
try {
  const user = await userService.createUser({
    username: 'newuser',
    full_name: 'John Doe',
    password: 'secure123',
    role: 'student'
  })
} catch (error) {
  console.error('Validation error:', error.message)
}
```

### ValidationService

```typescript
import { validateEmail, validatePassword } from '@/application'

// Использование валидаторов
const emailValid = validateEmail('user@example.com')
const passwordCheck = validatePassword('MySecure123')
```

