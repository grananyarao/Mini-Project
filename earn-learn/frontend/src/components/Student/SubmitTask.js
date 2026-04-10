import React, { useState } from 'react';
import axios from 'axios';

const SubmitTask = ({ taskId, alreadySubmitted, refresh }) => {
  const [note, setNote] = useState('');
  const [attachment, setAttachment] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/submissions', {
        taskId, note, attachment
      }, { headers: { Authorization: `Bearer ${localStorage.token}` } });
      setMsg("Submitted! Await admin evaluation.");
      refresh();
    } catch (err) {
      setMsg(err.response?.data?.error || "Error submitting.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Add a note to admin (optional)"
        required
      />
      <input
        type="text"
        value={attachment}
        onChange={e => setAttachment(e.target.value)}
        placeholder="Attachment URL (pdf/jpeg/GitHub, any link)"
        required
      />
      <button type="submit">Submit Task</button>
      {msg && <div>{msg}</div>}
    </form>
  );
};
export default SubmitTask;
