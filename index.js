const { Client } = require('pg');
const express = require('express');

// create an express application
const app = express();
app.use(express.json());
// create a postgresql client
const client = new Client({
    database: 'social-media'
});

// route handlers go here
app.get('/users', (req, res) => {
    client.query('SELECT * FROM users', (err, result) => {
        res.send(result.rows);
    })
})

app.post('/users', (req, res) => {
    const insert  = `INSERT INTO users (username, bio) VALUES ($1, $2) RETURNING *`;
    let values = [req.body.username, req.body.bio];
    client.query(insert, values, (err, result) => {
        console.log(result.rows[0])
    })
    res.end()
})

app.get('/users/:id', (req, res) => {
    const id = [req.params.id];
    const query = `SELECT * FROM users WHERE id=$1`

    client.query(query, id, (err, result) => {
        console.log(result.rows[0])
    })
    res.end();
})

// start a server that listens on port 3000 and connects the sql client on success
app.listen(3000, () => {
    client.connect();
});