import React, { useState, useEffect } from 'react';

export default function AdminRooms({ headers }) {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({ room_number: '', capacity: '' });

  useEffect(() => {
    fetch('/api/rooms', { headers })
      .then(res => res.json()).then(setRooms);
  }, []);

  const addRoom = (e) => {
    e.preventDefault();
    fetch('/api/rooms', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(newRoom),
    })
      .then(res => res.json())
      .then(() => {
        setNewRoom({ room_number: '', capacity: '' });
        fetch('/api/rooms', { headers })
          .then(res => res.json()).then(setRooms);
      });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-2">Rooms</h2>
      <form onSubmit={addRoom} className="flex flex-col md:flex-row gap-2 items-end bg-white dark:bg-gray-800 p-4 rounded shadow">
        <input className="p-2 rounded border flex-1" placeholder="Room Number" value={newRoom.room_number} onChange={e => setNewRoom(r => ({ ...r, room_number: e.target.value }))} required />
        <input className="p-2 rounded border w-32" type="number" placeholder="Capacity" value={newRoom.capacity} onChange={e => setNewRoom(r => ({ ...r, capacity: e.target.value }))} required />
        <button className="py-2 px-4 bg-green-600 text-white rounded">Add Room</button>
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border rounded-lg shadow">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-2">Room</th>
              <th className="p-2">Capacity</th>
              <th className="p-2">Occupied</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(r => (
              <tr key={r.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-2 font-semibold">{r.room_number}</td>
                <td className="p-2">{r.capacity}</td>
                <td className="p-2">{r.occupied}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
