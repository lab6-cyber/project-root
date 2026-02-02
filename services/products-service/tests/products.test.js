const request = require('supertest');
const app = require('../src/index');

jest.mock('../src/db', () => ({
  pool: {
    query: jest.fn().mockImplementation((query) => {
      if (query.includes('SELECT * FROM products')) {
        return Promise.resolve({ rows: [{ id: 1, title: 'Худи', price: 5000 }] });
      }
      return Promise.resolve({ rows: [] });
    }),
    end: jest.fn()
  },
  connectWithRetry: jest.fn().mockResolvedValue()
}));

describe('Products Service API', () => {
  it('GET /api/products - Получение списка товаров', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
