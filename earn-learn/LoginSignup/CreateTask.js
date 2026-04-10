import React, { useState } from 'react';
import axios from 'axios';
const CreateTask = ({ refresh }) => {
  const [form, setForm] = useState({ title: '', overview: '', requirements: '', difficulty: 'easy', maxPoints: 10 });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    axios.post('/api/tasks', form, { headers: { Authorization: `Bearer ${localStorage.token}` } }).then(refresh);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Task Title" value={form.title} onChange={handleChange} required />
      <textarea name="overview" placeholder="Overview" value={form.overview} onChange={handleChange} required />
      <textarea name="requirements" placeholder="Requirements" value={form.requirements} onChange={handleChange} required />
      <select name="difficulty" value={form.difficulty} onChange={handleChange}>
        <option>easy</option>
        <option>medium</option>
        <option>hard</option>
      </select>
      <input name="maxPoints" type="number" value={form.maxPoints} onChange={handleChange} required />
      <button type="submit">Create Task</button>
    </form>
  );
};
export default CreateTask;
