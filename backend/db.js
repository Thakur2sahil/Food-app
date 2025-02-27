const { Client } = require('pg');

const db = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: 'pass123',
    database: 'Demo',
});

db.connect()
    .then(() => {
        console.log('Connected to database');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

module.exports = db;