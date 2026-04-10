import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SubmissionList = () => {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    axios.get('/api/submissions/my', { headers: { Authorization: `Bearer ${localStorage.token}` } })
      .then(res => setSubs(res.data));
  }, []);

  return (
    <div>
      <h3>My Task Submissions</h3>
      {subs.length === 0 && <div>No submissions yet.</div>}
      {subs.map(s => (
        <div key={s._id} style={{ border: '1px solid #e8e8e8', margin: '6px', padding: '10px' }}>
          <b>Task:</b> {s.task.title} <br />
          <b>Status:</b> {s.status} <br />
          <b>Points:</b> {s.pointsAwarded} <br />
          <b>Admin Feedback:</b> {s.adminFeedback || "Pending"} <br />
          <b>Attachment:</b> <a href={s.attachment} target="_blank" rel="noopener noreferrer">View</a>
        </div>
      ))}
    </div>
  );
};
export default SubmissionList;
