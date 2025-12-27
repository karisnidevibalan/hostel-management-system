import React, { useState } from 'react';

const categories = [
  'Food',
  'Cleaning',
  'Fan',
  'Light',
  'Other',
];

export default function ComplaintForm({ onSubmit }) {
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(category, description)
      .then(() => {
        setMessage('Complaint submitted!');
        setDescription('');
      })
      .catch(() => setMessage('Error submitting complaint.'));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 bg-white dark:bg-gray-800 p-4 rounded shadow mt-4">
      <h3 className="font-semibold mb-2">Submit a Complaint</h3>
      <select className="w-full p-2 rounded border" value={category} onChange={e => setCategory(e.target.value)}>
        {categories.map(c => <option key={c}>{c}</option>)}
      </select>
      <textarea
        className="w-full p-2 rounded border"
        placeholder="Describe your issue..."
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      />
      <button className="py-2 px-4 bg-red-600 text-white rounded">Submit</button>
      {message && <div className="text-green-600 mt-2">{message}</div>}
    </form>
  );
}
