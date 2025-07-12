const fs = require('fs');
const path = require('path');

// Import the additional data
const { additionalPrograms } = require('./additional-programs.js');
const { additionalQuizzes } = require('./additional-quizzes.js');
const { additionalResources } = require('./additional-resources.js');
const { additionalRecommendations } = require('./additional-recommendations.js');

async function integrateAdditionalPrograms() {
  try {
    console.log('Starting integration of additional programs...');

    // Read existing data files
    const dataDir = path.join(__dirname, 'data');
    
    // Read existing programs from seed-database.js
    const seedPath = path.join(__dirname, 'scripts', 'seed-database.js');
    let seedContent = fs.readFileSync(seedPath, 'utf8');
    
    // Find the end of the programs array and add new programs
    const programsEndIndex = seedContent.lastIndexOf('];');
    if (programsEndIndex !== -1) {
      const newProgramsString = additionalPrograms.map(program => {
        return JSON.stringify(program, null, 2);
      }).join(',\n  ');
      
      seedContent = seedContent.slice(0, programsEndIndex) + 
                   ',\n  ' + newProgramsString + 
                   seedContent.slice(programsEndIndex);
    }

    // Write updated seed file
    fs.writeFileSync(seedPath, seedContent, 'utf8');
    console.log('✓ Updated seed-database.js with additional programs');

    // Read and update quizzes.json
    const quizzesPath = path.join(dataDir, 'quizzes.json');
    let quizzes = JSON.parse(fs.readFileSync(quizzesPath, 'utf8'));
    quizzes = quizzes.concat(additionalQuizzes);
    fs.writeFileSync(quizzesPath, JSON.stringify(quizzes, null, 2), 'utf8');
    console.log('✓ Updated quizzes.json with additional quizzes');

    // Read and update resources.json
    const resourcesPath = path.join(dataDir, 'resources.json');
    let resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'));
    resources = resources.concat(additionalResources);
    fs.writeFileSync(resourcesPath, JSON.stringify(resources, null, 2), 'utf8');
    console.log('✓ Updated resources.json with additional resources');

    // Read and update recommendations.json
    const recommendationsPath = path.join(dataDir, 'recommendations.json');
    let recommendations = JSON.parse(fs.readFileSync(recommendationsPath, 'utf8'));
    recommendations = recommendations.concat(additionalRecommendations);
    fs.writeFileSync(recommendationsPath, JSON.stringify(recommendations, null, 2), 'utf8');
    console.log('✓ Updated recommendations.json with additional recommendations');

    // Update program data files
    const libDir = path.join(__dirname, 'lib');
    
    // Update program-data.json
    const programDataPath = path.join(libDir, 'program-data.json');
    let programData = JSON.parse(fs.readFileSync(programDataPath, 'utf8'));
    programData = programData.concat(additionalPrograms);
    fs.writeFileSync(programDataPath, JSON.stringify(programData, null, 2), 'utf8');
    console.log('✓ Updated program-data.json');

    // Update program-data.js
    const programDataJsPath = path.join(libDir, 'program-data.js');
    let programDataJs = fs.readFileSync(programDataJsPath, 'utf8');
    const programsEndJsIndex = programDataJs.lastIndexOf('];');
    if (programsEndJsIndex !== -1) {
      const newProgramsJsString = additionalPrograms.map(program => {
        return JSON.stringify(program, null, 2);
      }).join(',\n  ');
      
      programDataJs = programDataJs.slice(0, programsEndJsIndex) + 
                     ',\n  ' + newProgramsJsString + 
                     programDataJs.slice(programsEndJsIndex);
    }
    fs.writeFileSync(programDataJsPath, programDataJs, 'utf8');
    console.log('✓ Updated program-data.js');

    // Update program-data.ts
    const programDataTsPath = path.join(libDir, 'program-data.ts');
    let programDataTs = fs.readFileSync(programDataTsPath, 'utf8');
    const programsEndTsIndex = programDataTs.lastIndexOf('];');
    if (programsEndTsIndex !== -1) {
      const newProgramsTsString = additionalPrograms.map(program => {
        return JSON.stringify(program, null, 2);
      }).join(',\n  ');
      
      programDataTs = programDataTs.slice(0, programsEndTsIndex) + 
                     ',\n  ' + newProgramsTsString + 
                     programDataTs.slice(programsEndTsIndex);
    }
    fs.writeFileSync(programDataTsPath, programDataTs, 'utf8');
    console.log('✓ Updated program-data.ts');

    // Create individual program files for new programs
    const programsDir = path.join(libDir, 'programs');
    if (!fs.existsSync(programsDir)) {
      fs.mkdirSync(programsDir, { recursive: true });
    }

    additionalPrograms.forEach(program => {
      const programFileName = `${program.id}.ts`;
      const programFilePath = path.join(programsDir, programFileName);
      
      const programContent = `import { Program } from '../types/program';

export const ${program.id.replace(/-([a-z])/g, (g) => g[1].toUpperCase())}Program: Program = ${JSON.stringify(program, null, 2)};
`;
      
      fs.writeFileSync(programFilePath, programContent, 'utf8');
      console.log(`✓ Created ${programFileName}`);
    });

    // Update the main programs index file
    const programsIndexPath = path.join(programsDir, 'index.ts');
    let indexContent = '';
    
    // Add existing programs
    const existingPrograms = ['computer-science', 'electrical-engineering', 'business-admin', 'nursing'];
    existingPrograms.forEach(programId => {
      const className = programId.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      indexContent += `export { ${className}Program } from './${programId}';\n`;
    });
    
    // Add new programs
    additionalPrograms.forEach(program => {
      const className = program.id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      indexContent += `export { ${className}Program } from './${program.id}';\n`;
    });
    
    fs.writeFileSync(programsIndexPath, indexContent, 'utf8');
    console.log('✓ Updated programs index file');

    // Create a summary report
    const summary = {
      timestamp: new Date().toISOString(),
      programsAdded: additionalPrograms.length,
      programs: additionalPrograms.map(p => p.id),
      quizzesAdded: additionalQuizzes.length,
      resourcesAdded: additionalResources.length,
      recommendationsAdded: additionalRecommendations.length,
      totalCourses: additionalPrograms.reduce((sum, program) => {
        return sum + program.years.reduce((yearSum, year) => {
          return yearSum + year.semesters.reduce((semSum, semester) => {
            return semSum + semester.courses.length;
          }, 0);
        }, 0);
      }, 0)
    };

    const summaryPath = path.join(__dirname, 'integration-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
    console.log('✓ Created integration summary');

    console.log('\n🎉 Integration completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Programs added: ${summary.programsAdded}`);
    console.log(`   - Quizzes added: ${summary.quizzesAdded}`);
    console.log(`   - Resources added: ${summary.resourcesAdded}`);
    console.log(`   - Recommendations added: ${summary.recommendationsAdded}`);
    console.log(`   - Total courses: ${summary.totalCourses}`);

  } catch (error) {
    console.error('❌ Error during integration:', error);
    throw error;
  }
}

// Run the integration
if (require.main === module) {
  integrateAdditionalPrograms()
    .then(() => {
      console.log('\n✅ All additional programs have been successfully integrated!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Integration failed:', error);
      process.exit(1);
    });
}

module.exports = { integrateAdditionalPrograms }; 