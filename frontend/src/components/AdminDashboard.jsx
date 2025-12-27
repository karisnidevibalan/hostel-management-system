
import React, { useEffect, useState } from 'react';

import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminNav from './AdminNav';
import AdminRooms from './AdminRooms';
import AdminOccupancy from './AdminOccupancy';
import AdminComplaints from './AdminComplaints';

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  useEffect(() => {
    fetch('/api/students', { headers })
      .then(res => res.json()).then(setStudents);
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <AdminNav />
      <div className="mt-6">
        <Routes>
          <Route path="/admin/rooms" element={<AdminRooms headers={headers} />} />
          <Route path="/admin/occupancy" element={<AdminOccupancy headers={headers} />} />
          <Route path="/admin/complaints" element={<AdminComplaints headers={headers} students={students} />} />
          <Route path="*" element={<Navigate to="/admin/rooms" />} />
        </Routes>
      </div>
    </div>
  );
}
