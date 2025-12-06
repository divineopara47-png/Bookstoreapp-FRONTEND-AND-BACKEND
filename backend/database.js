const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const db = new sqlite3.Database(path.join(__dirname, 'bookstore.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  // Create Authors table
  db.run(`
    CREATE TABLE IF NOT EXISTS authors (
      author_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating authors table:', err.message);
    } else {
      console.log('Authors table ready');
    }
  });

  // Create Books table with foreign key
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      book_id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author_id INTEGER NOT NULL,
      FOREIGN KEY (author_id) REFERENCES authors(author_id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating books table:', err.message);
    } else {
      console.log('Books table ready');
    }
  });
}

module.exports = db;