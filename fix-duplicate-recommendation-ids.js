const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data/recommendations.json');
const recommendations = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const seen = new Set();
let changed = false;
let counter = 1;

for (let rec of recommendations) {
  if (!rec.id || seen.has(rec.id)) {
    // Generate a new unique ID
    rec.id = `rec-fixed-${Date.now()}-${counter++}`;
    changed = true;
  }
  seen.add(rec.id);
}

if (changed) {
  fs.writeFileSync(filePath, JSON.stringify(recommendations, null, 2));
  console.log('✅ Duplicate IDs fixed and recommendations.json updated.');
} else {
  console.log('✅ No duplicate IDs found.');
} 