const express = require('express');
const cors = require('cors');
const { pool, connectWithRetry } = require('./db');

const app = express();
app.use(express.json());
app.use(cors());

const startServer = async () => {
    await connectWithRetry();
    await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
                                                id SERIAL PRIMARY KEY,
                                                title VARCHAR(255) NOT NULL,
            description TEXT,
            price INTEGER NOT NULL,
            stock INTEGER NOT NULL DEFAULT 0,
            image_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
    `);
    app.listen(process.env.PORT || 3002, () => console.log(`Products service running`));
};

app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
        res.json(result.rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.sendStatus(404);
        res.json(result.rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const { title, price, stock, description, image_url } = req.body;
        const result = await pool.query(
            'INSERT INTO products (title, price, stock, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, price, stock, description, image_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const { title, price, stock, description, image_url } = req.body;
        await pool.query(
            'UPDATE products SET title=$1, price=$2, stock=$3, description=$4, image_url=$5 WHERE id=$6',
            [title, price, stock, description, image_url, req.params.id]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM products WHERE id=$1', [req.params.id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.patch('/api/products/:id/decrement', async (req, res) => {
    try {
        const { quantity } = req.body;
        await pool.query(
            'UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1',
            [quantity, req.params.id]
        );
        res.json({ success: true });
    } catch (e) {
        console.error('Ошибка списания остатков:', e.message);
        res.status(500).json({ error: e.message });
    }
});

if (require.main === module) startServer();
module.exports = app;
