
import React, { useEffect, useState } from 'react';
import ComplaintForm from './ComplaintForm';

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [message, setMessage] = useState('');
  const [complaints, setComplaints] = useState([]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  useEffect(() => {
    fetch('/api/profile', { headers })
      .then(res => res.json()).then(setProfile);
    fetch('/api/rooms', { headers })
      .then(res => res.json()).then(setRooms);
    fetch('/api/complaints', { headers })
      .then(res => res.json()).then(setComplaints);
  }, []);

  const requestRoom = (e) => {
    e.preventDefault();
    fetch('/api/room-request', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ room_id: roomId }),
    })
      .then(res => res.json())
      .then(data => setMessage(data.success ? 'Room assigned!' : data.error));
  };

  const submitComplaint = (category, description) => {
    return fetch('/api/complaints', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, description }),
    })
      .then(res => res.json())
      .then(() => fetch('/api/complaints', { headers }).then(res => res.json()).then(setComplaints));
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <h2 className="text-2xl font-bold">Student Dashboard</h2>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Profile</h3>
        <div>Name: {profile.name}</div>
        <div>Email: {profile.email}</div>
        <div>Room: {rooms.find(r => r.id === profile.room_id)?.room_number || 'Not assigned'}</div>
        <div>Joined: {profile.created_at?.slice(0, 10)}</div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Request Room</h3>
        <form onSubmit={requestRoom} className="space-y-2">
          <select className="w-full p-2 rounded border" value={roomId} onChange={e => setRoomId(e.target.value)} required>
            <option value="">Select Room</option>
            {rooms.filter(r => r.occupied < r.capacity).map(r => (
              <option key={r.id} value={r.id}>{r.room_number} (Available: {r.capacity - r.occupied})</option>
            ))}
          </select>
          <button className="py-2 px-4 bg-blue-600 text-white rounded">Request</button>
        </form>
        {message && <div className="mt-2 text-green-600">{message}</div>}
      </div>
      <ComplaintForm onSubmit={submitComplaint} />
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">My Complaints</h3>
        <table className="min-w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-2">Category</th>
              <th className="p-2">Description</th>
              <th className="p-2">Status</th>
              <th className="p-2">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.category}</td>
                <td className="p-2">{c.description}</td>
                <td className="p-2">{c.status}</td>
                <td className="p-2">{c.assigned_to || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
