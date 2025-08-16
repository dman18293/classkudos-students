// Navigation System for Student Portal

class NavigationManager {
    constructor() {
        this.currentPage = 'login';
        this.currentStudent = null;
        this.init();
    }

    init() {
        // Show login page by default
        this.showPage('login');
    }

    showPage(pageId) {
        console.log(`Showing page: ${pageId}`);
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            console.log(`Hiding page: ${page.id}`);
        });

        // Show selected page
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
            console.log(`Activated page: ${targetPage.id}`);
        } else {
            console.error(`Page not found: ${pageId}-page`);
        }

        // Update navigation visibility
        this.updateNavigation();
    }

    updateNavigation() {
        const isLoggedIn = this.currentStudent !== null;
        
        // Show/hide navigation links based on login status
        document.getElementById('dashboard-link').style.display = isLoggedIn ? 'block' : 'none';
        document.getElementById('avatar-link').style.display = isLoggedIn ? 'block' : 'none';
        document.getElementById('logout-link').style.display = isLoggedIn ? 'block' : 'none';
    }

    setCurrentStudent(student) {
        console.log('🔄 NavigationManager setCurrentStudent called with:', student);
        console.log('🔄 Setting avatar data:', student?.avatar);
        
        this.currentStudent = student;
        this.updateNavigation();
        
        // Store in localStorage for persistence
        if (student) {
            localStorage.setItem('currentStudent', JSON.stringify(student));
            console.log('💾 Stored student in localStorage');
        } else {
            localStorage.removeItem('currentStudent');
        }
    }

    getCurrentStudent() {
        if (!this.currentStudent) {
            // Try to load from localStorage
            const stored = localStorage.getItem('currentStudent');
            if (stored) {
                this.currentStudent = JSON.parse(stored);
                console.log('📥 Loaded student from localStorage:', this.currentStudent);
            }
        }
        console.log('📤 getCurrentStudent returning:', this.currentStudent);
        console.log('📤 Avatar data:', this.currentStudent?.avatar);
        return this.currentStudent;
    }

    logout() {
        this.currentStudent = null;
        localStorage.removeItem('currentStudent');
        this.showPage('login');
        
        // Reset login page to teacher selection
        document.getElementById('teacher-selection').classList.remove('hidden');
        document.getElementById('student-selection').classList.add('hidden');
        
        // Clear search inputs
        document.getElementById('teacher-search').value = '';
        document.getElementById('student-search').value = '';
    }
}

// Global navigation functions
let navigationManager;

function initNavigation() {
    navigationManager = new NavigationManager();
    window.navigationManager = navigationManager; // Make it available globally
}

function showLoginPage() {
    navigationManager.showPage('login');
}

function showDashboard() {
    if (navigationManager.getCurrentStudent()) {
        navigationManager.showPage('dashboard');
        if (window.dashboardManager) {
            window.dashboardManager.loadDashboard();
        }
    }
}

function showAvatarBuilder() {
    console.log('showAvatarBuilder called');
    if (navigationManager.getCurrentStudent()) {
        console.log('Student found, showing avatar-builder page');
        navigationManager.showPage('avatar-builder');
        
        // Give a small delay for the page to render
        setTimeout(() => {
            if (window.avatarBuilderManager) {
                console.log('Avatar builder manager found, loading...');
                window.avatarBuilderManager.loadAvatarBuilder();
            } else {
                console.error('Avatar builder manager not found');
                // Show fallback content
                const container = document.querySelector('.avatar-builder-container');
                if (container) {
                    container.innerHTML = `
                        <div style="text-align: center; padding: 3rem; color: white;">
                            <h2>🐾 Creature Builder</h2>
                            <p>Creature builder is loading...</p>
                            <div style="margin-top: 2rem;">
                                <button onclick="location.reload()" style="padding: 1rem 2rem; background: #667eea; color: white; border: none; border-radius: 10px; cursor: pointer;">
                                    🔄 Refresh Page
                                </button>
                            </div>
                        </div>
                    `;
                }
            }
        }, 100);
    } else {
        console.log('No student found, redirecting to login');
        navigationManager.showPage('login');
    }
}

function logout() {
    if (confirm('Are you sure you want to log out?')) {
        navigationManager.logout();
    }
}

// Initialize navigation when page loads
document.addEventListener('DOMContentLoaded', initNavigation);
