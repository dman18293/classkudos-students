// Simple Class Code + Student Code Login System for Student Portal

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
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.color = '#dc3545';
        }
        
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
            if (loginButton) {
                loginButton.disabled = true;
                loginButton.textContent = 'Logging in...';
            }
            this.showLoading('Checking your codes...');

            console.log('Attempting login with:', { classCode, studentCode });

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
            console.log('Server response:', result);

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
            this.showError(error.message || 'Login failed. Please check your codes.');
            
            // Re-enable button
            if (loginButton) {
                loginButton.disabled = false;
                loginButton.textContent = 'Enter Portal';
            }
            this.hideLoading();
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('login-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.color = '#dc3545';
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
        const loginPage = document.getElementById('login-page');
        if (loginPage) loginPage.classList.remove('active');
        
        // Show dashboard
        const dashboardPage = document.getElementById('dashboard-page');
        if (dashboardPage) dashboardPage.classList.add('active');
        
        // Update navigation
        const dashboardLink = document.getElementById('dashboard-link');
        const avatarLink = document.getElementById('avatar-link');
        const logoutLink = document.getElementById('logout-link');
        
        if (dashboardLink) dashboardLink.style.display = 'inline';
        if (avatarLink) avatarLink.style.display = 'inline';
        if (logoutLink) logoutLink.style.display = 'inline';
        
        // Hide loading
        this.hideLoading();
        
        // Initialize dashboard with student data
        if (window.dashboardManager) {
            window.dashboardManager.loadDashboard();
        }
    }

    logout() {
        // Clear stored data
        localStorage.removeItem('classkudos_student');
        
        // Reset UI
        const dashboardPage = document.getElementById('dashboard-page');
        const loginPage = document.getElementById('login-page');
        
        if (dashboardPage) dashboardPage.classList.remove('active');
        if (loginPage) loginPage.classList.add('active');
        
        // Reset navigation
        const dashboardLink = document.getElementById('dashboard-link');
        const avatarLink = document.getElementById('avatar-link');
        const logoutLink = document.getElementById('logout-link');
        
        if (dashboardLink) dashboardLink.style.display = 'none';
        if (avatarLink) avatarLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'none';
        
        // Clear form
        const classCodeInput = document.getElementById('class-code-input');
        const studentCodeInput = document.getElementById('student-code-input');
        const errorDiv = document.getElementById('login-error');
        const loginButton = document.getElementById('login-button');
        
        if (classCodeInput) classCodeInput.value = '';
        if (studentCodeInput) studentCodeInput.value = '';
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.color = '#dc3545';
        }
        
        // Re-enable button
        if (loginButton) {
            loginButton.disabled = false;
            loginButton.textContent = 'Enter Portal';
        }
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
    const loginPage = document.getElementById('login-page');
    if (loginPage) loginPage.classList.add('active');
}

function showDashboard() {
    const student = localStorage.getItem('classkudos_student');
    if (!student) {
        showLoginPage();
        return;
    }
    
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const dashboardPage = document.getElementById('dashboard-page');
    if (dashboardPage) dashboardPage.classList.add('active');
}

function showAvatarBuilder() {
    const student = localStorage.getItem('classkudos_student');
    if (!student) {
        showLoginPage();
        return;
    }
    
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const avatarPage = document.getElementById('avatar-page');
    if (avatarPage) avatarPage.classList.add('active');
}

function logout() {
    if (window.loginManager) {
        window.loginManager.logout();
    }
}

// Initialize login manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing login manager...');
    window.loginManager = new LoginManager();
    // Check for existing login after a short delay
    setTimeout(() => {
        window.loginManager.checkExistingLogin();
    }, 500);
});
