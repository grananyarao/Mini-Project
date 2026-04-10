import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CourseDetail = ({ match }) => {
  const [course, setCourse] = useState(null);

  useEffect(() => {
    axios.get(`/api/courses/${match.params.id}`).then(res => setCourse(res.data));
  }, [match.params.id]);

  if (!course) return <div>Loading...</div>;

  return (
    <div className="course-detail">
      <h2>{course.name}</h2>
      {/* Loop through sections; placeholder for future video */}
      {course.sections.map((section, idx) => (
        <div key={idx} className="section">
          <h3>{section.title}</h3>
          <p>{section.description}</p>
          {/* Video placeholder */}
          {section.videoUrl ? (
            <video src={section.videoUrl} controls width="480" />
          ) : (
            <p><em>Video coming soon!</em></p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseDetail;

