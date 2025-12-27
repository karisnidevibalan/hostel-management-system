import express from 'express';
import cors from 'cors';
import db from './db.js';
import { initComplaintsTable, getAllComplaints, getComplaintsByStudent, addComplaint, updateComplaintStatus } from './complaints.js';


initComplaintsTable();
const app = express();
app.use(cors());
app.use(express.json());
// Complaints
app.get('/api/complaints', auth, (req, res) => {
  if (req.user.role === 'admin') {
    return res.json(getAllComplaints());
  }
  if (req.user.role === 'student') {
    return res.json(getComplaintsByStudent(req.user.id));
  }
  res.status(403).json({ error: 'Forbidden' });
});

app.post('/api/complaints', auth, (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Forbidden' });
  const { category, description } = req.body;
  try {
    const info = addComplaint(req.user.id, category, description);
    // Simulate notification to office and relevant staff
    res.json({ id: info.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.patch('/api/complaints/:id', auth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { status, assigned_to } = req.body;
  try {
    updateComplaintStatus(req.params.id, status, assigned_to);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Simulated JWT auth middleware
function auth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token' });
  req.user = token === 'admin-token' ? { role: 'admin' } : { role: 'student', id: parseInt(token) };
  next();
}

// Students
app.get('/api/students', auth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const students = db.prepare('SELECT * FROM students').all();
  res.json(students);
});

app.post('/api/students', auth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { name, email, room_id } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO students (name, email, room_id) VALUES (?, ?, ?)');
    const info = stmt.run(name, email, room_id || null);
    res.json({ id: info.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Rooms
app.get('/api/rooms', auth, (req, res) => {
  const rooms = db.prepare('SELECT * FROM rooms').all();
  res.json(rooms);
});

app.post('/api/rooms', auth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { room_number, capacity } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO rooms (room_number, capacity) VALUES (?, ?)');
    const info = stmt.run(room_number, capacity);
    res.json({ id: info.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Dashboard
app.get('/api/dashboard', auth, (req, res) => {
  const totalRooms = db.prepare('SELECT COUNT(*) as count FROM rooms').get().count;
  const totalStudents = db.prepare('SELECT COUNT(*) as count FROM students').get().count;
  const occupancy = db.prepare('SELECT room_number, capacity, occupied FROM rooms').all();
  res.json({ totalRooms, totalStudents, occupancy });
});

// Student profile
app.get('/api/profile', auth, (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Forbidden' });
  const student = db.prepare('SELECT * FROM students WHERE id = ?').get(req.user.id);
  if (!student) return res.status(404).json({ error: 'Not found' });
  res.json(student);
});

// Room request (student)
app.post('/api/room-request', auth, (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Forbidden' });
  const { room_id } = req.body;
  try {
    db.prepare('UPDATE students SET room_id = ? WHERE id = ?').run(room_id, req.user.id);
    db.prepare('UPDATE rooms SET occupied = occupied + 1 WHERE id = ?').run(room_id);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on port', PORT));
