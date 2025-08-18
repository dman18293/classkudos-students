// Simple Class Code + Name Login System for Student Portal

class LoginManager {
    constructor() {
        this.init();
    }

    async init() {
        console.log('Initializing simple student login...');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Enter key handlers
        const classCodeInput = document.getElementById('class-code-input');
        const studentCodeInput = document.getElementById('student-code-input');
        
        if (classCodeInput) {
            classCodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    document.getElementById('student-code-input').focus();
                }
            });
        }

        if (studentCodeInput) {
            studentCodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSimpleLogin();
                }
            });
        }
    }

    async handleSimpleLogin() {
        const classCode = document.getElementById('class-code-input').value.trim();
        const studentCode = document.getElementById('student-code-input').value.trim();
        const errorDiv = document.getElementById('login-error');
        const loginButton = document.getElementById('login-button');
        
        // Clear previous errors
        errorDiv.textContent = '';
        
        // Validate inputs
        if (!classCode) {
            this.showError('Please enter your class code');
            document.getElementById('class-code-input').focus();
            return;
        }
        
        if (!studentCode) {
            this.showError('Please enter your student code');
            document.getElementById('student-code-input').focus();
            return;
        }

        try {
            // Disable button and show loading
            loginButton.disabled = true;
            loginButton.textContent = 'Logging in...';
            this.showLoading('Checking your codes...');

            // Authenticate with the database
            const response = await fetch('/.netlify/functions/studentAuth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    classCode: classCode.toUpperCase(), // Normalize to uppercase
                    studentCode: studentCode.toUpperCase() // Normalize to uppercase
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.details || result.error || 'Login failed');
            }

            if (result.success && result.student) {
                console.log('Login successful:', result.student);
                
                // Store student info in localStorage
                localStorage.setItem('classkudos_student', JSON.stringify(result.student));
                
                // Show success and redirect to dashboard
                this.showSuccess('Welcome ' + result.student.name + '!');
                setTimeout(() => {
                    this.redirectToDashboard(result.student);
                }, 1000);
                
            } else {
                throw new Error('Invalid response from server');
            }

        } catch (error) {
            console.error('Login error:', error);
            this.showError(error.message);
            
            // Re-enable button
            loginButton.disabled = false;
            loginButton.textContent = 'Enter Portal';
            this.hideLoading();
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('login-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
        console.error('Login Error:', message);
    }

    showSuccess(message) {
        const errorDiv = document.getElementById('login-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.color = '#28a745';
            errorDiv.style.display = 'block';
        }
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

    redirectToDashboard(student) {
        console.log('Redirecting to dashboard with student:', student);
        
        // Hide login page
        document.getElementById('login-page').classList.remove('active');
        
        // Show dashboard
        document.getElementById('dashboard-page').classList.add('active');
        
        // Update navigation
        document.getElementById('dashboard-link').style.display = 'inline';
        document.getElementById('avatar-link').style.display = 'inline';
        document.getElementById('logout-link').style.display = 'inline';
        
        // Hide loading
        this.hideLoading();
        
        // Initialize dashboard with student data
        if (window.dashboardManager) {
            window.dashboardManager.loadStudentData(student);
        }
    }

    logout() {
        // Clear stored data
        localStorage.removeItem('classkudos_student');
        
        // Reset UI
        document.getElementById('dashboard-page').classList.remove('active');
        document.getElementById('login-page').classList.add('active');
        
        // Reset navigation
        document.getElementById('dashboard-link').style.display = 'none';
        document.getElementById('avatar-link').style.display = 'none';
        document.getElementById('logout-link').style.display = 'none';
        
        // Clear form
        document.getElementById('class-code-input').value = '';
        document.getElementById('student-code-input').value = '';
        document.getElementById('login-error').textContent = '';
        document.getElementById('login-error').style.color = '#dc3545';
        
        // Re-enable button
        const loginButton = document.getElementById('login-button');
        loginButton.disabled = false;
        loginButton.textContent = 'Enter Portal';
    }

    // Check if student is already logged in on page load
    checkExistingLogin() {
        const storedStudent = localStorage.getItem('classkudos_student');
        if (storedStudent) {
            try {
                const student = JSON.parse(storedStudent);
                console.log('Found existing login:', student);
                this.redirectToDashboard(student);
            } catch (error) {
                console.error('Error parsing stored student data:', error);
                localStorage.removeItem('classkudos_student');
            }
        }
    }
}

// Global functions for navigation
function showLoginPage() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('login-page').classList.add('active');
}

function showDashboard() {
    const student = localStorage.getItem('classkudos_student');
    if (!student) {
        showLoginPage();
        return;
    }
    
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('dashboard-page').classList.add('active');
}

function showAvatarBuilder() {
    const student = localStorage.getItem('classkudos_student');
    if (!student) {
        showLoginPage();
        return;
    }
    
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('avatar-page').classList.add('active');
}

function logout() {
    if (window.loginManager) {
        window.loginManager.logout();
    }
}

// Initialize login manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.loginManager = new LoginManager();
    // Check for existing login after a short delay
    setTimeout(() => {
        window.loginManager.checkExistingLogin();
    }, 500);
});
