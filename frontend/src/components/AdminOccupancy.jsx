import React, { useEffect, useState } from 'react';
import RoomChart from './RoomChart';

export default function AdminOccupancy({ headers }) {
  const [occupancy, setOccupancy] = useState([]);

  useEffect(() => {
    fetch('/api/dashboard', { headers })
      .then(res => res.json())
      .then(data => setOccupancy(data.occupancy || []));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-2">Occupancy Chart</h2>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <RoomChart data={occupancy} />
      </div>
    </div>
  );
}
