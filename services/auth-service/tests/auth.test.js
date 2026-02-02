const request = require('supertest');
const app = require('../src/index');
const { pool } = require('../src/db');

describe('Auth Service API', () => {
    afterAll(async () => {
        await pool.end();
    });

    it('POST /api/auth/register - Успешная регистрация', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: `test_${Date.now()}@moda.ru`,
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
