const request = require('supertest');
const app = require('../src/index');

// Имитируем базу данных, чтобы тесты проходили без реального Postgres в CI
jest.mock('../src/db', () => ({
  pool: {
    query: jest.fn().mockImplementation((query) => {
      if (query.includes('INSERT INTO users')) {
        return Promise.resolve({ rows: [{ id: 1, email: 'test@moda.ru', name: 'Тест' }] });
      }
      if (query.includes('SELECT * FROM users')) {
        return Promise.resolve({ rows: [] });
      }
      return Promise.resolve({ rows: [] });
    }),
    end: jest.fn()
  },
  connectWithRetry: jest.fn().mockResolvedValue()
}));

describe('Auth Service API', () => {
  it('POST /api/auth/register - Успешная регистрация', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@moda.ru',
        password: 'password123',
        name: 'Тест Пользователь'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('GET /api/auth/me - Ошибка без токена', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toEqual(401);
  });
});
