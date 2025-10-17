const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  durationMonths: { type: Number, required: true },
  totalClasses: { type: Number, required: true },
  timing: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
