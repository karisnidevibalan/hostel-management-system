import React from 'react';
import { NavLink } from 'react-router-dom';

export default function AdminNav() {
  const navClass = ({ isActive }) =>
    isActive
      ? 'px-4 py-2 border-b-2 border-blue-600 font-semibold text-blue-700 dark:text-blue-300'
      : 'px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600';

  return (
    <nav className="flex space-x-2 border-b bg-white dark:bg-gray-900 mb-6">
      <NavLink to="/admin/rooms" className={navClass} end>Rooms</NavLink>
      <NavLink to="/admin/occupancy" className={navClass}>Occupancy Chart</NavLink>
      <NavLink to="/admin/complaints" className={navClass}>Complaints</NavLink>
    </nav>
  );
}
