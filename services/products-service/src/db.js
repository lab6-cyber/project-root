const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const connectWithRetry = async () => {
    let retries = 10;
    while (retries) {
        try {
            await pool.query('SELECT NOW()');
            console.log('Database connected successfully');
            return;
        } catch (err) {
            console.log('Database connection failed, retrying in 5 seconds...', err.message);
            retries -= 1;
            await sleep(5000);
        }
    }
    throw new Error('Could not connect to database after retries');
};

module.exports = { pool, connectWithRetry };