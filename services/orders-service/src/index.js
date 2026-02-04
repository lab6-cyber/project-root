require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { pool, connectWithRetry } = require('./db');

const app = express();
app.use(express.json());
app.use(cors());

const PRODUCTS_URL = process.env.PRODUCTS_SERVICE_URL || 'http://products-service:3002';

const startServer = async () => {
    await connectWithRetry();
    await pool.query(`
        CREATE TABLE IF NOT EXISTS orders (
                                              id SERIAL PRIMARY KEY,
                                              user_id INTEGER NOT NULL,
                                              user_name VARCHAR(255),
            total INTEGER NOT NULL,
            status VARCHAR(50) DEFAULT 'Оформлен',
            address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        CREATE TABLE IF NOT EXISTS order_items (
                                                   id SERIAL PRIMARY KEY,
                                                   order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
            product_id INTEGER,
            title VARCHAR(255),
            quantity INTEGER,
            price INTEGER,
            image_url TEXT
            );
    `);
    app.listen(process.env.PORT || 3003, () => console.log(`Orders service running on 3003`));
};

app.post('/api/orders', async (req, res) => {
    const { userId, userName, items, total, address } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const orderRes = await client.query(
            'INSERT INTO orders (user_id, user_name, total, address) VALUES ($1, $2, $3, $4) RETURNING id',
            [userId, userName, total, address]
        );
        const orderId = orderRes.rows[0].id;

        for (const item of items) {
            await client.query(
                'INSERT INTO order_items (order_id, product_id, title, quantity, price, image_url) VALUES ($1, $2, $3, $4, $5, $6)',
                [orderId, item.productId, item.title, item.quantity, item.price, item.image_url]
            );

            try {
                await axios.patch(`${PRODUCTS_URL}/api/products/${item.productId}/decrement`, {
                    quantity: item.quantity
                });
            } catch (err) {
                console.error(`Ошибка связи с products-service для товара ${item.productId}:`, err.message);
            }
        }
        await client.query('COMMIT');
        res.json({ orderId, status: 'Оформлен' });
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Ошибка БД в orders-service:', e.message);
        res.status(500).json({ error: e.message });
    } finally {
        client.release();
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const { userId, all } = req.query;
        let result;
        if (all === 'true') {
            result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
        } else {
            result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        }

        const orders = result.rows;
        for (let order of orders) {
            const items = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
            order.items = items.rows;
        }
        res.json(orders);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.patch('/api/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, req.params.id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

if (require.main === module) startServer();
module.exports = app;
