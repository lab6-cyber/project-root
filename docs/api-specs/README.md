# API Спецификация микросервисов MODA

Все запросы к API проходят через Gateway (порт 8080). 
Базовый URL: `http://localhost:8080/api`

---

## 1. Auth Service (Сервис аутентификации)

### Регистрация пользователя
`POST /auth/register`

**Запрос:**
```json
{
  "email": "customer@example.com",
  "password": "securepassword123",
  "name": "Александр"
}
```

**Ответ (201 Created):**
```json
{
  "id": 1,
  "email": "customer@example.com",
  "name": "Александр"
}
```

---

### Вход в систему
`POST /auth/login`

**Запрос:**
```json
{
  "email": "customer@example.com",
  "password": "securepassword123"
}
```

**Ответ (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1...",
  "refreshToken": "def456...",
  "user": {
    "id": 1,
    "email": "customer@example.com",
    "name": "Александр",
    "role": "user"
  }
}
```

---

### Получение профиля (Проверка токена)
`GET /auth/me`
**Header:** `Authorization: Bearer <accessToken>`

**Ответ (200 OK):**
```json
{
  "id": 1,
  "email": "customer@example.com",
  "name": "Александр",
  "role": "user"
}
```

---

## 2. Products Service (Каталог товаров)

### Получение списка товаров
`GET /products`

**Ответ (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Черное худи Oversize",
    "description": "Плотный хлопок, свободный крой",
    "price": 4500,
    "stock": 15,
    "image_url": "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
    "created_at": "2026-02-02T10:00:00Z"
  },
  {
    "id": 2,
    "title": "Белая футболка Basic",
    "description": "Классическая футболка",
    "price": 1800,
    "stock": 50,
    "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    "created_at": "2026-02-02T10:05:00Z"
  }
]
```

---

### Создание товара (Admin)
`POST /products`
**Header:** `Authorization: Bearer <adminToken>`

**Запрос:**
```json
{
  "title": "Кожаная куртка",
  "price": 12000,
  "stock": 5,
  "description": "Натуральная кожа, премиальное качество",
  "image_url": "https://example.com/jacket.jpg"
}
```

**Ответ (201 Created):**
```json
{
  "id": 3,
  "title": "Кожаная куртка",
  "price": 12000,
  "stock": 5,
  "description": "Натуральная кожа, премиальное качество",
  "image_url": "https://example.com/jacket.jpg",
  "created_at": "2026-02-02T12:30:00Z"
}
```

---

### Удаление товара (Admin)
`DELETE /products/:id`
**Header:** `Authorization: Bearer <adminToken>`

**Ответ (200 OK):**
```json
{
  "success": true
}
```

---

## 3. Orders Service (Заказы)

### Оформление заказа
`POST /orders`
**Header:** `Authorization: Bearer <accessToken>`

**Запрос:**
```json
{
  "userId": 1,
  "userName": "Александр",
  "total": 6300,
  "address": "г. Москва, ул. Модная, д. 1",
  "items": [
    {
      "productId": 1,
      "title": "Черное худи Oversize",
      "quantity": 1,
      "price": 4500,
      "image_url": "https://images.unsplash.com/..."
    },
    {
      "productId": 2,
      "title": "Белая футболка Basic",
      "quantity": 1,
      "price": 1800,
      "image_url": "https://images.unsplash.com/..."
    }
  ]
}
```

**Ответ (200 OK):**
```json
{
  "orderId": 101,
  "status": "Оформлен"
}
```

---

### Список заказов пользователя
`GET /orders?userId=1`

**Ответ (200 OK):**
```json
[
  {
    "id": 101,
    "user_id": 1,
    "total": 6300,
    "status": "Оформлен",
    "created_at": "2026-02-02T13:00:00Z",
    "items": [
      {
        "id": 50,
        "product_id": 1,
        "title": "Черное худи Oversize",
        "quantity": 1,
        "price": 4500,
        "image_url": "..."
      }
    ]
  }
]
```

---

### Изменение статуса заказа (Admin)
`PATCH /orders/:id/status`
**Header:** `Authorization: Bearer <adminToken>`

**Запрос:**
```json
{
  "status": "В пути"
}
```

**Ответ (200 OK):**
```json
{
  "success": true
}
