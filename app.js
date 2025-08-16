// Student Portal Entry Point - redirects to main.js
console.log('Loading student portal...');
// Import main.js functionality
import('./js/main.js').then(() => {
    console.log('Student portal loaded successfully');
}).catch(error => {
    console.error('Error loading student portal:', error);
    // Fallback: load main.js directly
    const script = document.createElement('script');
    script.src = './js/main.js';
    document.head.appendChild(script);
});
