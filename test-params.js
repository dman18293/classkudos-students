console.log('Testing parameter fix...');

// Simple test function
function testLogin() {
    console.log('Testing login with both parameters...');
    
    const data = {
        classCode: "DARR",
        studentCode: "1170",
        studentName: "1170"  // This is the key parameter the deployed function needs
    };
    
    console.log('Sending data:', data);
    
    fetch('/.netlify/functions/studentAuth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Test result:', result);
    })
    .catch(error => {
        console.error('Test error:', error);
    });
}

// Call the test
testLogin();
