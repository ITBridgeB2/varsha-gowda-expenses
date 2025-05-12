const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', // Replace with your password
  database: 'expense_tracker'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.message);
    return;
  }
  console.log('Connected to MySQL database');
});

// ---------------------------
// API ROUTES
// ---------------------------

// Create a new expense
app.post('/expenses', (req, res) => {
  const { amount, category, date } = req.body;
  if (!amount || !category || !date) {
    return res.status(400).json({ error: "Amount, category, and date are required" });
  }

  const query = "INSERT INTO expenses (amount, category, date) VALUES (?, ?, ?)";
  db.query(query, [amount, category, date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query("SELECT * FROM expenses WHERE id = ?", [result.insertId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(rows[0]);
    });
  });
});

// Get all expenses
app.get('/expenses', (req, res) => {
  db.query("SELECT * FROM expenses ORDER BY date DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

// Get single expense by ID
app.get('/expenses/:id', (req, res) => {
  db.query("SELECT * FROM expenses WHERE id = ?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: "Expense not found" });
    res.status(200).json(rows[0]);
  });
});

// Update an expense
app.put('/expenses/:id', (req, res) => {
  const { amount, category, date } = req.body;
  const query = "UPDATE expenses SET amount = ?, category = ?, date = ? WHERE id = ?";
  db.query(query, [amount, category, date, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Expense not found" });

    db.query("SELECT * FROM expenses WHERE id = ?", [req.params.id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(rows[0]);
    });
  });
});

// Delete an expense
app.delete('/expenses/:id', (req, res) => {
  db.query("DELETE FROM expenses WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Expense not found" });
    res.status(204).send();
  });
});

// Get total expenses
app.get('/expenses/total', (req, res) => {
  db.query("SELECT SUM(amount) AS total FROM expenses", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ total: rows[0].total || 0 });
  });
});

// Sample route to insert test data
app.post('/expenses/sample-data', (req, res) => {
  const sample = [
    [45.50, 'Food', '2025-04-10'],
    [120.00, 'Transport', '2025-04-11'],
    [75.00, 'Groceries', '2025-04-12'],
    [200.00, 'Rent', '2025-04-01'],
    [35.25, 'Entertainment', '2025-04-15'],
    [15.00, 'Coffee', '2025-04-17'],
    [99.99, 'Shopping', '2025-04-19']
  ];

  const query = "INSERT INTO expenses (amount, category, date) VALUES ?";
  db.query(query, [sample], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Sample data inserted", inserted: result.affectedRows });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
