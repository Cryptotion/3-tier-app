const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
    // host: 'localhost',
    // user: 'root',     // Your MySQL username
    // password: '12345678', // Your MySQL password
    // database: 'myapp'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

app.get('/api/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/api/users', (req, res) => {
    const newUser = { name: req.body.name, email: req.body.email };
    const sql = 'INSERT INTO users SET ?';
    db.query(sql, newUser, (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, ...newUser });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
