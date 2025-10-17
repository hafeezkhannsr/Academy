// Form Handling
const registrationForm = {
    init: function() {
        DB.init(); // Initialize the database
        this.loadCourses();
        this.setupEventListeners();
        this.setupFormValidation();
    },

    loadCourses: function() {
        const courses = DB.courses.getAll();
        const courseSelect = document.querySelector('select[name="courseName"]');
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.name;
            courseSelect.appendChild(option);
        });
    },

    setupEventListeners: function() {
        document.getElementById('registrationForm').addEventListener('submit', this.handleSubmit.bind(this));
        
        // Download registration data
        document.getElementById('downloadData').addEventListener('click', () => {
            const data = DB.exportData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'academy_data_backup.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        // Import registration data
        document.getElementById('importData').addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        DB.importData(data);
                        alert('Data imported successfully!');
                        window.location.reload();
                    } catch (err) {
                        alert('Error importing data. Please check the file format.');
                    }
                };
                reader.readAsText(file);
            }
        });
    },

    setupFormValidation: function() {
        const form = document.getElementById('registrationForm');
        const inputs = form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.required && !input.value) {
                    input.classList.add('invalid');
                } else {
                    input.classList.remove('invalid');
                }
            });
        });
    },

    handleSubmit: function(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const studentData = {};
        
        formData.forEach((value, key) => {
            studentData[key] = value;
        });

        // Validate student ID uniqueness
        const existingStudent = DB.students.getById(studentData.rollNumber);
        if (existingStudent) {
            alert('This Student ID/Roll Number is already registered!');
            return;
        }

        // Save student data
        if (DB.students.add(studentData)) {
            alert('Registration successful!');
            this.saveRegistrationReceipt(studentData);
            form.reset();
        } else {
            alert('Error saving registration. Please try again.');
        }
    },

    saveRegistrationReceipt: function(studentData) {
        const receipt = `
            Registration Receipt
            -------------------
            Date: ${new Date().toLocaleDateString()}
            Time: ${new Date().toLocaleTimeString()}
            
            Student Information:
            Name: ${studentData.fullName}
            ID/Roll Number: ${studentData.rollNumber}
            Course: ${studentData.courseName}
            
            Please save this receipt for your records.
            You can now use your Student ID to mark daily attendance.
        `;

        const blob = new Blob([receipt], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `registration_receipt_${studentData.rollNumber}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};