const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'src');

function getAllTsxFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllTsxFiles(fullPath));
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getAllTsxFiles(path.join(srcDir, 'components'));
files.push(path.join(srcDir, 'services', 'dbService.ts'));

let totalChanges = 0;

// TS6133: Remove unused imports
const unusedImports = {
  'LabB10Genetics.tsx': ['Dna'],
  'LabB11Bioenergetics.tsx': ['Beaker'],
  'LabB11Cytology.tsx': ['Microscope'],
  'LabB11Fungi.tsx': ['Beaker'],
  'LabB11Microbiology.tsx': ['Beaker'],
  'LabB9Enzymes.tsx': ['Activity'],
  'LabB9PlantReproduction.tsx': ['Activity'],
  'LabC10AqueousElectrolysis.tsx': ['Activity', 'ArrowRight'],
  'LabC10CopperRefining.tsx': ['Activity', 'ArrowRight'],
  'LabC10DownsCell.tsx': ['Activity', 'ArrowRight'],
  'LabC10MoltenLeadChloride.tsx': ['Activity', 'ArrowRight'],
  'LabC10SaltExcessMetal.tsx': ['Beaker'],
  'LabC10SaltTitration.tsx': ['FlaskConical'],
  'LabC11AcidsBases.tsx': ['Droplets'],
  'LabC11AtomicStructure.tsx': ['Atom'],
  'LabC11EnergeticsKinetics.tsx': ['Thermometer'],
  'LabC11MolecularBonding.tsx': ['Hexagon'],
  'LabC11OrganicAnalysis.tsx': ['TestTube'],
  'LabC11OrganicSynthesis.tsx': ['Factory'],
  'LabC12Agriculture.tsx': ['Sprout'],
  'LabC12Biochemistry.tsx': ['Dna'],
  'LabC12Electrochemistry.tsx': ['Zap'],
  'LabC12EquilibriumAcidBase.tsx': ['FlaskConical'],
  'LabC12IndustryMaterials.tsx': ['Factory'],
  'LabC12Medicine.tsx': ['Activity'],
  'LabC12OrganicSynthesis.tsx': ['FlaskConical'],
  'LabC12SpectroscopyChromatography.tsx': ['Microscope'],
  'LabC12TransitionMetals.tsx': ['Layers'],
  'LabC6FileManagement1.tsx': ['Copy', 'Edit2', 'Trash2'],
  'LabC6MovementTracking.tsx': ['ArrowLeft'],
  'LabC7Cybercrime.tsx': ['Play'],
  'LabCS10CS11Algorithms.tsx': ['FileCode'],
  'LabCS11Algorithms.tsx': ['FileCode'],
  'LabCS11DataScience.tsx': ['BarChart2'],
  'LabCS11Python.tsx': ['Code'],
  'LabCS11SystemsNetworks.tsx': ['Cpu'],
  'LabCS10FutureTech.tsx': ['Cpu'],
  'LabCS12Cybersecurity.tsx': ['ShieldAlert'],
  'LabCS12DataStructures.tsx': ['Layers'],
  'LabCS12DigitalLiteracy.tsx': ['Database'],
  'LabCS12Entrepreneurship.tsx': ['Rocket'],
  'LabM10ChordBisectors.tsx': ['ArrowRight'],
  'LabM10CommonTangents.tsx': ['ChevronLeft'],
  'LabM10ComplexApplications.tsx': ['Zap'],
  'LabM10EqualChords.tsx': ['ArrowRight'],
  'LabM10InequalityApplications.tsx': ['Scale'],
  'LabM10MatrixApplications.tsx': ['FlaskConical'],
  'LabM10QuadraticApplications.tsx': ['Rocket'],
  'LabM10StatisticsWheels.tsx': ['ChevronLeft'],
  'LabM10TangentConstruction.tsx': ['ChevronLeft'],
  'LabM10Vectors.tsx': ['ArrowRight'],
  'LabM11BinomialInduction.tsx': ['Triangle', 'AlignCenterVertical'],
  'LabM12Derivatives.tsx': ['Box', 'TrendingUp', 'Target'],
  'LabM12DifferentialEq.tsx': ['Thermometer', 'Wind'],
  'LabM12Integration.tsx': ['Cylinder', 'Droplets', 'BringToFront'],
  'LabM9GeometryPolygons.tsx': ['Map'],
  'LabM9RealNumbers.tsx': ['MapPin'],
  'LabP10AbsorbersReflectors.tsx': ['RefreshCw'],
  'LabP10CarbonFootprint.tsx': ['RefreshCw'],
  'LabP10ConvectionCurrents.tsx': ['RefreshCw'],
  'LabP10ElectromagnetDC.tsx': ['RefreshCw'],
  'LabP10Electroscope.tsx': ['RefreshCw'],
  'LabP10ElectrostaticCharges.tsx': ['RefreshCw'],
  'LabP10ExpansionLiquids.tsx': ['RotateCcw'],
  'LabP10FaradayLaw.tsx': ['RefreshCw'],
  'LabP10GasPressureBalloon.tsx': ['RotateCcw'],
  'LabP10HalfLife.tsx': ['RefreshCw'],
  'LabP10InsulatingMaterials.tsx': ['RefreshCw'],
  'LabP10LatentHeat.tsx': ['RotateCcw'],
  'LabP10LeslieCube.tsx': ['RefreshCw'],
  'LabP10MagneticField.tsx': ['RefreshCw'],
  'LabP10OhmLaw.tsx': ['RefreshCw'],
  'LabP10OpticalFibers.tsx': ['RefreshCw'],
  'LabP10ParallelCircuit.tsx': ['RefreshCw'],
  'LabP10PlaneMirror.tsx': ['RefreshCw'],
  'LabP10Radioactivity.tsx': ['RefreshCw'],
  'LabP10RefractionBlocks.tsx': ['RefreshCw'],
  'LabP10RefractionIllusion.tsx': ['RefreshCw'],
  'LabP10RippleTank.tsx': ['RefreshCw'],
  'LabP10SeriesCircuit.tsx': ['RefreshCw'],
  'LabP10SoundMedium.tsx': ['RefreshCw'],
  'LabP10SoundProduction.tsx': ['RefreshCw'],
  'LabP10SpeakerProject.tsx': ['RefreshCw'],
  'LabP10SpecificHeatElectrical.tsx': ['RefreshCw'],
  'LabP10SpecificHeatMixture.tsx': ['RefreshCw'],
  'LabP10StringTelephone.tsx': ['RefreshCw'],
  'LabP10ThermalConduction.tsx': ['RefreshCw'],
  'LabP10ThermalExpansionSolid.tsx': ['RefreshCw'],
  'LabP10TotalInternalReflection.tsx': ['RefreshCw'],
  'LabP10WaveMotion.tsx': ['RefreshCw'],
  'LabP11PhysicalQuantities.tsx': ['Target'],
  'LabP11RotationalMotion.tsx': ['RefreshCw'],
  'LabP11TranslatoryMotion.tsx': ['Rocket'],
  'LabP11Vectors.tsx': ['Compass'],
  'LabP12Gravitation.tsx': ['Rocket'],
  'LabP12MedicalImaging.tsx': ['Activity'],
  'LabP12ThermoMechanics.tsx': ['Layers'],
  'LabP9Inertia.tsx': ['Zap'],
  'LabP9Kinematics.tsx': ['Activity'],
  'LabP9MeasurementTools.tsx': ['Ruler'],
  'LabP9VolumeDensity.tsx': ['Droplets'],
  'LabCS10BusinessPitch.tsx': ['Mic'],
  'LabCS9Entrepreneurship.tsx': ['Briefcase'],
  'LabCS9Algorithms.tsx': [],
  'LabCS9ComputerSystems.tsx': [],
  'LabS8AlkaliLitmus.tsx': ['RefreshCw'],
  'LabS8ChemicalCar.tsx': ['RefreshCw'],
  'LabS8ConcaveMirror.tsx': ['RefreshCw'],
  'LabS8ConservationMass.tsx': ['RefreshCw'],
  'LabS8ConvexMirror.tsx': ['RefreshCw'],
  'LabS8CrossingOver.tsx': ['RefreshCw'],
  'LabS8DNAExtraction.tsx': ['RefreshCw'],
  'LabS8Density.tsx': ['RefreshCw'],
  'LabS8Detergent.tsx': ['RefreshCw'],
  'LabS8DeterminingPH.tsx': ['RefreshCw'],
  'LabS8Electromagnet.tsx': ['RefreshCw'],
  'LabS8Endothermic.tsx': ['RefreshCw'],
  'LabS8Exothermic.tsx': ['RefreshCw'],
  'LabS8Flexibility.tsx': ['RefreshCw'],
  'LabS8GreenhouseEffect.tsx': ['Play', 'Square', 'RefreshCw'],
  'LabS8HumanVariations.tsx': ['RefreshCw'],
  'LabS8HydraulicElevator.tsx': ['RefreshCw'],
  'LabS8KneeJerk.tsx': ['RefreshCw'],
  'LabS8LaserMaze.tsx': ['RefreshCw'],
  'LabS8MakingYogurt.tsx': ['RefreshCw'],
  'LabS8Malleability.tsx': ['RefreshCw'],
  'LabS8MilkPlastic.tsx': ['RefreshCw'],
  'LabS8NailPressure.tsx': ['RefreshCw'],
  'LabS8Neutralization.tsx': ['RefreshCw'],
  'LabS8Periscope.tsx': ['RefreshCw'],
  'LabS8RefractionPencil.tsx': ['RefreshCw'],
  'LabS8SoapMaking.tsx': ['RefreshCw'],
  'LabS8SolarCooker.tsx': ['RefreshCw'],
  'LabS8StimulusResponse.tsx': ['RefreshCw'],
  'LabS8ThermalConductivity.tsx': ['RefreshCw'],
  'LabS8Toothpaste.tsx': ['RefreshCw'],
  'LabS8WaterRocket.tsx': ['RefreshCw'],
  'LabS8WindTurbine.tsx': ['RefreshCw'],
  'LabS8Windsock.tsx': ['RefreshCw'],
  'LabS8ElectronictConfig.tsx': [],
};

// TS6133: Remove unused state setters
const unusedSetters = {
  'LabB11Cytology.tsx': ['setActiveTab'],
  'LabC9AtomicStructure.tsx': ['setActiveTab'],
  'LabC9Electrochemistry.tsx': ['setActiveTab'],
  'LabC9StatesOfMatter.tsx': ['setActiveTab'],
  'LabCS9Algorithms.tsx': ['setActiveTaskIdx'],
  'LabCS9ComputerSystems.tsx': ['setActiveTab'],
  'LabM11BinomialInduction.tsx': ['setMode'],
  'LabM12Derivatives.tsx': ['setTab'],
  'LabM12DifferentialEq.tsx': ['setTab'],
  'LabM12Integration.tsx': ['setTab'],
  'LabM12Kinematics.tsx': ['setMode'],
  'LabP12SHM.tsx': ['setScenario'],
};

// TS6133: Remove unused functions/variables
const unusedFunctions = {
  'LabC6FileManagement1.tsx': ['handleCopy', 'handlePaste', 'handleDelete'],
  'LabC9AtomicStructure.tsx': ['resetSim'],
  'LabC9Electrochemistry.tsx': ['resetSim'],
  'LabC9StatesOfMatter.tsx': ['resetSim'],
  'LabC12Agriculture.tsx': ['handleScenarioChange'],
  'LabC12IndustryMaterials.tsx': ['handleProcessChange'],
  'LabC12Medicine.tsx': ['handleDrugChange'],
  'LabP10AbsorbersReflectors.tsx': ['handleReset'],
  'LabP10CarbonFootprint.tsx': ['reset'],
  'LabP10ConvectionCurrents.tsx': ['handleReset'],
  'LabP10ElectromagnetDC.tsx': ['resetLab'],
  'LabP10Electroscope.tsx': ['clearData'],
  'LabP10ElectrostaticCharges.tsx': ['clearData'],
  'LabP10FaradayLaw.tsx': ['resetLab'],
  'LabP10LeslieCube.tsx': ['handleReset'],
  'LabP10MagneticField.tsx': ['resetLab'],
  'LabP10ParallelCircuit.tsx': ['clearData'],
  'LabP10RefractionIllusion.tsx': ['resetLab'],
  'LabP10RippleTank.tsx': ['handleReset'],
  'LabP10SeriesCircuit.tsx': ['clearData'],
  'LabP10SoundMedium.tsx': ['resetLab'],
  'LabP10SoundProduction.tsx': ['resetLab'],
  'LabP10SpecificHeatElectrical.tsx': ['resetExperiment'],
  'LabP10ThermalExpansionSolid.tsx': ['reset'],
  'LabP10WaveMotion.tsx': ['handleReset'],
  'LabS8AlkaliLitmus.tsx': ['reset'],
  'LabS8ChemicalCar.tsx': ['reset'],
  'LabS8Density.tsx': ['reset'],
  'LabS8Endothermic.tsx': ['reset'],
  'LabS8Exothermic.tsx': ['reset'],
  'LabS8HumanVariations.tsx': ['reset'],
  'LabS8HydraulicElevator.tsx': ['reset'],
  'LabS8LaserMaze.tsx': ['reset'],
  'LabS8Malleability.tsx': ['reset'],
  'LabS8Neutralization.tsx': ['reset'],
  'LabS8SoapMaking.tsx': ['reset'],
  'LabS8Toothpaste.tsx': ['reset'],
  'LabS8WaterRocket.tsx': ['reset'],
  'Login.tsx': ['resetForms'],
};

for (const file of files) {
  const fileName = path.basename(file);
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;
  let changes = 0;

  // Fix TS6133: Remove unused imports
  if (unusedImports[fileName]) {
    for (const imp of unusedImports[fileName]) {
      // Remove from named imports: { Foo, Bar } -> { Bar }
      // Handle single import on its own line
      const singleImportLineRegex = new RegExp(`^\\s*import\\s*\\{\\s*${imp}\\s*\\}\\s*from\\s*['"][^'"]+['"];?\\s*\\n`, 'gm');
      if (singleImportLineRegex.test(content)) {
        content = content.replace(singleImportLineRegex, '');
        changes++;
        continue;
      }
      
      // Remove from multi-import: { Foo, Bar, Baz } -> { Bar, Baz }
      const multiImportRegex = new RegExp(`(\\{[^}]*?)\\s*,?\\s*${imp}\\s*,?\\s*([^}]*\\})`, 'g');
      const before = content;
      content = content.replace(multiImportRegex, (match, before, after) => {
        // Clean up double commas and leading/trailing commas
        let result = `${before}${after}`;
        result = result.replace(/,\s*,/g, ',');
        result = result.replace(/\{\s*,/g, '{');
        result = result.replace(/,\s*\}/g, '}');
        return result;
      });
      if (content !== before) changes++;
    }
  }

  // Fix TS6133: Remove unused state setters (const [x, setX] = useState -> const [x] = useState)
  if (unusedSetters[fileName]) {
    for (const setter of unusedSetters[fileName]) {
      const regex = new RegExp(`const\\s*\\[([^,]+),\\s*${setter}\\]\\s*=\\s*useState`, 'g');
      const before = content;
      content = content.replace(regex, `const [$1] = useState`);
      if (content !== before) changes++;
    }
  }

  // Fix TS6133: Remove unused functions (const handleX = () => { ... };)
  if (unusedFunctions[fileName]) {
    for (const fn of unusedFunctions[fileName]) {
      // Remove const fn = (...) => { ... }; with various body lengths
      // Match const fn = (...) => {\n ... \n  };
      const fnRegex = new RegExp(`\\n\\s*const\\s+${fn}\\s*=\\s*(?:\\([^)]*\\)|[^=])=>\\s*\\{[^}]*\\};\\n`, 'g');
      const before = content;
      content = content.replace(fnRegex, '\n');
      if (content !== before) { changes++; continue; }
      
      // Try multi-line with nested braces
      const fnRegex2 = new RegExp(`\\n\\s*const\\s+${fn}\\s*=\\s*[^{]*\\{[\\s\\S]*?\\n\\s*\\};\\n`, 'g');
      const before2 = content;
      content = content.replace(fnRegex2, '\n');
      if (content !== before2) changes++;
    }
  }

  // Fix TS2304: Remove rightJsx references in LabHeader rightContent
  // Pattern: rightContent={<>{rightJsx}</>}
  const rightJsxRegex = /\s*rightContent=\{<>\{rightJsx\}<\/>\}/g;
  if (rightJsxRegex.test(content)) {
    content = content.replace(rightJsxRegex, '');
    changes++;
  }
  // Also remove standalone rightJsx references
  const rightJsxRefRegex = /\{rightJsx\}/g;
  if (rightJsxRefRegex.test(content)) {
    content = content.replace(rightJsxRefRegex, 'null');
    changes++;
  }

  // Fix TS2322: Add optional chaining for onExit in JSX (onExit() -> onExit?.())
  // Actually, we fixed this by making onExit optional in LabHeader, so the type mismatch should be gone.

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`FIXED: ${fileName} (${changes} changes)`);
    totalChanges++;
  }
}

// Fix TS2722: dbService.ts - Cannot invoke possibly undefined
const dbServicePath = path.join(srcDir, 'services', 'dbService.ts');
if (fs.existsSync(dbServicePath)) {
  let content = fs.readFileSync(dbServicePath, 'utf-8');
  const before = content;
  // The error is at line 51: tx.done is not called with ()
  content = content.replace('tx.done;', 'await tx.done;');
  if (content !== before) {
    fs.writeFileSync(dbServicePath, content, 'utf-8');
    console.log('FIXED: dbService.ts (await tx.done)');
    totalChanges++;
  }
}

console.log(`\n=== Summary ===`);
console.log(`Files fixed: ${totalChanges}`);
