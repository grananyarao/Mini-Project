const mongoose = require('mongoose');
const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  note: String,
  attachments: [{ type: String }], // array of file names or paths
  pointsAwarded: { type: Number, default: 0 },
  adminFeedback: String,
  status: { type: String, enum: ['pending', 'satisfied', 'redo'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
  attempt: { type: Number, default: 1 }
});
module.exports = mongoose.model('Submission', submissionSchema);
