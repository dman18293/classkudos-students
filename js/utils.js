// Utility functions for Student Portal

// Helper function to show error messages
function showError(message) {
    console.error('Error:', message);
    const errorDiv = document.getElementById('login-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

// Helper function to show success messages
function showSuccess(message) {
    console.log('Success:', message);
    const errorDiv = document.getElementById('login-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.color = '#28a745';
        errorDiv.style.display = 'block';
    }
}

// Helper function to validate input
function validateInput(value, fieldName) {
    if (!value || value.trim() === '') {
        showError(`Please enter your ${fieldName}`);
        return false;
    }
    return true;
}

// Helper function to format student name
function formatStudentName(name) {
    return name.trim().replace(/\s+/g, ' ');
}

// Helper function to format class code
function formatClassCode(code) {
    return code.trim().toUpperCase();
}

// Helper function to clear form
function clearForm() {
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => input.value = '');
    
    const errorDiv = document.getElementById('login-error');
    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
        errorDiv.style.color = '#dc3545'; // Reset to error color
    }
}
