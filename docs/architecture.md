# Архитектура

## Компоненты
1. **Frontend**: React (Vite, Zustand, Axios).
2. **Gateway**: Nginx Reverse Proxy.
3. **Services**: Node.js + Express.
4. **DB**: PostgreSQL (отдельные базы данных).

## Схема
[Browser] -> [Nginx (8080)]
|-> [Frontend]
|-> [Auth Service] -> [Auth DB]
|-> [Products Service] -> [Products DB]
|-> [Orders Service] -> [Orders DB]

