const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const Student = require('./models/Student');
const Admin = require('./models/Admin');
const bcrypt = require('bcrypt');

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB for seeding');

  await Course.deleteMany({});
  await Student.deleteMany({});

  const courses = [
    { name: 'Web Development', durationMonths: 3, totalClasses: 30, timing: 'Evening' },
    { name: 'Graphic Design', durationMonths: 3, totalClasses: 30, timing: 'Afternoon' },
    { name: 'Digital Marketing', durationMonths: 3, totalClasses: 30, timing: 'Morning' },
  ];

  const created = await Course.insertMany(courses);

  const students = [];
  for (let i = 1; i <= 50; i++) {
    students.push({
      fullName: `Student ${i}`,
      fatherName: `Father ${i}`,
      rollNumber: `R${1000 + i}`,
      idType: 'formB',
      idNumber: `FB${1000 + i}`,
      dob: new Date('2005-01-01'),
      gender: 'male',
      contactNumber: '03000000000',
      email: `student${i}@example.com`,
      address: 'Address',
      class: 'Course Class',
      section: 'A',
      emergencyContactName: 'Emergency',
      emergencyContactNumber: '03000000000',
      bloodGroup: 'O+',
      medicalConditions: '',
      previousSchool: '',
      courseName: created[0].name,
      courseDuration: '3months',
      courseTiming: created[0].timing,
    });
  }

  await Student.insertMany(students);
  console.log('Seeded courses and students.');

  // create admin
  await Admin.deleteMany({});
  const hash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'admin123', 10);
  await Admin.create({ email: process.env.SEED_ADMIN_EMAIL || 'admin@example.com', passwordHash: hash });
  console.log('Created admin user (email: admin@example.com default)');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});