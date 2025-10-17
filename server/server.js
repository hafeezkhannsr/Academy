const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
// Configure CORS: allow specific origin via CORS_ORIGIN env var, otherwise allow all (for testing)
const corsOrigin = process.env.CORS_ORIGIN || '*';
const corsOptions = corsOrigin === '*' ? {} : { origin: corsOrigin };
app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Models
const Student = require('./models/Student');
const Attendance = require('./models/Attendance');
const Course = require('./models/Course');

// Auth routes
const authRoutes = require('./routes/auth');

// JWT helper
const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.adminId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Routes (simple inline for now)
app.use('/auth', authRoutes);
app.post('/api/register', async (req, res) => {
  try {
    const data = req.body;
    // If courseId provided, copy some course metadata
    if (data.courseId) {
      const course = await Course.findById(data.courseId);
      if (course) {
        data.courseName = course.name;
        data.courseDuration = course.durationMonths + 'months';
        data.courseTiming = course.timing;
      }
    }
    const student = new Student(data);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/attendance', async (req, res) => {
  try {
    const { studentId, courseId, date } = req.body;
    const attendance = new Attendance({ studentId, courseId, date });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/students', requireAdmin, async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

app.get('/api/courses', async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// attendance summary per student
app.get('/api/attendance-summary/student/:studentId', requireAdmin, async (req, res) => {
  const { studentId } = req.params;
  const total = await Attendance.countDocuments({ studentId });
  res.json({ studentId, attendedClasses: total });
});

// attendance summary per course
app.get('/api/attendance-summary/course/:courseId', requireAdmin, async (req, res) => {
  const { courseId } = req.params;
  const total = await Attendance.countDocuments({ courseId });
  res.json({ courseId, totalAttendances: total });
});

app.get('/api/attendances/:studentId', requireAdmin, async (req, res) => {
  const { studentId } = req.params;
  const records = await Attendance.find({ studentId });
  res.json(records);
});

// Connect to MongoDB and start
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });
