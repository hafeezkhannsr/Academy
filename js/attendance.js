// Attendance System Management
const attendanceSystem = {
    init: function() {
        DB.init(); // Initialize the database
        this.setupEventListeners();
        this.setDefaultDate();
        this.loadCourses();
    },

    setupEventListeners: function() {
        document.getElementById('attendanceForm').addEventListener('submit', this.markAttendance.bind(this));
        document.getElementById('studentId').addEventListener('input', this.loadStudentInfo.bind(this));
    },

    setDefaultDate: function() {
        document.querySelector('input[type="date"]').valueAsDate = new Date();
    },

    loadCourses: function() {
        const courses = DB.courses.getAll();
        const courseSelect = document.querySelector('select[name="course"]');
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.name;
            courseSelect.appendChild(option);
        });
    },

    loadStudentInfo: function(event) {
        const studentId = event.target.value;
        const student = DB.students.getById(studentId);
        
        if (student) {
            document.querySelector('select[name="course"]').value = student.courseName;
            this.updateAttendanceStats(studentId, student.courseName);
        }
    },

    markAttendance: function(event) {
        event.preventDefault();
        
        const form = event.target;
        const studentId = form.studentId.value;
        const course = form.course.value;
        const date = form.date.value;

        // Validate student exists
        const student = DB.students.getById(studentId);
        if (!student) {
            alert('Student ID not found. Please check the ID or register first.');
            return;
        }

        // Check if attendance already marked for today
        const today = new Date(date).toISOString().split('T')[0];
        const studentAttendance = DB.attendance.getByStudent(studentId);
        const alreadyMarked = studentAttendance.some(a => 
            new Date(a.timestamp).toISOString().split('T')[0] === today
        );

        if (alreadyMarked) {
            alert('Attendance already marked for today!');
            return;
        }

        // Save attendance
        const attendanceData = {
            studentId,
            course,
            date,
            studentName: student.fullName
        };

        if (DB.attendance.mark(attendanceData)) {
            this.updateAttendanceStats(studentId, course);
            this.updateAttendanceRecord(attendanceData);
            alert('Attendance marked successfully!');
        } else {
            alert('Error marking attendance. Please try again.');
        }
    },

    updateAttendanceStats: function(studentId, courseId) {
        const stats = DB.attendance.getAttendanceStats(studentId, courseId);
        
        document.getElementById('attendedClasses').textContent = stats.total;
        document.getElementById('attendancePercentage').textContent = stats.percentage.toFixed(1) + '%';
        document.getElementById('progressBar').style.width = stats.percentage + '%';

        if (stats.percentage >= 80) {
            this.showCertificateEligibility();
        }
    },

    updateAttendanceRecord: function(data) {
        const record = document.getElementById('recentAttendance');
        const entry = document.createElement('p');
        entry.textContent = `${data.studentName} (${data.studentId}) attended ${data.course} on ${data.date}`;
        record.insertBefore(entry, record.firstChild);
    },

    showCertificateEligibility: function() {
        const status = document.createElement('div');
        status.className = 'certificate-eligible';
        status.innerHTML = `
            <h3>🎉 Congratulations!</h3>
            <p>You have completed the required attendance (80% or more).</p>
            <p>You are now eligible for the course completion certificate.</p>
        `;
        
        const existingStatus = document.querySelector('.certificate-eligible');
        if (!existingStatus) {
            document.querySelector('.attendance-status').appendChild(status);
        }
    }
};