// Simple Login System for Student Portal - Compatible with Main App Database

class LoginManager {
    constructor() {
        this.selectedTeacher = null;
        this.selectedStudent = null;
        this.teachers = [];
        this.students = [];
        this.init();
    }

    async init() {
        console.log('Initializing student login...');
        await this.loadTeachers();
        this.setupEventListeners();
    }

    async loadTeachers() {
        try {
            console.log('Loading teachers from database...');
            
            // Load teachers from the database (compatible with main app)
            const response = await fetch('/.netlify/functions/getPublicTeachers');
            if (response.ok) {
                this.teachers = await response.json();
                console.log('Loaded teachers:', this.teachers);
            } else {
                throw new Error(`Failed to load teachers: ${response.status}`);
            }
            
            this.renderTeachers();
            
        } catch (error) {
            console.error('Error loading teachers:', error);
            // Fallback to encourage user to contact their teacher
            this.showError('Unable to load teacher list. Please contact your teacher for the student portal link.');
        }
    }

    async loadStudentsForTeacher(teacherEmail) {
        try {
            console.log('Loading students for teacher:', teacherEmail);
            
            // For security, we don't expose all students publicly
            // Instead, we'll let them enter their name and validate during authentication
            this.showStudentNameInput();
            
        } catch (error) {
            console.error('Error setting up student selection:', error);
            this.showError('Unable to set up student selection.');
        }
    }

    setupEventListeners() {
        // Teacher search
        const teacherSearch = document.getElementById('teacher-search');
        if (teacherSearch) {
            teacherSearch.addEventListener('input', (e) => {
                this.filterTeachers(e.target.value);
            });
        }

        // Student name input
        const studentNameInput = document.getElementById('student-name');
        if (studentNameInput) {
            studentNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleStudentNameSubmit();
                }
            });
        }

        // Access code input
        const accessCodeInput = document.getElementById('access-code');
        if (accessCodeInput) {
            accessCodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.submitAccessCode();
                }
            });
        }
    }

    renderTeachers() {
        const grid = document.getElementById('teacher-grid');
        if (!grid) return;

        if (this.teachers.length === 0) {
            grid.innerHTML = '<div class="no-results">No teachers found. Please contact your administrator.</div>';
            return;
        }

        grid.innerHTML = this.teachers.map(teacher => `
            <div class="teacher-card" data-email="${teacher.email}" onclick="loginManager.selectTeacher('${teacher.email}')">
                <div class="teacher-icon">👨‍🏫</div>
                <div class="teacher-info">
                    <h4>${teacher.name || teacher.email}</h4>
                    <p>${teacher.class_count || 0} classes</p>
                </div>
            </div>
        `).join('');
    }

    showStudentNameInput() {
        // Hide teacher selection and show student name input
        document.getElementById('teacher-selection').style.display = 'none';
        document.getElementById('student-selection').style.display = 'block';
        
        // Update the student selection to be a name input instead of a grid
        const studentGrid = document.getElementById('student-grid');
        if (studentGrid) {
            studentGrid.innerHTML = `
                <div class="student-name-input">
                    <label for="student-name-field">Enter your full name exactly as it appears in class:</label>
                    <input type="text" id="student-name-field" placeholder="Your full name..." />
                    <button onclick="loginManager.handleStudentNameSubmit()">Continue</button>
                </div>
            `;
            
            // Focus on the input
            setTimeout(() => {
                document.getElementById('student-name-field').focus();
            }, 100);
        }
    }

    selectTeacher(teacherEmail) {
        console.log('Selected teacher:', teacherEmail);
        this.selectedTeacher = teacherEmail;
        
        // Highlight selected teacher
        document.querySelectorAll('.teacher-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-email="${teacherEmail}"]`).classList.add('selected');
        
        // Load students for this teacher
        this.loadStudentsForTeacher(teacherEmail);
    }

    handleStudentNameSubmit() {
        const nameInput = document.getElementById('student-name-field');
        const studentName = nameInput ? nameInput.value.trim() : '';
        
        if (!studentName) {
            this.showError('Please enter your name');
            return;
        }
        
        this.selectedStudent = {
            name: studentName,
            teacherEmail: this.selectedTeacher
        };
        
        // Show access code step
        document.getElementById('student-selection').style.display = 'none';
        document.getElementById('code-entry').style.display = 'block';
        
        // Focus on access code input
        setTimeout(() => {
            document.getElementById('access-code').focus();
        }, 100);
    }

    async submitAccessCode() {
        const accessCode = document.getElementById('access-code').value.trim();
        const errorDiv = document.getElementById('code-error');
        
        if (!accessCode) {
            errorDiv.textContent = 'Please enter an access code';
            return;
        }

        if (!this.selectedStudent || !this.selectedTeacher) {
            errorDiv.textContent = 'Please select a teacher and enter your name first';
            return;
        }

        try {
            this.showLoading('Authenticating...');
            errorDiv.textContent = '';

            // Authenticate with the database
            const response = await fetch('/.netlify/functions/studentAuth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    studentName: this.selectedStudent.name,
                    teacherEmail: this.selectedTeacher,
                    accessCode: accessCode
                })
            });

            if (!response.ok) {
                throw new Error('Invalid access code');
            }

            const result = await response.json();
            
            if (result.success) {
                // Store authentication data
                this.storeAuthData(result);
                console.log('Login successful, redirecting to dashboard');
                this.redirectToDashboard();
            } else {
                throw new Error(result.error || 'Authentication failed');
            }
            
        } catch (error) {
            console.error('Authentication failed:', error);
            errorDiv.textContent = 'Invalid access code or student name. Please check and try again.';
        } finally {
            this.hideLoading();
        }
    }

    storeAuthData(authData) {
        const authInfo = {
            studentName: this.selectedStudent.name,
            teacherEmail: this.selectedTeacher,
            studentData: authData.student,
            authenticated: true,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('studentAuth', JSON.stringify(authInfo));
        localStorage.setItem('currentStudent', JSON.stringify(authData.student));
        console.log('Stored authentication data');
    }

    redirectToDashboard() {
        // Hide login page and show dashboard
        document.getElementById('login-page').classList.remove('active');
        document.getElementById('dashboard-page').classList.add('active');
        
        // Update navigation
        document.getElementById('dashboard-link').style.display = 'inline';
        document.getElementById('avatar-link').style.display = 'inline';
        document.getElementById('logout-link').style.display = 'inline';
        
        // Initialize dashboard if available
        if (window.dashboardManager) {
            window.dashboardManager.init();
        } else if (window.initDashboard) {
            window.initDashboard();
        }
    }

    filterTeachers(searchTerm) {
        const cards = document.querySelectorAll('.teacher-card');
        const term = searchTerm.toLowerCase();
        
        cards.forEach(card => {
            const teacherName = card.querySelector('h4').textContent.toLowerCase();
            
            if (teacherName.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    showLoading(message = 'Loading...') {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            const text = overlay.querySelector('p');
            if (text) text.textContent = message;
            overlay.style.display = 'flex';
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    showError(message) {
        console.error('Login Error:', message);
        alert(message); // Simple error display - can be enhanced
    }

    // Check if user is already authenticated
    checkExistingAuth() {
        const authData = localStorage.getItem('studentAuth');
        if (authData) {
            try {
                const auth = JSON.parse(authData);
                const hoursSinceAuth = (new Date() - new Date(auth.timestamp)) / (1000 * 60 * 60);
                
                // Auto-login if authenticated within last 8 hours
                if (hoursSinceAuth < 8 && auth.authenticated) {
                    console.log('Found existing authentication, redirecting to dashboard');
                    this.redirectToDashboard();
                    return true;
                }
            } catch (error) {
                console.warn('Invalid auth data in localStorage');
                localStorage.removeItem('studentAuth');
            }
        }
        return false;
    }

    logout() {
        localStorage.removeItem('studentAuth');
        localStorage.removeItem('currentStudent');
        
        // Reset UI
        document.getElementById('dashboard-page').classList.remove('active');
        document.getElementById('avatar-page').classList.remove('active');
        document.getElementById('login-page').classList.add('active');
        
        // Reset navigation
        document.getElementById('dashboard-link').style.display = 'none';
        document.getElementById('avatar-link').style.display = 'none';
        document.getElementById('logout-link').style.display = 'none';
        
        // Reset login state
        this.selectedTeacher = null;
        this.selectedStudent = null;
        
        // Show teacher selection again
        document.getElementById('teacher-selection').style.display = 'block';
        document.getElementById('student-selection').style.display = 'none';
        document.getElementById('code-entry').style.display = 'none';
        
        console.log('Logged out successfully');
    }
}

// Global functions for navigation
function showLoginPage() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('login-page').classList.add('active');
}

function showDashboard() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('dashboard-page').classList.add('active');
}

function showAvatarBuilder() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('avatar-page').classList.add('active');
}

function logout() {
    if (window.loginManager) {
        window.loginManager.logout();
    }
}

// Initialize when DOM is loaded
let loginManager;
document.addEventListener('DOMContentLoaded', () => {
    console.log('Student portal initializing...');
    loginManager = new LoginManager();
    
    // Check for existing authentication
    if (!loginManager.checkExistingAuth()) {
        // Show login page if not authenticated
        showLoginPage();
    }
});
