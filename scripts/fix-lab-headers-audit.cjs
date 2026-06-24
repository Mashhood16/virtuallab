const fs = require('fs');
const path = require('path');

const filesToFix = [
  // Class 7 Science - wrapper divs + duplicate h1
  'src/components/LabS7ChemicalChange.tsx',
  'src/components/LabS7AtomModel.tsx',
  'src/components/LabS7BalloonRocket.tsx',
  'src/components/LabS7EarthSeasons.tsx',
  'src/components/LabS7LithiumBonding.tsx',
  'src/components/LabS7OilPollutants.tsx',
  // Class 11 CS - wrapper divs
  'src/components/LabCS11Applications.tsx',
  'src/components/LabCS11DataScience.tsx',
  'src/components/LabCS11Impacts.tsx',
  'src/components/LabCS11Python.tsx',
  'src/components/LabCS11SystemsNetworks.tsx',
  // Class 11 Physics - wrapper divs + duplicate h1
  'src/components/LabP11PhysicalQuantities.tsx',
  'src/components/LabP11RotationalMotion.tsx',
  'src/components/LabP11Vectors.tsx',
  'src/components/LabP11TranslatoryMotion.tsx',
  // Class 12 Physics - wrapper divs
  'src/components/LabP12Gravitation.tsx',
  'src/components/LabP12ThermoMechanics.tsx',
  // Class 10 Math - wrapper divs + duplicate h1
  'src/components/LabM10TangentConstruction.tsx',
  'src/components/LabM10InequalityApplications.tsx',
  'src/components/LabM10FunctionApplications.tsx',
  'src/components/LabM10FractionApplications.tsx',
  'src/components/LabM10VectorApplications.tsx',
  'src/components/LabM10MatrixApplications.tsx',
  // Class 11 Math - wrapper divs
  'src/components/LabM11Permutations.tsx',
  // Class 12 Math - wrapper divs
  'src/components/LabM12AnalyticalGeometry.tsx',
  'src/components/LabM12Conics.tsx',
  // Class 8 Science - wrapper divs
  'src/components/LabS8SkyMap.tsx',
  // Class 12 Chemistry - wrapper divs
  'src/components/LabC12OrganicSynthesis.tsx',
];

let fixedCount = 0;
let skippedCount = 0;
let errorCount = 0;

for (const file of filesToFix) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP (not found): ${file}`);
    skippedCount++;
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;
  let changed = false;

  // Pattern 1: Remove wrapper divs around LabHeader
  // Match: <div className="bg-slate-800...p-4 flex items-center justify-between...">  \n  <LabHeader ... />  \n  <h1 ...>...</h1>  \n  </div>
  // Replace with: <LabHeader ... />

  // Pattern: wrapper div containing LabHeader + h1
  const wrapperWithH1Regex = /<div\s+className="[^"]*(?:bg-slate-[89]00|bg-blue-600|bg-emerald-900|bg-blue-900)[^"]*p-4\s+flex\s+items-center\s+justify-between[^"]*">\s*\n\s*(<LabHeader[^>]+\/>)\s*\n\s*<h1[^>]*>.*?<\/h1>\s*\n\s*<\/div>/gs;

  if (wrapperWithH1Regex.test(content)) {
    content = content.replace(wrapperWithH1Regex, '$1');
    changed = true;
  }

  // Pattern: wrapper div with LabHeader but no h1 (just wrapper)
  const wrapperOnlyRegex = /<div\s+className="[^"]*(?:bg-slate-[89]00|bg-blue-600|bg-emerald-900|bg-blue-900)[^"]*p-4\s+flex\s+items-center\s+justify-between[^"]*">\s*\n\s*(<LabHeader[^>]+\/>)\s*\n\s*<\/div>/gs;

  if (wrapperOnlyRegex.test(content)) {
    content = content.replace(wrapperOnlyRegex, '$1');
    changed = true;
  }

  // Pattern 2: Remove duplicate h1 that appears right after LabHeader (without wrapper)
  // Match: <LabHeader ... />  \n  <h1 ...>...</h1>
  const dupH1Regex = /(<LabHeader[^>]+\/>)\s*\n\s*<h1[^>]*>.*?<\/h1>/gs;

  if (dupH1Regex.test(content)) {
    content = content.replace(dupH1Regex, '$1');
    changed = true;
  }

  // Pattern: LabHeader inside <header> tag with wrapper
  const headerTagRegex = /<header\s+className="[^"]*(?:bg-slate-[89]00|bg-blue-900|bg-emerald-900)[^"]*p-4\s+flex\s+items-center\s+justify-between[^"]*">\s*\n\s*(<LabHeader[^>]+\/>)\s*\n\s*<\/header>/gs;

  if (headerTagRegex.test(content)) {
    content = content.replace(headerTagRegex, '$1');
    changed = true;
  }

  // Pattern: header tag with LabHeader + h1
  const headerTagWithH1Regex = /<header\s+className="[^"]*(?:bg-slate-[89]00|bg-blue-900|bg-emerald-900)[^"]*p-4\s+flex\s+items-center\s+justify-between[^"]*">\s*\n\s*(<LabHeader[^>]+\/>)\s*\n\s*<h1[^>]*>.*?<\/h1>\s*\n\s*<\/header>/gs;

  if (headerTagWithH1Regex.test(content)) {
    content = content.replace(headerTagWithH1Regex, '$1');
    changed = true;
  }

  // Pattern 3: LabHeader with h1 on the NEXT line (no wrapper, just sequential)
  // More aggressive: match LabHeader followed by h1 with only whitespace between
  const sequentialH1Regex = /(<LabHeader[^>]+\/>)\s*\n(\s*)<h1[^>]*>[^<]*<\/h1>/g;
  
  if (sequentialH1Regex.test(content)) {
    content = content.replace(sequentialH1Regex, '$1');
    changed = true;
  }

  // Ensure all LabHeader usages have a variant if they're in dark-themed labs
  // Check if the lab has bg-slate-900 or bg-slate-800 as main background
  const hasDarkBg = /className="[^"]*(?:bg-slate-900|bg-slate-800)[^"]*"/.test(content) && 
    !content.includes('LabHeader') === false;

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`FIXED: ${file}`);
    fixedCount++;
  } else {
    console.log(`SKIP (no match): ${file}`);
    skippedCount++;
  }
}

console.log(`\n=== Summary ===`);
console.log(`Fixed: ${fixedCount}`);
console.log(`Skipped: ${skippedCount}`);
console.log(`Errors: ${errorCount}`);
