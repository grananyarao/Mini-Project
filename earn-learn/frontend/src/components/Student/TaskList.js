import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    axios.get('/api/tasks', { headers: { Authorization: `Bearer ${localStorage.token}` } }).then(res => setTasks(res.data));
  }, []);
  return (
    <div>
      <h3>Available Tasks</h3>
      {tasks.map(t => (
        <div key={t._id}>
          <Link to={`/student/task/${t._id}`}>{t.title}</Link>
        </div>
      ))}
    </div>
  );
};
export default TaskList;
