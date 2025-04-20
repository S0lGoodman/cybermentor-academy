// Simple script to test the API endpoint
const fetch = require('node-fetch');

async function testCreateStudent() {
  try {
    console.log('Testing student creation API...');
    
    const response = await fetch('http://localhost:3000/api/students/create-direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '0612345678'
      })
    });
    
    console.log('Response status:', response.status);
    
    const text = await response.text();
    console.log('Response text:', text);
    
    try {
      const data = JSON.parse(text);
      console.log('Parsed response:', data);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
    }
    
    if (!response.ok) {
      console.error('Request failed with status:', response.status);
    } else {
      console.log('Request succeeded!');
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testCreateStudent();
