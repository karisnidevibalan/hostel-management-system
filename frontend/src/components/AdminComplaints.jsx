import React, { useEffect, useState } from 'react';

export default function AdminComplaints({ headers, students }) {
  const [complaints, setComplaints] = useState([]);
  const [editComplaint, setEditComplaint] = useState(null);
  const [assignTo, setAssignTo] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/complaints', { headers })
      .then(res => res.json()).then(setComplaints);
  }, []);

  const handleEditComplaint = (complaint) => {
    setEditComplaint(complaint);
    setAssignTo(complaint.assigned_to || '');
    setStatus(complaint.status || 'pending');
  };

  const handleUpdateComplaint = (e) => {
    e.preventDefault();
    fetch(`/api/complaints/${editComplaint.id}`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, assigned_to: assignTo }),
    })
      .then(res => res.json())
      .then(() => {
        setEditComplaint(null);
        fetch('/api/complaints', { headers })
          .then(res => res.json()).then(setComplaints);
      });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-2">Complaints</h2>
      <div className="overflow-x-auto bg-white dark:bg-gray-800 p-4 rounded shadow">
        <table className="min-w-full table-auto border rounded-lg shadow">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-2">ID</th>
              <th className="p-2">Student</th>
              <th className="p-2">Category</th>
              <th className="p-2">Description</th>
              <th className="p-2">Status</th>
              <th className="p-2">Assigned To</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-2">{c.id}</td>
                <td className="p-2">{students.find(s => s.id === c.student_id)?.name || '-'}</td>
                <td className="p-2">{c.category}</td>
                <td className="p-2">{c.description}</td>
                <td className="p-2">{c.status}</td>
                <td className="p-2">{c.assigned_to || '-'}</td>
                <td className="p-2">
                  <button className="text-blue-600 underline" onClick={() => handleEditComplaint(c)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editComplaint && (
          <form onSubmit={handleUpdateComplaint} className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
            <h4 className="font-semibold mb-2">Edit Complaint #{editComplaint.id}</h4>
            <label className="block mb-1">Status</label>
            <select className="w-full p-2 rounded border mb-2" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <label className="block mb-1">Assign To</label>
            <input className="w-full p-2 rounded border mb-2" value={assignTo} onChange={e => setAssignTo(e.target.value)} placeholder="e.g. Electrician, Cleaner, Cook" />
            <button className="py-2 px-4 bg-blue-600 text-white rounded">Update</button>
            <button type="button" className="ml-2 py-2 px-4 bg-gray-400 text-white rounded" onClick={() => setEditComplaint(null)}>Cancel</button>
          </form>
        )}
      </div>
    </div>
  );
}
