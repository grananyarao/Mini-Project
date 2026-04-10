const Course = require('../models/Course');
const User = require('../models/User');

exports.getCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};

exports.getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.json(course);
};

// Enroll student in course if enough points
exports.enrollCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  const user = await User.findById(req.user.userId);
  if (user.points < course.pointsRequired)
    return res.status(403).json({ error: 'Not enough points to enroll' });
  // Enrollment logic here (could add to user's data)
  res.json({ message: 'Enrollment successful!' });
};
