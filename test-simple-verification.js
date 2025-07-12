// Simple test to verify basic functionality
// Run with: node test-simple-verification.js

require('dotenv').config()

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function testSimpleVerification() {
  console.log('🧪 Testing Simple Verification...')
  console.log(`📍 Using API base: ${API_BASE}`)

  try {
    // Test basic API connectivity
    const response = await fetch(`${API_BASE}/api/programs`)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API connectivity test passed')
      console.log(`📊 Found ${data.length} programs`)
      
      if (data.length > 0) {
        console.log('📋 Sample program:', data[0].title)
      }
    } else {
      console.log('❌ API connectivity test failed')
      console.log('Status:', response.status)
    }
  } catch (error) {
    console.error('❌ Error during verification:', error.message)
  }
}

testSimpleVerification() 