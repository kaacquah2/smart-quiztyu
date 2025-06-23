const { programs } = require('./lib/program-data.ts');

function checkSemesterCoverage() {
  console.log('=== SEMESTER COVERAGE ANALYSIS ===\n');
  
  const results = {
    complete: [],
    incomplete: [],
    summary: {
      totalPrograms: 0,
      completePrograms: 0,
      incompletePrograms: 0
    }
  };

  programs.forEach(program => {
    console.log(`\n📚 Program: ${program.title}`);
    console.log(`   ID: ${program.id}`);
    
    const programAnalysis = {
      id: program.id,
      title: program.title,
      years: [],
      isComplete: true,
      missingSemesters: []
    };

    // Check each year
    for (let year = 1; year <= 4; year++) {
      const yearData = program.years.find(y => y.year === year);
      
      if (!yearData) {
        console.log(`   ❌ Year ${year}: MISSING ENTIRE YEAR`);
        programAnalysis.years.push({
          year,
          status: 'MISSING',
          semesters: []
        });
        programAnalysis.isComplete = false;
        programAnalysis.missingSemesters.push(`Year ${year} - Complete year missing`);
        continue;
      }

      const semesters = yearData.semesters;
      const semester1 = semesters.find(s => s.semester === 1);
      const semester2 = semesters.find(s => s.semester === 2);

      const yearAnalysis = {
        year,
        status: 'COMPLETE',
        semesters: []
      };

      if (!semester1) {
        console.log(`   ❌ Year ${year}: Missing Semester 1`);
        yearAnalysis.status = 'INCOMPLETE';
        yearAnalysis.semesters.push({ semester: 1, status: 'MISSING' });
        programAnalysis.isComplete = false;
        programAnalysis.missingSemesters.push(`Year ${year} - Semester 1 missing`);
      } else {
        console.log(`   ✅ Year ${year} Semester 1: ${semester1.courses.length} courses`);
        yearAnalysis.semesters.push({ 
          semester: 1, 
          status: 'PRESENT', 
          courseCount: semester1.courses.length 
        });
      }

      if (!semester2) {
        console.log(`   ❌ Year ${year}: Missing Semester 2`);
        yearAnalysis.status = 'INCOMPLETE';
        yearAnalysis.semesters.push({ semester: 2, status: 'MISSING' });
        programAnalysis.isComplete = false;
        programAnalysis.missingSemesters.push(`Year ${year} - Semester 2 missing`);
      } else {
        console.log(`   ✅ Year ${year} Semester 2: ${semester2.courses.length} courses`);
        yearAnalysis.semesters.push({ 
          semester: 2, 
          status: 'PRESENT', 
          courseCount: semester2.courses.length 
        });
      }

      programAnalysis.years.push(yearAnalysis);
    }

    // Add to results
    if (programAnalysis.isComplete) {
      results.complete.push(programAnalysis);
      console.log(`   🎉 COMPLETE: All years have both semesters`);
    } else {
      results.incomplete.push(programAnalysis);
      console.log(`   ⚠️  INCOMPLETE: Missing semesters detected`);
    }

    results.summary.totalPrograms++;
    if (programAnalysis.isComplete) {
      results.summary.completePrograms++;
    } else {
      results.summary.incompletePrograms++;
    }
  });

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 SUMMARY REPORT');
  console.log('='.repeat(50));
  console.log(`Total Programs: ${results.summary.totalPrograms}`);
  console.log(`Complete Programs: ${results.summary.completePrograms}`);
  console.log(`Incomplete Programs: ${results.summary.incompletePrograms}`);
  console.log(`Completion Rate: ${((results.summary.completePrograms / results.summary.totalPrograms) * 100).toFixed(1)}%`);

  if (results.incomplete.length > 0) {
    console.log('\n❌ INCOMPLETE PROGRAMS:');
    results.incomplete.forEach(program => {
      console.log(`\n   ${program.title} (${program.id})`);
      program.missingSemesters.forEach(missing => {
        console.log(`     - ${missing}`);
      });
    });
  }

  if (results.complete.length > 0) {
    console.log('\n✅ COMPLETE PROGRAMS:');
    results.complete.forEach(program => {
      console.log(`   - ${program.title} (${program.id})`);
    });
  }

  // Final answer
  console.log('\n' + '='.repeat(50));
  console.log('🎯 FINAL ANSWER');
  console.log('='.repeat(50));
  
  if (results.summary.incompletePrograms === 0) {
    console.log('✅ YES: Every program has semester 1 and 2 for each level/year from 1 to 4');
  } else {
    console.log('❌ NO: Not every program has semester 1 and 2 for each level/year from 1 to 4');
    console.log(`   ${results.summary.incompletePrograms} out of ${results.summary.totalPrograms} programs are incomplete`);
  }

  return results;
}

// Run the analysis
checkSemesterCoverage(); 