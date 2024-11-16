const bodyParser = require('body-parser');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const { Pool } = require('pg');

const app = express();
const PORT = 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(bodyParser.json());


app.get('/api/todos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM todos');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Error with getting your todos occured!' });
    }
});

app.post('/api/todos', async (req, res) => {
    const { title } = req.body;
    try {
        const newTodo = await pool.query('INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *', [title, false]);
        res.status(201).json({ message: 'New todo created!', result: result.rows[0] })
    } catch (err) {
        res.status(500).json({ message: err.message || 'Error with adding new task occured!' });
    }
});
app.delete('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM todos WHERE id = $1', [id]);
        res.status(200).json({ message: 'Todo deleted!' });
    } catch (err) {
        res.status(500).json({ message: err.message || 'Error with deleing your task' });
    }
})

app.listen(PORT, () => {
    console.log(`The server is running on port: ${PORT}!`);
});