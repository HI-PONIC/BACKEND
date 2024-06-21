const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

exports.findByDeviceId = async (device_id) => {
    const result = await pool.query('SELECT 1 FROM iot_devices WHERE device_id = $1 LIMIT 1', [device_id]);
    return result.rowCount > 0;
};