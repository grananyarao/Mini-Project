import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('/api/courses', { headers: { Authorization: `Bearer ${localStorage.token}` } })
      .then(res => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Could not load courses.');
        setLoading(false);
      });
  }, []);

  // For demo/testing, if API doesn't work, use sample data
  // Remove this block if you have real backend!
  useEffect(() => {
    if (courses.length === 0 && !loading && !error) {
      setCourses([
        { _id: '1', name: 'Maths 101', pointsRequired: 10 },
        { _id: '2', name: 'Science Fundamentals', pointsRequired: 20 }
      ]);
    }
  }, [courses, loading, error]);

  return (
    <div className="main-content">
      <h2>Available Courses</h2>
      {loading && <p>Loading courses...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {courses.length === 0 && !loading && !error && <p>No courses found.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {courses.map(course => (
          <li key={course._id} style={{
            margin: "1.2em 0", padding: "1em", boxShadow: "0 2px 12px #eee", borderRadius: "10px",
            background: "#fff"
          }}>
            <Link to={`/courses/${course._id}`} style={{ color: "#2267b0", fontSize: "1.15em", fontWeight: "bold" }}>
              {course.name}
            </Link>
            <span style={{ marginLeft: "1.5em", color: "#888" }}>
              {course.pointsRequired} points required
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default CourseList;

