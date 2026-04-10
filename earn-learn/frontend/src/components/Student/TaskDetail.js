import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SubmitTask from './SubmitTask';

const TaskDetail = ({ match }) => {
  const [task, setTask] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const taskId = match.params.id;

  useEffect(() => {
    axios.get(`/api/tasks/${taskId}`, { headers: { Authorization: `Bearer ${localStorage.token}` } })
      .then(res => setTask(res.data));
    axios.get(`/api/submissions/task/${taskId}`, { headers: { Authorization: `Bearer ${localStorage.token}` } })
      .then(res => {
        setSubmissions(res.data);
        setMySubmissions(res.data.filter(s => s.student._id === getUserId()));
      });
  }, [taskId]);

  // Helper to get logged-in user id from JWT
  function getUserId() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch { return null; }
  }

  if (!task) return <div>Loading...</div>;
  const canSubmit = mySubmissions.length < 2 && (!mySubmissions.length || mySubmissions.slice(-1)[0].status === "redo");

  return (
    <div>
      <h3>{task.title}</h3>
      <p><b>Difficulty:</b> {task.difficulty}</p>
      <p><b>Overview:</b> {task.overview}</p>
      <p><b>Requirements:</b> {task.requirements}</p>
      <p><b>Max Points:</b> {task.maxPoints}</p>
      <p>
        <b>Responses Submitted:</b> {submissions.length}
      </p>
      {canSubmit ? 
        <SubmitTask taskId={taskId} alreadySubmitted={mySubmissions.length} refresh={() => window.location.reload()} /> :
        <div><i>You have reached maximum submissions or your last response is satisfied!</i></div>
      }
      <div>
        <h4>Your Submissions</h4>
        {mySubmissions.map(s => (
          <div key={s._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '6px 0' }}>
            <b>Status:</b> {s.status} <br />
            <b>Points Awarded:</b> {s.pointsAwarded} <br />
            <b>Admin Feedback:</b> {s.adminFeedback || "Pending"} <br />
            <b>Your Note:</b> {s.note} <br />
            <b>Attachment:</b> <a href={s.attachment} target="_blank" rel="noopener noreferrer">View</a>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TaskDetail;
