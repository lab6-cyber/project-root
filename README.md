# MODA — Premium Clothing Store (Microservices)

Прототип современной информационной системы для интернет-магазина одежды, построенный на микросервисной архитектуре.

## О проекте
Данный проект представляет собой полноценное веб-приложение (MVP), демонстрирующее разделение бизнес-логики на независимые сервисы. Магазин предназначен для розничных покупателей одежды и администраторов каталога.

### Основные функции
- **Покупатель**: регистрация, авторизация (JWT), просмотр стильного каталога, страница деталей товара, персональная корзина (сохраняется между сессиями) и оформление заказов.
- **Администратор**: полный цикл управления товарами (CRUD: создание, редактирование, удаление) и управление статусами заказов всех пользователей.
- **Инфраструктура**: автоматическое списание остатков товара при покупке и маршрутизация через API Gateway.

---

## Технические требования
Для запуска проекта на вашем компьютере должны быть установлены:
- **ОС**: Windows 10+, macOS или Linux.
- **Docker Desktop**: версия 4.0 и выше.
- **Node.js**: версия 20.x (для локального запуска вне Docker).
- **Браузер**: Chrome, Firefox или Edge (версии 2025-2026 года).

---

## Установка и запуск

### 1. Запуск через Docker (Рекомендуемый способ)
Это самый простой способ поднять все сервисы и базы данных одной командой.

1. Склонируйте репозиторий:
   ```bash
   git clone <url_вашего_репозитория>
   cd project-root
   ```
2. Запустите сборку и старт контейнеров:
   ```bash
   docker-compose -f infra/docker-compose.yml up --build
   ```
3. Откройте магазин в браузере: [http://localhost:8080](http://localhost:8080)

### 2. Локальный запуск (Dev Mode)
Если вы хотите запустить каждый сервис вручную для разработки:

1. **База данных**: 
Запустите только Postgres через Docker:
   ```bash
   docker run --name moda-db -e POSTGRES_PASSWORD=pass -p 5432:5432 -d postgres:15
   ```
Создайте отдельно базы:
   ```bash
   docker exec -it moda-db psql -U postgres -c "CREATE DATABASE auth_db;"
   docker exec -it moda-db psql -U postgres -c "CREATE DATABASE products_db;"
   docker exec -it moda-db psql -U postgres -c "CREATE DATABASE orders_db;"
   ```
   
2. **Сервисы**: В каждой папке (`services/auth-service`, `services/products-service`, `services/orders-service`) выполните:
   ```bash
   npm install
   npm start
   ```
3. **Фронтенд**: В папке `frontend`:
   ```bash
   npm install
   npm run dev
   ```

---

## Работа с тестами
В проекте реализованы unit и integration тесты.

- **Тесты бэкенда**:
  Перейдите в папку любого сервиса (например, `services/auth-service`) и выполните:
  ```bash
  npm test
  ```
- **Тесты фронтенда**:
  Перейдите в папку `frontend` и выполните:
  ```bash
  npm run test
  ```

---

## Примеры использования API
Запросы выполняются через шлюз на порту `8080`.

**Пример создания товара (POST):**
```bash
curl -X POST http://localhost:8080/api/products \
-H "Content-Type: application/json" \
-d '{"title": "Худи MODA Black", "price": 5500, "stock": 10, "image_url": "http://img.com/1.jpg"}'
```

---

## Структура репозитория
```text
project-root/
├── frontend/          # React приложение (Vite, Zustand, Axios)
├── services/          # Микросервисы на Node.js/Express
│   ├── auth-service/     # Аутентификация и пользователи (JWT)
│   ├── products-service/ # Каталог товаров и склад
│   └── orders-service/   # Управление заказами и связь с товарами
├── gateway/           # Nginx API Gateway (маршрутизация)
├── infra/             # Docker Compose и SQL инициализация
├── docs/              # Архитектурная схема, API спецификации и отчет
└── .github/           # CI/CD Workflows (GitHub Actions)
```

---

## Авторы и роли
- **Студент (Имя Фамилия)** — Fullstack Developer & DevOps.
    - Проектирование микросервисной архитектуры.
    - Разработка API и интеграция сервисов.
    - Дизайн и разработка Frontend части.
    - Настройка контейнеризации и CI.

## Обратная связь
По вопросам работы прототипа или баг-репортам:
- **Email**: [student@example.com]
- **GitHub**: [link_to_profile]

