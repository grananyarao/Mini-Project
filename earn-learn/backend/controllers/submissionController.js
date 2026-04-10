const Submission = require('../models/Submission');
const Task = require('../models/Task');
const User = require('../models/User');

/**
 * Student submits to a task (max 2 times)
 * Handles multiple file uploads (req.files).
 */
exports.submitTask = async (req, res) => {
  const { taskId, note } = req.body;
  // Check previous submissions
  const prevSubs = await Submission.countDocuments({ task: taskId, student: req.user.userId });
  if (prevSubs >= 2) return res.status(400).json({ error: 'Maximum 2 submissions allowed.' });

  // Collect uploaded filenames/paths
  let attachments = [];
  if (req.files && req.files.length > 0) {
    attachments = req.files.map(f => f.filename || f.path); // multer will provide filename/path
  } else if (req.file) {
    attachments = [req.file.filename || req.file.path];
  } else if (req.body.attachments) {
    // Support for legacy: attachments passed as string/array
    attachments = Array.isArray(req.body.attachments)
      ? req.body.attachments : [req.body.attachments];
  }

  const sub = new Submission({
    task: taskId,
    student: req.user.userId,
    note,
    attachments,
    attempt: prevSubs + 1
  });
  await sub.save();
  res.status(201).json(sub);
};

// List submissions for a task
exports.getSubmissionList = async (req, res) => {
  const list = await Submission.find({ task: req.params.taskId }).populate('student', 'name email');
  res.json(list);
};

// Admin evaluates a submission (points, feedback, satisfied/redo)
exports.evaluateSubmission = async (req, res) => {
  const { pointsAwarded, adminFeedback, status } = req.body;
  const submission = await Submission.findById(req.params.id);
  if (!submission) return res.status(404).json({ error: 'Not found' });
  if (submission.status === 'satisfied') return res.status(400).json({ error: 'Already marked satisfied.' });

  submission.pointsAwarded = pointsAwarded;
  submission.adminFeedback = adminFeedback;
  submission.status = status;
  await submission.save();

  if (status === 'satisfied') {
    await User.findByIdAndUpdate(submission.student, { $inc: { points: pointsAwarded } });
  }
  res.json(submission);
};
