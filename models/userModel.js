const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

exports.create = async (username, password, email) => {
    const result = await pool.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *', [username, password, email]);
    return result.rows[0];
};

exports.findByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

exports.updateUsername = async (userId, newUsername) => {
    await pool.query('UPDATE users SET username = $1 WHERE id = $2', [newUsername, userId]);
};

exports.updatePassword = async (userId, newPassword) => {
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [newPassword, userId]);
};

exports.findById = async (userId) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    return result.rows[0];
};