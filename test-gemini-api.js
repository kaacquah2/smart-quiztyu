// Test file for Gemini API integration
// Run with: node test-gemini-api.js

require('dotenv').config();
console.log("Loaded env:", process.env);

const API_KEY = process.env.GEMINI_API_KEY || "your-gemini-api-key-here";
const MODEL = "gemini-2.0-flash";

async function testGeminiAPI() {
  if (API_KEY === "your-gemini-api-key-here") {
    console.log("❌ Please set your GEMINI_API_KEY in the .env file");
    return;
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  
  try {
    console.log("🧪 Testing Gemini API...");
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Explain how AI works in exactly 3 words"
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    
    console.log("✅ Gemini API test successful!");
    console.log("🤖 Response:", text);
    
  } catch (error) {
    console.error("❌ Gemini API test failed:", error.message);
  }
}

testGeminiAPI(); 