# Auth Service
Сервис управления пользователями и сессиями (JWT).

### Эндпоинты
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход (выдача access/refresh токенов)
- `POST /api/auth/refresh` - Обновление токена
- `GET /api/auth/me` - Получение профиля (нужен Bearer токен)

### Запуск (dev)
1. `npm install`
2. `npm start`