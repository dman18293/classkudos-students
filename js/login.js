// Login System for Student Portal

class LoginManager {
    constructor() {
        this.selectedTeacher = null;
        this.teachers = [];
        this.students = [];
        this.init();
    }

    async init() {
        await this.loadTeachers();
        this.setupEventListeners();
        this.renderTeachers();
    }

    async loadTeachers() {
        try {
            // Use the static teacher list from database-api.js
            this.teachers = window.mockTeachers || [];
        } catch (error) {
            console.error('Error loading teachers:', error);
            this.showError('Failed to load teachers. Please try again.');
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

        // Student search
        const studentSearch = document.getElementById('student-search');
        if (studentSearch) {
            studentSearch.addEventListener('input', (e) => {
                this.filterStudents(e.target.value);
            });
        }
    }

    renderTeachers(filter = '') {
        const teacherGrid = document.getElementById('teacher-grid');
        if (!teacherGrid) return;

        const filteredTeachers = this.teachers.filter(teacher => 
            teacher.name.toLowerCase().includes(filter.toLowerCase()) ||
            teacher.className.toLowerCase().includes(filter.toLowerCase()) ||
            teacher.subject.toLowerCase().includes(filter.toLowerCase())
        );

        teacherGrid.innerHTML = '';

        if (filteredTeachers.length === 0) {
            teacherGrid.innerHTML = `
                <div class="no-results">
                    <p>No teachers found. Try a different search term.</p>
                </div>
            `;
            return;
        }

        filteredTeachers.forEach(teacher => {
            const teacherCard = document.createElement('div');
            teacherCard.className = 'teacher-card';
            teacherCard.innerHTML = `
                <span class="teacher-avatar">${teacher.avatar}</span>
                <div class="teacher-name">${teacher.name}</div>
                <div class="teacher-class">${teacher.className}</div>
                <div class="teacher-subject">${teacher.subject}</div>
            `;
            
            teacherCard.addEventListener('click', () => {
                this.selectTeacher(teacher);
            });

            teacherGrid.appendChild(teacherCard);
        });
    }

    async selectTeacher(teacher) {
        this.selectedTeacher = teacher;
        
        // Show loading state
        this.showLoading(true);
        
        try {
            // Instead of loading students, just show the login form
            // Students will be authenticated directly with their login codes
            
            // Switch to student selection
            document.getElementById('teacher-selection').classList.add('hidden');
            document.getElementById('student-selection').classList.remove('hidden');
            
            // Show simple login interface instead of student list
            this.renderLoginForm();
            
        } catch (error) {
            console.error('Error setting up login:', error);
            this.showError('Failed to set up login. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    renderLoginForm() {
        const studentSelection = document.getElementById('student-selection');
        if (!studentSelection) return;

        studentSelection.innerHTML = `
            <h3>Step 2: Enter Your Login Code</h3>
            <div class="direct-login-container">
                <div class="login-info">
                    <h4>Class: ${this.selectedTeacher.className}</h4>
                    <p>Teacher: ${this.selectedTeacher.name}</p>
                </div>
                <div class="login-form">
                    <div class="input-group">
                        <label for="directLoginCode">Your Login Code:</label>
                        <input type="text" id="directLoginCode" class="login-code-input" placeholder="Enter your login code..." maxlength="10" autocomplete="off">
                    </div>
                    <button class="btn btn-primary" id="directLoginBtn">Login</button>
                    <button class="btn btn-secondary" id="backToTeachersBtn">Back to Teachers</button>
                </div>
                <div class="help-text">
                    💡 Ask your teacher if you don't know your login code
                </div>
            </div>
        `;

        // Add event listeners
        const directLoginBtn = document.getElementById('directLoginBtn');
        const directLoginCode = document.getElementById('directLoginCode');
        const backToTeachersBtn = document.getElementById('backToTeachersBtn');

        if (directLoginBtn && directLoginCode) {
            const handleLogin = async () => {
                const loginCode = directLoginCode.value.trim();
                if (!loginCode) {
                    this.showError('Please enter your login code');
                    return;
                }

                this.showLoading(true);
                try {
                    const authenticatedStudent = await DatabaseAPI.authenticateStudent(
                        loginCode.toUpperCase(), 
                        this.selectedTeacher.className
                    );
                    
                    if (authenticatedStudent) {
                        navigationManager.setCurrentStudent(authenticatedStudent);
                        this.showSuccess(`Welcome back, ${authenticatedStudent.name}!`);
                        
                        setTimeout(() => {
                            navigationManager.showPage('dashboard');
                            if (window.dashboardManager) {
                                window.dashboardManager.loadDashboard();
                            }
                        }, 1000);
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    if (error.message.includes('Invalid login code')) {
                        this.showError('Incorrect login code. Please check with your teacher.');
                    } else {
                        this.showError('Login failed. Please try again.');
                    }
                } finally {
                    this.showLoading(false);
                }
            };

            directLoginBtn.addEventListener('click', handleLogin);
            directLoginCode.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleLogin();
                }
            });
        }

        if (backToTeachersBtn) {
            backToTeachersBtn.addEventListener('click', () => {
                document.getElementById('student-selection').classList.add('hidden');
                document.getElementById('teacher-selection').classList.remove('hidden');
                this.selectedTeacher = null;
            });
        }
    }

    renderStudents(filter = '') {
        const studentGrid = document.getElementById('student-grid');
        if (!studentGrid) return;

        const filteredStudents = this.students.filter(student => 
            student.name.toLowerCase().includes(filter.toLowerCase())
        );

        studentGrid.innerHTML = '';

        if (filteredStudents.length === 0) {
            studentGrid.innerHTML = `
                <div class="no-results">
                    <p>No students found. Try a different search term.</p>
                </div>
            `;
            return;
        }

        filteredStudents.forEach(student => {
            const studentCard = document.createElement('div');
            studentCard.className = 'student-card';
            
            // Generate avatar preview based on student's avatar data
            const avatarStyle = this.generateAvatarStyle(student.avatar);
            
            studentCard.innerHTML = `
                <div class="student-avatar-preview" style="${avatarStyle}">
                    ${student.name.charAt(0).toUpperCase()}
                </div>
                <div class="student-name">${student.name}</div>
                <div class="student-points">${student.kudosPoints} Kudos Points</div>
                <div class="student-level">Level ${student.level}</div>
                <div class="login-code-hint">🔐 Login code required</div>
            `;
            
            studentCard.addEventListener('click', () => {
                this.selectStudent(student);
            });

            studentGrid.appendChild(studentCard);
        });
    }

    generateAvatarStyle(avatar) {
        if (!avatar) return `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`;
        
        return `background: ${avatar.color || '#667eea'};`;
    }

    async selectStudent(student) {
        // Show custom login code modal
        const loginCode = await this.showLoginCodeModal(student.name);
        
        if (!loginCode) {
            return; // User cancelled
        }
        
        // Show loading state
        this.showLoading(true);
        
        try {
            // Use real database authentication
            const authenticatedStudent = await DatabaseAPI.authenticateStudent(
                loginCode.toUpperCase().trim(), 
                this.selectedTeacher.className
            );
            
            if (authenticatedStudent) {
                // Set current student in navigation manager
                navigationManager.setCurrentStudent(authenticatedStudent);
                
                // Show success message
                this.showSuccess(`Welcome back, ${authenticatedStudent.name}!`);
                
                // Navigate to dashboard
                setTimeout(() => {
                    navigationManager.showPage('dashboard');
                    if (window.dashboardManager) {
                        window.dashboardManager.loadDashboard();
                    }
                }, 1000);
            } else {
                this.showError('Authentication failed. Please try again.');
            }
            
        } catch (error) {
            console.error('Error authenticating student:', error);
            if (error.message.includes('Invalid login code')) {
                this.showError('Incorrect login code. Please check with your teacher.');
            } else {
                this.showError('Failed to authenticate. Please try again.');
            }
        } finally {
            this.showLoading(false);
        }
    }

    filterTeachers(searchTerm) {
        this.renderTeachers(searchTerm);
    }

    filterStudents(searchTerm) {
        this.renderStudents(searchTerm);
    }

    // Show custom login code modal
    showLoginCodeModal(studentName) {
        return new Promise((resolve) => {
            // Create modal HTML
            const modalHTML = `
                <div class="login-code-overlay" id="loginCodeOverlay">
                    <div class="login-code-modal">
                        <div class="modal-header">
                            <h3>🔐 Welcome ${studentName}!</h3>
                            <p>Please enter your login code to access your account</p>
                        </div>
                        <div class="modal-body">
                            <div class="input-group">
                                <label for="loginCodeInput">Login Code:</label>
                                <input type="text" id="loginCodeInput" class="login-code-input" placeholder="Enter your code..." maxlength="10" autocomplete="off">
                            </div>
                            <div class="help-text">
                                💡 Ask your teacher if you don't know your login code
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" id="cancelLoginBtn">Cancel</button>
                            <button class="btn btn-primary" id="submitLoginBtn">Login</button>
                        </div>
                    </div>
                </div>
            `;

            // Add modal to page
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Add modal styles if not already added
            if (!document.getElementById('login-code-modal-styles')) {
                const styles = document.createElement('style');
                styles.id = 'login-code-modal-styles';
                styles.textContent = `
                    .login-code-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                        animation: fadeIn 0.3s ease;
                    }
                    .login-code-modal {
                        background: white;
                        border-radius: 20px;
                        max-width: 450px;
                        width: 90%;
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                        animation: slideIn 0.3s ease;
                    }
                    .modal-header {
                        padding: 2rem 2rem 1rem;
                        text-align: center;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border-radius: 20px 20px 0 0;
                    }
                    .modal-header h3 {
                        margin: 0 0 0.5rem;
                        font-size: 1.5rem;
                    }
                    .modal-header p {
                        margin: 0;
                        opacity: 0.9;
                        font-size: 1rem;
                    }
                    .modal-body {
                        padding: 2rem;
                    }
                    .input-group {
                        margin-bottom: 1rem;
                    }
                    .input-group label {
                        display: block;
                        margin-bottom: 0.5rem;
                        font-weight: 600;
                        color: #333;
                    }
                    .login-code-input {
                        width: 100%;
                        padding: 12px 16px;
                        border: 2px solid #e9ecef;
                        border-radius: 10px;
                        font-size: 1.1rem;
                        text-align: center;
                        font-weight: bold;
                        letter-spacing: 1px;
                        transition: border-color 0.3s ease;
                    }
                    .login-code-input:focus {
                        outline: none;
                        border-color: #667eea;
                        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                    }
                    .help-text {
                        font-size: 0.9rem;
                        color: #666;
                        text-align: center;
                        margin-top: 1rem;
                    }
                    .modal-footer {
                        padding: 1rem 2rem 2rem;
                        display: flex;
                        gap: 1rem;
                        justify-content: flex-end;
                    }
                    .btn {
                        padding: 10px 20px;
                        border: none;
                        border-radius: 10px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    .btn-secondary {
                        background: #6c757d;
                        color: white;
                    }
                    .btn-secondary:hover {
                        background: #5a6268;
                    }
                    .btn-primary {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                    }
                    .btn-primary:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideIn {
                        from { transform: translateY(-50px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                `;
                document.head.appendChild(styles);
            }

            // Get elements
            const overlay = document.getElementById('loginCodeOverlay');
            const input = document.getElementById('loginCodeInput');
            const cancelBtn = document.getElementById('cancelLoginBtn');
            const submitBtn = document.getElementById('submitLoginBtn');

            // Focus input
            setTimeout(() => input.focus(), 100);

            // Handle submit
            const handleSubmit = () => {
                const code = input.value.trim();
                if (code) {
                    overlay.remove();
                    resolve(code);
                } else {
                    input.focus();
                    input.style.borderColor = '#e74c3c';
                    setTimeout(() => {
                        input.style.borderColor = '';
                    }, 1000);
                }
            };

            // Handle cancel
            const handleCancel = () => {
                overlay.remove();
                resolve(null);
            };

            // Event listeners
            submitBtn.addEventListener('click', handleSubmit);
            cancelBtn.addEventListener('click', handleCancel);
            
            // Enter key submit
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSubmit();
                }
            });

            // Escape key cancel
            document.addEventListener('keydown', function escapeHandler(e) {
                if (e.key === 'Escape') {
                    document.removeEventListener('keydown', escapeHandler);
                    handleCancel();
                }
            });

            // Click outside to cancel
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    handleCancel();
                }
            });

            // Auto-uppercase input
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.toUpperCase();
            });
        });
    }

    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            if (show) {
                overlay.classList.remove('hidden');
            } else {
                overlay.classList.add('hidden');
            }
        }
    }

    showError(message) {
        // Simple alert for now - can be enhanced with custom modal later
        alert('Error: ' + message);
    }

    showSuccess(message) {
        // Simple alert for now - can be enhanced with custom toast later
        alert(message);
    }
}

// Global functions for navigation
function backToTeacherSelection() {
    document.getElementById('student-selection').classList.add('hidden');
    document.getElementById('teacher-selection').classList.remove('hidden');
    
    // Clear student search
    document.getElementById('student-search').value = '';
}

// Initialize login manager
let loginManager;

document.addEventListener('DOMContentLoaded', () => {
    loginManager = new LoginManager();
});
