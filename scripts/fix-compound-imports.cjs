const fs = require('fs');
const path = require('path');

// Map of broken compound imports -> correct individual imports
// These are the merges my previous script accidentally created
const compoundFixes = {
  'RotateCcwMousePointerClick': 'RotateCcw, MousePointerClick',
  'TargetCheckCircle': 'Target, CheckCircle',
  'CheckCircleInfo': 'CheckCircle, Info',
  'FlameRotateCcw': 'Flame, RotateCcw',
  'XCircleShieldAlert': 'XCircle, ShieldAlert',
  'ThermometerRefreshCcw': 'Thermometer, RefreshCw',
  'InfoSave': 'Info, Save',
  'ActivityTarget': 'Activity, Target',
  'FlameWrench': 'Flame, Wrench',
  'BoxTarget': 'Box, Target',
  'PlayRefreshCw': 'Play, RefreshCw',
  'ActivityCheckCircle2': 'Activity, CheckCircle2',
  'BoxCheckCircle2': 'Box, CheckCircle2',
  'TargetCheckCircle2': 'Target, CheckCircle2',
  'RotateCcwCheckCircle2': 'RotateCcw, CheckCircle2',
  'CheckCircleCalculator': 'CheckCircle, Calculator',
  'PauseClipboardList': 'Pause, ClipboardList',
  'SaveCheckCircle': 'Save, CheckCircle',
  'RotateCcwTarget': 'RotateCcw, Target',
  'FileCheckCircleMonitor': 'File, CheckCircle, Monitor',
  'ArrowLeftImage': 'ArrowLeft, Image',
  'CheckCircleLayout': 'CheckCircle, Layout',
  'FileTextServer': 'FileText, Server',
  'CheckCircleCalculator': 'CheckCircle, Calculator',
  'BarChartFileBarChart': 'BarChart, FileBarChart',
};

const srcDir = path.join(process.cwd(), 'src', 'components');

function getAllTsxFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllTsxFiles(fullPath));
    } else if (entry.name.endsWith('.tsx')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getAllTsxFiles(srcDir);
let totalFixed = 0;

for (const file of files) {
  const fileName = path.basename(file);
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;
  
  // Find all lucide-react import lines
  const lines = content.split('\n');
  let changed = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes("from 'lucide-react'") && !line.includes('from "lucide-react"')) continue;
    
    // Check if this line has any compound (broken) import names
    let hasCompound = false;
    for (const compound of Object.keys(compoundFixes)) {
      if (line.includes(compound)) {
        hasCompound = true;
        break;
      }
    }
    
    if (!hasCompound) continue;
    
    // Extract the import names
    const importMatch = line.match(/\{([^}]+)\}/);
    if (!importMatch) continue;
    
    const importStr = importMatch[1];
    const names = importStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    // Expand any compound names
    const expanded = [];
    for (const name of names) {
      if (compoundFixes[name]) {
        expanded.push(...compoundFixes[name].split(',').map(s => s.trim()));
      } else {
        expanded.push(name);
      }
    }
    
    // Deduplicate
    const unique = [...new Set(expanded)];
    
    const newImportLine = line.replace(/\{[^}]+\}/, `{ ${unique.join(', ')} }`);
    lines[i] = newImportLine;
    changed = true;
  }
  
  if (changed) {
    content = lines.join('\n');
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`FIXED: ${fileName}`);
    totalFixed++;
  }
}

console.log(`\nFixed ${totalFixed} files with broken compound imports`);
