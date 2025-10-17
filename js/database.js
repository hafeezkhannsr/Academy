// Local Storage Database Management
const DB = {
    // Initialize the database
    init: function() {
        if (!localStorage.getItem('students')) {
            localStorage.setItem('students', JSON.stringify([]));
        }
        if (!localStorage.getItem('attendance')) {
            localStorage.setItem('attendance', JSON.stringify([]));
        }
        if (!localStorage.getItem('courses')) {
            localStorage.setItem('courses', JSON.stringify([
                { id: 'webDevelopment', name: 'Web Development', duration: '3months' },
                { id: 'graphicDesign', name: 'Graphic Design', duration: '6months' },
                { id: 'digitalMarketing', name: 'Digital Marketing', duration: '3months' },
                { id: 'programming', name: 'Programming Fundamentals', duration: '6months' },
                { id: 'dataScience', name: 'Data Science', duration: '6months' },
                { id: 'networking', name: 'Computer Networking', duration: '3months' }
            ]));
        }
    },

    // Student Management
    students: {
        add: function(student) {
            const students = JSON.parse(localStorage.getItem('students'));
            students.push({
                ...student,
                id: Date.now().toString(),
                registrationDate: new Date().toISOString()
            });
            localStorage.setItem('students', JSON.stringify(students));
            return true;
        },
        
        getAll: function() {
            return JSON.parse(localStorage.getItem('students'));
        },
        
        getById: function(studentId) {
            const students = JSON.parse(localStorage.getItem('students'));
            return students.find(s => s.rollNumber === studentId);
        }
    },

    // Attendance Management
    attendance: {
        mark: function(data) {
            const attendance = JSON.parse(localStorage.getItem('attendance'));
            attendance.push({
                ...data,
                id: Date.now().toString(),
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('attendance', JSON.stringify(attendance));
            return true;
        },
        
        getByStudent: function(studentId) {
            const attendance = JSON.parse(localStorage.getItem('attendance'));
            return attendance.filter(a => a.studentId === studentId);
        },
        
        getAttendanceStats: function(studentId, courseId) {
            const attendance = this.getByStudent(studentId);
            const courseSessions = attendance.filter(a => a.course === courseId);
            return {
                total: courseSessions.length,
                percentage: (courseSessions.length / 90) * 100
            };
        }
    },

    // Course Management
    courses: {
        getAll: function() {
            return JSON.parse(localStorage.getItem('courses'));
        },
        
        getById: function(courseId) {
            const courses = JSON.parse(localStorage.getItem('courses'));
            return courses.find(c => c.id === courseId);
        }
    },

    // Export data (for backup)
    exportData: function() {
        return {
            students: JSON.parse(localStorage.getItem('students')),
            attendance: JSON.parse(localStorage.getItem('attendance')),
            courses: JSON.parse(localStorage.getItem('courses')),
            exportDate: new Date().toISOString()
        };
    },

    // Import data (from backup)
    importData: function(data) {
        if (data.students) localStorage.setItem('students', JSON.stringify(data.students));
        if (data.attendance) localStorage.setItem('attendance', JSON.stringify(data.attendance));
        if (data.courses) localStorage.setItem('courses', JSON.stringify(data.courses));
    }
};