const fetch = require('node-fetch');

async function testUsersAPI() {
  try {
    console.log('Testing /api/users/list endpoint...');
    
    // Test the new endpoint
    const response = await fetch('http://localhost:3000/api/users/list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response data type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      console.log('Data length:', data.length);
      console.log('First few items:', data.slice(0, 2));
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testUsersAPI(); 