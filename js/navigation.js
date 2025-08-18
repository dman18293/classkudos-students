// Navigation Manager for Student Portal
class NavigationManager {
    constructor() {
        this.currentPage = 'login-page';
        this.init();
    }

    init() {
        console.log('Navigation Manager initialized');
        this.showPage('login');
    }

    showPage(pageName) {
        console.log('Showing page:', pageName);
        
        // Hide all pages first
        const pages = ['login-page', 'dashboard-page', 'avatar-page'];
        pages.forEach(pageId => {
            console.log('Hiding page:', pageId);
            const page = document.getElementById(pageId);
            if (page) {
                page.classList.remove('active');
            }
        });

        // Show the requested page
        const targetPageId = pageName.includes('-page') ? pageName : pageName + '-page';
        const targetPage = document.getElementById(targetPageId);
        if (targetPage) {
            console.log('Activated page:', targetPageId);
            targetPage.classList.add('active');
            this.currentPage = targetPageId;
        } else {
            console.error('Page not found:', targetPageId);
        }
    }

    showLoginPage() {
        this.showPage('login-page');
    }

    showDashboard() {
        this.showPage('dashboard-page');
    }

    showAvatarPage() {
        this.showPage('avatar-page');
    }
}

// Initialize navigation manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.navigationManager = new NavigationManager();
});

// Global navigation functions for backward compatibility
function showPage(pageName) {
    if (window.navigationManager) {
        window.navigationManager.showPage(pageName);
    }
}

function showLoginPage() {
    if (window.navigationManager) {
        window.navigationManager.showLoginPage();
    }
}

function showDashboard() {
    if (window.navigationManager) {
        window.navigationManager.showDashboard();
    }
}

function showAvatarBuilder() {
    if (window.navigationManager) {
        window.navigationManager.showAvatarPage();
    }
}
