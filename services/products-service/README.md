# Products Service
Сервис каталога одежды.

### Эндпоинты
- `GET /api/products` - Список товаров
- `GET /api/products/:id` - Детали товара
- `POST /api/products` - Создание (Admin)
- `PUT /api/products/:id` - Редактирование (Admin)
- `DELETE /api/products/:id` - Удаление (Admin)
- `PATCH /api/products/:id/decrement` - Списание остатка