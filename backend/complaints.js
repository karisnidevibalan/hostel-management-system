import db from './db.js';

// Create complaints table if not exists
export function initComplaintsTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      assigned_to TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES students(id)
    );
  `);
}

export function getAllComplaints() {
  return db.prepare('SELECT * FROM complaints').all();
}

export function getComplaintsByStudent(student_id) {
  return db.prepare('SELECT * FROM complaints WHERE student_id = ?').all(student_id);
}

export function addComplaint(student_id, category, description) {
  return db.prepare('INSERT INTO complaints (student_id, category, description) VALUES (?, ?, ?)')
    .run(student_id, category, description);
}

export function updateComplaintStatus(id, status, assigned_to) {
  return db.prepare('UPDATE complaints SET status = ?, assigned_to = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(status, assigned_to, id);
}
