import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('dark') === 'true');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('dark', dark);
  }, [dark]);

  const token = localStorage.getItem('token');
  const isAdmin = token === 'admin-token';
  const isStudent = token && token !== 'admin-token';

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <header className="p-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow">
          <h1 className="text-xl font-bold">Hostel Management System</h1>
          <button
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
            onClick={() => setDark((d) => !d)}
          >
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </header>
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/admin"
              element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/student"
              element={isStudent ? <StudentDashboard /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
