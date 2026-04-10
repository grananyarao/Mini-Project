import React, { useState } from 'react';
import axios from 'axios';

const EditTask = ({ task }) => {
  const [form, setForm] = useState(task);
  const [editing, setEditing] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleEdit = e => {
    e.preventDefault();
    axios.put(`/api/tasks/${task._id}`, form, { headers: { Authorization: `Bearer ${localStorage.token}` } }).then(() => setEditing(false));
  };
  const handleDelete = () => {
    if (window.confirm("Delete this task?"))
      axios.delete(`/api/tasks/${task._id}`, { headers: { Authorization: `Bearer ${localStorage.token}` } });
  };
  const handleRepost = () => {
    axios.post(`/api/tasks/${task._id}/repost`, {}, { headers: { Authorization: `Bearer ${localStorage.token}` } });
  };

  return (
    <div style={{ border: '1px solid #eee', margin: '6px', padding: '10px' }}>
      {!editing ? (
        <>
          <b>{task.title}</b> ({task.difficulty})<br />
          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
          {!task.isActive && <button onClick={handleRepost}>Repost</button>}
        </>
      ) : (
        <form onSubmit={handleEdit}>
          <input name="title" value={form.title} onChange={handleChange} />
          <textarea name="overview" value={form.overview} onChange={handleChange}></textarea>
          <input name="maxPoints" type="number" value={form.maxPoints} onChange={handleChange} />
          <select name="difficulty" value={form.difficulty} onChange={handleChange}>
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
          <textarea name="requirements" value={form.requirements} onChange={handleChange}></textarea>
          <button type="submit">Save</button>
        </form>
      )}
    </div>
  );
};
export default EditTask;
