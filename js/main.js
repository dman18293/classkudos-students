// Main JavaScript file for Student Portal
// This file initializes the application and coordinates between different managers

class StudentPortalApp {
    constructor() {
        this.initialized = false;
        this.init();
    }

    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeApp());
            } else {
                this.initializeApp();
            }
        } catch (error) {
            console.error('Error initializing Student Portal:', error);
            this.showCriticalError('Failed to initialize application. Please refresh the page.');
        }
    }

    initializeApp() {
        console.log('🎓 Initializing Class Kudos Student Portal...');

        // Check for existing login
        this.checkExistingLogin();

        // Set up global error handling
        this.setupErrorHandling();

        // Set up keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Initialize offline detection
        this.setupOfflineDetection();

        this.initialized = true;
        console.log('✅ Student Portal initialized successfully!');

        // Show welcome message for first-time users
        this.showWelcomeMessage();
    }

    checkExistingLogin() {
        const storedStudent = Utils.storage.get('currentStudent');
        if (storedStudent && navigationManager) {
            navigationManager.setCurrentStudent(storedStudent);
            
            // Ask user if they want to continue as this student
            if (confirm(`Welcome back, ${storedStudent.name}! Would you like to continue?`)) {
                navigationManager.showPage('dashboard');
                if (window.dashboardManager) {
                    window.dashboardManager.loadDashboard();
                }
            } else {
                // Clear stored data and show login
                Utils.storage.remove('currentStudent');
                navigationManager.showPage('login');
            }
        }
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleError(event.error, 'An unexpected error occurred');
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleError(event.reason, 'An unexpected error occurred');
            event.preventDefault();
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Only handle shortcuts when not typing in inputs
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            // Alt + D = Dashboard
            if (event.altKey && event.key === 'd') {
                event.preventDefault();
                if (navigationManager && navigationManager.getCurrentStudent()) {
                    showDashboard();
                }
            }

            // Alt + A = Avatar Builder
            if (event.altKey && event.key === 'a') {
                event.preventDefault();
                if (navigationManager && navigationManager.getCurrentStudent()) {
                    showAvatarBuilder();
                }
            }

            // Alt + B = Battle Arena
            if (event.altKey && event.key === 'b') {
                event.preventDefault();
                if (navigationManager && navigationManager.getCurrentStudent()) {
                    showBattleArena();
                }
            }

            // Alt + L = Logout
            if (event.altKey && event.key === 'l') {
                event.preventDefault();
                if (navigationManager && navigationManager.getCurrentStudent()) {
                    logout();
                }
            }

            // Escape = Close current action/go back
            if (event.key === 'Escape') {
                event.preventDefault();
                this.handleEscapeKey();
            }
        });
    }

    setupOfflineDetection() {
        window.addEventListener('online', () => {
            Utils.showToast('Connection restored!', 'success');
        });

        window.addEventListener('offline', () => {
            Utils.showToast('You are offline. Some features may not work.', 'error');
        });
    }

    handleEscapeKey() {
        // Close any open modals or return to previous page
        const currentPage = navigationManager ? navigationManager.currentPage : 'login';
        
        switch (currentPage) {
            case 'avatar-builder':
            case 'battle-arena':
                if (navigationManager.getCurrentStudent()) {
                    showDashboard();
                }
                break;
            case 'dashboard':
                // Maybe show a "Are you sure you want to logout?" dialog
                break;
        }
    }

    handleError(error, userMessage) {
        // Log error for debugging
        console.error('Application error:', error);

        // Show user-friendly message
        Utils.showToast(userMessage || 'Something went wrong. Please try again.', 'error');

        // In production, you might want to send error reports to a logging service
        // this.sendErrorReport(error);
    }

    showCriticalError(message) {
        document.body.innerHTML = `
            <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-family: 'Open Sans', sans-serif;
                text-align: center;
                padding: 2rem;
            ">
                <div style="
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 3rem;
                    max-width: 500px;
                ">
                    <h1 style="font-family: 'Fredoka One', cursive; margin-bottom: 1rem;">
                        🚨 Oops!
                    </h1>
                    <p style="font-size: 1.2rem; margin-bottom: 2rem;">
                        ${message}
                    </p>
                    <button onclick="window.location.reload()" style="
                        background: white;
                        color: #667eea;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 25px;
                        font-weight: 600;
                        cursor: pointer;
                        font-size: 1rem;
                    ">
                        Refresh Page
                    </button>
                </div>
            </div>
        `;
    }

    showWelcomeMessage() {
        // Only show welcome for first-time visitors
        const hasVisited = Utils.storage.get('hasVisitedBefore');
        if (!hasVisited) {
            setTimeout(() => {
                Utils.showToast('Welcome to Class Kudos Student Portal! 🎓', 'success');
                Utils.storage.set('hasVisitedBefore', true);
            }, 1000);
        }
    }

    // Utility method to check if app is ready
    isReady() {
        return this.initialized && 
               window.navigationManager && 
               window.loginManager && 
               window.dashboardManager;
    }

    // Method to get app status for debugging
    getStatus() {
        return {
            initialized: this.initialized,
            currentPage: navigationManager ? navigationManager.currentPage : null,
            currentStudent: navigationManager ? navigationManager.getCurrentStudent() : null,
            online: navigator.onLine,
            userAgent: navigator.userAgent
        };
    }
}

// Initialize the application
const studentPortalApp = new StudentPortalApp();

// Make app available globally for debugging
window.studentPortalApp = studentPortalApp;

// Console welcome message for developers
console.log(`
🎓 Class Kudos Student Portal
===============================
Version: 1.0.0 (Development)
Ready for Pokemon-style educational battles!

Debug Commands:
- studentPortalApp.getStatus() - Get app status
- Utils.showToast('message', 'type') - Show toast
- navigationManager.showPage('page') - Navigate
- mockData - Access mock data
- quickLogin() - Quick login as demo student

Keyboard Shortcuts:
- Alt + D = Dashboard
- Alt + A = Avatar Builder  
- Alt + B = Battle Arena
- Alt + L = Logout
- Escape = Go back/close
`);

// Quick login function for development/testing (DISABLED - using real data now)
/*
window.quickLogin = async function() {
    try {
        // Get the first student from mock data
        const firstStudent = await MockDataAPI.getStudent(101); // Alex Thompson
        if (firstStudent && navigationManager) {
            navigationManager.setCurrentStudent(firstStudent);
            navigationManager.showPage('dashboard');
            Utils.showToast(`Logged in as ${firstStudent.name}!`, 'success');
            console.log('Quick login successful:', firstStudent);
            return firstStudent;
        } else {
            Utils.showToast('Failed to load demo student', 'error');
        }
    } catch (error) {
        console.error('Quick login failed:', error);
        Utils.showToast('Quick login failed', 'error');
    }
};
*/
