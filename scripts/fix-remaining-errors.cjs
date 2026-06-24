const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'src');

function getAllTsxFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...getAllTsxFiles(fullPath));
    else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) results.push(fullPath);
  }
  return results;
}

const files = getAllTsxFiles(path.join(srcDir, 'components'));
files.push(path.join(srcDir, 'services', 'dbService.ts'));

let totalFixed = 0;

// Additional compound imports to fix
const moreCompoundFixes = {
  'BeakerActivity': 'Beaker, Activity',
  'ThermometerRefreshCw': 'Thermometer, RefreshCw',
  'FlameActivity': 'Flame, Activity',
  'ArrowLeftImage': 'ArrowLeft, Image',
  'XCirclePause': 'XCircle, Pause',
  'ShieldLock': 'Shield, Lock',
  'SearchTable': 'Search, Table',
  'XCirclePlay': 'XCircle, Play',
  'CalculatorPlay': 'Calculator, Play',
  'TruckPackage': 'Truck, Package',
};

for (const file of files) {
  const fileName = path.basename(file);
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;
  let changed = false;

  // Fix remaining compound imports
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes("from 'lucide-react'") && !line.includes('from "lucide-react"')) continue;
    
    let lineChanged = false;
    let newLine = line;
    for (const [compound, replacement] of Object.entries(moreCompoundFixes)) {
      if (newLine.includes(compound)) {
        newLine = newLine.replace(new RegExp(compound, 'g'), replacement);
        lineChanged = true;
      }
    }
    
    if (lineChanged) {
      // Deduplicate imports in this line
      const importMatch = newLine.match(/\{([^}]+)\}/);
      if (importMatch) {
        const names = importMatch[1].split(',').map(s => s.trim()).filter(s => s.length > 0);
        const unique = [...new Set(names)];
        newLine = newLine.replace(/\{[^}]+\}/, `{ ${unique.join(', ')} }`);
      }
      lines[i] = newLine;
      changed = true;
    }
  }
  if (changed) content = lines.join('\n');

  // Fix TS6133: Remove unused state setters
  const unusedSetters = {
    'LabC12Agriculture.tsx': ['setScenario'],
    'LabC12IndustryMaterials.tsx': ['setProcess'],
    'LabC12Medicine.tsx': ['setDrug'],
    'LabC7Cybercrime.tsx': ['setIsPlaying'],
    'LabM12Derivatives.tsx': ['setXBox'],
    'LabM10MatrixApplications.tsx': ['FlaskConical'],
  };

  if (unusedSetters[fileName]) {
    for (const setter of unusedSetters[fileName]) {
      // Remove from const [x, setX] = useState
      const setterRegex = new RegExp(`,\\s*${setter}\\]\\s*=\\s*useState`, 'g');
      const before = content;
      content = content.replace(setterRegex, '] = useState');
      if (content !== before) { changed = true; continue; }
      
      // Remove standalone const declarations
      const constRegex = new RegExp(`\\n\\s*const\\s+${setter}\\s*=[\\s\\S]*?;\\n`, 'g');
      const before2 = content;
      content = content.replace(constRegex, '\n');
      if (content !== before2) changed = true;
    }
  }

  // Fix TS6133: Remove specific unused variables
  if (fileName === 'LabC6FileManagement1.tsx') {
    // Remove clipboard/setClipboard state
    content = content.replace(/,?\s*setClipboard\]\s*=\s*useState[^;]+;/g, ']\ = useState<string | null>(null);');
    content = content.replace(/const\s+\[clipboard,\s*setClipboard\]\s*=\s*useState[^;]+;/g, 'const [clipboard] = useState<string | null>(null);');
    changed = true;
  }

  if (fileName === 'LabC9SeparationTech.tsx') {
    content = content.replace(/,\s*Beaker\s*,/, ',');
    changed = true;
  }

  if (fileName === 'LabM11BinomialInduction.tsx') {
    // Remove generatePascalTriangle function
    const fnRegex = /\n\s*const\s+generatePascalTriangle\s*=[^;]+;[\s\S]*?\n\s*\};\n/g;
    content = content.replace(fnRegex, '\n');
    changed = true;
  }

  if (fileName === 'LabM12Derivatives.tsx') {
    // Remove sBox state
    content = content.replace(/const\s+\[sBox\].*?;\n/g, '');
    changed = true;
  }

  if (fileName === 'LabP10Electroscope.tsx') {
    // Fix groundElectroscope - it's used but not defined, check if it's a function ref
    content = content.replace(/\bgroundElectroscope\b/g, 'handleGround');
    changed = true;
  }

  if (fileName === 'dbService.ts') {
    // Fix await tx.done - tx.done is a promise
    content = content.replace(/\btx\.done\b(?!\()/g, 'await tx.done');
    content = content.replace(/await await tx\.done/g, 'await tx.done');
    // If tx.done is in a non-async context, wrap it
    changed = true;
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`FIXED: ${fileName}`);
    totalFixed++;
  }
}

console.log(`\nFixed ${totalFixed} files`);
