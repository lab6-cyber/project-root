# MODA — Frontend Application

Клиентское приложение магазина одежды, разработанное на **React** с использованием сборщика **Vite**.

## Технологический стек
- **UI**: React 18
- **State Management**: Zustand
- **Routing**: React Router Dom v6
- **Styles**: Custom CSS (Premium Modern UI)
- **API Client**: Axios
- **Testing**: Jest + React Testing Library

## Команды для локальной разработки

Перед запуском убедитесь, что вы находитесь в папке `frontend` и выполнили `npm install`.

### 1. Запуск в режиме разработки
Запускает сервер Vite с поддержкой Hot Module Replacement (HMR).
```bash
npm run dev
```

### 2. Сборка для продакшена
Компилирует приложение и оптимизирует его для деплоя. Результат сохраняется в папку `dist/`.
```bash
npm run build
```

### 3. Запуск превью
Запускает локальный сервер для проверки собранного продакшен-бандла.
```bash
npm run preview
```

### 4. Запуск тестов
Запускает unit-тесты компонентов и логики через Jest.
```bash
npm run test
```

## Работа с Docker

### 1. Сборка Docker-образа
Сборка образа фронтенда на основе Nginx для раздачи статики.
```bash
docker build -t moda-frontend .
```

### 2. Запуск контейнера отдельно
Если нужно запустить фронтенд без docker-compose (на порту 3000):
```bash
docker run -p 3000:3000 moda-frontend
```

## Взаимодействие с API
Приложение настроено на отправку запросов по относительному пути `/api`.
В режиме Docker-compose все запросы проксируются через **Nginx Gateway** на соответствующие микросервисы (Auth, Products, Orders).
```javascript
const api = axios.create({
  baseURL: '/api'
});
