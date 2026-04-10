const User = require('../models/User');

// List all students (admin only)
exports.getAllStudents = async (req, res) => {
  const students = await User.find({ role: 'student' }).select('-password');
  res.json(students);
};
// Get user details
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
};
