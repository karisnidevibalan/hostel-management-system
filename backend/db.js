import Database from 'better-sqlite3';

const db = new Database('hostel.db');

db.exec(`
CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_number TEXT NOT NULL UNIQUE,
  capacity INTEGER NOT NULL,
  occupied INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  room_id INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(room_id) REFERENCES rooms(id)
);
`);

export default db;
