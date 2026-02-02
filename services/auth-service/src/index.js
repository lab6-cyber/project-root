const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool, connectWithRetry } = require('./db');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refreshsecret';

const startServer = async () => {
    await connectWithRetry();
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            name VARCHAR(255),
            role VARCHAR(50) DEFAULT 'user'
        );
    `);

    app.listen(process.env.PORT || 3001, () => console.log(`Auth service running`));
};

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
            [email, hash, name]
        );
        res.status(201).json(result.rows[0]);
    } catch (e) {
        res.status(500).json({ error: 'Email already exists' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

        res.json({
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/auth/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(401);

    try {
        const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const newAccessToken = jwt.sign({ id: payload.id }, JWT_SECRET, { expiresIn: '15m' });
        res.json({ accessToken: newAccessToken });
    } catch {
        res.sendStatus(403);
    }
});

app.get('/api/auth/me', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const result = await pool.query('SELECT id, email, name, role FROM users WHERE id = $1', [payload.id]);
        res.json(result.rows[0]);
    } catch {
        res.sendStatus(403);
    }
});

if (require.main === module) startServer();

module.exports = app;
