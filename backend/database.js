const Database = require('better-sqlite3');
const path = require('path');

// Connect to database file
const dbPath = path.join(__dirname, 'db', 'database.db');
const db = new Database(dbPath);

// Create the tables if they do not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    password TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT "black"
  )`);
  
db.exec(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user INTEGER NOT NULL,
    content TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user) REFERENCES users(id) 
  )
`);

db.exec(`
  CREATE TABlE IF NOT EXISTS session (
    sid TEXT PRIMARY KEY,
    ses TEXT NOT NULL,
    expire INTEGER NOT NULL
  )`);

module.exports = db;