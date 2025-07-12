const fs = require('fs')
const path = require('path')

console.log("🧪 File Read Test")
console.log("=" .repeat(40))

try {
  // Read the file as a string
  const filePath = path.join(__dirname, 'lib', 'program-data.ts')
  const fileContent = fs.readFileSync(filePath, 'utf8')
  
  console.log(`File size: ${fileContent.length} characters`)
  console.log(`File exists: ${fs.existsSync(filePath)}`)
  
  // Check for key content
  console.log(`Contains 'artificial-intelligence': ${fileContent.includes('artificial-intelligence')}`)
  console.log(`Contains 'circuit-analysis': ${fileContent.includes('circuit-analysis')}`)
  console.log(`Contains 'intro-business': ${fileContent.includes('intro-business')}`)
  console.log(`Contains 'electrical-engineering': ${fileContent.includes('electrical-engineering')}`)
  console.log(`Contains 'business-admin': ${fileContent.includes('business-admin')}`)
  
  // Count programs
  const programMatches = fileContent.match(/id: "[^"]+"/g)
  console.log(`Program IDs found: ${programMatches ? programMatches.length : 0}`)
  if (programMatches) {
    console.log(`Program IDs: ${programMatches.slice(0, 5).join(', ')}...`)
  }
  
  // Check for array structure
  const arrayStart = fileContent.indexOf('export const programs: Program[] = [')
  const arrayEnd = fileContent.lastIndexOf(']')
  console.log(`Array start position: ${arrayStart}`)
  console.log(`Array end position: ${arrayEnd}`)
  console.log(`Array length: ${arrayEnd - arrayStart} characters`)
  
  // Check if the file ends properly
  const lastLines = fileContent.split('\n').slice(-10)
  console.log(`Last 10 lines:`)
  lastLines.forEach((line, index) => {
    console.log(`  ${index + 1}: ${line.trim()}`)
  })

} catch (error) {
  console.error("❌ Error reading file:", error.message)
} 