const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  // Admin creates a new task
  const { title, overview, requirements, difficulty, maxPoints } = req.body;
  const task = new Task({
    admin: req.user.userId,
    title, overview, requirements, difficulty, maxPoints
  });
  await task.save();
  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  // Admin sees their tasks; students see all active tasks
  if (req.user.role === 'admin') {
    const tasks = await Task.find({ admin: req.user.userId });
    return res.json(tasks);
  }
  const tasks = await Task.find({ isActive: true });
  res.json(tasks);
};

exports.getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Not found' });
  res.json(task);
};

exports.editTask = async (req, res) => {
  // Admin can edit their own tasks
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, admin: req.user.userId },
    req.body,
    { new: true }
  );
  if (!task) return res.status(404).json({ error: 'Not found' });
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, admin: req.user.userId });
  if (!task) return res.status(404).json({ error: 'Not found or unauthorized' });
  res.json({ message: 'Task deleted' });
};

exports.repostTask = async (req, res) => {
  // Reactivate a previously deleted/closed task
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, admin: req.user.userId },
    { isActive: true },
    { new: true }
  );
  if (!task) return res.status(404).json({ error: 'Not found or unauthorized' });
  res.json(task);
};
