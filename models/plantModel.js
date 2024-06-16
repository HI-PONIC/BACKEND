const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432, // You can add a default port here
});

// Function to create a new plant
exports.create = async (name, date_added, image, user_id) => {
    const query = 'INSERT INTO plants (name, date_added, image, user_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [name, date_added, image, user_id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Function to find all plants
exports.findAll = async () => {
    const query = 'SELECT * FROM plants';
    const result = await pool.query(query);
    return result.rows;
};

// Function to update a plant
exports.update = async (id, name, date_added, image, user_id) => {
    const query = 'UPDATE plants SET name = $1, date_added = $2, image = $3, user_id = $4 WHERE id = $5 RETURNING *';
    const values = [name, date_added, image, user_id, id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Function to delete a plant
exports.delete = async (id) => {
    const query = 'DELETE FROM plants WHERE id = $1';
    const values = [id];
    await pool.query(query, values);
};

// Function to find plants by user_id
exports.findByUserId = async (user_id) => {
    const query = 'SELECT * FROM plants WHERE user_id = $1';
    const values = [user_id];
    const result = await pool.query(query, values);
    return result.rows;
};
