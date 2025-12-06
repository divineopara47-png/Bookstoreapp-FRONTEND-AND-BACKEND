const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ========== AUTHORS ENDPOINTS ==========

// GET all authors
app.get('/api/authors', (req, res) => {
  const sql = 'SELECT * FROM authors';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// POST new author
app.post('/api/authors', (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  const sql = 'INSERT INTO authors (name) VALUES (?)';
  db.run(sql, [name], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      author_id: this.lastID,
      name: name
    });
  });
});

// ========== BOOKS ENDPOINTS ==========

// GET all books
app.get('/api/books', (req, res) => {
  const sql = 'SELECT * FROM books';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// POST new book
app.post('/api/books', (req, res) => {
  const { title, author_id } = req.body;
  
  if (!title || !author_id) {
    res.status(400).json({ error: 'Title and author_id are required' });
    return;
  }

  const sql = 'INSERT INTO books (title, author_id) VALUES (?, ?)';
  db.run(sql, [title, author_id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      book_id: this.lastID,
      title: title,
      author_id: author_id
    });
  });
});

// PUT update book
app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author_id } = req.body;
  
  if (!title || !author_id) {
    res.status(400).json({ error: 'Title and author_id are required' });
    return;
  }

  const sql = 'UPDATE books SET title = ?, author_id = ? WHERE book_id = ?';
  db.run(sql, [title, author_id, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    res.json({
      book_id: parseInt(id),
      title: title,
      author_id: author_id
    });
  });
});

// DELETE book
app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  
  const sql = 'DELETE FROM books WHERE book_id = ?';
  db.run(sql, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    res.json({ message: 'Book deleted successfully', book_id: parseInt(id) });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});