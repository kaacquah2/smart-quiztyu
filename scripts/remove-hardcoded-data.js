#!/usr/bin/env node

/**
 * Script to identify and help remove hardcoded data usage
 * This script will help migrate from hardcoded data to database-driven data
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Checking for hardcoded data usage...\n')

// Files that contain hardcoded data
const hardcodedFiles = [
  'lib/program-data.ts',
  'lib/program-data.js', 
  'lib/program-data.json',
  'lib/resources-data.ts',
  'data/resources.json',
  'data/quizzes.json',
  'data/recommendations.json'
]

// Files that import hardcoded data
const filesToUpdate = [
  'lib/basic-quiz-service.ts',
  'lib/rule-based-study-plan-service.ts',
  'lib/rule-based-recommendations-service.ts',
  'lib/resource-service.ts',
  'lib/resource-service-db.ts',
  'lib/gemini-study-plan-service.ts',
  'lib/deepseek-recommendations-service.ts',
  'app/api/study-plan/route.ts',
  'app/api/gemini-study-plan/route.ts',
  'app/api/ai-recommendations/route.ts',
  'components/test-dropdown.tsx',
  'components/course-autocomplete.tsx',
  'components/ai-recommendations.tsx',
  'app/resources/page.tsx',
  'app/dashboard/page.tsx'
]

console.log('📁 Hardcoded data files found:')
hardcodedFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file)
  if (fs.existsSync(filePath)) {
    console.log(`  ❌ ${file} (exists)`)
  } else {
    console.log(`  ✅ ${file} (not found)`)
  }
})

console.log('\n📝 Files that need to be updated:')
filesToUpdate.forEach(file => {
  const filePath = path.join(process.cwd(), file)
  if (fs.existsSync(filePath)) {
    console.log(`  🔄 ${file} (needs update)`)
  } else {
    console.log(`  ⚠️  ${file} (not found)`)
  }
})

console.log('\n🔄 Migration steps:')
console.log('1. ✅ Dashboard page - Updated to use dynamic program selection')
console.log('2. ✅ Programs page - Updated to use dynamic categorization')
console.log('3. ✅ Social page - Updated to use dynamic program options')
console.log('4. ✅ Profile page - Updated to use dynamic program options')
console.log('5. ✅ Test dropdown - Updated to use dynamic program selection')
console.log('6. 🔄 Service files - Need to be updated to use new program-service.ts')
console.log('7. 🔄 API routes - Need to be updated to use database instead of hardcoded data')

console.log('\n📋 Next steps:')
console.log('1. Update service files to use lib/program-service.ts instead of lib/program-data.ts')
console.log('2. Update API routes to use database queries instead of hardcoded data')
console.log('3. Remove hardcoded data files after confirming everything works')
console.log('4. Test all functionality to ensure database connectivity works properly')

console.log('\n💡 Recommendations:')
console.log('- Use the new program-service.ts for all program-related operations')
console.log('- Ensure all API routes are properly connected to the database')
console.log('- Add proper error handling for database operations')
console.log('- Consider adding caching for frequently accessed data')
console.log('- Add database migration scripts if needed')

console.log('\n✅ Hardcoded data removal checklist:')
console.log('  ☐ Update all service files')
console.log('  ☐ Update all API routes')
console.log('  ☐ Test all functionality')
console.log('  ☐ Remove hardcoded data files')
console.log('  ☐ Update documentation')
console.log('  ☐ Run full test suite') 