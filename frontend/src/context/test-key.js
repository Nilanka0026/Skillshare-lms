const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../backend/.env') });

const apiKey = process.env.GEMINI_API_KEY;
console.log('Using API key:', apiKey);

if (!apiKey) {
  console.error('No GEMINI_API_KEY found in backend/.env');
  process.exit(1);
}

async function testGemini() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: 'Hello' }]
            }
          ]
        })
      }
    );

    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Response body:', text);
  } catch (error) {
    console.error('Error during test:', error);
  }
}

testGemini();
