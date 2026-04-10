const mongoose = require('mongoose');
const courseSectionSchema = new mongoose.Schema({
  title: String,
  description: String,
  videoUrl: String, // placeholder for video
});
const courseSchema = new mongoose.Schema({
  name: String,
  sections: [courseSectionSchema],
  pointsRequired: { type: Number, default: 100 },
});
module.exports = mongoose.model('Course', courseSchema);

