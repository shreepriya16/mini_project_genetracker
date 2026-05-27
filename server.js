const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// ✅ Serve static files from "public" folder
app.use(express.static('public'));

// Connect to SQLite database
const db = new sqlite3.Database('./sample.db');

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS samples (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sample_id TEXT,
    organism TEXT,
    collection_date TEXT
)`);

// Insert sample
app.post('/samples', (req, res) => {
    const { sample_id, organism, collection_date } = req.body;
    db.run(
        `INSERT INTO samples (sample_id, organism, collection_date) VALUES (?, ?, ?)`,
        [sample_id, organism, collection_date],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID });
        }
    );
});

// View all samples
app.get('/samples', (req, res) => {
    db.all(`SELECT * FROM samples`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
