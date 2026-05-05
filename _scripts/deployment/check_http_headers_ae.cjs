const axios = require('axios');

async function checkHeaders() {
    try {
        const response = await axios.get('https://sukounalbunyan.ae/backend/rental/create', {
            validateStatus: () => true
        });
        console.log('Status:', response.status);
        console.log('Content-Type:', response.headers['content-type']);
        console.log('Full Headers:', JSON.stringify(response.headers, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkHeaders();
