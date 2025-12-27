import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'admin') {
      if (email === 'admin@hostel.com') {
        localStorage.setItem('token', 'admin-token');
        navigate('/admin');
      } else {
        setError('Invalid admin email');
      }
    } else {
      // Simulate student login by email lookup
      fetch('/api/students', { headers: { Authorization: 'admin-token' } })
        .then((res) => res.json())
        .then((students) => {
          if (Array.isArray(students)) {
            const student = students.find((s) => s.email === email);
            if (student) {
              localStorage.setItem('token', String(student.id));
              navigate('/student');
            } else {
              setError('Student not found');
            }
          } else {
            setError('Login failed');
          }
        })
        .catch(() => setError('Login failed'));
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <select value={role} onChange={e => setRole(e.target.value)} className="w-full p-2 rounded border">
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 rounded border"
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button className="w-full py-2 bg-blue-600 text-white rounded">Login</button>
      </form>
    </div>
  );
}
