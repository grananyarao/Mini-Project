import React, { useState } from 'react';
import axios from 'axios';
const EvaluateTask = ({ submission }) => {
  const [form, setForm] = useState({ pointsAwarded: submission.pointsAwarded, adminFeedback: '', status: 'pending' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    axios.post(`/api/submissions/evaluate/${submission._id}`, form, { headers: { Authorization: `Bearer ${localStorage.token}` } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>Task: {submission.task.title}</div>
      <div>Student: {submission.student.name}</div>
      <input name="pointsAwarded" type="number" value={form.pointsAwarded} onChange={handleChange} />
      <textarea name="adminFeedback" value={form.adminFeedback} onChange={handleChange} />
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="satisfied">Satisfied</option>
        <option value="redo">Redo</option>
        <option value="pending">Pending</option>
      </select>
      <button type="submit">Evaluate</button>
    </form>
  );
};
export default EvaluateTask;
