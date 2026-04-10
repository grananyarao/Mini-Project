const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  overview: String,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  maxPoints: { type: Number, default: 10 },
  requirements: String,
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});
module.exports = mongoose.model('Task', taskSchema);

