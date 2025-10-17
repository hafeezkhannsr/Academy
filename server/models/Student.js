const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  fatherName: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  idType: { type: String, enum: ['nic', 'formB'], required: true },
  idNumber: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String },
  contactNumber: { type: String },
  email: { type: String },
  address: { type: String },
  class: { type: String },
  section: { type: String },
  emergencyContactName: { type: String },
  emergencyContactNumber: { type: String },
  bloodGroup: { type: String },
  medicalConditions: { type: String },
  previousSchool: { type: String },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  courseName: { type: String },
  courseDuration: { type: String },
  courseTiming: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
