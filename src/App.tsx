import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { Microscope, Atom, Calculator, Laptop, Activity, BookOpen, Dna } from 'lucide-react';
import { useAuth, useTheme } from './store';
import { progressDB } from './services/dbService';
import { syncService } from './services/syncService';
import { LAB_MODULES, formatSubject } from './data/labModules';
const Layout = lazy(() => import('./components/Layout'));

// Class 8 Computer Additions
const LabDataComm = lazy(() => import('./components/LabDataComm'));
const LabNetworkDevices = lazy(() => import('./components/LabNetworkDevices'));
const LabCricketSpreadsheet = lazy(() => import('./components/LabCricketSpreadsheet'));
const LabDataWorksheets = lazy(() => import('./components/LabDataWorksheets'));
const LabPseudocodeInterpreter = lazy(() => import('./components/LabPseudocodeInterpreter'));
const LabDiceGameAlgorithm = lazy(() => import('./components/LabDiceGameAlgorithm'));
const LabScratchMaze = lazy(() => import('./components/LabScratchMaze'));
const LabCyberScout = lazy(() => import('./components/LabCyberScout'));
const LabAntivirus = lazy(() => import('./components/LabAntivirus'));
const LabBusinessPlan = lazy(() => import('./components/LabBusinessPlan'));
const LabDigitalMarketing = lazy(() => import('./components/LabDigitalMarketing'));

// Class 7 Computer Additions
const LabC7Hardware = lazy(() => import('./components/LabC7Hardware'));
const LabC7EmergingTech = lazy(() => import('./components/LabC7EmergingTech'));
const LabC7Generations = lazy(() => import('./components/LabC7Generations'));
const LabC7NetworkDiagram = lazy(() => import('./components/LabC7NetworkDiagram'));
const LabC7UrduTyping = lazy(() => import('./components/LabC7UrduTyping'));
const LabC7LetterFormat = lazy(() => import('./components/LabC7LetterFormat'));
const LabC7CVCreation = lazy(() => import('./components/LabC7CVCreation'));
const LabC7IllustratedStory = lazy(() => import('./components/LabC7IllustratedStory'));
const LabC7PowerPointGeometry = lazy(() => import('./components/LabC7PowerPointGeometry'));
const LabC7WondersResearch = lazy(() => import('./components/LabC7WondersResearch'));
const LabC7ConditionalLogic = lazy(() => import('./components/LabC7ConditionalLogic'));
const LabC7GradingFlowchart = lazy(() => import('./components/LabC7GradingFlowchart'));
const LabC7ReverseFlowchart = lazy(() => import('./components/LabC7ReverseFlowchart'));
const LabC7SpriteManipulation = lazy(() => import('./components/LabC7SpriteManipulation'));
const LabC7LoopAdjustments = lazy(() => import('./components/LabC7LoopAdjustments'));
const LabC7BouncingBall = lazy(() => import('./components/LabC7BouncingBall'));
const LabC7AnimatedDialogue = lazy(() => import('./components/LabC7AnimatedDialogue'));
const LabC7InteractivePiano = lazy(() => import('./components/LabC7InteractivePiano'));
const LabC7Cybercrime = lazy(() => import('./components/LabC7Cybercrime'));
const LabC7DevianceDiscussion = lazy(() => import('./components/LabC7DevianceDiscussion'));
const LabC7EthicsChart = lazy(() => import('./components/LabC7EthicsChart'));
const LabC7DesignPrototype = lazy(() => import('./components/LabC7DesignPrototype'));
const LabC7MothersDay = lazy(() => import('./components/LabC7MothersDay'));

// Class 6 Computer Additions
const LabC6HealthCampaign = lazy(() => import('./components/LabC6HealthCampaign'));
const LabC6HardwareCharts = lazy(() => import('./components/LabC6HardwareCharts'));
const LabC6LabRules = lazy(() => import('./components/LabC6LabRules'));
const LabC6GroupPresentations = lazy(() => import('./components/LabC6GroupPresentations'));
const LabC6SystemSoftware = lazy(() => import('./components/LabC6SystemSoftware'));
const LabC6FileManagement1 = lazy(() => import('./components/LabC6FileManagement1'));
const LabC6FileManagement2 = lazy(() => import('./components/LabC6FileManagement2'));
const LabC6DietExercise = lazy(() => import('./components/LabC6DietExercise'));
const LabC6Paint3DFace = lazy(() => import('./components/LabC6Paint3DFace'));
const LabC6SolarSystem = lazy(() => import('./components/LabC6SolarSystem'));
const LabC6ProblemDecomposition = lazy(() => import('./components/LabC6ProblemDecomposition'));
const LabC6RoadSafetyProcess = lazy(() => import('./components/LabC6RoadSafetyProcess'));
const LabC6CoordinateExp = lazy(() => import('./components/LabC6CoordinateExp'));
const LabC6CostumeChange = lazy(() => import('./components/LabC6CostumeChange'));
const LabC6MovementTracking = lazy(() => import('./components/LabC6MovementTracking'));
const LabC6LoopAdjustments = lazy(() => import('./components/LabC6LoopAdjustments'));
const LabC6EthicsChart = lazy(() => import('./components/LabC6EthicsChart'));
const LabC6CyberScout = lazy(() => import('./components/LabC6CyberScout'));
const LabC6PosterCompetition = lazy(() => import('./components/LabC6PosterCompetition'));
const LabC6HobbyMonetization = lazy(() => import('./components/LabC6HobbyMonetization'));

// Class 8 Science Additions
const LabS8GreenhouseEffect = lazy(() => import('./components/LabS8GreenhouseEffect'));
const LabS8StimulusResponse = lazy(() => import('./components/LabS8StimulusResponse'));
const LabS8KneeJerk = lazy(() => import('./components/LabS8KneeJerk'));
const LabS8ReflexTime = lazy(() => import('./components/LabS8ReflexTime'));
const LabS8DNAExtraction = lazy(() => import('./components/LabS8DNAExtraction'));
const LabS8HumanVariations = lazy(() => import('./components/LabS8HumanVariations'));
const LabS8CrossingOver = lazy(() => import('./components/LabS8CrossingOver'));
const LabS8MakingYogurt = lazy(() => import('./components/LabS8MakingYogurt'));
const LabS8PeriodicTable = lazy(() => import('./components/LabS8PeriodicTable'));
const LabS8ElectronicConfig = lazy(() => import('./components/LabS8ElectronicConfig'));
const LabS8Malleability = lazy(() => import('./components/LabS8Malleability'));
const LabS8Flexibility = lazy(() => import('./components/LabS8Flexibility'));
const LabS8Density = lazy(() => import('./components/LabS8Density'));
const LabS8ThermalConductivity = lazy(() => import('./components/LabS8ThermalConductivity'));
const LabS8Sonorous = lazy(() => import('./components/LabS8Sonorous'));
const LabS8ChemicalReactionSigns = lazy(() => import('./components/LabS8ChemicalReactionSigns'));
const LabS8ConservationMass = lazy(() => import('./components/LabS8ConservationMass'));
const LabS8Endothermic = lazy(() => import('./components/LabS8Endothermic'));
const LabS8Exothermic = lazy(() => import('./components/LabS8Exothermic'));
const LabS8AcidLitmus = lazy(() => import('./components/LabS8AcidLitmus'));
const LabS8AlkaliLitmus = lazy(() => import('./components/LabS8AlkaliLitmus'));
const LabS8Neutralization = lazy(() => import('./components/LabS8Neutralization'));
const LabS8DeterminingPH = lazy(() => import('./components/LabS8DeterminingPH'));
const LabS8NailPressure = lazy(() => import('./components/LabS8NailPressure'));
const LabS8HydraulicElevator = lazy(() => import('./components/LabS8HydraulicElevator'));
const LabS8WaterRocket = lazy(() => import('./components/LabS8WaterRocket'));

// Batch 4
const LabS8LaserMaze = lazy(() => import('./components/LabS8LaserMaze'));
const LabS8Periscope = lazy(() => import('./components/LabS8Periscope'));
const LabS8RefractionPencil = lazy(() => import('./components/LabS8RefractionPencil'));
const LabS8ConcaveMirror = lazy(() => import('./components/LabS8ConcaveMirror'));
const LabS8ConvexMirror = lazy(() => import('./components/LabS8ConvexMirror'));
const LabS8Electromagnet = lazy(() => import('./components/LabS8Electromagnet'));
const LabS8Toothpaste = lazy(() => import('./components/LabS8Toothpaste'));
const LabS8SoapMaking = lazy(() => import('./components/LabS8SoapMaking'));
const LabS8MilkPlastic = lazy(() => import('./components/LabS8MilkPlastic'));
const LabS8Detergent = lazy(() => import('./components/LabS8Detergent'));
const LabS8SolarCooker = lazy(() => import('./components/LabS8SolarCooker'));
const LabS8WindTurbine = lazy(() => import('./components/LabS8WindTurbine'));
const LabS8ChemicalCar = lazy(() => import('./components/LabS8ChemicalCar'));
const LabS8Windsock = lazy(() => import('./components/LabS8Windsock'));
const LabS8SkyMap = lazy(() => import('./components/LabS8SkyMap'));

// Class 7 Science Additions
const LabS7XylemTransport = lazy(() => import('./components/LabS7XylemTransport'));
const LabS7TranspirationObservation = lazy(() => import('./components/LabS7TranspirationObservation'));
const LabS7TranspirationLeaves = lazy(() => import('./components/LabS7TranspirationLeaves'));
const LabS7MineralsPlantGrowth = lazy(() => import('./components/LabS7MineralsPlantGrowth'));
const LabS7Unit1Projects = lazy(() => import('./components/LabS7Unit1Projects'));
const LabS7MeasuringLungCapacity = lazy(() => import('./components/LabS7MeasuringLungCapacity'));
const LabS7PulseRateExercise = lazy(() => import('./components/LabS7PulseRateExercise'));
const LabS7Unit2Projects = lazy(() => import('./components/LabS7Unit2Projects'));
const LabS7ImmuneSystemRolePlay = lazy(() => import('./components/LabS7ImmuneSystemRolePlay'));
const LabS7Unit3Projects = lazy(() => import('./components/LabS7Unit3Projects'));
const LabS7ChemicalChange = lazy(() => import('./components/LabS7ChemicalChange'));
const LabS7ThermalConduction = lazy(() => import('./components/LabS7ThermalConduction'));
const LabS7Unit4Projects = lazy(() => import('./components/LabS7Unit4Projects'));
const LabS7CalculatingSubatomicParticles = lazy(() => import('./components/LabS7CalculatingSubatomicParticles'));
const LabS7AtomModel = lazy(() => import('./components/LabS7AtomModel'));
const LabS7LithiumBonding = lazy(() => import('./components/LabS7LithiumBonding'));
const LabS7DiluteConcentratedSolutions = lazy(() => import('./components/LabS7DiluteConcentratedSolutions'));
const LabS7CleaningCoins = lazy(() => import('./components/LabS7CleaningCoins'));
const LabS7MakingRockCandy = lazy(() => import('./components/LabS7MakingRockCandy'));
const LabS7OilPollutants = lazy(() => import('./components/LabS7OilPollutants'));
const LabS7BalloonRocket = lazy(() => import('./components/LabS7BalloonRocket'));
const LabS7Unit8Projects = lazy(() => import('./components/LabS7Unit8Projects'));
const LabS7VibratingLengthPitch = lazy(() => import('./components/LabS7VibratingLengthPitch'));
const LabS7Unit9Projects = lazy(() => import('./components/LabS7Unit9Projects'));
const LabS7Unit10Projects = lazy(() => import('./components/LabS7Unit10Projects'));
const LabS7DripIrrigation = lazy(() => import('./components/LabS7DripIrrigation'));
const LabS7MakeStethoscope = lazy(() => import('./components/LabS7MakeStethoscope'));
const LabS7HandSanitizer = lazy(() => import('./components/LabS7HandSanitizer'));
const LabS7Unit11Projects = lazy(() => import('./components/LabS7Unit11Projects'));
const LabS7EarthSeasons = lazy(() => import('./components/LabS7EarthSeasons'));

// Class 10 Physics Additions
const LabP10ThermionicEmission = lazy(() => import('./components/LabP10ThermionicEmission'));
const LabP10LogicGates = lazy(() => import('./components/LabP10LogicGates'));
const LabP10RadioTransmission = lazy(() => import('./components/LabP10RadioTransmission'));
const LabP10OpticalFibers = lazy(() => import('./components/LabP10OpticalFibers'));
const LabP10Radioactivity = lazy(() => import('./components/LabP10Radioactivity'));
const LabP10HalfLife = lazy(() => import('./components/LabP10HalfLife'));

const LabP10ElectrostaticCharges = lazy(() => import('./components/LabP10ElectrostaticCharges'));
const LabP10Electroscope = lazy(() => import('./components/LabP10Electroscope'));
const LabP10OhmLaw = lazy(() => import('./components/LabP10OhmLaw'));
const LabP10SeriesCircuit = lazy(() => import('./components/LabP10SeriesCircuit'));
const LabP10ParallelCircuit = lazy(() => import('./components/LabP10ParallelCircuit'));
const LabP10MagneticField = lazy(() => import('./components/LabP10MagneticField'));
const LabP10ElectromagnetDC = lazy(() => import('./components/LabP10ElectromagnetDC'));
const LabP10FaradayLaw = lazy(() => import('./components/LabP10FaradayLaw'));

const LabP10WaveMotion = lazy(() => import('./components/LabP10WaveMotion'));
const LabP10RippleTank = lazy(() => import('./components/LabP10RippleTank'));
const LabP10RefractionIllusion = lazy(() => import('./components/LabP10RefractionIllusion'));
const LabP10SoundProduction = lazy(() => import('./components/LabP10SoundProduction'));
const LabP10SoundMedium = lazy(() => import('./components/LabP10SoundMedium'));
const LabP10StringTelephone = lazy(() => import('./components/LabP10StringTelephone'));
const LabP10SpeakerProject = lazy(() => import('./components/LabP10SpeakerProject'));
const LabP10PlaneMirror = lazy(() => import('./components/LabP10PlaneMirror'));
const LabP10RefractionBlocks = lazy(() => import('./components/LabP10RefractionBlocks'));
const LabP10TotalInternalReflection = lazy(() => import('./components/LabP10TotalInternalReflection'));

const LabP10CarbonFootprint = lazy(() => import('./components/LabP10CarbonFootprint'));
const LabP10SpecificHeatMixture = lazy(() => import('./components/LabP10SpecificHeatMixture'));
const LabP10SpecificHeatElectrical = lazy(() => import('./components/LabP10SpecificHeatElectrical'));
const LabP10ThermalConduction = lazy(() => import('./components/LabP10ThermalConduction'));
const LabP10ConvectionCurrents = lazy(() => import('./components/LabP10ConvectionCurrents'));
const LabP10InsulatingMaterials = lazy(() => import('./components/LabP10InsulatingMaterials'));
const LabP10AbsorbersReflectors = lazy(() => import('./components/LabP10AbsorbersReflectors'));
const LabP10LeslieCube = lazy(() => import('./components/LabP10LeslieCube'));
const LabP10ThermalExpansionSolid = lazy(() => import('./components/LabP10ThermalExpansionSolid'));
const LabP10ExpansionLiquids = lazy(() => import('./components/LabP10ExpansionLiquids'));
const LabP10GasPressureBalloon = lazy(() => import('./components/LabP10GasPressureBalloon'));
const LabP10LatentHeat = lazy(() => import('./components/LabP10LatentHeat'));

// Class 10 Chemistry Additions
const LabC10DiluteSolution = lazy(() => import('./components/LabC10DiluteSolution'));
const LabC10StandardizationTitration = lazy(() => import('./components/LabC10StandardizationTitration'));
const LabC10SaltTitration = lazy(() => import('./components/LabC10SaltTitration'));
const LabC10SaltExcessMetal = lazy(() => import('./components/LabC10SaltExcessMetal'));
const LabC10SaltExcessBase = lazy(() => import('./components/LabC10SaltExcessBase'));
const LabC10SaltExcessCarbonate = lazy(() => import('./components/LabC10SaltExcessCarbonate'));
const LabC10MetalReactivity = lazy(() => import('./components/LabC10MetalReactivity'));
const LabC10SaturatedUnsaturated = lazy(() => import('./components/LabC10SaturatedUnsaturated'));
const LabC10AceticAcidMetal = lazy(() => import('./components/LabC10AceticAcidMetal'));
const LabC10AceticAcidCarbonate = lazy(() => import('./components/LabC10AceticAcidCarbonate'));

// Class 10 Chemistry Phase 2 Additions
const LabC10DownsCell = lazy(() => import('./components/LabC10DownsCell'));
const LabC10MoltenLeadChloride = lazy(() => import('./components/LabC10MoltenLeadChloride'));
const LabC10AqueousElectrolysis = lazy(() => import('./components/LabC10AqueousElectrolysis'));
const LabC10CopperRefining = lazy(() => import('./components/LabC10CopperRefining'));
const LabC10Electroplating = lazy(() => import('./components/LabC10Electroplating'));
const LabC10DanielCell = lazy(() => import('./components/LabC10DanielCell'));
const LabC10FuelCell = lazy(() => import('./components/LabC10FuelCell'));
const LabC10SurfaceAreaRate = lazy(() => import('./components/LabC10SurfaceAreaRate'));
const LabC10ConcentrationRate = lazy(() => import('./components/LabC10ConcentrationRate'));
const LabC10Esterification = lazy(() => import('./components/LabC10Esterification'));
const LabC10EthanolFermentation = lazy(() => import('./components/LabC10EthanolFermentation'));
const LabC10EthanolHydration = lazy(() => import('./components/LabC10EthanolHydration'));
const LabC10AlcoholCombustion = lazy(() => import('./components/LabC10AlcoholCombustion'));
const LabC10AdditionPolymerisation = lazy(() => import('./components/LabC10AdditionPolymerisation'));
const LabC10CondensationPolymerisation = lazy(() => import('./components/LabC10CondensationPolymerisation'));
const LabC10PETAcidHydrolysis = lazy(() => import('./components/LabC10PETAcidHydrolysis'));
const LabC10BiochemicalTest = lazy(() => import('./components/LabC10BiochemicalTest'));

// Class 10 Computer Science Additions
const LabCS10NumberSystems = lazy(() => import('./components/LabCS10NumberSystems'));
const LabCS10HelloWorld = lazy(() => import('./components/LabCS10HelloWorld'));
const LabCS10ComputationalThinking = lazy(() => import('./components/LabCS10ComputationalThinking'));
const LabCS10HTMLCSS = lazy(() => import('./components/LabCS10HTMLCSS'));
const LabCS10JSAlgorithms = lazy(() => import('./components/LabCS10JSAlgorithms'));
const LabCS10DynamicList = lazy(() => import('./components/LabCS10DynamicList'));
const LabCS10DataVisualization = lazy(() => import('./components/LabCS10DataVisualization'));
const LabCS10ChurnPrediction = lazy(() => import('./components/LabCS10ChurnPrediction'));
const LabCS10FutureTech = lazy(() => import('./components/LabCS10FutureTech'));
const LabCS10CyberSafety = lazy(() => import('./components/LabCS10CyberSafety'));
const LabCS10DigitalMarketing = lazy(() => import('./components/LabCS10DigitalMarketing'));
const LabCS10MarketResearch = lazy(() => import('./components/LabCS10MarketResearch'));
const LabCS10Financials = lazy(() => import('./components/LabCS10Financials'));
const LabCS10BusinessPitch = lazy(() => import('./components/LabCS10BusinessPitch'));

// Class 10 Mathematics Additions
const LabM10Vectors = lazy(() => import('./components/LabM10Vectors'));
const LabM10ChordBisectors = lazy(() => import('./components/LabM10ChordBisectors'));
const LabM10EqualChords = lazy(() => import('./components/LabM10EqualChords'));
const LabM10TangentProperties = lazy(() => import('./components/LabM10TangentProperties'));
const LabM10CircleAngles = lazy(() => import('./components/LabM10CircleAngles'));
const LabM10CircleBasics = lazy(() => import('./components/LabM10CircleBasics'));
const LabM10TangentConstruction = lazy(() => import('./components/LabM10TangentConstruction'));
const LabM10CommonTangents = lazy(() => import('./components/LabM10CommonTangents'));
const LabM10StatisticsWheels = lazy(() => import('./components/LabM10StatisticsWheels'));

// Class 10 Mathematics Phase 2 Additions
const LabM10ComplexApplications = lazy(() => import('./components/LabM10ComplexApplications'));
const LabM10QuadraticApplications = lazy(() => import('./components/LabM10QuadraticApplications'));
const LabM10MatrixApplications = lazy(() => import('./components/LabM10MatrixApplications'));
const LabM10InequalityApplications = lazy(() => import('./components/LabM10InequalityApplications'));
const LabM10FractionApplications = lazy(() => import('./components/LabM10FractionApplications'));
const LabM10FunctionApplications = lazy(() => import('./components/LabM10FunctionApplications'));
const LabM10VectorApplications = lazy(() => import('./components/LabM10VectorApplications'));
const LabM10TrigApplications = lazy(() => import('./components/LabM10TrigApplications'));
const LabM10CircleApplications = lazy(() => import('./components/LabM10CircleApplications'));
const LabM10StatsApplications = lazy(() => import('./components/LabM10StatsApplications'));

// Class 10 Biology Additions
const LabB10DigestiveSystem = lazy(() => import('./components/LabB10DigestiveSystem'));
const LabB10BloodSmear = lazy(() => import('./components/LabB10BloodSmear'));
const LabB10RespiratorySystem = lazy(() => import('./components/LabB10RespiratorySystem'));
const LabB10KidneyDissection = lazy(() => import('./components/LabB10KidneyDissection'));
const LabB10NervousSystem = lazy(() => import('./components/LabB10NervousSystem'));
const LabB10Genetics = lazy(() => import('./components/LabB10Genetics'));
const LabB10Biostatistics = lazy(() => import('./components/LabB10Biostatistics'));

// Class 9 Biology Additions
const LabB9Biodiversity = lazy(() => import('./components/LabB9Biodiversity'));
const LabB9Microscopy = lazy(() => import('./components/LabB9Microscopy'));
const LabB9Biochemistry = lazy(() => import('./components/LabB9Biochemistry'));
const LabB9Enzymes = lazy(() => import('./components/LabB9Enzymes'));
const LabB9PlantPhysiology = lazy(() => import('./components/LabB9PlantPhysiology'));
const LabB9PlantReproduction = lazy(() => import('./components/LabB9PlantReproduction'));

// Class 9 Chemistry Additions
const LabC9StatesOfMatter = lazy(() => import('./components/LabC9StatesOfMatter'));
const LabC9AtomicStructure = lazy(() => import('./components/LabC9AtomicStructure'));
const LabC9Electrochemistry = lazy(() => import('./components/LabC9Electrochemistry'));
const LabC9EnvironmentalChem = lazy(() => import('./components/LabC9EnvironmentalChem'));
const LabC9OrganicChem = lazy(() => import('./components/LabC9OrganicChem'));
const LabC9SeparationTech = lazy(() => import('./components/LabC9SeparationTech'));
const LabC9QualitativeAnalysis = lazy(() => import('./components/LabC9QualitativeAnalysis'));

// Class 9 Physics Additions
const LabP9MeasurementTools = lazy(() => import('./components/LabP9MeasurementTools'));
const LabP9VolumeDensity = lazy(() => import('./components/LabP9VolumeDensity'));
const LabP9Kinematics = lazy(() => import('./components/LabP9Kinematics'));
const LabP9Inertia = lazy(() => import('./components/LabP9Inertia'));
const LabP9Friction = lazy(() => import('./components/LabP9Friction'));
const LabP9Pressure = lazy(() => import('./components/LabP9Pressure'));
const LabP9Springs = lazy(() => import('./components/LabP9Springs'));
const LabP9MagnetismFields = lazy(() => import('./components/LabP9MagnetismFields'));
const LabP9MagnetismInduction = lazy(() => import('./components/LabP9MagnetismInduction'));
const LabP9EverydayPhysics = lazy(() => import('./components/LabP9EverydayPhysics'));

// Class 9 Computer Science Additions
const LabCS9ComputerSystems = lazy(() => import('./components/LabCS9ComputerSystems'));
const LabCS9Algorithms = lazy(() => import('./components/LabCS9Algorithms'));
const LabCS9WebBasics = lazy(() => import('./components/LabCS9WebBasics'));
const LabCS9JavaScript = lazy(() => import('./components/LabCS9JavaScript'));
const LabCS9WebProjects = lazy(() => import('./components/LabCS9WebProjects'));
const LabCS9DataAnalysis = lazy(() => import('./components/LabCS9DataAnalysis'));
const LabCS9AIApplications = lazy(() => import('./components/LabCS9AIApplications'));
const LabCS9CyberSafety = lazy(() => import('./components/LabCS9CyberSafety'));
const LabCS9Entrepreneurship = lazy(() => import('./components/LabCS9Entrepreneurship'));

// Class 9 Mathematics Additions
const LabM9RealNumbers = lazy(() => import('./components/LabM9RealNumbers'));
const LabM9Logarithms = lazy(() => import('./components/LabM9Logarithms'));
const LabM9SetsRelations = lazy(() => import('./components/LabM9SetsRelations'));
const LabM9AlgebraicManipulation = lazy(() => import('./components/LabM9AlgebraicManipulation'));
const LabM9Trigonometry = lazy(() => import('./components/LabM9Trigonometry'));
const LabM9CoordinateGeometry = lazy(() => import('./components/LabM9CoordinateGeometry'));
const LabM9LinearGraphs = lazy(() => import('./components/LabM9LinearGraphs'));
const LabM9GeometryPolygons = lazy(() => import('./components/LabM9GeometryPolygons'));
const LabM9BasicStatistics = lazy(() => import('./components/LabM9BasicStatistics'));

// Class 11 Chemistry Additions
const LabC11AtomicStructure = lazy(() => import('./components/LabC11AtomicStructure'));
const LabC11MolecularBonding = lazy(() => import('./components/LabC11MolecularBonding'));
const LabC11Stoichiometry = lazy(() => import('./components/LabC11Stoichiometry'));
const LabC11PhasesOfMatter = lazy(() => import('./components/LabC11PhasesOfMatter'));
const LabC11EnergeticsKinetics = lazy(() => import('./components/LabC11EnergeticsKinetics'));
const LabC11IndustrialEquilibrium = lazy(() => import('./components/LabC11IndustrialEquilibrium'));
const LabC11AcidsBases = lazy(() => import('./components/LabC11AcidsBases'));
const LabC11EnvironmentalChem = lazy(() => import('./components/LabC11EnvironmentalChem'));
const LabC11OrganicAnalysis = lazy(() => import('./components/LabC11OrganicAnalysis'));
const LabC11OrganicSynthesis = lazy(() => import('./components/LabC11OrganicSynthesis'));

// Class 11 Physics Additions
const LabP11PhysicalQuantities = lazy(() => import('./components/LabP11PhysicalQuantities'));
const LabP11Vectors = lazy(() => import('./components/LabP11Vectors'));
const LabP11TranslatoryMotion = lazy(() => import('./components/LabP11TranslatoryMotion'));
const LabP11RotationalMotion = lazy(() => import('./components/LabP11RotationalMotion'));
const LabP11WorkEnergy = lazy(() => import('./components/LabP11WorkEnergy'));
const LabP11FluidMechanics = lazy(() => import('./components/LabP11FluidMechanics'));
const LabP11Solids = lazy(() => import('./components/LabP11Solids'));
const LabP11Thermodynamics = lazy(() => import('./components/LabP11Thermodynamics'));
const LabP11Waves = lazy(() => import('./components/LabP11Waves'));
const LabP11Electrostatics = lazy(() => import('./components/LabP11Electrostatics'));
const LabP11Electricity = lazy(() => import('./components/LabP11Electricity'));
const LabP11Electromagnetism = lazy(() => import('./components/LabP11Electromagnetism'));
const LabP11ModernPhysics = lazy(() => import('./components/LabP11ModernPhysics'));

// Class 11 Computer Science Additions
const LabCS11SystemsNetworks = lazy(() => import('./components/LabCS11SystemsNetworks'));
const LabCS11Algorithms = lazy(() => import('./components/LabCS11Algorithms'));
const LabCS11Python = lazy(() => import('./components/LabCS11Python'));
const LabCS11DataScience = lazy(() => import('./components/LabCS11DataScience'));
const LabCS11Applications = lazy(() => import('./components/LabCS11Applications'));
const LabCS11Impacts = lazy(() => import('./components/LabCS11Impacts'));
const LabCS11Research = lazy(() => import('./components/LabCS11Research'));
const LabCS11ProductDev = lazy(() => import('./components/LabCS11ProductDev'));

// Class 11 Biology Additions
const LabB11Cytology = lazy(() => import('./components/LabB11Cytology'));
const LabB11Biomolecules = lazy(() => import('./components/LabB11Biomolecules'));
const LabB11Enzymes = lazy(() => import('./components/LabB11Enzymes'));
const LabB11Bioenergetics = lazy(() => import('./components/LabB11Bioenergetics'));
const LabB11Microbiology = lazy(() => import('./components/LabB11Microbiology'));
const LabB11Fungi = lazy(() => import('./components/LabB11Fungi'));
const LabB11PlantPhysiology = lazy(() => import('./components/LabB11PlantPhysiology'));
const LabB11Inheritance = lazy(() => import('./components/LabB11Inheritance'));
const LabB11Genetics = lazy(() => import('./components/LabB11Genetics'));

// Class 12 Biology Additions
const LabB12Digestive = lazy(() => import('./components/LabB12Digestive'));
const LabB12Cardiorespiratory = lazy(() => import('./components/LabB12Cardiorespiratory'));
const LabB12Urinary = lazy(() => import('./components/LabB12Urinary'));
const LabB12NeuroEndocrine = lazy(() => import('./components/LabB12NeuroEndocrine'));
const LabB12Skeletal = lazy(() => import('./components/LabB12Skeletal'));
const LabB12Immunity = lazy(() => import('./components/LabB12Immunity'));
const LabB12Biotechnology = lazy(() => import('./components/LabB12Biotechnology'));
const Login = lazy(() => import('./components/Login'));
import { useHistory } from './store';
const LabB12StructuralStats = lazy(() => import('./components/LabB12StructuralStats'));
const LabB12PharmacologyEcology = lazy(() => import('./components/LabB12PharmacologyEcology'));

// Class 12 Physics Additions
const LabP12Gravitation = lazy(() => import('./components/LabP12Gravitation'));
const LabP12ThermoMechanics = lazy(() => import('./components/LabP12ThermoMechanics'));
const LabP12SHM = lazy(() => import('./components/LabP12SHM'));
const LabP12Diffraction = lazy(() => import('./components/LabP12Diffraction'));
const LabP12ElectricPotential = lazy(() => import('./components/LabP12ElectricPotential'));
const LabP12AlternatingCurrent = lazy(() => import('./components/LabP12AlternatingCurrent'));
const LabP12QuantumNuclear = lazy(() => import('./components/LabP12QuantumNuclear'));
const LabP12CosmologyClimate = lazy(() => import('./components/LabP12CosmologyClimate'));
const LabP12MedicalImaging = lazy(() => import('./components/LabP12MedicalImaging'));

// Class 12 Chemistry Additions
const LabC12Electrochemistry = lazy(() => import('./components/LabC12Electrochemistry'));
const LabC12EquilibriumAcidBase = lazy(() => import('./components/LabC12EquilibriumAcidBase'));
const LabC12TransitionMetals = lazy(() => import('./components/LabC12TransitionMetals'));
const LabC12OrganicSynthesis = lazy(() => import('./components/LabC12OrganicSynthesis'));
const LabC12Biochemistry = lazy(() => import('./components/LabC12Biochemistry'));
const LabC12SpectroscopyChromatography = lazy(() => import('./components/LabC12SpectroscopyChromatography'));
const LabC12Medicine = lazy(() => import('./components/LabC12Medicine'));
const LabC12Agriculture = lazy(() => import('./components/LabC12Agriculture'));
const LabC12IndustryMaterials = lazy(() => import('./components/LabC12IndustryMaterials'));

// Class 12 CS Additions
const LabCS12HCI = lazy(() => import('./components/LabCS12HCI'));
const LabCS12DataStructures = lazy(() => import('./components/LabCS12DataStructures'));
const LabCS12Programming = lazy(() => import('./components/LabCS12Programming'));
const LabCS12MachineLearning = lazy(() => import('./components/LabCS12MachineLearning'));
const LabCS12DeepLearning = lazy(() => import('./components/LabCS12DeepLearning'));
const LabCS12IoTCloud = lazy(() => import('./components/LabCS12IoTCloud'));
const LabCS12Cybersecurity = lazy(() => import('./components/LabCS12Cybersecurity'));
const LabCS12DigitalLiteracy = lazy(() => import('./components/LabCS12DigitalLiteracy'));
const LabCS12Entrepreneurship = lazy(() => import('./components/LabCS12Entrepreneurship'));

// Class 11 Mathematics Additions
const LabM11ComplexNumbers = lazy(() => import('./components/LabM11ComplexNumbers'));
const LabM11Matrices = lazy(() => import('./components/LabM11Matrices'));
const LabM11Vectors = lazy(() => import('./components/LabM11Vectors'));
const LabM11SequencesSeries = lazy(() => import('./components/LabM11SequencesSeries'));
const LabM11Polynomials = lazy(() => import('./components/LabM11Polynomials'));
const LabM11Trigonometry = lazy(() => import('./components/LabM11Trigonometry'));
const LabM11Permutations = lazy(() => import('./components/LabM11Permutations'));
const LabM11BinomialInduction = lazy(() => import('./components/LabM11BinomialInduction'));

// Class 12 Mathematics Additions
const LabM12Derivatives = lazy(() => import('./components/LabM12Derivatives'));
const LabM12Integration = lazy(() => import('./components/LabM12Integration'));
const LabM12DifferentialEq = lazy(() => import('./components/LabM12DifferentialEq'));
const LabM12Conics = lazy(() => import('./components/LabM12Conics'));
const LabM12AnalyticalGeometry = lazy(() => import('./components/LabM12AnalyticalGeometry'));
const LabM12Kinematics = lazy(() => import('./components/LabM12Kinematics'));
const LabM12Functions = lazy(() => import('./components/LabM12Functions'));
const LabM12InverseTrig = lazy(() => import('./components/LabM12InverseTrig'));

// Class 6 Science Additions
const LabS6Microscope = lazy(() => import('./components/LabS6Microscope'));
const LabS6Unit1Projects = lazy(() => import('./components/LabS6Unit1Projects'));
const LabS6VegetativePropagation = lazy(() => import('./components/LabS6VegetativePropagation'));
const LabS6FatDetection = lazy(() => import('./components/LabS6FatDetection'));
const LabS6BalancedDiet = lazy(() => import('./components/LabS6BalancedDiet'));
const LabS6DigestionMechanics = lazy(() => import('./components/LabS6DigestionMechanics'));
const LabS6AlimentaryCanal = lazy(() => import('./components/LabS6AlimentaryCanal'));
const LabS6LungModel = lazy(() => import('./components/LabS6LungModel'));
const LabS6ParticleSimulation = lazy(() => import('./components/LabS6ParticleSimulation'));
const LabS6MolecularBuilder = lazy(() => import('./components/LabS6MolecularBuilder'));
const LabS6ElementsCompounds = lazy(() => import('./components/LabS6ElementsCompounds'));
const LabS6Separation = lazy(() => import('./components/LabS6Separation'));
const LabS6SolutionInvestigation = lazy(() => import('./components/LabS6SolutionInvestigation'));
const LabS6EnergyTransformation = lazy(() => import('./components/LabS6EnergyTransformation'));
const LabS6EnergyProjects = lazy(() => import('./components/LabS6EnergyProjects'));
const LabS6CircuitBuilder = lazy(() => import('./components/LabS6CircuitBuilder'));
const LabS6ConductorsInsulators = lazy(() => import('./components/LabS6ConductorsInsulators'));
const LabS6Magnetism = lazy(() => import('./components/LabS6Magnetism'));
const LabS6PlantGrowth = lazy(() => import('./components/LabS6PlantGrowth'));
const LabS6SolarSystemBuilder = lazy(() => import('./components/LabS6SolarSystemBuilder'));
const LabS6EverydayTech = lazy(() => import('./components/LabS6EverydayTech'));

const CLASSES = ['6', '7', '8', '9', '10', '11', '12'];

const getSubjectsForClass = (classLevel: string) => {
  const num = parseInt(classLevel);
  if (num >= 6 && num <= 8) {
    return ['science', 'computer'];
  } else {
    return ['physics', 'chemistry', 'biology', 'math', 'computer'];
  }
};

function Breadcrumbs() {
  const { classId, subjectId } = useParams();
  
  return (
    <div className="inline-flex items-center gap-2 text-sm text-slate-500 mb-6 bg-slate-50 py-2 px-4 rounded-lg shadow-sm border border-slate-200">
      <Link to="/" className="hover:text-blue-600 transition-colors font-medium">Home</Link>
      {classId && (
        <>
          <span className="text-slate-300">/</span>
          <Link to={`/class/${classId}`} className={`transition-colors font-medium ${!subjectId ? 'text-slate-800 cursor-default pointer-events-none' : 'hover:text-blue-600'}`}>Class {classId}</Link>
        </>
      )}
      {subjectId && (
        <>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-medium">{formatSubject(subjectId)}</span>
        </>
      )}
    </div>
  );
}

function ClassSelection() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex flex-col relative">
        <Breadcrumbs />

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 p-10 mb-12 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-slate-50 opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-40 h-40 bg-slate-50 opacity-10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-outfit tracking-tight">
              Welcome to Virtual<span className="text-blue-300">Lab</span>
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8 font-medium">
              Explore our massive library of <span className="font-bold text-white bg-blue-500/30 px-2 py-0.5 rounded">384 interactive modules</span> across Physics, Chemistry, Biology, Mathematics, and Computer Science.
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Select Class</h2>
          <p className="text-slate-500 mt-1 mb-6">Choose your grade level to browse available experiments.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {CLASSES.map(cls => (
              <button 
                key={cls}
                onClick={() => navigate(`/class/${cls}`)}
                className="glass p-8 rounded-3xl hover:border-blue-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center justify-center gap-4 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center text-3xl font-extrabold shadow-inner group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:rotate-6 transition-all duration-300 font-outfit">
                  {cls}
                </div>
                <span className="text-xl font-bold text-slate-700 group-hover:text-blue-700 font-outfit transition-colors">Class {cls}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

const getSubjectIcon = (subject: string) => {
  switch (subject.toLowerCase()) {
    case 'physics': return <Atom className="w-7 h-7" />;
    case 'chemistry': return <Microscope className="w-7 h-7" />;
    case 'biology': return <Dna className="w-7 h-7" />;
    case 'mathematics': return <Calculator className="w-7 h-7" />;
    case 'computer': return <Laptop className="w-7 h-7" />;
    case 'science': return <Activity className="w-7 h-7" />;
    default: return <BookOpen className="w-7 h-7" />;
  }
};

function SubjectSelection() {
  const { classId } = useParams();
  const navigate = useNavigate();
  if (!classId) return null;
  const subjects = getSubjectsForClass(classId);

  return (
    <Layout>
      <div className="flex flex-col">
        <Breadcrumbs />
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Select Subject</h2>
          <p className="text-slate-500 mt-1 mb-6">Class {classId} Curriculum</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map(subject => (
              <button 
                key={subject}
                onClick={() => navigate(`/class/${classId}/${subject}`)}
                className="glass p-6 rounded-2xl hover:border-indigo-400 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex items-center gap-4 text-left relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-50 text-indigo-600 flex items-center justify-center shadow-inner group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-blue-600 group-hover:text-white transition-all duration-300">
                  {getSubjectIcon(subject)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-700 transition-colors font-outfit">{formatSubject(subject)}</h3>
                  <span className="text-sm font-medium text-slate-400 group-hover:text-indigo-500 transition-colors">Explore Interactive Modules</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ModuleSelection() {
  const { classId, subjectId } = useParams();
  const navigate = useNavigate();
  
  const filteredModules = LAB_MODULES.filter(m => m.classLevel === classId && m.subject === subjectId);

  return (
    <Layout>
      <div className="flex flex-col">
        <Breadcrumbs />
        
        {filteredModules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Modules Coming Soon</h3>
            <p className="text-slate-500 max-w-md text-center">We are actively developing premium virtual labs for Class {classId} {subjectId && formatSubject(subjectId)}. Check back soon!</p>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Curriculum Modules</h2>
            <p className="text-slate-500 mt-1 mb-6">High-End Interactive Experiments (Class {classId} {subjectId && formatSubject(subjectId)})</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map(lab => (
                <div 
                  key={lab.id} 
                  onClick={() => lab.built && navigate(`/class/${classId}/${subjectId}/lab/${lab.id}`)}
                  className={`glass rounded-3xl ${lab.built ? 'hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 border-slate-50/40 cursor-pointer' : 'border-dashed border-slate-300 opacity-80'} overflow-hidden transition-all duration-300 group flex flex-col h-full relative`}
                >
                  {lab.built && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-10 pointer-events-none"></div>}
                  <div className={`h-48 relative overflow-hidden ${!lab.built && 'grayscale-[50%]'}`}>
                    {/* Unique 2D SVG Cover Image */}
                    <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${lab.id}&backgroundColor=transparent`} alt={lab.title} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3" loading="lazy" />
                    
                    {/* Gradient & Pattern Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${lab.bg} mix-blend-color opacity-90`}></div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${lab.bg} opacity-70`}></div>
                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
                    
                    <div className="absolute bottom-4 left-4 flex gap-2 z-10">
                      <span className="bg-slate-50/30 backdrop-blur-md border border-slate-50/40 text-white text-xs font-bold tracking-wide px-3 py-1.5 rounded-full shadow-sm">{formatSubject(lab.subject)}</span>
                      <span className="bg-black/30 backdrop-blur-md border border-slate-50/20 text-white text-xs font-bold tracking-wide px-3 py-1.5 rounded-full shadow-sm">Class {lab.classLevel}</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col relative bg-slate-50/60/60 backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className={`text-xl font-bold font-outfit ${lab.built ? 'text-slate-800 group-hover:text-blue-700' : 'text-slate-600'} transition-colors leading-tight`}>{lab.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-6 font-medium">
                      {lab.desc}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-200/60/60">
                      <div className="flex items-center gap-2 bg-slate-100/80 px-2.5 py-1 rounded-md">
                        <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs font-bold text-slate-600">15 MIN</span>
                      </div>
                      {lab.built ? (
                        <button 
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 transition-all z-20 transform group-hover:scale-105 pointer-events-none"
                        >
                          Launch
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-300">Coming Soon</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function LabRunnerInner() {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const handleExit = () => {
    navigate(-1); // Go back to the dashboard
  };

  if (moduleId === 'c8c_1_1') return <LabDataComm onExit={handleExit} />;
  if (moduleId === 'c8c_1_2') return <LabNetworkDevices onExit={handleExit} />;
  if (moduleId === 'c8c_2_1') return <LabCricketSpreadsheet onExit={handleExit} />;
  if (moduleId === 'c8c_2_2') return <LabDataWorksheets onExit={handleExit} />;
  if (moduleId === 'c8c_3_1') return <LabPseudocodeInterpreter onExit={handleExit} />;
  if (moduleId === 'c8c_3_2') return <LabDiceGameAlgorithm onExit={handleExit} />;
  if (moduleId === 'c8c_4_1') return <LabScratchMaze onExit={handleExit} />;
  if (moduleId === 'c8c_5_1') return <LabCyberScout onExit={handleExit} />;
  if (moduleId === 'c8c_5_2') return <LabAntivirus onExit={handleExit} />;
  if (moduleId === 'c8c_6_1') return <LabBusinessPlan onExit={handleExit} />;
  if (moduleId === 'c8c_6_2') return <LabDigitalMarketing onExit={handleExit} />;
  
  if (moduleId === 'c8s_1_1') return <LabS8GreenhouseEffect onExit={handleExit} />;
  if (moduleId === 'c8s_2_1') return <LabS8StimulusResponse onExit={handleExit} />;
  if (moduleId === 'c8s_2_2') return <LabS8KneeJerk onExit={handleExit} />;
  if (moduleId === 'c8s_2_3') return <LabS8ReflexTime onExit={handleExit} />;
  if (moduleId === 'c8s_3_1') return <LabS8DNAExtraction onExit={handleExit} />;
  if (moduleId === 'c8s_3_2') return <LabS8HumanVariations onExit={handleExit} />;
  if (moduleId === 'c8s_3_3') return <LabS8CrossingOver onExit={handleExit} />;
  if (moduleId === 'c8s_4_1') return <LabS8MakingYogurt onExit={handleExit} />;
  if (moduleId === 'c8s_5_1') return <LabS8PeriodicTable onExit={handleExit} />;
  if (moduleId === 'c8s_5_2') return <LabS8ElectronicConfig onExit={handleExit} />;
  if (moduleId === 'c8s_5_3') return <LabS8Malleability onExit={handleExit} />;
  if (moduleId === 'c8s_5_4') return <LabS8Flexibility onExit={handleExit} />;
  if (moduleId === 'c8s_5_5') return <LabS8Density onExit={handleExit} />;
  if (moduleId === 'c8s_5_6') return <LabS8ThermalConductivity onExit={handleExit} />;
  if (moduleId === 'c8s_5_7') return <LabS8Sonorous onExit={handleExit} />;
  if (moduleId === 'c8s_6_1') return <LabS8ChemicalReactionSigns onExit={handleExit} />;
  if (moduleId === 'c8s_6_2') return <LabS8ConservationMass onExit={handleExit} />;
  if (moduleId === 'c8s_6_3') return <LabS8Endothermic onExit={handleExit} />;
  if (moduleId === 'c8s_6_4') return <LabS8Exothermic onExit={handleExit} />;
  if (moduleId === 'c8s_7_1') return <LabS8AcidLitmus onExit={handleExit} />;
  if (moduleId === 'c8s_7_2') return <LabS8AlkaliLitmus onExit={handleExit} />;
  if (moduleId === 'c8s_7_3') return <LabS8Neutralization onExit={handleExit} />;
  if (moduleId === 'c8s_7_4') return <LabS8DeterminingPH onExit={handleExit} />;
  if (moduleId === 'c8s_8_1') return <LabS8NailPressure onExit={handleExit} />;
  if (moduleId === 'c8s_8_2') return <LabS8HydraulicElevator onExit={handleExit} />;
  if (moduleId === 'c8s_8_3') return <LabS8WaterRocket onExit={handleExit} />;
  if (moduleId === 'c8s_9_1') return <LabS8LaserMaze onExit={handleExit} />;
  if (moduleId === 'c8s_9_3') return <LabS8Periscope onExit={handleExit} />;
  if (moduleId === 'c8s_9_4') return <LabS8RefractionPencil onExit={handleExit} />;
  
  switch(moduleId) {
    case 'c8s_9_5': return <LabS8ConcaveMirror onExit={handleExit} />;
    case 'c8s_9_6': return <LabS8ConvexMirror onExit={handleExit} />;
    case 'c8s_10_1': return <LabS8Electromagnet onExit={handleExit} />;
    case 'c8s_11_1': return <LabS8Toothpaste onExit={handleExit} />;
    case 'c8s_11_2': return <LabS8SoapMaking onExit={handleExit} />;
    case 'c8s_11_3': return <LabS8MilkPlastic onExit={handleExit} />;
    case 'c8s_11_4': return <LabS8Detergent onExit={handleExit} />;
    case 'c8s_11_5': return <LabS8SolarCooker onExit={handleExit} />;
    case 'c8s_11_7': return <LabS8WindTurbine onExit={handleExit} />;
    case 'c8s_11_8': return <LabS8ChemicalCar onExit={handleExit} />;
    case 'c8s_11_9': return <LabS8Windsock onExit={handleExit} />;
    case 'c8s_12_1': return <LabS8SkyMap onExit={handleExit} />;
  }

  if (moduleId === 'c7c_1_1') return <LabC7Hardware onExit={handleExit} />;
  if (moduleId === 'c7c_1_2') return <LabC7EmergingTech onExit={handleExit} />;
  if (moduleId === 'c7c_1_3') return <LabC7Generations onExit={handleExit} />;
  if (moduleId === 'c7c_1_4') return <LabC7NetworkDiagram onExit={handleExit} />;
  if (moduleId === 'c7c_2_1') return <LabC7UrduTyping onExit={handleExit} />;
  if (moduleId === 'c7c_2_2') return <LabC7LetterFormat onExit={handleExit} />;
  if (moduleId === 'c7c_2_3') return <LabC7CVCreation onExit={handleExit} />;
  if (moduleId === 'c7c_2_4') return <LabC7IllustratedStory onExit={handleExit} />;
  if (moduleId === 'c7c_2_5') return <LabC7PowerPointGeometry onExit={handleExit} />;
  if (moduleId === 'c7c_2_6') return <LabC7WondersResearch onExit={handleExit} />;
  if (moduleId === 'c7c_3_1') return <LabC7ConditionalLogic onExit={handleExit} />;
  if (moduleId === 'c7c_3_2') return <LabC7GradingFlowchart onExit={handleExit} />;
  if (moduleId === 'c7c_3_3') return <LabC7ReverseFlowchart onExit={handleExit} />;
  if (moduleId === 'c7c_4_1') return <LabC7SpriteManipulation onExit={handleExit} />;
  if (moduleId === 'c7c_4_2') return <LabC7LoopAdjustments onExit={handleExit} />;
  if (moduleId === 'c7c_4_3') return <LabC7BouncingBall onExit={handleExit} />;
  if (moduleId === 'c7c_4_4') return <LabC7AnimatedDialogue onExit={handleExit} />;
  if (moduleId === 'c7c_4_5') return <LabC7InteractivePiano onExit={handleExit} />;
  if (moduleId === 'c7c_5_1') return <LabC7Cybercrime onExit={handleExit} />;
  if (moduleId === 'c7c_5_2') return <LabC7DevianceDiscussion onExit={handleExit} />;
  if (moduleId === 'c7c_5_3') return <LabC7EthicsChart onExit={handleExit} />;
  if (moduleId === 'c7c_6_1') return <LabC7DesignPrototype onExit={handleExit} />;
  if (moduleId === 'c7c_6_2') return <LabC7MothersDay onExit={handleExit} />;
  
  if (moduleId === 'c7s_1_1') return <LabS7XylemTransport onExit={handleExit} />;
  if (moduleId === 'c7s_1_2') return <LabS7TranspirationObservation onExit={handleExit} />;
  if (moduleId === 'c7s_1_3') return <LabS7TranspirationLeaves onExit={handleExit} />;
  if (moduleId === 'c7s_1_4') return <LabS7MineralsPlantGrowth onExit={handleExit} />;
  if (moduleId === 'c7s_1_5') return <LabS7Unit1Projects onExit={handleExit} />;
  if (moduleId === 'c7s_2_1') return <LabS7MeasuringLungCapacity onExit={handleExit} />;
  if (moduleId === 'c7s_2_2') return <LabS7PulseRateExercise onExit={handleExit} />;
  if (moduleId === 'c7s_2_3') return <LabS7Unit2Projects onExit={handleExit} />;
  if (moduleId === 'c7s_3_1') return <LabS7ImmuneSystemRolePlay onExit={handleExit} />;
  if (moduleId === 'c7s_3_2') return <LabS7Unit3Projects onExit={handleExit} />;
  if (moduleId === 'c7s_4_1') return <LabS7ChemicalChange onExit={handleExit} />;
  if (moduleId === 'c7s_4_2') return <LabS7ThermalConduction onExit={handleExit} />;
  if (moduleId === 'c7s_4_3') return <LabS7Unit4Projects onExit={handleExit} />;
  if (moduleId === 'c7s_5_1') return <LabS7CalculatingSubatomicParticles onExit={handleExit} />;
  if (moduleId === 'c7s_5_2') return <LabS7AtomModel onExit={handleExit} />;
  if (moduleId === 'c7s_6_1') return <LabS7LithiumBonding onExit={handleExit} />;
  if (moduleId === 'c7s_7_1') return <LabS7DiluteConcentratedSolutions onExit={handleExit} />;
  if (moduleId === 'c7s_7_2') return <LabS7CleaningCoins onExit={handleExit} />;
  if (moduleId === 'c7s_7_3') return <LabS7MakingRockCandy onExit={handleExit} />;
  if (moduleId === 'c7s_7_4') return <LabS7OilPollutants onExit={handleExit} />;
  if (moduleId === 'c7s_8_1') return <LabS7BalloonRocket onExit={handleExit} />;
  if (moduleId === 'c7s_8_2') return <LabS7Unit8Projects onExit={handleExit} />;
  if (moduleId === 'c7s_9_1') return <LabS7VibratingLengthPitch onExit={handleExit} />;
  if (moduleId === 'c7s_9_2') return <LabS7Unit9Projects onExit={handleExit} />;
  if (moduleId === 'c7s_10_1') return <LabS7Unit10Projects onExit={handleExit} />;
  if (moduleId === 'c7s_11_1') return <LabS7DripIrrigation onExit={handleExit} />;
  if (moduleId === 'c7s_11_2') return <LabS7MakeStethoscope onExit={handleExit} />;
  if (moduleId === 'c7s_11_3') return <LabS7HandSanitizer onExit={handleExit} />;
  if (moduleId === 'c7s_11_4') return <LabS7Unit11Projects onExit={handleExit} />;
  if (moduleId === 'c7s_12_1') return <LabS7EarthSeasons onExit={handleExit} />;

  if (moduleId === 'c6s_1_1') return <LabS6Microscope onExit={handleExit} />;
  if (moduleId === 'c6s_1_3') return <LabS6Unit1Projects onExit={handleExit} />;
  if (moduleId === 'c6s_2_1') return <LabS6VegetativePropagation onExit={handleExit} />;
  if (moduleId === 'c6s_3_1') return <LabS6FatDetection onExit={handleExit} />;
  if (moduleId === 'c6s_3_2') return <LabS6BalancedDiet onExit={handleExit} />;
  if (moduleId === 'c6s_4_1') return <LabS6DigestionMechanics onExit={handleExit} />;
  if (moduleId === 'c6s_4_2') return <LabS6AlimentaryCanal onExit={handleExit} />;
  if (moduleId === 'c6s_4_4') return <LabS6LungModel onExit={handleExit} />;
  if (moduleId === 'c6s_5_1') return <LabS6ParticleSimulation onExit={handleExit} />;
  if (moduleId === 'c6s_6_1') return <LabS6MolecularBuilder onExit={handleExit} />;
  if (moduleId === 'c6s_6_2') return <LabS6ElementsCompounds onExit={handleExit} />;
  if (moduleId === 'c6s_7_1') return <LabS6Separation onExit={handleExit} />;
  if (moduleId === 'c6s_7_2') return <LabS6SolutionInvestigation onExit={handleExit} />;
  if (moduleId === 'c6s_8_1') return <LabS6EnergyTransformation onExit={handleExit} />;
  if (moduleId === 'c6s_8_2') return <LabS6EnergyProjects onExit={handleExit} />;
  if (moduleId === 'c6s_9_1') return <LabS6CircuitBuilder onExit={handleExit} />;
  if (moduleId === 'c6s_9_2') return <LabS6ConductorsInsulators onExit={handleExit} />;
  if (moduleId === 'c6s_10_1') return <LabS6Magnetism onExit={handleExit} />;
  if (moduleId === 'c6s_11_1') return <LabS6PlantGrowth onExit={handleExit} />;
  if (moduleId === 'c6s_12_1') return <LabS6SolarSystemBuilder onExit={handleExit} />;
  if (moduleId === 'c6s_12_2') return <LabS6EverydayTech onExit={handleExit} />;

  if (moduleId === 'c6c_1_1') return <LabC6HealthCampaign onExit={handleExit} />;
  if (moduleId === 'c6c_1_2') return <LabC6HardwareCharts onExit={handleExit} />;
  if (moduleId === 'c6c_1_3') return <LabC6LabRules onExit={handleExit} />;
  if (moduleId === 'c6c_1_4') return <LabC6GroupPresentations onExit={handleExit} />;
  if (moduleId === 'c6c_2_1') return <LabC6SystemSoftware onExit={handleExit} />;
  if (moduleId === 'c6c_2_2') return <LabC6FileManagement1 onExit={handleExit} />;
  if (moduleId === 'c6c_2_3') return <LabC6FileManagement2 onExit={handleExit} />;
  if (moduleId === 'c6c_2_4') return <LabC6DietExercise onExit={handleExit} />;
  if (moduleId === 'c6c_2_5') return <LabC6Paint3DFace onExit={handleExit} />;
  if (moduleId === 'c6c_2_6') return <LabC6SolarSystem onExit={handleExit} />;
  if (moduleId === 'c6c_3_1') return <LabC6ProblemDecomposition onExit={handleExit} />;
  if (moduleId === 'c6c_3_2') return <LabC6RoadSafetyProcess onExit={handleExit} />;
  if (moduleId === 'c6c_4_1') return <LabC6CoordinateExp onExit={handleExit} />;
  if (moduleId === 'c6c_4_2') return <LabC6CostumeChange onExit={handleExit} />;
  if (moduleId === 'c6c_4_3') return <LabC6MovementTracking onExit={handleExit} />;
  if (moduleId === 'c6c_4_4') return <LabC6LoopAdjustments onExit={handleExit} />;
  if (moduleId === 'c6c_5_1') return <LabC6EthicsChart onExit={handleExit} />;
  if (moduleId === 'c6c_5_2') return <LabC6CyberScout onExit={handleExit} />;
  if (moduleId === 'c6c_5_3') return <LabC6PosterCompetition onExit={handleExit} />;
  if (moduleId === 'c6c_6_1') return <LabC6HobbyMonetization onExit={handleExit} />;
  
  if (moduleId === 'p10_10_1') return <LabP10CarbonFootprint onExit={handleExit} />;
  if (moduleId === 'p10_10_2') return <LabP10SpecificHeatMixture onExit={handleExit} />;
  if (moduleId === 'p10_10_3') return <LabP10SpecificHeatElectrical onExit={handleExit} />;
  if (moduleId === 'p10_10_4') return <LabP10ThermalConduction onExit={handleExit} />;
  if (moduleId === 'p10_10_5') return <LabP10ConvectionCurrents onExit={handleExit} />;
  if (moduleId === 'p10_10_6') return <LabP10InsulatingMaterials onExit={handleExit} />;
  if (moduleId === 'p10_10_7') return <LabP10AbsorbersReflectors onExit={handleExit} />;
  if (moduleId === 'p10_10_8') return <LabP10LeslieCube onExit={handleExit} />;
  if (moduleId === 'p10_11_1') return <LabP10ThermalExpansionSolid onExit={handleExit} />;
  if (moduleId === 'p10_11_2') return <LabP10ExpansionLiquids onExit={handleExit} />;
  if (moduleId === 'p10_11_3') return <LabP10GasPressureBalloon onExit={handleExit} />;
  if (moduleId === 'p10_11_4') return <LabP10LatentHeat onExit={handleExit} />;
  
  if (moduleId === 'p10_12_1') return <LabP10WaveMotion onExit={handleExit} />;
  if (moduleId === 'p10_12_2') return <LabP10RippleTank onExit={handleExit} />;
  if (moduleId === 'p10_12_3') return <LabP10RefractionIllusion onExit={handleExit} />;
  if (moduleId === 'p10_13_1') return <LabP10SoundProduction onExit={handleExit} />;
  if (moduleId === 'p10_13_2') return <LabP10SoundMedium onExit={handleExit} />;
  if (moduleId === 'p10_13_3') return <LabP10StringTelephone onExit={handleExit} />;
  if (moduleId === 'p10_13_4') return <LabP10SpeakerProject onExit={handleExit} />;
  if (moduleId === 'p10_14_1') return <LabP10PlaneMirror onExit={handleExit} />;
  if (moduleId === 'p10_14_2') return <LabP10RefractionBlocks onExit={handleExit} />;
  if (moduleId === 'p10_14_3') return <LabP10TotalInternalReflection onExit={handleExit} />;
  
  if (moduleId === 'p10_15_1') return <LabP10ElectrostaticCharges onExit={handleExit} />;
  if (moduleId === 'p10_15_2') return <LabP10Electroscope onExit={handleExit} />;
  if (moduleId === 'p10_16_1') return <LabP10OhmLaw onExit={handleExit} />;
  if (moduleId === 'p10_16_2') return <LabP10SeriesCircuit onExit={handleExit} />;
  if (moduleId === 'p10_16_3') return <LabP10ParallelCircuit onExit={handleExit} />;
  if (moduleId === 'p10_17_1') return <LabP10MagneticField onExit={handleExit} />;
  if (moduleId === 'p10_17_2') return <LabP10ElectromagnetDC onExit={handleExit} />;
  if (moduleId === 'p10_17_3') return <LabP10FaradayLaw onExit={handleExit} />;
  
  if (moduleId === 'p10_18_1') return <LabP10ThermionicEmission onExit={handleExit} />;
  if (moduleId === 'p10_18_2') return <LabP10LogicGates onExit={handleExit} />;
  if (moduleId === 'p10_19_1') return <LabP10RadioTransmission onExit={handleExit} />;
  if (moduleId === 'p10_19_2') return <LabP10OpticalFibers onExit={handleExit} />;
  if (moduleId === 'p10_20_1') return <LabP10Radioactivity onExit={handleExit} />;
  if (moduleId === 'p10_20_2') return <LabP10HalfLife onExit={handleExit} />;

  if (moduleId === 'c10_3_1') return <LabC10DiluteSolution onExit={handleExit} />;
  if (moduleId === 'c10_3_2') return <LabC10StandardizationTitration onExit={handleExit} />;
  if (moduleId === 'c10_6_1') return <LabC10SaltTitration onExit={handleExit} />;
  if (moduleId === 'c10_6_2') return <LabC10SaltExcessMetal onExit={handleExit} />;
  if (moduleId === 'c10_6_3') return <LabC10SaltExcessBase onExit={handleExit} />;
  if (moduleId === 'c10_6_4') return <LabC10SaltExcessCarbonate onExit={handleExit} />;
  if (moduleId === 'c10_7_1') return <LabC10MetalReactivity onExit={handleExit} />;
  if (moduleId === 'c10_9_1') return <LabC10SaturatedUnsaturated onExit={handleExit} />;
  if (moduleId === 'c10_11_1') return <LabC10AceticAcidMetal onExit={handleExit} />;
  if (moduleId === 'c10_11_2') return <LabC10AceticAcidCarbonate onExit={handleExit} />;

  // Class 10 Chemistry Phase 2
  if (moduleId === 'c10_4_1') return <LabC10DownsCell onExit={handleExit} />;
  if (moduleId === 'c10_4_2') return <LabC10MoltenLeadChloride onExit={handleExit} />;
  if (moduleId === 'c10_4_3') return <LabC10AqueousElectrolysis onExit={handleExit} />;
  if (moduleId === 'c10_4_4') return <LabC10CopperRefining onExit={handleExit} />;
  if (moduleId === 'c10_4_5') return <LabC10Electroplating onExit={handleExit} />;
  if (moduleId === 'c10_4_6') return <LabC10DanielCell onExit={handleExit} />;
  if (moduleId === 'c10_4_7') return <LabC10FuelCell onExit={handleExit} />;
  
  if (moduleId === 'c10_5_1') return <LabC10SurfaceAreaRate onExit={handleExit} />;
  if (moduleId === 'c10_5_2') return <LabC10ConcentrationRate onExit={handleExit} />;
  
  if (moduleId === 'c10_8_1') return <LabC10Esterification onExit={handleExit} />;
  
  if (moduleId === 'c10_10_1') return <LabC10EthanolFermentation onExit={handleExit} />;
  if (moduleId === 'c10_10_2') return <LabC10EthanolHydration onExit={handleExit} />;
  if (moduleId === 'c10_10_3') return <LabC10AlcoholCombustion onExit={handleExit} />;
  
  if (moduleId === 'c10_12_1') return <LabC10AdditionPolymerisation onExit={handleExit} />;
  if (moduleId === 'c10_12_2') return <LabC10CondensationPolymerisation onExit={handleExit} />;
  if (moduleId === 'c10_12_3') return <LabC10PETAcidHydrolysis onExit={handleExit} />;
  
  if (moduleId === 'c10_13_1') return <LabC10BiochemicalTest onExit={handleExit} />;

  // Class 10 Computer Science
  if (moduleId === 'cs10_1_1') return <LabCS10NumberSystems onExit={handleExit} />;
  if (moduleId === 'cs10_1_2') return <LabCS10HelloWorld onExit={handleExit} />;
  if (moduleId === 'cs10_2_1') return <LabCS10ComputationalThinking onExit={handleExit} />;
  if (moduleId === 'cs10_3_1') return <LabCS10HTMLCSS onExit={handleExit} />;
  if (moduleId === 'cs10_3_2') return <LabCS10JSAlgorithms onExit={handleExit} />;
  if (moduleId === 'cs10_3_3') return <LabCS10DynamicList onExit={handleExit} />;
  if (moduleId === 'cs10_4_1') return <LabCS10DataVisualization onExit={handleExit} />;
  if (moduleId === 'cs10_4_2') return <LabCS10ChurnPrediction onExit={handleExit} />;
  if (moduleId === 'cs10_5_1') return <LabCS10FutureTech onExit={handleExit} />;
  if (moduleId === 'cs10_6_1') return <LabCS10CyberSafety onExit={handleExit} />;
  if (moduleId === 'cs10_7_1') return <LabCS10DigitalMarketing onExit={handleExit} />;
  if (moduleId === 'cs10_8_1') return <LabCS10MarketResearch onExit={handleExit} />;
  if (moduleId === 'cs10_8_2') return <LabCS10Financials onExit={handleExit} />;
  if (moduleId === 'cs10_8_3') return <LabCS10BusinessPitch onExit={handleExit} />;

  // Class 10 Mathematics
  if (moduleId === 'm10_7_1') return <LabM10Vectors onExit={handleExit} />;
  if (moduleId === 'm10_9_1') return <LabM10ChordBisectors onExit={handleExit} />;
  if (moduleId === 'm10_9_2') return <LabM10EqualChords onExit={handleExit} />;
  if (moduleId === 'm10_10_1') return <LabM10TangentProperties onExit={handleExit} />;
  if (moduleId === 'm10_10_2') return <LabM10CircleAngles onExit={handleExit} />;
  if (moduleId === 'm10_11_1') return <LabM10CircleBasics onExit={handleExit} />;
  if (moduleId === 'm10_11_2') return <LabM10TangentConstruction onExit={handleExit} />;
  if (moduleId === 'm10_11_3') return <LabM10CommonTangents onExit={handleExit} />;
  if (moduleId === 'm10_12_1') return <LabM10StatisticsWheels onExit={handleExit} />;

  // Class 10 Mathematics Phase 2
  if (moduleId === 'm10_app_1') return <LabM10ComplexApplications onExit={handleExit} />;
  if (moduleId === 'm10_app_2') return <LabM10QuadraticApplications onExit={handleExit} />;
  if (moduleId === 'm10_app_3') return <LabM10MatrixApplications onExit={handleExit} />;
  if (moduleId === 'm10_app_4') return <LabM10InequalityApplications onExit={handleExit} />;
  if (moduleId === 'm10_app_5') return <LabM10FractionApplications onExit={handleExit} />;
  if (moduleId === 'm10_app_6') return <LabM10FunctionApplications onExit={handleExit} />;
  if (moduleId === 'm10_app_7') return <LabM10VectorApplications onExit={handleExit} />;
  if (moduleId === 'm10_app_8') return <LabM10TrigApplications onExit={handleExit} />;
  if (moduleId === 'm10_app_9') return <LabM10CircleApplications onExit={handleExit} />;
  if (moduleId === 'm10_app_12') return <LabM10StatsApplications onExit={handleExit} />;

  // Class 10 Biology
  if (moduleId === 'b10_1') return <LabB10DigestiveSystem onExit={handleExit} />;
  if (moduleId === 'b10_2') return <LabB10BloodSmear onExit={handleExit} />;
  if (moduleId === 'b10_3') return <LabB10RespiratorySystem onExit={handleExit} />;
  if (moduleId === 'b10_4') return <LabB10KidneyDissection onExit={handleExit} />;
  if (moduleId === 'b10_5') return <LabB10NervousSystem onExit={handleExit} />;
  if (moduleId === 'b10_7') return <LabB10Genetics onExit={handleExit} />;
  if (moduleId === 'b10_11') return <LabB10Biostatistics onExit={handleExit} />;

  // Class 9 Biology
  if (moduleId === 'b9_1') return <LabB9Biodiversity onExit={handleExit} />;
  if (moduleId === 'b9_3') return <LabB9Microscopy onExit={handleExit} />;
  if (moduleId === 'b9_6') return <LabB9Biochemistry onExit={handleExit} />;
  if (moduleId === 'b9_7') return <LabB9Enzymes onExit={handleExit} />;
  if (moduleId === 'b9_8') return <LabB9PlantPhysiology onExit={handleExit} />;
  if (moduleId === 'b9_9') return <LabB9PlantReproduction onExit={handleExit} />;

  // Class 9 Chemistry
  if (moduleId === 'c9_1') return <LabC9StatesOfMatter onExit={handleExit} />;
  if (moduleId === 'c9_2') return <LabC9AtomicStructure onExit={handleExit} />;
  if (moduleId === 'c9_3') return <LabC9Electrochemistry onExit={handleExit} />;
  if (moduleId === 'c9_4') return <LabC9EnvironmentalChem onExit={handleExit} />;
  if (moduleId === 'c9_5') return <LabC9OrganicChem onExit={handleExit} />;
  if (moduleId === 'c9_6') return <LabC9SeparationTech onExit={handleExit} />;
  if (moduleId === 'c9_7') return <LabC9QualitativeAnalysis onExit={handleExit} />;

  // Class 9 Physics
  if (moduleId === 'p9_1') return <LabP9MeasurementTools onExit={handleExit} />;
  if (moduleId === 'p9_2') return <LabP9VolumeDensity onExit={handleExit} />;
  if (moduleId === 'p9_3') return <LabP9Kinematics onExit={handleExit} />;
  if (moduleId === 'p9_4') return <LabP9Inertia onExit={handleExit} />;
  if (moduleId === 'p9_5') return <LabP9Friction onExit={handleExit} />;
  if (moduleId === 'p9_6') return <LabP9Pressure onExit={handleExit} />;
  if (moduleId === 'p9_7') return <LabP9Springs onExit={handleExit} />;
  if (moduleId === 'p9_8') return <LabP9MagnetismFields onExit={handleExit} />;
  if (moduleId === 'p9_9') return <LabP9MagnetismInduction onExit={handleExit} />;
  if (moduleId === 'p9_10') return <LabP9EverydayPhysics onExit={handleExit} />;

  // Class 9 Computer Science
  if (moduleId === 'cs9_1') return <LabCS9ComputerSystems onExit={handleExit} />;
  if (moduleId === 'cs9_2') return <LabCS9Algorithms onExit={handleExit} />;
  if (moduleId === 'cs9_3') return <LabCS9WebBasics onExit={handleExit} />;
  if (moduleId === 'cs9_4') return <LabCS9JavaScript onExit={handleExit} />;
  if (moduleId === 'cs9_5') return <LabCS9WebProjects onExit={handleExit} />;
  if (moduleId === 'cs9_6') return <LabCS9DataAnalysis onExit={handleExit} />;
  if (moduleId === 'cs9_7') return <LabCS9AIApplications onExit={handleExit} />;
  if (moduleId === 'cs9_8') return <LabCS9CyberSafety onExit={handleExit} />;
  if (moduleId === 'cs9_9') return <LabCS9Entrepreneurship onExit={handleExit} />;

  // Class 9 Mathematics
  if (moduleId === 'm9_1') return <LabM9RealNumbers onExit={handleExit} />;
  if (moduleId === 'm9_2') return <LabM9Logarithms onExit={handleExit} />;
  if (moduleId === 'm9_3') return <LabM9SetsRelations onExit={handleExit} />;
  if (moduleId === 'm9_4') return <LabM9AlgebraicManipulation onExit={handleExit} />;
  if (moduleId === 'm9_5') return <LabM9Trigonometry onExit={handleExit} />;
  if (moduleId === 'm9_6') return <LabM9CoordinateGeometry onExit={handleExit} />;
  if (moduleId === 'm9_7') return <LabM9LinearGraphs onExit={handleExit} />;
  if (moduleId === 'm9_8') return <LabM9GeometryPolygons onExit={handleExit} />;
  if (moduleId === 'm9_9') return <LabM9BasicStatistics onExit={handleExit} />;

  // Class 11 Chemistry
  if (moduleId === 'c11_1') return <LabC11AtomicStructure onExit={handleExit} />;
  if (moduleId === 'c11_2') return <LabC11MolecularBonding onExit={handleExit} />;
  if (moduleId === 'c11_3') return <LabC11Stoichiometry onExit={handleExit} />;
  if (moduleId === 'c11_4') return <LabC11PhasesOfMatter onExit={handleExit} />;
  if (moduleId === 'c11_5') return <LabC11EnergeticsKinetics onExit={handleExit} />;
  if (moduleId === 'c11_6') return <LabC11IndustrialEquilibrium onExit={handleExit} />;
  if (moduleId === 'c11_7') return <LabC11AcidsBases onExit={handleExit} />;
  if (moduleId === 'c11_8') return <LabC11EnvironmentalChem onExit={handleExit} />;
  if (moduleId === 'c11_9') return <LabC11OrganicAnalysis onExit={handleExit} />;
  if (moduleId === 'c11_10') return <LabC11OrganicSynthesis onExit={handleExit} />;

  if (moduleId === 'p11_1') return <LabP11PhysicalQuantities onExit={handleExit} />;
  if (moduleId === 'p11_2') return <LabP11Vectors onExit={handleExit} />;
  if (moduleId === 'p11_3') return <LabP11TranslatoryMotion onExit={handleExit} />;
  if (moduleId === 'p11_4') return <LabP11RotationalMotion onExit={handleExit} />;
  if (moduleId === 'p11_5') return <LabP11WorkEnergy onExit={handleExit} />;
  if (moduleId === 'p11_6') return <LabP11FluidMechanics onExit={handleExit} />;
  if (moduleId === 'p11_7') return <LabP11Solids onExit={handleExit} />;
  if (moduleId === 'p11_8') return <LabP11Thermodynamics onExit={handleExit} />;
  if (moduleId === 'p11_9') return <LabP11Waves onExit={handleExit} />;
  if (moduleId === 'p11_10') return <LabP11Electrostatics onExit={handleExit} />;
  if (moduleId === 'p11_11') return <LabP11Electricity onExit={handleExit} />;
  if (moduleId === 'p11_12') return <LabP11Electromagnetism onExit={handleExit} />;
  if (moduleId === 'p11_13') return <LabP11ModernPhysics onExit={handleExit} />;

  if (moduleId === 'cs11_1') return <LabCS11SystemsNetworks onExit={handleExit} />;
  if (moduleId === 'cs11_2') return <LabCS11Algorithms onExit={handleExit} />;
  if (moduleId === 'cs11_3') return <LabCS11Python onExit={handleExit} />;
  if (moduleId === 'cs11_4') return <LabCS11DataScience onExit={handleExit} />;
  if (moduleId === 'cs11_5') return <LabCS11Applications onExit={handleExit} />;
  if (moduleId === 'cs11_6') return <LabCS11Impacts onExit={handleExit} />;
  if (moduleId === 'cs11_7') return <LabCS11Research onExit={handleExit} />;
  if (moduleId === 'cs11_8') return <LabCS11ProductDev onExit={handleExit} />;

  if (moduleId === 'b11_1') return <LabB11Cytology onExit={handleExit} />;
  if (moduleId === 'b11_2') return <LabB11Biomolecules onExit={handleExit} />;
  if (moduleId === 'b11_3') return <LabB11Enzymes onExit={handleExit} />;
  if (moduleId === 'b11_4') return <LabB11Bioenergetics onExit={handleExit} />;
  if (moduleId === 'b11_5') return <LabB11Microbiology onExit={handleExit} />;
  if (moduleId === 'b11_6') return <LabB11Fungi onExit={handleExit} />;
  if (moduleId === 'b11_7') return <LabB11PlantPhysiology onExit={handleExit} />;
  if (moduleId === 'b11_8') return <LabB11Inheritance onExit={handleExit} />;
  if (moduleId === 'b11_9') return <LabB11Genetics onExit={handleExit} />;

  if (moduleId === 'b12_1') return <LabB12Digestive onExit={handleExit} />;
  if (moduleId === 'b12_2') return <LabB12Cardiorespiratory onExit={handleExit} />;
  if (moduleId === 'b12_3') return <LabB12Urinary onExit={handleExit} />;
  if (moduleId === 'b12_4') return <LabB12NeuroEndocrine onExit={handleExit} />;
  if (moduleId === 'b12_5') return <LabB12Skeletal onExit={handleExit} />;
  if (moduleId === 'b12_6') return <LabB12Immunity onExit={handleExit} />;
  if (moduleId === 'b12_7') return <LabB12Biotechnology onExit={handleExit} />;
  if (moduleId === 'b12_8') return <LabB12StructuralStats onExit={handleExit} />;
  if (moduleId === 'b12_9') return <LabB12PharmacologyEcology onExit={handleExit} />;

  if (moduleId === 'p12_1') return <LabP12Gravitation onExit={handleExit} />;
  if (moduleId === 'p12_2') return <LabP12ThermoMechanics onExit={handleExit} />;
  if (moduleId === 'p12_3') return <LabP12SHM onExit={handleExit} />;
  if (moduleId === 'p12_4') return <LabP12Diffraction onExit={handleExit} />;
  if (moduleId === 'p12_5') return <LabP12ElectricPotential onExit={handleExit} />;
  if (moduleId === 'p12_6') return <LabP12AlternatingCurrent onExit={handleExit} />;
  if (moduleId === 'p12_7') return <LabP12QuantumNuclear onExit={handleExit} />;
  if (moduleId === 'p12_8') return <LabP12CosmologyClimate onExit={handleExit} />;
  if (moduleId === 'p12_9') return <LabP12MedicalImaging onExit={handleExit} />;

  if (moduleId === 'c12_1') return <LabC12Electrochemistry onExit={handleExit} />;
  if (moduleId === 'c12_2') return <LabC12EquilibriumAcidBase onExit={handleExit} />;
  if (moduleId === 'c12_3') return <LabC12TransitionMetals onExit={handleExit} />;
  if (moduleId === 'c12_4') return <LabC12OrganicSynthesis onExit={handleExit} />;
  if (moduleId === 'c12_5') return <LabC12Biochemistry onExit={handleExit} />;
  if (moduleId === 'c12_6') return <LabC12SpectroscopyChromatography onExit={handleExit} />;
  if (moduleId === 'c12_7') return <LabC12Medicine onExit={handleExit} />;
  if (moduleId === 'c12_8') return <LabC12Agriculture onExit={handleExit} />;
  if (moduleId === 'c12_9') return <LabC12IndustryMaterials onExit={handleExit} />;

  if (moduleId === 'cs12_1') return <LabCS12HCI onExit={handleExit} />;
  if (moduleId === 'cs12_2') return <LabCS12DataStructures onExit={handleExit} />;
  if (moduleId === 'cs12_3') return <LabCS12Programming onExit={handleExit} />;
  if (moduleId === 'cs12_4') return <LabCS12MachineLearning onExit={handleExit} />;
  if (moduleId === 'cs12_5') return <LabCS12DeepLearning onExit={handleExit} />;
  if (moduleId === 'cs12_6') return <LabCS12IoTCloud onExit={handleExit} />;
  if (moduleId === 'cs12_7') return <LabCS12Cybersecurity onExit={handleExit} />;
  if (moduleId === 'cs12_8') return <LabCS12DigitalLiteracy onExit={handleExit} />;
  if (moduleId === 'cs12_9') return <LabCS12Entrepreneurship onExit={handleExit} />;

  if (moduleId === 'm11_1') return <LabM11ComplexNumbers onExit={handleExit} />;
  if (moduleId === 'm11_2') return <LabM11Matrices onExit={handleExit} />;
  if (moduleId === 'm11_3') return <LabM11Vectors onExit={handleExit} />;
  if (moduleId === 'm11_4') return <LabM11SequencesSeries onExit={handleExit} />;
  if (moduleId === 'm11_5') return <LabM11Polynomials onExit={handleExit} />;
  if (moduleId === 'm11_6') return <LabM11Trigonometry onExit={handleExit} />;
  if (moduleId === 'm11_7') return <LabM11Permutations onExit={handleExit} />;
  if (moduleId === 'm11_8') return <LabM11BinomialInduction onExit={handleExit} />;

  if (moduleId === 'm12_1') return <LabM12Derivatives onExit={handleExit} />;
  if (moduleId === 'm12_2') return <LabM12Integration onExit={handleExit} />;
  if (moduleId === 'm12_3') return <LabM12DifferentialEq onExit={handleExit} />;
  if (moduleId === 'm12_4') return <LabM12Conics onExit={handleExit} />;
  if (moduleId === 'm12_5') return <LabM12AnalyticalGeometry onExit={handleExit} />;
  if (moduleId === 'm12_6') return <LabM12Kinematics onExit={handleExit} />;
  if (moduleId === 'm12_7') return <LabM12Functions onExit={handleExit} />;
  if (moduleId === 'm12_8') return <LabM12InverseTrig onExit={handleExit} />;

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-50 rounded-2xl border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Module Not Found</h2>
        <p className="text-slate-500 mb-6">The module "{moduleId}" does not exist or is still under construction.</p>
        <button onClick={handleExit} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
          Return to Dashboard
        </button>
      </div>
    </Layout>
  );
}

function HistoryDashboard() {
  const { history } = useHistory();

  return (
    <Layout>
      <div className="flex flex-col min-h-[70vh] bg-slate-50 rounded-3xl border border-slate-200 shadow-sm mt-8 p-12">
        <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800 font-outfit tracking-tight">Lab History</h2>
            <p className="text-slate-500 text-lg">Verified telemetry and performance metrics from your completed labs.</p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Labs Visited Yet</h3>
            <p className="text-slate-500 max-w-sm text-center">Your completed labs and measured results will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((record, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all group bg-gradient-to-b from-white to-slate-50/50">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{record.subject}</span>
                  <span className="text-sm font-medium text-slate-400">{new Date(record.timestamp).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2 leading-tight">{record.title}</h3>
                
                {record.experimentData && Object.keys(record.experimentData).length > 0 && (
                  <div className="mt-4 mb-2 bg-slate-50 rounded-lg p-3 border border-slate-100 shadow-inner">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1">Experiment Data</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(record.experimentData).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <span className="text-[10px] text-slate-500 font-medium truncate">{key}</span>
                          <span className="text-sm font-bold text-slate-700">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Score</span>
                    <span className={`text-2xl font-bold font-outfit ${record.score >= (record.maxScore * 0.8) ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {record.score} <span className="text-sm text-slate-400 font-medium">/ {record.maxScore}</span>
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Time</span>
                    <span className="text-lg font-bold text-slate-600">{Math.floor(record.timeSpentSeconds / 60)}m {record.timeSpentSeconds % 60}s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

function SettingsPanel() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [editName, setEditName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('virtuallab_fontsize') || '16');
  const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem('virtuallab_reduced_motion') === 'true');
  const [storageInfo, setStorageInfo] = useState<{ used: string; total: string } | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'done' | 'error'>('idle');
  const [unsyncedCount, setUnsyncedCount] = useState(0);

  // Font size
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('virtuallab_fontsize', fontSize);
  }, [fontSize]);

  // Reduced motion
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reducedMotion);
    localStorage.setItem('virtuallab_reduced_motion', String(reducedMotion));
  }, [reducedMotion]);

  // Calculate storage usage
  useEffect(() => {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((estimate) => {
        const usedMB = ((estimate.usage || 0) / (1024 * 1024)).toFixed(1);
        const totalMB = ((estimate.quota || 0) / (1024 * 1024)).toFixed(0);
        setStorageInfo({ used: `${usedMB} MB`, total: `${totalMB} MB` });
      });
    }
  }, []);

  // Check unsynced records
  useEffect(() => {
    progressDB.getUnsyncedRecords().then((records) => setUnsyncedCount(records.length));
  }, []);

  const handleSaveName = async () => {
    if (editName.trim() && user) {
      await updateProfile({ name: editName.trim() });
      setIsEditing(false);
    }
  };

  const handleClearAllData = async () => {
    logout();
    // Clear per-user history keys
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('virtuallab_history_') || key === 'virtuallab_user_id') {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem('virtuallab_fontsize');
    localStorage.removeItem('virtuallab_reduced_motion');
    indexedDB.deleteDatabase('VirtualLabDB');
    indexedDB.deleteDatabase('VirtualLabStudents');
    setTimeout(() => window.location.reload(), 200);
  };

  const handleClearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const name of cacheNames) {
        await caches.delete(name);
      }
    }
    setTimeout(() => window.location.reload(), 200);
  };

  const handleSyncNow = async () => {
    setSyncStatus('syncing');
    try {
      await syncService.syncAllUnsynced();
      setSyncStatus('done');
      const records = await progressDB.getUnsyncedRecords();
      setUnsyncedCount(records.length);
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-slate-800 font-outfit tracking-tight">Settings</h1>

        {/* Profile & Account */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Profile & Account
          </h2>
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                      />
                      <button onClick={handleSaveName} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">Save</button>
                      <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-slate-800 font-semibold">{user.name}</span>
                      <button onClick={() => { setEditName(user.name); setIsEditing(true); }} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Edit</button>
                    </div>
                  )}
                  <p className="text-xs text-slate-400 mt-1">{user.email}</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Class</span>
                    <p className="text-sm font-semibold text-slate-700">Class {user.classLevel}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Section</span>
                    <p className="text-sm font-semibold text-slate-700">{user.section}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="w-full px-4 py-3 bg-rose-50 text-rose-600 font-semibold rounded-xl hover:bg-rose-100 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Sign Out
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-slate-500 mb-3">You are not signed in.</p>
              <button onClick={() => navigate('/login')} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm">Log In</button>
            </div>
          )}
        </div>

        {/* Appearance */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Theme</span>
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setTheme('light')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${theme === 'light' ? 'bg-slate-50 text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >☀️ Light</button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${theme === 'dark' ? 'bg-slate-50 text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >🌙 Dark</button>
            </div>
          </div>
        </div>

        {/* Storage & Cache */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
            Storage & Cache
          </h2>
          <div className="space-y-4">
            {storageInfo && (
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Local Storage Used</span>
                  <span className="font-semibold text-slate-800">{storageInfo.used} / {storageInfo.total}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${Math.min((parseFloat(storageInfo.used) / parseFloat(storageInfo.total)) * 100, 100)}%` }}></div>
                </div>
              </div>
            )}
            <button
              onClick={handleClearCache}
              className="w-full px-4 py-3 bg-amber-50 text-amber-700 font-semibold rounded-xl hover:bg-amber-100 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Clear Cached Labs
            </button>
            <button
              onClick={handleClearAllData}
              className="w-full px-4 py-3 bg-rose-50 text-rose-600 font-semibold rounded-xl hover:bg-rose-100 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              Clear All Data & Reset
            </button>
          </div>
        </div>

        {/* Sync Status */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Sync Status
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">Pending Records</p>
                <p className="text-xs text-slate-500">{unsyncedCount} experiment{unsyncedCount !== 1 ? 's' : ''} waiting to sync</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${unsyncedCount > 0 ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
            </div>
            <button
              onClick={handleSyncNow}
              disabled={syncStatus === 'syncing' || unsyncedCount === 0}
              className={`w-full px-4 py-3 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors ${
                syncStatus === 'syncing' ? 'bg-blue-100 text-blue-600 cursor-wait' :
                syncStatus === 'done' ? 'bg-emerald-100 text-emerald-700' :
                syncStatus === 'error' ? 'bg-rose-100 text-rose-600' :
                unsyncedCount === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'done' ? '✓ Synced!' : syncStatus === 'error' ? '✗ Sync Failed' : 'Sync Now'}
            </button>
          </div>
        </div>

        {/* Accessibility */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            Accessibility
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Font Size</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setFontSize(String(Math.max(12, parseInt(fontSize) - 2)))} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors text-sm">A-</button>
                <span className="text-sm font-semibold text-slate-800 w-12 text-center">{fontSize}px</span>
                <button onClick={() => setFontSize(String(Math.min(24, parseInt(fontSize) + 2)))} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors text-sm">A+</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Reduce Animations</span>
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`relative w-12 h-6 rounded-full transition-colors ${reducedMotion ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-slate-50 rounded-full shadow transition-transform ${reducedMotion ? 'translate-x-6' : ''}`}></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function LabRunner() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-500 font-medium">Loading lab...</p>
        </div>
      </Layout>
    }>
      <LabRunnerInner />
    </Suspense>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, isLoaded, navigate]);

  if (!isLoaded) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-500 font-medium">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!user) return null;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ClassSelection />} />
      <Route path="/login" element={<Login />} />
      <Route path="/progress" element={<ProtectedRoute><HistoryDashboard /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><HistoryDashboard /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPanel /></ProtectedRoute>} />
      <Route path="/class/:classId" element={<SubjectSelection />} />
      <Route path="/class/:classId/:subjectId" element={<ModuleSelection />} />
      <Route path="/class/:classId/:subjectId/lab/:moduleId" element={<LabRunner />} />
    </Routes>
  );
}
