// Main initialization for Student Portal

document.addEventListener('DOMContentLoaded', () => {
    console.log('Student Portal initializing...');
    
    // Initialize API
    if (typeof StudentPortalAPI !== 'undefined') {
        window.studentAPI = new StudentPortalAPI();
    }
    
    // Set initial page state
    setTimeout(() => {
        // Ensure login page is shown by default
        const loginPage = document.getElementById('login-page');
        if (loginPage && !loginPage.classList.contains('active')) {
            loginPage.classList.add('active');
        }
        
        // Hide other pages
        const otherPages = ['dashboard-page', 'avatar-page'];
        otherPages.forEach(pageId => {
            const page = document.getElementById(pageId);
            if (page) {
                page.classList.remove('active');
            }
        });
    }, 100);
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Student Portal Error:', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
});
