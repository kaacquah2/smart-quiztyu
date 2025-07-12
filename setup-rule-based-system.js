#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Rule-Based Recommendation and Study Plan System\n');
console.log('=' .repeat(60));

// Check if required files exist
const requiredFiles = [
  'lib/rule-based-recommendations-service.ts',
  'lib/rule-based-study-plan-service.ts',
  'app/api/deepseek-recommendations/route.ts',
  'app/api/gemini-study-plan/route.ts',
  'test-rule-based-system.js',
  'RULE_BASED_SYSTEM_DOCUMENTATION.md'
];

console.log('📋 Checking required files...\n');

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please ensure all files are created.');
  process.exit(1);
}

console.log('\n✅ All required files are present!');

// Check environment variables
console.log('\n🔧 Checking environment configuration...\n');

const envFile = '.env';
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf8');
  
  const hasDatabaseUrl = envContent.includes('DATABASE_URL=');
  const hasDeepSeekKey = envContent.includes('DEEPSEEK_API_KEY=');
  const hasGeminiKey = envContent.includes('GEMINI_API_KEY=');
  
  console.log(`📊 Database URL configured: ${hasDatabaseUrl ? '✅' : '❌'}`);
  console.log(`🤖 DeepSeek API key configured: ${hasDeepSeekKey ? '✅' : '❌'}`);
  console.log(`🤖 Gemini API key configured: ${hasGeminiKey ? '✅' : '❌'}`);
  
  if (!hasDatabaseUrl) {
    console.log('\n⚠️  Warning: DATABASE_URL not found in .env file');
    console.log('   The rule-based system will work, but some features may be limited.');
  }
  
  if (!hasDeepSeekKey && !hasGeminiKey) {
    console.log('\nℹ️  Info: No AI API keys configured');
    console.log('   The system will automatically use rule-based fallbacks.');
  }
} else {
  console.log('⚠️  .env file not found');
  console.log('   Create a .env file with your configuration.');
}

// Check package.json for required dependencies
console.log('\n📦 Checking dependencies...\n');

const packageJsonPath = 'package.json';
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredDeps = ['@prisma/client', 'next', 'react'];
  requiredDeps.forEach(dep => {
    if (dependencies[dep]) {
      console.log(`✅ ${dep} (${dependencies[dep]})`);
    } else {
      console.log(`❌ ${dep} - Missing`);
    }
  });
} else {
  console.log('❌ package.json not found');
}

// Check Prisma setup
console.log('\n🗄️  Checking database setup...\n');

const prismaDir = 'prisma';
if (fs.existsSync(prismaDir)) {
  const schemaFile = path.join(prismaDir, 'schema.prisma');
  if (fs.existsSync(schemaFile)) {
    console.log('✅ Prisma schema found');
    
    const schemaContent = fs.readFileSync(schemaFile, 'utf8');
    const hasRequiredModels = schemaContent.includes('model User') && 
                             schemaContent.includes('model Quiz') &&
                             schemaContent.includes('model QuizSubmission');
    
    if (hasRequiredModels) {
      console.log('✅ Required database models found');
    } else {
      console.log('⚠️  Some required database models may be missing');
    }
  } else {
    console.log('❌ Prisma schema not found');
  }
} else {
  console.log('❌ Prisma directory not found');
}

// Provide setup instructions
console.log('\n📚 Setup Instructions\n');
console.log('=' .repeat(60));

console.log(`
1. 🗄️  Database Setup:
   - Ensure PostgreSQL is running
   - Update DATABASE_URL in .env file
   - Run: npx prisma generate
   - Run: npx prisma db push

2. 🔑 API Configuration (Optional):
   - Add DEEPSEEK_API_KEY to .env for AI recommendations
   - Add GEMINI_API_KEY to .env for AI study plans
   - If not configured, system will use rule-based fallbacks

3. 🧪 Testing:
   - Start your development server: npm run dev
   - Run tests: node test-rule-based-system.js
   - Check API endpoints manually if needed

4. 📖 Documentation:
   - Read RULE_BASED_SYSTEM_DOCUMENTATION.md for detailed information
   - Check API examples in the documentation

5. 🔧 Customization:
   - Modify rule logic in lib/rule-based-*.ts files
   - Update resource recommendations as needed
   - Adjust performance thresholds if required
`);

// Check if development server can be started
console.log('\n🚀 Quick Start Commands\n');
console.log('=' .repeat(60));

const hasPackageJson = fs.existsSync('package.json');
if (hasPackageJson) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const scripts = packageJson.scripts || {};
  
  if (scripts.dev) {
    console.log(`✅ Development server: npm run dev`);
  } else {
    console.log(`⚠️  No 'dev' script found in package.json`);
  }
  
  if (scripts.build) {
    console.log(`✅ Build: npm run build`);
  }
  
  if (scripts.start) {
    console.log(`✅ Production: npm run start`);
  }
} else {
  console.log('❌ package.json not found - cannot determine available scripts');
}

console.log(`
📋 Available Test Commands:
   node test-rule-based-system.js          # Run comprehensive tests
   node test-rule-based-system.js --help   # Show test options

🔍 Manual Testing:
   - POST /api/deepseek-recommendations    # Test recommendations
   - POST /api/gemini-study-plan          # Test study plans
   - Check response for "fallback": true   # Verify rule-based usage

📊 Monitoring:
   - Check console logs for fallback usage
   - Monitor API response times
   - Verify recommendation quality
`);

console.log('\n🎉 Setup complete!');
console.log('\n📞 Need help?');
console.log('   - Check the documentation: RULE_BASED_SYSTEM_DOCUMENTATION.md');
console.log('   - Review the test file: test-rule-based-system.js');
console.log('   - Check API examples in the documentation');

console.log('\n' + '=' .repeat(60));
console.log('Rule-Based System is ready to use! 🚀\n'); 