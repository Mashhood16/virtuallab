import { useState, useRef, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { Search, Microscope, Atom, Calculator, Laptop, Activity, BookOpen, Dna } from 'lucide-react';
import Layout from './components/Layout';

// Class 8 Computer Additions
import LabDataComm from './components/LabDataComm';
import LabNetworkDevices from './components/LabNetworkDevices';
import LabCricketSpreadsheet from './components/LabCricketSpreadsheet';
import LabDataWorksheets from './components/LabDataWorksheets';
import LabPseudocodeInterpreter from './components/LabPseudocodeInterpreter';
import LabDiceGameAlgorithm from './components/LabDiceGameAlgorithm';
import LabScratchMaze from './components/LabScratchMaze';
import LabCyberScout from './components/LabCyberScout';
import LabAntivirus from './components/LabAntivirus';
import LabBusinessPlan from './components/LabBusinessPlan';
import LabDigitalMarketing from './components/LabDigitalMarketing';

// Class 7 Computer Additions
import LabC7Hardware from './components/LabC7Hardware';
import LabC7EmergingTech from './components/LabC7EmergingTech';
import LabC7Generations from './components/LabC7Generations';
import LabC7NetworkDiagram from './components/LabC7NetworkDiagram';
import LabC7UrduTyping from './components/LabC7UrduTyping';
import LabC7LetterFormat from './components/LabC7LetterFormat';
import LabC7CVCreation from './components/LabC7CVCreation';
import LabC7IllustratedStory from './components/LabC7IllustratedStory';
import LabC7PowerPointGeometry from './components/LabC7PowerPointGeometry';
import LabC7WondersResearch from './components/LabC7WondersResearch';
import LabC7ConditionalLogic from './components/LabC7ConditionalLogic';
import LabC7GradingFlowchart from './components/LabC7GradingFlowchart';
import LabC7ReverseFlowchart from './components/LabC7ReverseFlowchart';
import LabC7SpriteManipulation from './components/LabC7SpriteManipulation';
import LabC7LoopAdjustments from './components/LabC7LoopAdjustments';
import LabC7BouncingBall from './components/LabC7BouncingBall';
import LabC7AnimatedDialogue from './components/LabC7AnimatedDialogue';
import LabC7InteractivePiano from './components/LabC7InteractivePiano';
import LabC7Cybercrime from './components/LabC7Cybercrime';
import LabC7DevianceDiscussion from './components/LabC7DevianceDiscussion';
import LabC7EthicsChart from './components/LabC7EthicsChart';
import LabC7DesignPrototype from './components/LabC7DesignPrototype';
import LabC7MothersDay from './components/LabC7MothersDay';

// Class 6 Computer Additions
import LabC6HealthCampaign from './components/LabC6HealthCampaign';
import LabC6HardwareCharts from './components/LabC6HardwareCharts';
import LabC6LabRules from './components/LabC6LabRules';
import LabC6GroupPresentations from './components/LabC6GroupPresentations';
import LabC6SystemSoftware from './components/LabC6SystemSoftware';
import LabC6FileManagement1 from './components/LabC6FileManagement1';
import LabC6FileManagement2 from './components/LabC6FileManagement2';
import LabC6DietExercise from './components/LabC6DietExercise';
import LabC6Paint3DFace from './components/LabC6Paint3DFace';
import LabC6SolarSystem from './components/LabC6SolarSystem';
import LabC6ProblemDecomposition from './components/LabC6ProblemDecomposition';
import LabC6RoadSafetyProcess from './components/LabC6RoadSafetyProcess';
import LabC6CoordinateExp from './components/LabC6CoordinateExp';
import LabC6CostumeChange from './components/LabC6CostumeChange';
import LabC6MovementTracking from './components/LabC6MovementTracking';
import LabC6LoopAdjustments from './components/LabC6LoopAdjustments';
import LabC6EthicsChart from './components/LabC6EthicsChart';
import LabC6CyberScout from './components/LabC6CyberScout';
import LabC6PosterCompetition from './components/LabC6PosterCompetition';
import LabC6HobbyMonetization from './components/LabC6HobbyMonetization';

// Class 8 Science Additions
import LabS8GreenhouseEffect from './components/LabS8GreenhouseEffect';
import LabS8StimulusResponse from './components/LabS8StimulusResponse';
import LabS8KneeJerk from './components/LabS8KneeJerk';
import LabS8ReflexTime from './components/LabS8ReflexTime';
import LabS8DNAExtraction from './components/LabS8DNAExtraction';
import LabS8HumanVariations from './components/LabS8HumanVariations';
import LabS8CrossingOver from './components/LabS8CrossingOver';
import LabS8MakingYogurt from './components/LabS8MakingYogurt';
import LabS8PeriodicTable from './components/LabS8PeriodicTable';
import LabS8ElectronicConfig from './components/LabS8ElectronicConfig';
import LabS8Malleability from './components/LabS8Malleability';
import LabS8Flexibility from './components/LabS8Flexibility';
import LabS8Density from './components/LabS8Density';
import LabS8ThermalConductivity from './components/LabS8ThermalConductivity';
import LabS8Sonorous from './components/LabS8Sonorous';
import LabS8ChemicalReactionSigns from './components/LabS8ChemicalReactionSigns';
import LabS8ConservationMass from './components/LabS8ConservationMass';
import LabS8Endothermic from './components/LabS8Endothermic';
import LabS8Exothermic from './components/LabS8Exothermic';
import LabS8AcidLitmus from './components/LabS8AcidLitmus';
import LabS8AlkaliLitmus from './components/LabS8AlkaliLitmus';
import LabS8Neutralization from './components/LabS8Neutralization';
import LabS8DeterminingPH from './components/LabS8DeterminingPH';
import LabS8NailPressure from './components/LabS8NailPressure';
import LabS8HydraulicElevator from './components/LabS8HydraulicElevator';
import LabS8WaterRocket from './components/LabS8WaterRocket';

// Batch 4
import LabS8LaserMaze from './components/LabS8LaserMaze';
import LabS8Periscope from './components/LabS8Periscope';
import LabS8RefractionPencil from './components/LabS8RefractionPencil';
import LabS8ConcaveMirror from './components/LabS8ConcaveMirror';
import LabS8ConvexMirror from './components/LabS8ConvexMirror';
import LabS8Electromagnet from './components/LabS8Electromagnet';
import LabS8Toothpaste from './components/LabS8Toothpaste';
import LabS8SoapMaking from './components/LabS8SoapMaking';
import LabS8MilkPlastic from './components/LabS8MilkPlastic';
import LabS8Detergent from './components/LabS8Detergent';
import LabS8SolarCooker from './components/LabS8SolarCooker';
import LabS8WindTurbine from './components/LabS8WindTurbine';
import LabS8ChemicalCar from './components/LabS8ChemicalCar';
import LabS8Windsock from './components/LabS8Windsock';
import LabS8SkyMap from './components/LabS8SkyMap';

// Class 7 Science Additions
import LabS7XylemTransport from './components/LabS7XylemTransport';
import LabS7TranspirationObservation from './components/LabS7TranspirationObservation';
import LabS7TranspirationLeaves from './components/LabS7TranspirationLeaves';
import LabS7MineralsPlantGrowth from './components/LabS7MineralsPlantGrowth';
import LabS7Unit1Projects from './components/LabS7Unit1Projects';
import LabS7MeasuringLungCapacity from './components/LabS7MeasuringLungCapacity';
import LabS7PulseRateExercise from './components/LabS7PulseRateExercise';
import LabS7Unit2Projects from './components/LabS7Unit2Projects';
import LabS7ImmuneSystemRolePlay from './components/LabS7ImmuneSystemRolePlay';
import LabS7Unit3Projects from './components/LabS7Unit3Projects';
import LabS7ChemicalChange from './components/LabS7ChemicalChange';
import LabS7ThermalConduction from './components/LabS7ThermalConduction';
import LabS7Unit4Projects from './components/LabS7Unit4Projects';
import LabS7CalculatingSubatomicParticles from './components/LabS7CalculatingSubatomicParticles';
import LabS7AtomModel from './components/LabS7AtomModel';
import LabS7LithiumBonding from './components/LabS7LithiumBonding';
import LabS7DiluteConcentratedSolutions from './components/LabS7DiluteConcentratedSolutions';
import LabS7CleaningCoins from './components/LabS7CleaningCoins';
import LabS7MakingRockCandy from './components/LabS7MakingRockCandy';
import LabS7OilPollutants from './components/LabS7OilPollutants';
import LabS7BalloonRocket from './components/LabS7BalloonRocket';
import LabS7Unit8Projects from './components/LabS7Unit8Projects';
import LabS7VibratingLengthPitch from './components/LabS7VibratingLengthPitch';
import LabS7Unit9Projects from './components/LabS7Unit9Projects';
import LabS7Unit10Projects from './components/LabS7Unit10Projects';
import LabS7DripIrrigation from './components/LabS7DripIrrigation';
import LabS7MakeStethoscope from './components/LabS7MakeStethoscope';
import LabS7HandSanitizer from './components/LabS7HandSanitizer';
import LabS7Unit11Projects from './components/LabS7Unit11Projects';
import LabS7EarthSeasons from './components/LabS7EarthSeasons';

// Class 10 Physics Additions
import LabP10ThermionicEmission from './components/LabP10ThermionicEmission';
import LabP10LogicGates from './components/LabP10LogicGates';
import LabP10RadioTransmission from './components/LabP10RadioTransmission';
import LabP10OpticalFibers from './components/LabP10OpticalFibers';
import LabP10Radioactivity from './components/LabP10Radioactivity';
import LabP10HalfLife from './components/LabP10HalfLife';

import LabP10ElectrostaticCharges from './components/LabP10ElectrostaticCharges';
import LabP10Electroscope from './components/LabP10Electroscope';
import LabP10OhmLaw from './components/LabP10OhmLaw';
import LabP10SeriesCircuit from './components/LabP10SeriesCircuit';
import LabP10ParallelCircuit from './components/LabP10ParallelCircuit';
import LabP10MagneticField from './components/LabP10MagneticField';
import LabP10ElectromagnetDC from './components/LabP10ElectromagnetDC';
import LabP10FaradayLaw from './components/LabP10FaradayLaw';

import LabP10WaveMotion from './components/LabP10WaveMotion';
import LabP10RippleTank from './components/LabP10RippleTank';
import LabP10RefractionIllusion from './components/LabP10RefractionIllusion';
import LabP10SoundProduction from './components/LabP10SoundProduction';
import LabP10SoundMedium from './components/LabP10SoundMedium';
import LabP10StringTelephone from './components/LabP10StringTelephone';
import LabP10SpeakerProject from './components/LabP10SpeakerProject';
import LabP10PlaneMirror from './components/LabP10PlaneMirror';
import LabP10RefractionBlocks from './components/LabP10RefractionBlocks';
import LabP10TotalInternalReflection from './components/LabP10TotalInternalReflection';

import LabP10CarbonFootprint from './components/LabP10CarbonFootprint';
import LabP10SpecificHeatMixture from './components/LabP10SpecificHeatMixture';
import LabP10SpecificHeatElectrical from './components/LabP10SpecificHeatElectrical';
import LabP10ThermalConduction from './components/LabP10ThermalConduction';
import LabP10ConvectionCurrents from './components/LabP10ConvectionCurrents';
import LabP10InsulatingMaterials from './components/LabP10InsulatingMaterials';
import LabP10AbsorbersReflectors from './components/LabP10AbsorbersReflectors';
import LabP10LeslieCube from './components/LabP10LeslieCube';
import LabP10ThermalExpansionSolid from './components/LabP10ThermalExpansionSolid';
import LabP10ExpansionLiquids from './components/LabP10ExpansionLiquids';
import LabP10GasPressureBalloon from './components/LabP10GasPressureBalloon';
import LabP10LatentHeat from './components/LabP10LatentHeat';

// Class 10 Chemistry Additions
import LabC10DiluteSolution from './components/LabC10DiluteSolution';
import LabC10StandardizationTitration from './components/LabC10StandardizationTitration';
import LabC10SaltTitration from './components/LabC10SaltTitration';
import LabC10SaltExcessMetal from './components/LabC10SaltExcessMetal';
import LabC10SaltExcessBase from './components/LabC10SaltExcessBase';
import LabC10SaltExcessCarbonate from './components/LabC10SaltExcessCarbonate';
import LabC10MetalReactivity from './components/LabC10MetalReactivity';
import LabC10SaturatedUnsaturated from './components/LabC10SaturatedUnsaturated';
import LabC10AceticAcidMetal from './components/LabC10AceticAcidMetal';
import LabC10AceticAcidCarbonate from './components/LabC10AceticAcidCarbonate';

// Class 10 Chemistry Phase 2 Additions
import LabC10DownsCell from './components/LabC10DownsCell';
import LabC10MoltenLeadChloride from './components/LabC10MoltenLeadChloride';
import LabC10AqueousElectrolysis from './components/LabC10AqueousElectrolysis';
import LabC10CopperRefining from './components/LabC10CopperRefining';
import LabC10Electroplating from './components/LabC10Electroplating';
import LabC10DanielCell from './components/LabC10DanielCell';
import LabC10FuelCell from './components/LabC10FuelCell';
import LabC10SurfaceAreaRate from './components/LabC10SurfaceAreaRate';
import LabC10ConcentrationRate from './components/LabC10ConcentrationRate';
import LabC10Esterification from './components/LabC10Esterification';
import LabC10EthanolFermentation from './components/LabC10EthanolFermentation';
import LabC10EthanolHydration from './components/LabC10EthanolHydration';
import LabC10AlcoholCombustion from './components/LabC10AlcoholCombustion';
import LabC10AdditionPolymerisation from './components/LabC10AdditionPolymerisation';
import LabC10CondensationPolymerisation from './components/LabC10CondensationPolymerisation';
import LabC10PETAcidHydrolysis from './components/LabC10PETAcidHydrolysis';
import LabC10BiochemicalTest from './components/LabC10BiochemicalTest';

// Class 10 Computer Science Additions
import LabCS10NumberSystems from './components/LabCS10NumberSystems';
import LabCS10HelloWorld from './components/LabCS10HelloWorld';
import LabCS10ComputationalThinking from './components/LabCS10ComputationalThinking';
import LabCS10HTMLCSS from './components/LabCS10HTMLCSS';
import LabCS10JSAlgorithms from './components/LabCS10JSAlgorithms';
import LabCS10DynamicList from './components/LabCS10DynamicList';
import LabCS10DataVisualization from './components/LabCS10DataVisualization';
import LabCS10ChurnPrediction from './components/LabCS10ChurnPrediction';
import LabCS10FutureTech from './components/LabCS10FutureTech';
import LabCS10CyberSafety from './components/LabCS10CyberSafety';
import LabCS10DigitalMarketing from './components/LabCS10DigitalMarketing';
import LabCS10MarketResearch from './components/LabCS10MarketResearch';
import LabCS10Financials from './components/LabCS10Financials';
import LabCS10BusinessPitch from './components/LabCS10BusinessPitch';

// Class 10 Mathematics Additions
import LabM10Vectors from './components/LabM10Vectors';
import LabM10ChordBisectors from './components/LabM10ChordBisectors';
import LabM10EqualChords from './components/LabM10EqualChords';
import LabM10TangentProperties from './components/LabM10TangentProperties';
import LabM10CircleAngles from './components/LabM10CircleAngles';
import LabM10CircleBasics from './components/LabM10CircleBasics';
import LabM10TangentConstruction from './components/LabM10TangentConstruction';
import LabM10CommonTangents from './components/LabM10CommonTangents';
import LabM10StatisticsWheels from './components/LabM10StatisticsWheels';

// Class 10 Mathematics Phase 2 Additions
import LabM10ComplexApplications from './components/LabM10ComplexApplications';
import LabM10QuadraticApplications from './components/LabM10QuadraticApplications';
import LabM10MatrixApplications from './components/LabM10MatrixApplications';
import LabM10InequalityApplications from './components/LabM10InequalityApplications';
import LabM10FractionApplications from './components/LabM10FractionApplications';
import LabM10FunctionApplications from './components/LabM10FunctionApplications';
import LabM10VectorApplications from './components/LabM10VectorApplications';
import LabM10TrigApplications from './components/LabM10TrigApplications';
import LabM10CircleApplications from './components/LabM10CircleApplications';
import LabM10StatsApplications from './components/LabM10StatsApplications';

// Class 10 Biology Additions
import LabB10DigestiveSystem from './components/LabB10DigestiveSystem';
import LabB10BloodSmear from './components/LabB10BloodSmear';
import LabB10RespiratorySystem from './components/LabB10RespiratorySystem';
import LabB10KidneyDissection from './components/LabB10KidneyDissection';
import LabB10NervousSystem from './components/LabB10NervousSystem';
import LabB10Genetics from './components/LabB10Genetics';
import LabB10Biostatistics from './components/LabB10Biostatistics';

// Class 9 Biology Additions
import LabB9Biodiversity from './components/LabB9Biodiversity';
import LabB9Microscopy from './components/LabB9Microscopy';
import LabB9Biochemistry from './components/LabB9Biochemistry';
import LabB9Enzymes from './components/LabB9Enzymes';
import LabB9PlantPhysiology from './components/LabB9PlantPhysiology';
import LabB9PlantReproduction from './components/LabB9PlantReproduction';

// Class 9 Chemistry Additions
import LabC9StatesOfMatter from './components/LabC9StatesOfMatter';
import LabC9AtomicStructure from './components/LabC9AtomicStructure';
import LabC9Electrochemistry from './components/LabC9Electrochemistry';
import LabC9EnvironmentalChem from './components/LabC9EnvironmentalChem';
import LabC9OrganicChem from './components/LabC9OrganicChem';
import LabC9SeparationTech from './components/LabC9SeparationTech';
import LabC9QualitativeAnalysis from './components/LabC9QualitativeAnalysis';

// Class 9 Physics Additions
import LabP9MeasurementTools from './components/LabP9MeasurementTools';
import LabP9VolumeDensity from './components/LabP9VolumeDensity';
import LabP9Kinematics from './components/LabP9Kinematics';
import LabP9Inertia from './components/LabP9Inertia';
import LabP9Friction from './components/LabP9Friction';
import LabP9Pressure from './components/LabP9Pressure';
import LabP9Springs from './components/LabP9Springs';
import LabP9MagnetismFields from './components/LabP9MagnetismFields';
import LabP9MagnetismInduction from './components/LabP9MagnetismInduction';
import LabP9EverydayPhysics from './components/LabP9EverydayPhysics';

// Class 9 Computer Science Additions
import LabCS9ComputerSystems from './components/LabCS9ComputerSystems';
import LabCS9Algorithms from './components/LabCS9Algorithms';
import LabCS9WebBasics from './components/LabCS9WebBasics';
import LabCS9JavaScript from './components/LabCS9JavaScript';
import LabCS9WebProjects from './components/LabCS9WebProjects';
import LabCS9DataAnalysis from './components/LabCS9DataAnalysis';
import LabCS9AIApplications from './components/LabCS9AIApplications';
import LabCS9CyberSafety from './components/LabCS9CyberSafety';
import LabCS9Entrepreneurship from './components/LabCS9Entrepreneurship';

// Class 9 Mathematics Additions
import LabM9RealNumbers from './components/LabM9RealNumbers';
import LabM9Logarithms from './components/LabM9Logarithms';
import LabM9SetsRelations from './components/LabM9SetsRelations';
import LabM9AlgebraicManipulation from './components/LabM9AlgebraicManipulation';
import LabM9Trigonometry from './components/LabM9Trigonometry';
import LabM9CoordinateGeometry from './components/LabM9CoordinateGeometry';
import LabM9LinearGraphs from './components/LabM9LinearGraphs';
import LabM9GeometryPolygons from './components/LabM9GeometryPolygons';
import LabM9BasicStatistics from './components/LabM9BasicStatistics';

// Class 11 Chemistry Additions
import LabC11AtomicStructure from './components/LabC11AtomicStructure';
import LabC11MolecularBonding from './components/LabC11MolecularBonding';
import LabC11Stoichiometry from './components/LabC11Stoichiometry';
import LabC11PhasesOfMatter from './components/LabC11PhasesOfMatter';
import LabC11EnergeticsKinetics from './components/LabC11EnergeticsKinetics';
import LabC11IndustrialEquilibrium from './components/LabC11IndustrialEquilibrium';
import LabC11AcidsBases from './components/LabC11AcidsBases';
import LabC11EnvironmentalChem from './components/LabC11EnvironmentalChem';
import LabC11OrganicAnalysis from './components/LabC11OrganicAnalysis';
import LabC11OrganicSynthesis from './components/LabC11OrganicSynthesis';

// Class 11 Physics Additions
import LabP11PhysicalQuantities from './components/LabP11PhysicalQuantities';
import LabP11Vectors from './components/LabP11Vectors';
import LabP11TranslatoryMotion from './components/LabP11TranslatoryMotion';
import LabP11RotationalMotion from './components/LabP11RotationalMotion';
import LabP11WorkEnergy from './components/LabP11WorkEnergy';
import LabP11FluidMechanics from './components/LabP11FluidMechanics';
import LabP11Solids from './components/LabP11Solids';
import LabP11Thermodynamics from './components/LabP11Thermodynamics';
import LabP11Waves from './components/LabP11Waves';
import LabP11Electrostatics from './components/LabP11Electrostatics';
import LabP11Electricity from './components/LabP11Electricity';
import LabP11Electromagnetism from './components/LabP11Electromagnetism';
import LabP11ModernPhysics from './components/LabP11ModernPhysics';

// Class 11 Computer Science Additions
import LabCS11SystemsNetworks from './components/LabCS11SystemsNetworks';
import LabCS11Algorithms from './components/LabCS11Algorithms';
import LabCS11Python from './components/LabCS11Python';
import LabCS11DataScience from './components/LabCS11DataScience';
import LabCS11Applications from './components/LabCS11Applications';
import LabCS11Impacts from './components/LabCS11Impacts';
import LabCS11Research from './components/LabCS11Research';
import LabCS11ProductDev from './components/LabCS11ProductDev';

// Class 11 Biology Additions
import LabB11Cytology from './components/LabB11Cytology';
import LabB11Biomolecules from './components/LabB11Biomolecules';
import LabB11Enzymes from './components/LabB11Enzymes';
import LabB11Bioenergetics from './components/LabB11Bioenergetics';
import LabB11Microbiology from './components/LabB11Microbiology';
import LabB11Fungi from './components/LabB11Fungi';
import LabB11PlantPhysiology from './components/LabB11PlantPhysiology';
import LabB11Inheritance from './components/LabB11Inheritance';
import LabB11Genetics from './components/LabB11Genetics';

// Class 12 Biology Additions
import LabB12Digestive from './components/LabB12Digestive';
import LabB12Cardiorespiratory from './components/LabB12Cardiorespiratory';
import LabB12Urinary from './components/LabB12Urinary';
import LabB12NeuroEndocrine from './components/LabB12NeuroEndocrine';
import LabB12Skeletal from './components/LabB12Skeletal';
import LabB12Immunity from './components/LabB12Immunity';
import LabB12Biotechnology from './components/LabB12Biotechnology';
import Login from './components/Login';
import { useHistory } from './store';
import LabB12StructuralStats from './components/LabB12StructuralStats';
import LabB12PharmacologyEcology from './components/LabB12PharmacologyEcology';

// Class 12 Physics Additions
import LabP12Gravitation from './components/LabP12Gravitation';
import LabP12ThermoMechanics from './components/LabP12ThermoMechanics';
import LabP12SHM from './components/LabP12SHM';
import LabP12Diffraction from './components/LabP12Diffraction';
import LabP12ElectricPotential from './components/LabP12ElectricPotential';
import LabP12AlternatingCurrent from './components/LabP12AlternatingCurrent';
import LabP12QuantumNuclear from './components/LabP12QuantumNuclear';
import LabP12CosmologyClimate from './components/LabP12CosmologyClimate';
import LabP12MedicalImaging from './components/LabP12MedicalImaging';

// Class 12 Chemistry Additions
import LabC12Electrochemistry from './components/LabC12Electrochemistry';
import LabC12EquilibriumAcidBase from './components/LabC12EquilibriumAcidBase';
import LabC12TransitionMetals from './components/LabC12TransitionMetals';
import LabC12OrganicSynthesis from './components/LabC12OrganicSynthesis';
import LabC12Biochemistry from './components/LabC12Biochemistry';
import LabC12SpectroscopyChromatography from './components/LabC12SpectroscopyChromatography';
import LabC12Medicine from './components/LabC12Medicine';
import LabC12Agriculture from './components/LabC12Agriculture';
import LabC12IndustryMaterials from './components/LabC12IndustryMaterials';

// Class 12 CS Additions
import LabCS12HCI from './components/LabCS12HCI';
import LabCS12DataStructures from './components/LabCS12DataStructures';
import LabCS12Programming from './components/LabCS12Programming';
import LabCS12MachineLearning from './components/LabCS12MachineLearning';
import LabCS12DeepLearning from './components/LabCS12DeepLearning';
import LabCS12IoTCloud from './components/LabCS12IoTCloud';
import LabCS12Cybersecurity from './components/LabCS12Cybersecurity';
import LabCS12DigitalLiteracy from './components/LabCS12DigitalLiteracy';
import LabCS12Entrepreneurship from './components/LabCS12Entrepreneurship';

// Class 11 Mathematics Additions
import LabM11ComplexNumbers from './components/LabM11ComplexNumbers';
import LabM11Matrices from './components/LabM11Matrices';
import LabM11Vectors from './components/LabM11Vectors';
import LabM11SequencesSeries from './components/LabM11SequencesSeries';
import LabM11Polynomials from './components/LabM11Polynomials';
import LabM11Trigonometry from './components/LabM11Trigonometry';
import LabM11Permutations from './components/LabM11Permutations';
import LabM11BinomialInduction from './components/LabM11BinomialInduction';

// Class 12 Mathematics Additions
import LabM12Derivatives from './components/LabM12Derivatives';
import LabM12Integration from './components/LabM12Integration';
import LabM12DifferentialEq from './components/LabM12DifferentialEq';
import LabM12Conics from './components/LabM12Conics';
import LabM12AnalyticalGeometry from './components/LabM12AnalyticalGeometry';
import LabM12Kinematics from './components/LabM12Kinematics';
import LabM12Functions from './components/LabM12Functions';
import LabM12InverseTrig from './components/LabM12InverseTrig';

// Class 6 Science Additions
import LabS6Microscope from './components/LabS6Microscope';
import LabS6Unit1Projects from './components/LabS6Unit1Projects';
import LabS6VegetativePropagation from './components/LabS6VegetativePropagation';
import LabS6FatDetection from './components/LabS6FatDetection';
import LabS6BalancedDiet from './components/LabS6BalancedDiet';
import LabS6DigestionMechanics from './components/LabS6DigestionMechanics';
import LabS6AlimentaryCanal from './components/LabS6AlimentaryCanal';
import LabS6LungModel from './components/LabS6LungModel';
import LabS6ParticleSimulation from './components/LabS6ParticleSimulation';
import LabS6MolecularBuilder from './components/LabS6MolecularBuilder';
import LabS6ElementsCompounds from './components/LabS6ElementsCompounds';
import LabS6Separation from './components/LabS6Separation';
import LabS6SolutionInvestigation from './components/LabS6SolutionInvestigation';
import LabS6EnergyTransformation from './components/LabS6EnergyTransformation';
import LabS6EnergyProjects from './components/LabS6EnergyProjects';
import LabS6CircuitBuilder from './components/LabS6CircuitBuilder';
import LabS6ConductorsInsulators from './components/LabS6ConductorsInsulators';
import LabS6Magnetism from './components/LabS6Magnetism';
import LabS6PlantGrowth from './components/LabS6PlantGrowth';
import LabS6SolarSystemBuilder from './components/LabS6SolarSystemBuilder';
import LabS6EverydayTech from './components/LabS6EverydayTech';

const LAB_MODULES = [
  // Class 8 Computer
  { id: 'c8c_1_1', classLevel: '8', subject: 'computer', title: 'Act 1.1: Data Comm Model', desc: 'Assemble the components of the communication cycle.', built: true, bg: 'from-blue-500 to-indigo-600' },
  { id: 'c8c_1_2', classLevel: '8', subject: 'computer', title: 'Act 1.2: Network Devices', desc: 'Identify devices and configure the server rack.', built: true, bg: 'from-sky-500 to-blue-700' },
  { id: 'c8c_2_1', classLevel: '8', subject: 'computer', title: 'Act 2.1: Cricket Spreadsheets', desc: 'Use Excel functions to calculate cricket scores.', built: true, bg: 'from-emerald-500 to-green-700' },
  { id: 'c8c_2_2', classLevel: '8', subject: 'computer', title: 'Act 2.2: Worksheet Charts', desc: 'Prepare data and draw corresponding charts for 3 scenarios.', built: true, bg: 'from-green-500 to-teal-600' },
  { id: 'c8c_3_1', classLevel: '8', subject: 'computer', title: 'Act 3.1: Pseudocode', desc: 'Build algorithms using conditionals to solve logical problems.', built: true, bg: 'from-slate-700 to-slate-900' },
  { id: 'c8c_3_2', classLevel: '8', subject: 'computer', title: 'Act 3.2: Dice Algorithm', desc: 'Implement and execute a turn-based loop with conditional rules.', built: true, bg: 'from-indigo-800 to-purple-900' },
  { id: 'c8c_4_1', classLevel: '8', subject: 'computer', title: 'Act 4.1: Scratch Maze', desc: 'Arrange code blocks to navigate the cat over the pond.', built: true, bg: 'from-orange-500 to-red-600' },
  { id: 'c8c_5_1', classLevel: '8', subject: 'computer', title: 'Act 5.1: Cyber Scout', desc: 'Practice filling out secure online forms on the NR3C portal.', built: true, bg: 'from-sky-600 to-blue-800' },
  { id: 'c8c_5_2', classLevel: '8', subject: 'computer', title: 'Act 5.2: Malware Protection', desc: 'Install an antivirus and run a system scan to remove threats.', built: true, bg: 'from-red-600 to-rose-800' },
  { id: 'c8c_6_1', classLevel: '8', subject: 'computer', title: 'Act 6.1: Business Plan', desc: 'Draft your startup pitch deck and present it to partners.', built: true, bg: 'from-purple-600 to-fuchsia-700' },
  { id: 'c8c_6_2', classLevel: '8', subject: 'computer', title: 'Act 6.2: Digital Marketing', desc: 'Promote PIA incentives via digital channels.', built: true, bg: 'from-emerald-600 to-teal-800' },
  // Class 8 Science
  { id: 'c8s_1_1', classLevel: '8', subject: 'science', title: 'Act 1.1: Greenhouse Effect', desc: 'Observe how a closed environment traps thermal energy.', built: true, bg: 'from-emerald-500 to-green-600' },
  { id: 'c8s_2_1', classLevel: '8', subject: 'science', title: 'Act 2.1: Stimulus Response', desc: 'Observe termite behavior towards light vs dark.', built: true, bg: 'from-amber-500 to-orange-600' },
  { id: 'c8s_2_2', classLevel: '8', subject: 'science', title: 'Act 2.2: Knee Jerk Reflex', desc: 'Observe an involuntary reflex action.', built: true, bg: 'from-orange-500 to-red-600' },
  { id: 'c8s_2_3', classLevel: '8', subject: 'science', title: 'Act 2.3: Reflex Time', desc: 'Measure human reaction time.', built: true, bg: 'from-red-500 to-rose-600' },
  { id: 'c8s_3_1', classLevel: '8', subject: 'science', title: 'Act 3.1: DNA Extraction', desc: 'Extract visible DNA strands from a strawberry.', built: true, bg: 'from-purple-500 to-fuchsia-600' },
  { id: 'c8s_3_2', classLevel: '8', subject: 'science', title: 'Act 3.2: Human Variations', desc: 'Sort traits by their variation type.', built: true, bg: 'from-indigo-500 to-purple-600' },
  { id: 'c8s_3_3', classLevel: '8', subject: 'science', title: 'Act 3.3: Crossing Over', desc: 'Model genetic recombination during meiosis.', built: true, bg: 'from-pink-500 to-rose-600' },
  { id: 'c8s_4_1', classLevel: '8', subject: 'science', title: 'Act 4.1: Making Yogurt', desc: 'Observe bacterial fermentation of milk into yogurt.', built: true, bg: 'from-blue-500 to-indigo-600' },
  { id: 'c8s_5_1', classLevel: '8', subject: 'science', title: 'Act 5.1: Periodic Table', desc: 'Count the number of elements in each period.', built: true, bg: 'from-indigo-500 to-blue-600' },
  { id: 'c8s_5_2', classLevel: '8', subject: 'science', title: 'Act 5.2: Electronic Config', desc: 'Compare Group IA and Group IIA outer shells.', built: true, bg: 'from-cyan-500 to-blue-600' },
  { id: 'c8s_5_3', classLevel: '8', subject: 'science', title: 'Act 5.3: Malleability', desc: 'Test malleability of metals vs non-metals.', built: true, bg: 'from-amber-500 to-orange-600' },
  { id: 'c8s_5_4', classLevel: '8', subject: 'science', title: 'Act 5.4: Flexibility', desc: 'Test flexibility and brittleness of materials.', built: true, bg: 'from-violet-500 to-purple-600' },
  { id: 'c8s_5_5', classLevel: '8', subject: 'science', title: 'Act 5.5: Density', desc: 'Drop objects in water to test their density.', built: true, bg: 'from-sky-500 to-blue-600' },
  { id: 'c8s_5_6', classLevel: '8', subject: 'science', title: 'Act 5.6: Thermal Conductivity', desc: 'Observe how heat travels through materials.', built: true, bg: 'from-red-500 to-orange-600' },
  { id: 'c8s_5_7', classLevel: '8', subject: 'science', title: 'Act 5.7: Sonorous Nature', desc: 'Test the ringing sound of different materials.', built: true, bg: 'from-fuchsia-500 to-pink-600' },
  { id: 'c8s_6_1', classLevel: '8', subject: 'science', title: 'Act 6.1: Chemical Reactions', desc: 'Observe signs of a chemical reaction.', built: true, bg: 'from-blue-500 to-indigo-600' },
  { id: 'c8s_6_2', classLevel: '8', subject: 'science', title: 'Act 6.2: Conservation of Mass', desc: 'Verify mass before and after a reaction.', built: true, bg: 'from-sky-500 to-blue-600' },
  { id: 'c8s_6_3', classLevel: '8', subject: 'science', title: 'Act 6.3: Endothermic', desc: 'Observe temperature drop during an endothermic reaction.', built: true, bg: 'from-teal-500 to-emerald-600' },
  { id: 'c8s_6_4', classLevel: '8', subject: 'science', title: 'Act 6.4: Exothermic', desc: 'Observe temperature rise during an exothermic reaction.', built: true, bg: 'from-rose-500 to-red-600' },
  { id: 'c8s_7_1', classLevel: '8', subject: 'science', title: 'Act 7.1: Acids & Litmus', desc: 'Test acid on blue litmus paper.', built: true, bg: 'from-red-500 to-orange-600' },
  { id: 'c8s_7_2', classLevel: '8', subject: 'science', title: 'Act 7.2: Alkalis & Litmus', desc: 'Test alkalis on red litmus paper.', built: true, bg: 'from-blue-500 to-sky-600' },
  { id: 'c8s_7_3', classLevel: '8', subject: 'science', title: 'Act 7.3: Neutralization', desc: 'Mix acid and alkali to create salt and water.', built: true, bg: 'from-purple-500 to-fuchsia-600' },
  { id: 'c8s_7_4', classLevel: '8', subject: 'science', title: 'Act 7.4: Universal Indicator', desc: 'Determine pH of household liquids.', built: true, bg: 'from-amber-500 to-yellow-600' },
  { id: 'c8s_8_1', classLevel: '8', subject: 'science', title: 'Act 8.1: Nail Pressure', desc: 'Compare pressure of pointed vs flat objects.', built: true, bg: 'from-slate-500 to-zinc-600' },
  { id: 'c8s_8_2', classLevel: '8', subject: 'science', title: 'Act 8.2: Hydraulic Elevator', desc: 'Use liquid pressure to lift a load.', built: true, bg: 'from-blue-600 to-indigo-700' },
  { id: 'c8s_8_3', classLevel: '8', subject: 'science', title: 'Act 8.3: Water Rocket', desc: 'Launch a rocket using water pressure.', built: true, bg: 'from-cyan-500 to-sky-600' },
  { id: 'c8s_9_1', classLevel: '8', subject: 'science', title: 'Act 9.1: Laser Maze', desc: 'Trace mirror reflections to navigate a maze.', built: true, bg: 'from-green-500 to-emerald-600' },
  { id: 'c8s_9_3', classLevel: '8', subject: 'science', title: 'Act 9.3: Periscope', desc: 'See over obstacles using two 45 degree mirrors.', built: true, bg: 'from-indigo-500 to-purple-600' },
  { id: 'c8s_9_4', classLevel: '8', subject: 'science', title: 'Act 9.4: Refraction Pencil', desc: 'Observe a pencil bending in different liquids.', built: true, bg: 'from-sky-500 to-blue-600' },
  { id: 'c8s_9_5', classLevel: '8', subject: 'science', title: 'Act 9.5: Concave Mirror', desc: 'Observe focal point and magnification in a shaving mirror.', built: true, bg: 'from-purple-500 to-fuchsia-600' },
  { id: 'c8s_9_6', classLevel: '8', subject: 'science', title: 'Act 9.6: Convex Mirror', desc: 'Observe a wider field of view in a car rearview mirror.', built: true, bg: 'from-rose-500 to-red-600' },
  { id: 'c8s_10_1', classLevel: '8', subject: 'science', title: 'Act 10.1: Electromagnet', desc: 'Generate a magnetic field using electric current.', built: true, bg: 'from-amber-500 to-orange-600' },
  { id: 'c8s_11_1', classLevel: '8', subject: 'science', title: 'Act 11.1: DIY Toothpaste', desc: 'Formulate toothpaste from household ingredients.', built: true, bg: 'from-cyan-500 to-blue-600' },
  { id: 'c8s_11_2', classLevel: '8', subject: 'science', title: 'Act 11.2: Soap Making', desc: 'The chemical process of saponification.', built: true, bg: 'from-teal-500 to-emerald-600' },
  { id: 'c8s_11_3', classLevel: '8', subject: 'science', title: 'Act 11.3: Milk Plastic', desc: 'Extract casein polymer from milk.', built: true, bg: 'from-amber-500 to-yellow-600' },
  { id: 'c8s_11_4', classLevel: '8', subject: 'science', title: 'Act 11.4: DIY Detergent', desc: 'Mix powders to formulate laundry detergent.', built: true, bg: 'from-sky-500 to-indigo-600' },
  { id: 'c8s_11_5', classLevel: '8', subject: 'science', title: 'Act 11.5: Solar Cooker', desc: 'Use a parabolic mirror to concentrate solar energy.', built: true, bg: 'from-yellow-500 to-orange-600' },
  { id: 'c8s_11_7', classLevel: '8', subject: 'science', title: 'Act 11.7: Wind Turbine', desc: 'Convert kinetic energy into electrical energy.', built: true, bg: 'from-sky-400 to-blue-500' },
  { id: 'c8s_11_8', classLevel: '8', subject: 'science', title: 'Act 11.8: Chemical Car', desc: 'Propulsion using vinegar and baking soda.', built: true, bg: 'from-red-500 to-rose-600' },
  { id: 'c8s_11_9', classLevel: '8', subject: 'science', title: 'Act 11.9: Windsock', desc: 'Visualizing wind direction and speed.', built: true, bg: 'from-orange-500 to-amber-600' },
  { id: 'c8s_12_1', classLevel: '8', subject: 'science', title: 'Act 12.1: Sky Map', desc: 'Locate constellations and stars in the night sky.', built: true, bg: 'from-indigo-600 to-slate-800' },

  // Class 7 Computer
  { id: 'c7c_1_1', classLevel: '7', subject: 'computer', title: 'Act 1.1: Hardware', desc: 'Identify and learn about internal computer hardware.', built: true, bg: 'from-blue-600 to-indigo-800' },
  { id: 'c7c_1_2', classLevel: '7', subject: 'computer', title: 'Act 1.2: Emerging Tech', desc: 'Present an emerging technology mini-project.', built: true, bg: 'from-indigo-600 to-purple-800' },
  { id: 'c7c_1_3', classLevel: '7', subject: 'computer', title: 'Act 1.3: Generations', desc: 'Map out the generations of computers over time.', built: true, bg: 'from-purple-600 to-fuchsia-800' },
  { id: 'c7c_1_4', classLevel: '7', subject: 'computer', title: 'Act 1.4: Network Diagram', desc: 'Construct a computer network diagram.', built: true, bg: 'from-fuchsia-600 to-pink-800' },
  { id: 'c7c_2_1', classLevel: '7', subject: 'computer', title: 'Act 2.1: Urdu Typing', desc: 'Practice Urdu typing options in Microsoft Word.', built: true, bg: 'from-emerald-600 to-teal-800' },
  { id: 'c7c_2_2', classLevel: '7', subject: 'computer', title: 'Act 2.2: Letter Format', desc: 'Format a letter properly with fonts and spacing.', built: true, bg: 'from-teal-600 to-cyan-800' },
  { id: 'c7c_2_3', classLevel: '7', subject: 'computer', title: 'Act 2.3: CV Creation', desc: 'Design a professional CV using Word tools.', built: true, bg: 'from-cyan-600 to-blue-800' },
  { id: 'c7c_2_4', classLevel: '7', subject: 'computer', title: 'Act 2.4: Illustrated Story', desc: 'Write a story and add illustrations using Word.', built: true, bg: 'from-sky-600 to-indigo-800' },
  { id: 'c7c_2_5', classLevel: '7', subject: 'computer', title: 'Act 2.5: PPT Geometry', desc: 'Use PowerPoint to draw and format geometric shapes.', built: true, bg: 'from-orange-600 to-red-800' },
  { id: 'c7c_2_6', classLevel: '7', subject: 'computer', title: 'Act 2.6: Wonders Research', desc: 'Create a presentation on the Seven Wonders of the World.', built: true, bg: 'from-red-600 to-rose-800' },
  { id: 'c7c_3_1', classLevel: '7', subject: 'computer', title: 'Act 3.1: Conditional Logic', desc: 'Translate sentences into algorithmic IF-THEN logic.', built: true, bg: 'from-slate-600 to-slate-800' },
  { id: 'c7c_3_2', classLevel: '7', subject: 'computer', title: 'Act 3.2: Grading Flowchart', desc: 'Drag and drop nodes to build a grading flowchart.', built: true, bg: 'from-slate-700 to-slate-900' },
  { id: 'c7c_3_3', classLevel: '7', subject: 'computer', title: 'Act 3.3: Reverse Flowchart', desc: 'Reverse engineer a flowchart to find its problem statement.', built: true, bg: 'from-zinc-600 to-zinc-800' },
  { id: 'c7c_4_1', classLevel: '7', subject: 'computer', title: 'Act 4.1: Sprite Coord', desc: 'Change the X and Y coordinates to move a sprite.', built: true, bg: 'from-amber-600 to-orange-800' },
  { id: 'c7c_4_2', classLevel: '7', subject: 'computer', title: 'Act 4.2: Loop Adjustments', desc: 'Test repeat loops to control sprite movement.', built: true, bg: 'from-yellow-600 to-amber-800' },
  { id: 'c7c_4_3', classLevel: '7', subject: 'computer', title: 'Act 4.3: Bouncing Ball', desc: 'Assemble Scratch blocks to make a ball bounce forever.', built: true, bg: 'from-orange-600 to-red-800' },
  { id: 'c7c_4_4', classLevel: '7', subject: 'computer', title: 'Act 4.4: Animated Dialogue', desc: 'Program a conversation between two sprites.', built: true, bg: 'from-rose-600 to-pink-800' },
  { id: 'c7c_4_5', classLevel: '7', subject: 'computer', title: 'Act 4.5: Interactive Piano', desc: 'Click keys to trigger sounds in an interactive piano.', built: true, bg: 'from-pink-600 to-fuchsia-800' },
  { id: 'c7c_5_1', classLevel: '7', subject: 'computer', title: 'Act 5.1: Cybercrime Pres', desc: 'Prepare a presentation on a movie about cybercrime.', built: true, bg: 'from-purple-600 to-indigo-800' },
  { id: 'c7c_5_2', classLevel: '7', subject: 'computer', title: 'Act 5.2: Deviance Disc', desc: 'Discuss ethical choices regarding deviant online behavior.', built: true, bg: 'from-indigo-600 to-blue-800' },
  { id: 'c7c_5_3', classLevel: '7', subject: 'computer', title: 'Act 5.3: Ethics Chart', desc: 'Design a classroom poster on online safety and ethics.', built: true, bg: 'from-blue-600 to-sky-800' },
  { id: 'c7c_6_1', classLevel: '7', subject: 'computer', title: 'Act 6.1: Design Proto', desc: 'Build a prototype without using standard tools.', built: true, bg: 'from-emerald-600 to-green-800' },
  { id: 'c7c_6_2', classLevel: '7', subject: 'computer', title: 'Act 6.2: Mothers Day Card', desc: 'Design a creative greeting card applying digital art skills.', built: true, bg: 'from-green-600 to-teal-800' },
  // Class 7 Science
  { id: 'c7s_1_1', classLevel: '7', subject: 'science', title: 'Act 1.1: Xylem Transport', desc: 'Observe coloured water moving up a stem.', built: true, bg: 'from-green-500 to-emerald-600' },
  { id: 'c7s_1_2', classLevel: '7', subject: 'science', title: 'Act 1.2: Transpiration Bag', desc: 'Observe water loss from leaves into a sealed bag.', built: true, bg: 'from-green-500 to-emerald-600' },
  { id: 'c7s_1_3', classLevel: '7', subject: 'science', title: 'Act 1.3: Transpiration Paper', desc: 'Test for water loss using cobalt chloride paper.', built: true, bg: 'from-teal-500 to-cyan-600' },
  { id: 'c7s_1_4', classLevel: '7', subject: 'science', title: 'Act 1.4: Minerals & Growth', desc: 'Observe plant growth with and without fertilizer.', built: true, bg: 'from-lime-500 to-green-600' },
  { id: 'c7s_1_5', classLevel: '7', subject: 'science', title: 'Unit 1: Plant Projects', desc: 'Photosynthesis and respiration posters.', built: true, bg: 'from-green-600 to-teal-700' },
  { id: 'c7s_2_1', classLevel: '7', subject: 'science', title: 'Act 2.1: Lung Capacity', desc: 'Measure lung volume using water displacement.', built: true, bg: 'from-blue-500 to-indigo-600' },
  { id: 'c7s_2_2', classLevel: '7', subject: 'science', title: 'Act 2.2: Pulse & Exercise', desc: 'Track heart rate before and after jumping jacks.', built: true, bg: 'from-red-500 to-rose-600' },
  { id: 'c7s_2_3', classLevel: '7', subject: 'science', title: 'Unit 2: Human Body Projects', desc: 'Blood vessel observation and system models.', built: true, bg: 'from-rose-500 to-pink-600' },
  { id: 'c7s_3_1', classLevel: '7', subject: 'science', title: 'Act 3.1: Immune Roleplay', desc: 'Simulate pathogens attacking white blood cells.', built: true, bg: 'from-purple-500 to-fuchsia-600' },
  { id: 'c7s_3_2', classLevel: '7', subject: 'science', title: 'Unit 3: Immunity Projects', desc: 'Design health campaigns and infographics.', built: true, bg: 'from-purple-600 to-indigo-700' },
  { id: 'c7s_4_1', classLevel: '7', subject: 'science', title: 'Act 4.1: Chemical Change', desc: 'Observe the irreversible reaction of burning paper.', built: true, bg: 'from-amber-500 to-orange-600' },
  { id: 'c7s_4_2', classLevel: '7', subject: 'science', title: 'Act 4.2: Thermal Conduction', desc: 'Melt wax on a rod to visualize heat transfer.', built: true, bg: 'from-orange-500 to-red-600' },
  { id: 'c7s_4_3', classLevel: '7', subject: 'science', title: 'Unit 4: Physical vs Chemical', desc: 'Comparative poster assignment for changes.', built: true, bg: 'from-yellow-500 to-amber-600' },
  { id: 'c7s_5_1', classLevel: '7', subject: 'science', title: 'Act 5.1: Subatomic Particles', desc: 'Calculate protons, neutrons, and electrons.', built: true, bg: 'from-sky-500 to-blue-600' },
  { id: 'c7s_5_2', classLevel: '7', subject: 'science', title: 'Act 5.2: Atom Builder', desc: 'Construct a 3D model of an Oxygen atom.', built: true, bg: 'from-blue-600 to-indigo-600' },
  { id: 'c7s_6_1', classLevel: '7', subject: 'science', title: 'Act 6.1: Lithium Bonding', desc: 'Visualize metallic bonds forming in solid lithium.', built: true, bg: 'from-slate-500 to-zinc-600' },
  { id: 'c7s_7_1', classLevel: '7', subject: 'science', title: 'Act 7.1: Dilute & Concentrated', desc: 'Compare colors of different syrup concentrations.', built: true, bg: 'from-pink-500 to-rose-600' },
  { id: 'c7s_7_2', classLevel: '7', subject: 'science', title: 'Act 7.2: Cleaning Coins', desc: 'Test acid solutions on copper oxide tarnish.', built: true, bg: 'from-amber-600 to-yellow-600' },
  { id: 'c7s_7_3', classLevel: '7', subject: 'science', title: 'Act 7.3: Rock Candy', desc: 'Observe crystallization in a supersaturated solution.', built: true, bg: 'from-fuchsia-500 to-purple-600' },
  { id: 'c7s_7_4', classLevel: '7', subject: 'science', title: 'Act 7.4: Oil Pollutants', desc: 'Test methods to clean an oil slick from water.', built: true, bg: 'from-slate-700 to-slate-900' },
  { id: 'c7s_8_1', classLevel: '7', subject: 'science', title: 'Act 8.1: Balloon Rocket', desc: 'Demonstrate Newton\'s 3rd Law of Motion.', built: true, bg: 'from-red-500 to-orange-600' },
  { id: 'c7s_8_2', classLevel: '7', subject: 'science', title: 'Unit 8: Force Projects', desc: 'Water rocket assembly and launch.', built: true, bg: 'from-cyan-600 to-blue-700' },
  { id: 'c7s_9_1', classLevel: '7', subject: 'science', title: 'Act 9.1: Pitch & Length', desc: 'Pluck a rubber band at different lengths.', built: true, bg: 'from-purple-500 to-indigo-600' },
  { id: 'c7s_9_2', classLevel: '7', subject: 'science', title: 'Unit 9: Waves Projects', desc: 'Build a custom rubber band instrument.', built: true, bg: 'from-purple-600 to-fuchsia-700' },
  { id: 'c7s_10_1', classLevel: '7', subject: 'science', title: 'Unit 10: Heat Projects', desc: 'Engineer a homemade insulated cooler.', built: true, bg: 'from-blue-400 to-cyan-500' },
  { id: 'c7s_11_1', classLevel: '7', subject: 'science', title: 'Act 11.1: Drip Irrigation', desc: 'Model water conservation in agriculture.', built: true, bg: 'from-green-600 to-emerald-700' },
  { id: 'c7s_11_2', classLevel: '7', subject: 'science', title: 'Act 11.2: Stethoscope', desc: 'Build a tool to amplify heartbeat sounds.', built: true, bg: 'from-rose-400 to-pink-500' },
  { id: 'c7s_11_3', classLevel: '7', subject: 'science', title: 'Act 11.3: Hand Sanitizer', desc: 'Mix alcohol, aloe, and oils to make sanitizer.', built: true, bg: 'from-teal-400 to-emerald-500' },
  { id: 'c7s_11_4', classLevel: '7', subject: 'science', title: 'Unit 11: Tech Projects', desc: 'Water footprint tracker and conservation drive.', built: true, bg: 'from-sky-500 to-blue-600' },
  { id: 'c7s_12_1', classLevel: '7', subject: 'science', title: 'Act 12.1: Earth Seasons', desc: 'Observe how axial tilt causes the seasons.', built: true, bg: 'from-indigo-600 to-purple-800' },

  // Class 6 Science
  { id: 'c6s_1_1', classLevel: '6', subject: 'science', title: 'Unit 1: Microscope Cells', desc: 'Observe onion and cheek cells under a microscope.', built: true, bg: 'from-emerald-500 to-teal-600' },
  { id: 'c6s_1_3', classLevel: '6', subject: 'science', title: 'Unit 1: Cell Projects', desc: 'Physical models of cells and organ systems.', built: true, bg: 'from-green-500 to-emerald-600' },
  { id: 'c6s_2_1', classLevel: '6', subject: 'science', title: 'Unit 2: Veg. Propagation', desc: 'Compare plant growth from seeds vs cuttings over time.', built: true, bg: 'from-lime-500 to-green-600' },
  { id: 'c6s_3_1', classLevel: '6', subject: 'science', title: 'Unit 3: Fat Detection', desc: 'Perform the ethanol emulsion test to find fats in food.', built: true, bg: 'from-yellow-500 to-orange-600' },
  { id: 'c6s_3_2', classLevel: '6', subject: 'science', title: 'Unit 3: Balanced Diet', desc: 'Roleplay a chef planning a balanced meal.', built: true, bg: 'from-orange-500 to-red-600' },
  { id: 'c6s_4_1', classLevel: '6', subject: 'science', title: 'Unit 4: Physical Digestion', desc: 'Mechanically break down food to see surface area effects.', built: true, bg: 'from-red-500 to-rose-600' },
  { id: 'c6s_4_2', classLevel: '6', subject: 'science', title: 'Unit 4: Alimentary Canal', desc: 'Order the organs to build the digestive pathway.', built: true, bg: 'from-rose-500 to-pink-600' },
  { id: 'c6s_4_4', classLevel: '6', subject: 'science', title: 'Unit 4: Lung Model', desc: 'Construct a breathing model with balloons and a bottle.', built: true, bg: 'from-pink-500 to-fuchsia-600' },
  { id: 'c6s_5_1', classLevel: '6', subject: 'science', title: 'Unit 5: Particle Models', desc: 'Simulate dissolving sugar and diffusing gases.', built: true, bg: 'from-fuchsia-500 to-purple-600' },
  { id: 'c6s_6_1', classLevel: '6', subject: 'science', title: 'Unit 6: Molecular Builder', desc: 'Construct 3D molecular models of H2O, CO2, and CH4.', built: true, bg: 'from-purple-500 to-indigo-600' },
  { id: 'c6s_6_2', classLevel: '6', subject: 'science', title: 'Unit 6: Elements vs Compounds', desc: 'Identify substances as elements or compounds.', built: true, bg: 'from-indigo-500 to-blue-600' },
  { id: 'c6s_7_1', classLevel: '6', subject: 'science', title: 'Unit 7: Mixture Separation', desc: 'Separate salt and sand via dissolving, filtering, and evaporating.', built: true, bg: 'from-blue-500 to-sky-600' },
  { id: 'c6s_7_2', classLevel: '6', subject: 'science', title: 'Unit 7: Solution Temp', desc: 'Investigate exothermic and endothermic reactions.', built: true, bg: 'from-sky-500 to-cyan-600' },
  { id: 'c6s_8_1', classLevel: '6', subject: 'science', title: 'Unit 8: Energy Transforms', desc: 'Observe energy changes in a bouncing ball and solar fan.', built: true, bg: 'from-cyan-500 to-teal-600' },
  { id: 'c6s_8_2', classLevel: '6', subject: 'science', title: 'Unit 8: Energy Projects', desc: 'Build a windmill and a roller coaster track.', built: true, bg: 'from-teal-500 to-emerald-600' },
  { id: 'c6s_9_1', classLevel: '6', subject: 'science', title: 'Unit 9: Circuit Builder', desc: 'Construct series and parallel electrical circuits.', built: true, bg: 'from-yellow-400 to-amber-500' },
  { id: 'c6s_9_2', classLevel: '6', subject: 'science', title: 'Unit 9: Conductors & Insulators', desc: 'Test various materials in an electrical circuit.', built: true, bg: 'from-amber-500 to-orange-500' },
  { id: 'c6s_10_1', classLevel: '6', subject: 'science', title: 'Unit 10: Magnetism', desc: 'Plot magnetic fields and observe natural alignment.', built: true, bg: 'from-red-600 to-rose-700' },
  { id: 'c6s_11_1', classLevel: '6', subject: 'science', title: 'Unit 11: Plant Growth', desc: 'Simulate the effect of fertilizers on plant growth.', built: true, bg: 'from-green-600 to-emerald-700' },
  { id: 'c6s_12_1', classLevel: '6', subject: 'science', title: 'Unit 12: Solar System Model', desc: 'Build a scaled 3D model of the solar system.', built: true, bg: 'from-slate-800 to-black' },
  { id: 'c6s_12_2', classLevel: '6', subject: 'science', title: 'Unit 12: Everyday Tech', desc: 'Explore the roles of satellites, GPS, and communication.', built: true, bg: 'from-blue-700 to-indigo-900' },
  // Class 6 Computer
  { id: 'c6c_1_1', classLevel: '6', subject: 'computer', title: 'Act 1.1: Health Campaign', desc: 'Design a campaign regarding health effects of ICT.', built: true, bg: 'from-rose-500 to-red-700' },
  { id: 'c6c_1_2', classLevel: '6', subject: 'computer', title: 'Act 1.2: Hardware Charts', desc: 'Identify and label hardware components.', built: true, bg: 'from-orange-500 to-amber-700' },
  { id: 'c6c_1_3', classLevel: '6', subject: 'computer', title: 'Act 1.3: Lab Rules', desc: 'Prepare charts outlining Do\'s and Don\'ts.', built: true, bg: 'from-emerald-500 to-green-700' },
  { id: 'c6c_1_4', classLevel: '6', subject: 'computer', title: 'Act 1.4: Group Presentations', desc: 'Prepare presentations on hardware topics.', built: true, bg: 'from-teal-500 to-cyan-700' },
  { id: 'c6c_2_1', classLevel: '6', subject: 'computer', title: 'Act 2.1: System Software', desc: 'Identify utility programs and OS components.', built: true, bg: 'from-blue-500 to-indigo-700' },
  { id: 'c6c_2_2', classLevel: '6', subject: 'computer', title: 'Act 2.2: File Mgmt 1', desc: 'Create, copy, and rename folders.', built: true, bg: 'from-indigo-500 to-purple-700' },
  { id: 'c6c_2_3', classLevel: '6', subject: 'computer', title: 'Act 2.3: File Mgmt 2', desc: 'Create files and recover from Recycle Bin.', built: true, bg: 'from-purple-500 to-fuchsia-700' },
  { id: 'c6c_2_4', classLevel: '6', subject: 'computer', title: 'Act 2.4: Diet Exercise', desc: 'Investigate calories consumed vs burned.', built: true, bg: 'from-fuchsia-500 to-pink-700' },
  { id: 'c6c_2_5', classLevel: '6', subject: 'computer', title: 'Act 2.5: Paint 3D Face', desc: 'Design a face using curve tools.', built: true, bg: 'from-pink-500 to-rose-700' },
  { id: 'c6c_2_6', classLevel: '6', subject: 'computer', title: 'Act 2.6: Solar System', desc: 'Draw and label the solar system.', built: true, bg: 'from-slate-700 to-zinc-900' },
  { id: 'c6c_3_1', classLevel: '6', subject: 'computer', title: 'Act 3.1: Problem Decomp', desc: 'Break down grocery shopping problem.', built: true, bg: 'from-blue-600 to-sky-800' },
  { id: 'c6c_3_2', classLevel: '6', subject: 'computer', title: 'Act 3.2: Road Safety', desc: 'Apply 6-step model to cross a road safely.', built: true, bg: 'from-sky-600 to-cyan-800' },
  { id: 'c6c_4_1', classLevel: '6', subject: 'computer', title: 'Act 4.1: Coord Exp', desc: 'Relocate sprite to different coordinates.', built: true, bg: 'from-cyan-600 to-teal-800' },
  { id: 'c6c_4_2', classLevel: '6', subject: 'computer', title: 'Act 4.2: Costume Change', desc: 'Trigger a costume change using a keyboard event.', built: true, bg: 'from-teal-600 to-emerald-800' },
  { id: 'c6c_4_3', classLevel: '6', subject: 'computer', title: 'Act 4.3: Movement Tracking', desc: 'Track movement with a counter variable.', built: true, bg: 'from-emerald-600 to-green-800' },
  { id: 'c6c_4_4', classLevel: '6', subject: 'computer', title: 'Act 4.4: Loop Adjustments', desc: 'Compare turn vs size in repeat loop.', built: true, bg: 'from-green-600 to-lime-800' },
  { id: 'c6c_5_1', classLevel: '6', subject: 'computer', title: 'Act 5.1: Ethics Chart', desc: 'Display ethical rules regarding ICT use.', built: true, bg: 'from-lime-600 to-yellow-800' },
  { id: 'c6c_5_2', classLevel: '6', subject: 'computer', title: 'Act 5.2: Cyber Scout', desc: 'Explore how to become a Cyber Scout.', built: true, bg: 'from-yellow-600 to-amber-800' },
  { id: 'c6c_5_3', classLevel: '6', subject: 'computer', title: 'Act 5.3: Poster Comp', desc: 'Prepare posters for Cyber ethics themes.', built: true, bg: 'from-amber-600 to-orange-800' },
  { id: 'c6c_6_1', classLevel: '6', subject: 'computer', title: 'Act 6.1: Hobby Monetization', desc: 'Prepare a startup pitch for a hobby.', built: true, bg: 'from-orange-600 to-red-800' },
  // Class 10 Physics
  { id: 'p10_10_1', classLevel: '10', subject: 'physics', title: 'Unit 10: Carbon Footprint', desc: 'Calculate daily CO2 emissions from transportation to school.', built: true, bg: 'from-emerald-500 to-teal-600' },
  { id: 'p10_10_2', classLevel: '10', subject: 'physics', title: 'Unit 10: Specific Heat (Mixtures)', desc: 'Calculate specific heat by transferring a hot solid into a cold liquid.', built: true, bg: 'from-blue-500 to-indigo-600' },
  { id: 'p10_10_3', classLevel: '10', subject: 'physics', title: 'Unit 10: Specific Heat (Electrical)', desc: 'Calculate heat energy using an immersion heater in an insulated metal block.', built: true, bg: 'from-purple-500 to-fuchsia-600' },
  { id: 'p10_10_4', classLevel: '10', subject: 'physics', title: 'Unit 10: Thermal Conduction', desc: 'Heat the ends of Copper, Iron, and Aluminium strips to see which conducts heat fastest.', built: true, bg: 'from-orange-500 to-red-600' },
  { id: 'p10_10_5', classLevel: '10', subject: 'physics', title: 'Unit 10: Convection Currents', desc: 'Observe a colored stream of potassium permanganate travel upward as water is heated.', built: true, bg: 'from-violet-500 to-purple-600' },
  { id: 'p10_10_6', classLevel: '10', subject: 'physics', title: 'Unit 10: Insulating Materials', desc: 'Wrap hot water bottles in different insulators to see which retains heat best over an hour.', built: true, bg: 'from-slate-500 to-zinc-600' },
  { id: 'p10_10_7', classLevel: '10', subject: 'physics', title: 'Unit 10: Absorbers & Reflectors', desc: 'Compare heating rates of a shiny silver can vs a dull black can using a radiant heater.', built: true, bg: 'from-zinc-700 to-black' },
  { id: 'p10_10_8', classLevel: '10', subject: 'physics', title: 'Unit 10: Leslie Cube', desc: 'Measure infrared radiation emitted from 4 different surfaces of a Leslie Cube.', built: true, bg: 'from-rose-500 to-red-600' },
  { id: 'p10_11_1', classLevel: '10', subject: 'physics', title: 'Unit 11: Thermal Expansion', desc: 'Heat a metal rod secured by a bolt to observe the massive force of thermal expansion.', built: true, bg: 'from-red-600 to-orange-700' },
  { id: 'p10_11_2', classLevel: '10', subject: 'physics', title: 'Unit 11: Expansion of Liquids', desc: 'Observe a liquid drop initially before rising due to glass expansion.', built: true, bg: 'from-cyan-500 to-blue-600' },
  { id: 'p10_11_3', classLevel: '10', subject: 'physics', title: 'Unit 11: Gas Pressure', desc: 'Observe an inflated balloon expand in heat and shrink in cold.', built: true, bg: 'from-blue-500 to-indigo-600' },
  { id: 'p10_11_4', classLevel: '10', subject: 'physics', title: 'Unit 11: Latent Heat', desc: 'Heat ice continuously and observe the temperature plateaus during state changes.', built: true, bg: 'from-sky-400 to-blue-500' },
  { id: 'p10_12_1', classLevel: '10', subject: 'physics', title: 'Unit 12: Wave Motion', desc: 'Observe how waves transfer energy without transferring matter.', built: true, bg: 'from-blue-600 to-indigo-800' },
  { id: 'p10_12_2', classLevel: '10', subject: 'physics', title: 'Unit 12: Ripple Tank', desc: 'Observe reflection, refraction, and diffraction using a ripple tank simulation.', built: true, bg: 'from-cyan-600 to-teal-800' },
  { id: 'p10_12_3', classLevel: '10', subject: 'physics', title: 'Unit 12: Refraction Illusion', desc: 'Observe a pencil appearing bent due to light refracting between air and water.', built: true, bg: 'from-sky-500 to-blue-700' },
  { id: 'p10_13_1', classLevel: '10', subject: 'physics', title: 'Unit 13: Sound Production', desc: 'Strike a tuning fork and touch it to water to visualize physical vibrations.', built: true, bg: 'from-indigo-500 to-purple-700' },
  { id: 'p10_13_2', classLevel: '10', subject: 'physics', title: 'Unit 13: Sound Medium', desc: 'Suspend an electric bell in a vacuum jar to prove sound needs a medium.', built: true, bg: 'from-amber-600 to-orange-800' },
  { id: 'p10_13_3', classLevel: '10', subject: 'physics', title: 'Unit 13: String Telephone', desc: 'Thread a string through two cups and walk apart to transmit sound.', built: true, bg: 'from-emerald-600 to-teal-800' },
  { id: 'p10_13_4', classLevel: '10', subject: 'physics', title: 'Unit 13: Speaker Project', desc: 'Wrap a wire coil around a cup and add a magnet to play music.', built: true, bg: 'from-purple-600 to-fuchsia-800' },
  { id: 'p10_14_1', classLevel: '10', subject: 'physics', title: 'Unit 14: Plane Mirror', desc: 'Investigate the properties of an image formed by a plane mirror.', built: true, bg: 'from-slate-600 to-zinc-800' },
  { id: 'p10_14_2', classLevel: '10', subject: 'physics', title: 'Unit 14: Refraction Blocks', desc: 'Trace a laser beam as it refracts entering and leaving a glass block.', built: true, bg: 'from-red-600 to-rose-800' },
  { id: 'p10_14_3', classLevel: '10', subject: 'physics', title: 'Unit 14: Total Internal Reflection', desc: 'Shine a laser from water into air to find the critical angle.', built: true, bg: 'from-green-600 to-emerald-800' },
  { id: 'p10_15_1', classLevel: '10', subject: 'physics', title: 'Unit 15: Electrostatic Charges', desc: 'Rub a plastic rod with cloth to transfer electrons, creating a static charge.', built: true, bg: 'from-orange-500 to-red-600' },
  { id: 'p10_15_2', classLevel: '10', subject: 'physics', title: 'Unit 15: Gold Leaf Electroscope', desc: 'Detect the presence and nature of an electric charge.', built: true, bg: 'from-yellow-500 to-amber-600' },
  { id: 'p10_16_1', classLevel: '10', subject: 'physics', title: 'Unit 16: Ohm\'s Law', desc: 'Investigate the relationship between Voltage (V), Current (I), and Resistance (R).', built: true, bg: 'from-emerald-500 to-teal-600' },
  { id: 'p10_16_2', classLevel: '10', subject: 'physics', title: 'Unit 16: Series Circuit', desc: 'Observe how adding bulbs in a series circuit increases total resistance.', built: true, bg: 'from-blue-500 to-indigo-600' },
  { id: 'p10_16_3', classLevel: '10', subject: 'physics', title: 'Unit 16: Parallel Circuit', desc: 'Observe how adding bulbs in parallel decreases total resistance.', built: true, bg: 'from-cyan-500 to-blue-600' },
  { id: 'p10_17_1', classLevel: '10', subject: 'physics', title: 'Unit 17: Magnetic Field', desc: 'Sprinkle iron filings around a bar magnet to reveal its magnetic field lines.', built: true, bg: 'from-slate-500 to-zinc-600' },
  { id: 'p10_17_2', classLevel: '10', subject: 'physics', title: 'Unit 17: Electromagnetism', desc: 'Observe how a current-carrying wire behaves in a magnetic field.', built: true, bg: 'from-indigo-500 to-purple-600' },
  { id: 'p10_17_3', classLevel: '10', subject: 'physics', title: 'Unit 17: Faraday\'s Law', desc: 'Thrust a magnet into a coil to induce an electromagnetic force.', built: true, bg: 'from-rose-500 to-red-600' },
  { id: 'p10_18_1', classLevel: '10', subject: 'physics', title: 'Unit 18: Thermionic Emission', desc: 'Heat a tungsten filament to emit electrons, then accelerate them with a high voltage anode.', built: true, bg: 'from-orange-600 to-amber-800' },
  { id: 'p10_18_2', classLevel: '10', subject: 'physics', title: 'Unit 18: Logic Gates', desc: 'Test different logic gates and observe their truth tables.', built: true, bg: 'from-blue-600 to-indigo-800' },
  { id: 'p10_19_1', classLevel: '10', subject: 'physics', title: 'Unit 19: Radio Transmission', desc: 'Trace the signal flow from microphone to speaker via radio waves.', built: true, bg: 'from-cyan-600 to-blue-800' },
  { id: 'p10_19_2', classLevel: '10', subject: 'physics', title: 'Unit 19: Optical Fibers', desc: 'Observe total internal reflection transmitting light through a bent glass fiber.', built: true, bg: 'from-fuchsia-600 to-pink-800' },
  { id: 'p10_20_1', classLevel: '10', subject: 'physics', title: 'Unit 20: Radioactivity', desc: 'Observe how Alpha, Beta, and Gamma radiation deflects in a magnetic field.', built: true, bg: 'from-emerald-600 to-teal-800' },
  { id: 'p10_20_2', classLevel: '10', subject: 'physics', title: 'Unit 20: Half-Life Simulation', desc: 'Observe the random decay of radioactive nuclei over time.', built: true, bg: 'from-rose-600 to-pink-800' },
  // Class 10 Chemistry
  { id: 'c10_3_1', classLevel: '10', subject: 'chemistry', title: 'Unit 3: Dilute Solution Prep', desc: 'Prepare a 0.1M HCl solution from concentrated acid using M1V1=M2V2.', built: true, bg: 'from-teal-500 to-emerald-600' },
  { id: 'c10_3_2', classLevel: '10', subject: 'chemistry', title: 'Unit 3: Titration Standardization', desc: 'Standardize HCl by titrating it against standard NaOH.', built: true, bg: 'from-emerald-500 to-green-600' },
  { id: 'c10_6_1', classLevel: '10', subject: 'chemistry', title: 'Unit 6: Salt via Titration', desc: 'Prepare NaCl crystals by neutralizing HCl with NaOH.', built: true, bg: 'from-cyan-500 to-blue-600' },
  { id: 'c10_6_2', classLevel: '10', subject: 'chemistry', title: 'Unit 6: Salt via Excess Metal', desc: 'Prepare ZnSO4 from Zinc and Sulphuric Acid.', built: true, bg: 'from-sky-500 to-indigo-600' },
  { id: 'c10_6_3', classLevel: '10', subject: 'chemistry', title: 'Unit 6: Salt via Excess Base', desc: 'Prepare CuSO4 from Copper(II) Oxide and Sulphuric Acid.', built: true, bg: 'from-blue-500 to-indigo-700' },
  { id: 'c10_6_4', classLevel: '10', subject: 'chemistry', title: 'Unit 6: Salt via Excess Carbonate', desc: 'Prepare CaCl2 from Calcium Carbonate and HCl.', built: true, bg: 'from-indigo-500 to-purple-600' },
  { id: 'c10_7_1', classLevel: '10', subject: 'chemistry', title: 'Unit 7: Metal Reactivity', desc: 'Compare reactivity of Mg, Zn, Fe, and Cu with HCl.', built: true, bg: 'from-purple-500 to-fuchsia-600' },
  { id: 'c10_9_1', classLevel: '10', subject: 'chemistry', title: 'Unit 9: Saturated & Unsaturated', desc: 'Use Bromine water to test butter and vegetable oil.', built: true, bg: 'from-fuchsia-500 to-pink-600' },
  { id: 'c10_11_1', classLevel: '10', subject: 'chemistry', title: 'Unit 11: Acetic Acid + Metal', desc: 'React vinegar with sodium metal to produce hydrogen gas.', built: true, bg: 'from-rose-500 to-red-600' },
  { id: 'c10_11_2', classLevel: '10', subject: 'chemistry', title: 'Unit 11: Acetic Acid + Carbonate', desc: 'React vinegar with sodium carbonate to produce CO2 gas.', built: true, bg: 'from-red-500 to-orange-600' },
  
  // Class 10 Chemistry Phase 2
  { id: 'c10_4_1', classLevel: '10', subject: 'chemistry', title: 'Unit 4: Downs Cell', desc: 'Electrolysis of molten sodium chloride to produce liquid sodium.', built: true, bg: 'from-orange-500 to-red-600' },
  { id: 'c10_4_2', classLevel: '10', subject: 'chemistry', title: 'Unit 4: Molten Lead Chloride', desc: 'Electrolysis of molten PbCl2.', built: true, bg: 'from-slate-500 to-zinc-700' },
  { id: 'c10_4_3', classLevel: '10', subject: 'chemistry', title: 'Unit 4: Aqueous Electrolysis', desc: 'Electrolysis of concentrated brine vs dilute NaCl/H2SO4.', built: true, bg: 'from-blue-500 to-indigo-600' },
  { id: 'c10_4_4', classLevel: '10', subject: 'chemistry', title: 'Unit 4: Copper Refining', desc: 'Purifying copper using an electrolytic cell.', built: true, bg: 'from-amber-600 to-orange-700' },
  { id: 'c10_4_5', classLevel: '10', subject: 'chemistry', title: 'Unit 4: Electroplating', desc: 'Electroplating steel with Zinc, Tin, or Chromium.', built: true, bg: 'from-cyan-500 to-blue-600' },
  { id: 'c10_4_6', classLevel: '10', subject: 'chemistry', title: 'Unit 4: Daniel Cell', desc: 'Generate electricity using a spontaneous redox reaction with a salt bridge.', built: true, bg: 'from-emerald-500 to-teal-600' },
  { id: 'c10_4_7', classLevel: '10', subject: 'chemistry', title: 'Unit 4: Fuel Cell', desc: 'Hydrogen-Oxygen fuel cell producing water and electricity.', built: true, bg: 'from-sky-500 to-blue-600' },
  
  { id: 'c10_5_1', classLevel: '10', subject: 'chemistry', title: 'Unit 5: Surface Area Kinetics', desc: 'Effect of solid vs powdered zinc on reaction rate.', built: true, bg: 'from-pink-500 to-rose-600' },
  { id: 'c10_5_2', classLevel: '10', subject: 'chemistry', title: 'Unit 5: Concentration Kinetics', desc: 'Effect of concentration on antacid neutralization rate.', built: true, bg: 'from-purple-500 to-indigo-600' },
  
  { id: 'c10_8_1', classLevel: '10', subject: 'chemistry', title: 'Unit 8: Esterification', desc: 'React an alcohol with a carboxylic acid to produce a fruity ester.', built: true, bg: 'from-fuchsia-500 to-purple-600' },
  
  { id: 'c10_10_1', classLevel: '10', subject: 'chemistry', title: 'Unit 10: Fermentation', desc: 'Anaerobic yeast fermentation to manufacture ethanol.', built: true, bg: 'from-lime-500 to-green-600' },
  { id: 'c10_10_2', classLevel: '10', subject: 'chemistry', title: 'Unit 10: Ethene Hydration', desc: 'Industrial manufacture of ethanol via hydration of ethene.', built: true, bg: 'from-cyan-600 to-teal-700' },
  { id: 'c10_10_3', classLevel: '10', subject: 'chemistry', title: 'Unit 10: Alcohol Combustion', desc: 'Measure the heat energy released by burning alcohols.', built: true, bg: 'from-red-500 to-orange-600' },
  
  { id: 'c10_12_1', classLevel: '10', subject: 'chemistry', title: 'Unit 12: Addition Polymerisation', desc: 'Join ethene monomers to form polyethylene chains.', built: true, bg: 'from-indigo-500 to-blue-600' },
  { id: 'c10_12_2', classLevel: '10', subject: 'chemistry', title: 'Unit 12: Condensation Polymerisation', desc: 'React diol with dicarboxylic acid to form PET.', built: true, bg: 'from-violet-500 to-purple-600' },
  { id: 'c10_12_3', classLevel: '10', subject: 'chemistry', title: 'Unit 12: PET Hydrolysis', desc: 'Chemical recycling of PET back into monomers using acid.', built: true, bg: 'from-teal-500 to-emerald-600' },
  
  { id: 'c10_13_1', classLevel: '10', subject: 'chemistry', title: 'Unit 13: Biochemical Testing', desc: 'Analyze hCG hormone concentration in a pregnancy test simulation.', built: true, bg: 'from-rose-400 to-pink-500' },
  
  // Class 10 Computer Science
  { id: 'cs10_1_1', classLevel: '10', subject: 'computer', title: 'Unit 1: Number Systems', desc: 'Interactive calculator for binary/hex conversions and 2s complement.', built: true, bg: 'from-blue-600 to-indigo-800' },
  { id: 'cs10_1_2', classLevel: '10', subject: 'computer', title: 'Unit 1: Hello World!', desc: 'Code a dynamic webpage using HTML, CSS, and JS in a simulated editor.', built: true, bg: 'from-sky-500 to-blue-700' },
  { id: 'cs10_2_1', classLevel: '10', subject: 'computer', title: 'Unit 2: Computational Thinking', desc: 'Practice map abstraction and modular program design with flowcharts.', built: true, bg: 'from-cyan-600 to-teal-800' },
  { id: 'cs10_3_1', classLevel: '10', subject: 'computer', title: 'Unit 3: HTML & CSS', desc: 'Build a travel form, timetable, and CSS color-transition animation.', built: true, bg: 'from-emerald-600 to-green-800' },
  { id: 'cs10_3_2', classLevel: '10', subject: 'computer', title: 'Unit 3: JS Algorithms', desc: 'Simulate search algorithms and array comparisons in JavaScript.', built: true, bg: 'from-yellow-500 to-amber-700' },
  { id: 'cs10_3_3', classLevel: '10', subject: 'computer', title: 'Unit 3: Dynamic Lists', desc: 'Visually insert, find, and remove items from an array structure.', built: true, bg: 'from-orange-500 to-red-700' },
  { id: 'cs10_4_1', classLevel: '10', subject: 'computer', title: 'Unit 4: Data Visualization', desc: 'Clean datasets, calculate mean/median, and render interactive charts.', built: true, bg: 'from-purple-600 to-fuchsia-800' },
  { id: 'cs10_4_2', classLevel: '10', subject: 'computer', title: 'Unit 4: Churn Prediction', desc: 'Analyze customer metrics to predict churn and apply retention promos.', built: true, bg: 'from-pink-600 to-rose-800' },
  { id: 'cs10_5_1', classLevel: '10', subject: 'computer', title: 'Unit 5: Applications & AI', desc: 'Simulate cloud docs, build an IoT smart home, and analyze AI bias.', built: true, bg: 'from-indigo-600 to-violet-800' },
  { id: 'cs10_6_1', classLevel: '10', subject: 'computer', title: 'Unit 6: Impacts of Computing', desc: 'Design safe internet and anti-cyberbullying campaign posters.', built: true, bg: 'from-slate-600 to-zinc-800' },
  { id: 'cs10_7_1', classLevel: '10', subject: 'computer', title: 'Unit 7: Digital Literacy', desc: 'Design a digital billboard and simulate an AI social media product launch.', built: true, bg: 'from-teal-600 to-cyan-800' },
  { id: 'cs10_8_1', classLevel: '10', subject: 'computer', title: 'Unit 8: Market Research', desc: 'Categorize variables, calculate CAC, and define a Unique Selling Proposition.', built: true, bg: 'from-rose-500 to-red-700' },
  { id: 'cs10_8_2', classLevel: '10', subject: 'computer', title: 'Unit 8: Financial Projections', desc: 'Calculate 1st-year projected revenue, expenses, and profitability.', built: true, bg: 'from-green-600 to-emerald-800' },
  { id: 'cs10_8_3', classLevel: '10', subject: 'computer', title: 'Unit 8: Business Pitch', desc: 'Run a timed elevator pitch, brainstorm problems, and analyze documents.', built: true, bg: 'from-blue-700 to-indigo-900' },
  
  // Class 10 Mathematics
  { id: 'm10_7_1', classLevel: '10', subject: 'math', title: 'Unit 7: Vectors in Plane', desc: 'Categorize physical measurements into Scalar and Vector quantities.', built: true, bg: 'from-indigo-600 to-purple-800' },
  { id: 'm10_9_1', classLevel: '10', subject: 'math', title: 'Unit 9: Chord Bisectors', desc: 'Verify circle properties through 3 non-collinear points and bisectors.', built: true, bg: 'from-teal-500 to-emerald-700' },
  { id: 'm10_9_2', classLevel: '10', subject: 'math', title: 'Unit 9: Equal Chords', desc: 'Verify equidistant chords and congruent arcs using a digital protractor.', built: true, bg: 'from-cyan-600 to-blue-800' },
  { id: 'm10_10_1', classLevel: '10', subject: 'math', title: 'Unit 10: Tangent Properties', desc: 'Prove tangents are perpendicular to radii and analyze touching circles.', built: true, bg: 'from-rose-500 to-red-700' },
  { id: 'm10_10_2', classLevel: '10', subject: 'math', title: 'Unit 10: Circle Angles', desc: 'Explore alternate segments, cyclic quads, and angles within segments.', built: true, bg: 'from-amber-500 to-orange-700' },
  { id: 'm10_11_1', classLevel: '10', subject: 'math', title: 'Unit 11: Circle Basics', desc: 'Draft circles, locate centers, and complete broken arcs using a compass.', built: true, bg: 'from-fuchsia-600 to-pink-800' },
  { id: 'm10_11_2', classLevel: '10', subject: 'math', title: 'Unit 11: Tangent Construction', desc: 'Construct tangents on arcs and circles from external points and angles.', built: true, bg: 'from-sky-500 to-blue-600' },
  { id: 'm10_11_3', classLevel: '10', subject: 'math', title: 'Unit 11: Common Tangents', desc: 'Draft direct and transverse common tangents for multi-circle systems.', built: true, bg: 'from-violet-600 to-purple-800' },
  { id: 'm10_12_1', classLevel: '10', subject: 'math', title: 'Unit 12: Basic Statistics', desc: 'Spin a probability wheel to calculate percentiles and experimental probabilities.', built: true, bg: 'from-emerald-500 to-green-700' },

  // Class 10 Mathematics Phase 2 (Applications)
  { id: 'm10_app_1', classLevel: '10', subject: 'math', title: 'Unit 1: Complex Apps', desc: 'Simulate AC Circuits and model imaginary wave oscillations.', built: true, bg: 'from-blue-600 to-indigo-800' },
  { id: 'm10_app_2', classLevel: '10', subject: 'math', title: 'Unit 2: Quadratic Apps', desc: 'Analyze projectile motion, architectural area, and vehicular braking distance.', built: true, bg: 'from-red-500 to-orange-700' },
  { id: 'm10_app_3', classLevel: '10', subject: 'math', title: 'Unit 3: Matrix Apps', desc: 'Apply Cramer\'s rule for cost analysis, chemical mixing, and resource allocation.', built: true, bg: 'from-emerald-600 to-teal-800' },
  { id: 'm10_app_4', classLevel: '10', subject: 'math', title: 'Unit 4: Inequality Apps', desc: 'Graph feasible regions for budgeting and absolute deviation limits.', built: true, bg: 'from-purple-600 to-fuchsia-800' },
  { id: 'm10_app_5', classLevel: '10', subject: 'math', title: 'Unit 5: Fraction Apps', desc: 'Solve logistical travel equations and combined worker rate problems.', built: true, bg: 'from-cyan-600 to-blue-800' },
  { id: 'm10_app_6', classLevel: '10', subject: 'math', title: 'Unit 6: Function Apps', desc: 'Model machine depreciation and the exponential spread of diseases.', built: true, bg: 'from-rose-500 to-pink-700' },
  { id: 'm10_app_7', classLevel: '10', subject: 'math', title: 'Unit 7: Vector Apps', desc: 'Calculate aviation crosswinds, swimming trajectories, and resultant pulling forces.', built: true, bg: 'from-slate-600 to-zinc-800' },
  { id: 'm10_app_8', classLevel: '10', subject: 'math', title: 'Unit 8: Trig Apps', desc: 'Measure inaccessible heights and calculate irregular land plot areas.', built: true, bg: 'from-amber-500 to-orange-700' },
  { id: 'm10_app_9', classLevel: '10', subject: 'math', title: 'Unit 9-11: Circle Apps', desc: 'Analyze mechanical tangency, arched bridges, and GPS satellite distances.', built: true, bg: 'from-indigo-500 to-violet-700' },
  { id: 'm10_app_12', classLevel: '10', subject: 'math', title: 'Unit 12: Stats Apps', desc: 'Analyze salary percentiles, BMI scatter plots, and QC probability trees.', built: true, bg: 'from-teal-500 to-green-700' },

  // Class 10 Biology
  { id: 'b10_1', classLevel: '10', subject: 'biology', title: 'Unit 1: Digestive System', desc: 'Demonstrate peristalsis with a straw and bead, and perform lipid emulsification.', built: true, bg: 'from-amber-500 to-orange-700' },
  { id: 'b10_2', classLevel: '10', subject: 'biology', title: 'Unit 2: Circulatory System', desc: 'Prepare a human blood smear slide, stain it, and view it under a microscope.', built: true, bg: 'from-red-600 to-rose-800' },
  { id: 'b10_3', classLevel: '10', subject: 'biology', title: 'Unit 3: Respiratory System', desc: 'Test for CO2 with lime water and operate a physics-based lung model.', built: true, bg: 'from-cyan-500 to-blue-700' },
  { id: 'b10_4', classLevel: '10', subject: 'biology', title: 'Unit 4: Urinary System', desc: 'Dissect a virtual goat kidney to identify the cortex, medulla, and pelvis.', built: true, bg: 'from-fuchsia-600 to-purple-800' },
  { id: 'b10_5', classLevel: '10', subject: 'biology', title: 'Unit 5: Nervous System', desc: 'Trigger a knee jerk reflex and analyze the 50ms monosynaptic reflex arc.', built: true, bg: 'from-emerald-500 to-green-700' },
  { id: 'b10_7', classLevel: '10', subject: 'biology', title: 'Unit 7: Inheritance', desc: 'Simulate Mendel\'s laws of segregation using interactive colored beads.', built: true, bg: 'from-indigo-500 to-blue-800' },
  { id: 'b10_11', classLevel: '10', subject: 'biology', title: 'Unit 11: Biostatistics', desc: 'Calculate medians and construct biological bar charts on digital graph paper.', built: true, bg: 'from-slate-600 to-zinc-800' },

  // Class 9 Biology
  { id: 'b9_1', classLevel: '9', subject: 'biology', title: 'Unit 1-2: Biodiversity', desc: 'Sort organisms by taxonomy and build a biodiversity collage.', built: true, bg: 'from-emerald-600 to-teal-800' },
  { id: 'b9_3', classLevel: '9', subject: 'biology', title: 'Unit 3-5: Microscopy', desc: 'Stain and squash onion roots, swab cheek cells, and view animal tissues.', built: true, bg: 'from-blue-600 to-indigo-800' },
  { id: 'b9_6', classLevel: '9', subject: 'biology', title: 'Unit 6: Biochemistry', desc: 'Use reagents to test for proteins, lipids, and carbohydrates.', built: true, bg: 'from-purple-600 to-fuchsia-800' },
  { id: 'b9_7', classLevel: '9', subject: 'biology', title: 'Unit 7: Enzymes', desc: 'Test Amylase and Pepsin in interactive water baths across different pH and temps.', built: true, bg: 'from-red-500 to-orange-700' },
  { id: 'b9_8', classLevel: '9', subject: 'biology', title: 'Unit 8: Plant Physiology', desc: 'Measure transpiration with a Potometer and test Hydrilla for oxygen.', built: true, bg: 'from-green-500 to-emerald-700' },
  { id: 'b9_9', classLevel: '9', subject: 'biology', title: 'Unit 9: Reproduction', desc: 'Dissect flowers to create herbariums and track seed germination.', built: true, bg: 'from-pink-500 to-rose-700' },

  // Class 9 Chemistry
  { id: 'c9_1', classLevel: '9', subject: 'chemistry', title: 'Unit 2: States of Matter', desc: 'Create super-saturated solutions and trigger sudden crystallization.', built: true, bg: 'from-blue-600 to-indigo-800' },
  { id: 'c9_2', classLevel: '9', subject: 'chemistry', title: 'Unit 3-4: Atomic Structure', desc: 'Visualize U-238 alpha decay and Halogen displacement reactions.', built: true, bg: 'from-emerald-600 to-teal-800' },
  { id: 'c9_3', classLevel: '9', subject: 'chemistry', title: 'Unit 7-8: Electrochemistry', desc: 'Perform KMnO4 redox titrations and track exothermic temperature changes.', built: true, bg: 'from-purple-600 to-fuchsia-800' },
  { id: 'c9_4', classLevel: '9', subject: 'chemistry', title: 'Unit 10-12: Environmental Chem', desc: 'Simulate Catalytic Converters and test water purity melting points.', built: true, bg: 'from-cyan-600 to-blue-800' },
  { id: 'c9_5', classLevel: '9', subject: 'chemistry', title: 'Unit 14: Organic Chemistry', desc: 'Hydrogenate Ethene with Nickel catalysts and Halogenate Methane.', built: true, bg: 'from-orange-500 to-red-700' },
  { id: 'c9_6', classLevel: '9', subject: 'chemistry', title: 'Unit 17-19: Separation Tech', desc: 'Operate a distillation apparatus and measure Rf values in Chromatography.', built: true, bg: 'from-rose-500 to-pink-700' },
  { id: 'c9_7', classLevel: '9', subject: 'chemistry', title: 'Unit 18: Qualitative Analysis', desc: 'Perform Flame Tests, Pop Tests, and Limewater gas detection tests.', built: true, bg: 'from-yellow-500 to-amber-700' },

  // Class 9 Physics
  { id: 'p9_1', classLevel: '9', subject: 'physics', title: 'Unit 1: Measurement Tools', desc: 'Interactive Vernier Calipers and Screw Gauge for precise measurements.', built: true, bg: 'from-blue-700 to-indigo-900' },
  { id: 'p9_2', classLevel: '9', subject: 'physics', title: 'Unit 1 & 7: Volume & Density', desc: 'Measure density of unknown liquids and irregular solids via displacement.', built: true, bg: 'from-cyan-700 to-sky-900' },
  { id: 'p9_3', classLevel: '9', subject: 'physics', title: 'Unit 1 & 2: Kinematics', desc: 'Use a stopwatch to calculate bowling speed on a cricket pitch.', built: true, bg: 'from-emerald-700 to-teal-900' },
  { id: 'p9_4', classLevel: '9', subject: 'physics', title: 'Unit 3: Inertia', desc: 'Flick a card to drop a coin into a glass and test stacked coin inertia.', built: true, bg: 'from-amber-600 to-orange-800' },
  { id: 'p9_5', classLevel: '9', subject: 'physics', title: 'Unit 4: Friction', desc: 'Test sliding friction vs rolling friction by sliding heavy books.', built: true, bg: 'from-red-700 to-rose-900' },
  { id: 'p9_6', classLevel: '9', subject: 'physics', title: 'Unit 5: Liquid Pressure', desc: 'Drill holes in a water can to observe how liquid pressure increases with depth.', built: true, bg: 'from-blue-500 to-blue-700' },
  { id: 'p9_7', classLevel: '9', subject: 'physics', title: 'Unit 5: Springs', desc: 'Hang multiple spring balances in series to observe force readings.', built: true, bg: 'from-violet-600 to-purple-800' },
  { id: 'p9_8', classLevel: '9', subject: 'physics', title: 'Unit 8: Magnetic Fields', desc: 'Plot invisible magnetic fields using compasses and iron filings.', built: true, bg: 'from-fuchsia-600 to-pink-800' },
  { id: 'p9_9', classLevel: '9', subject: 'physics', title: 'Unit 8: Magnetization', desc: 'Induce magnetization via the stroking and hammering methods.', built: true, bg: 'from-indigo-600 to-blue-800' },
  { id: 'p9_10', classLevel: '9', subject: 'physics', title: 'Unit 9: Everyday Physics', desc: 'Identify physical phenomena at work in a virtual classroom environment.', built: true, bg: 'from-slate-600 to-gray-800' },

  // Class 9 Computer Science
  { id: 'cs9_1', classLevel: '9', subject: 'computer_science', title: 'Unit 1: Computer Systems', desc: 'Assemble hardware components and assign roles in the OSI Model.', built: true, bg: 'from-slate-700 to-gray-900' },
  { id: 'cs9_2', classLevel: '9', subject: 'computer_science', title: 'Unit 2: Algorithms', desc: 'Build logic flowcharts and IPO charts to solve computational problems.', built: true, bg: 'from-blue-700 to-indigo-900' },
  { id: 'cs9_3', classLevel: '9', subject: 'computer_science', title: 'Unit 3: Web Basics', desc: 'Write HTML/CSS to build lists and tables with a live browser preview.', built: true, bg: 'from-emerald-700 to-teal-900' },
  { id: 'cs9_4', classLevel: '9', subject: 'computer_science', title: 'Unit 3: JavaScript', desc: 'Write JavaScript grading logic and run it against an automated test suite.', built: true, bg: 'from-yellow-500 to-amber-700' },
  { id: 'cs9_5', classLevel: '9', subject: 'computer_science', title: 'Unit 3: Web Projects', desc: 'Develop major web projects like an E-Commerce Food website.', built: true, bg: 'from-cyan-700 to-sky-900' },
  { id: 'cs9_6', classLevel: '9', subject: 'computer_science', title: 'Unit 4: Data Analysis', desc: 'Enter survey data to generate dynamic Bar and Pie charts.', built: true, bg: 'from-purple-700 to-fuchsia-900' },
  { id: 'cs9_7', classLevel: '9', subject: 'computer_science', title: 'Unit 5: AI Applications', desc: 'Explore the functional and ethical issues of AI in various industries.', built: true, bg: 'from-rose-600 to-pink-800' },
  { id: 'cs9_8', classLevel: '9', subject: 'computer_science', title: 'Unit 6: Cyber Safety', desc: 'Navigate scenario-based challenges involving fake news and cyberbullying.', built: true, bg: 'from-red-600 to-orange-800' },
  { id: 'cs9_9', classLevel: '9', subject: 'computer_science', title: 'Unit 7: Entrepreneurship', desc: 'Calculate cost of production and build digital business plans.', built: true, bg: 'from-emerald-600 to-green-800' },

  // Class 9 Mathematics
  { id: 'm9_1', classLevel: '9', subject: 'mathematics', title: 'Unit 1: Real Numbers', desc: 'Calculate fractions and distances for financial and real-world logistics.', built: true, bg: 'from-blue-700 to-indigo-900' },
  { id: 'm9_2', classLevel: '9', subject: 'mathematics', title: 'Unit 2: Logarithms', desc: 'Measure earthquakes on the Richter Scale and use Scientific Notation.', built: true, bg: 'from-emerald-700 to-teal-900' },
  { id: 'm9_3', classLevel: '9', subject: 'mathematics', title: 'Unit 3: Sets & Relations', desc: 'Categorize demographic survey data into overlapping Venn Diagrams.', built: true, bg: 'from-amber-600 to-orange-800' },
  { id: 'm9_4', classLevel: '9', subject: 'mathematics', title: 'Unit 4-5: Algebraic Manipulation', desc: 'Optimize architectural volume and focal lengths using algebraic inequalities.', built: true, bg: 'from-rose-700 to-pink-900' },
  { id: 'm9_5', classLevel: '9', subject: 'mathematics', title: 'Unit 6: Trigonometry', desc: 'Measure tree heights with shadow angles and plot ship bearings.', built: true, bg: 'from-cyan-700 to-blue-900' },
  { id: 'm9_6', classLevel: '9', subject: 'mathematics', title: 'Unit 7: Coordinate Geometry', desc: 'Plot maps and use distance formulas for urban planning scenarios.', built: true, bg: 'from-violet-700 to-fuchsia-900' },
  { id: 'm9_7', classLevel: '9', subject: 'mathematics', title: 'Unit 8: Linear Graphs', desc: 'Calculate linear slopes for taxi fares and pollution indexing.', built: true, bg: 'from-red-700 to-rose-900' },
  { id: 'm9_8', classLevel: '9', subject: 'mathematics', title: 'Unit 9-10: Geometry & Polygons', desc: 'Estimate landscaping costs and interactively find the Centroid of a triangle.', built: true, bg: 'from-orange-500 to-amber-700' },
  { id: 'm9_9', classLevel: '9', subject: 'mathematics', title: 'Unit 11: Basic Statistics', desc: 'Plot histograms and determine probability flaws in factory shipments.', built: true, bg: 'from-slate-700 to-gray-900' },

  // Class 11 Chemistry
  { id: 'c11_1', classLevel: '11', subject: 'chemistry', title: 'Ch 2: Atomic Structure', desc: 'Mass Spectrometry, semiconductor doping, and emission line spectra.', built: true, bg: 'from-blue-700 to-indigo-900' },
  { id: 'c11_2', classLevel: '11', subject: 'chemistry', title: 'Ch 3: Chemical Bonding', desc: 'Use VSEPR theory to shape synthetic drugs to fit enzyme active sites.', built: true, bg: 'from-emerald-700 to-teal-900' },
  { id: 'c11_3', classLevel: '11', subject: 'chemistry', title: 'Ch 4: Stoichiometry', desc: 'Synthesize Aspirin in a wet-lab and calculate Theoretical vs Actual Yield.', built: true, bg: 'from-rose-700 to-pink-900' },
  { id: 'c11_4', classLevel: '11', subject: 'chemistry', title: 'Ch 5: Phases of Matter', desc: 'Vacuum distillation, pressure cookers, and liquid crystal properties.', built: true, bg: 'from-amber-600 to-orange-800' },
  { id: 'c11_5', classLevel: '11', subject: 'chemistry', title: 'Ch 6-7: Energetics & Kinetics', desc: 'Measure calorimetry heat flow and explore catalytic converter reactions.', built: true, bg: 'from-cyan-700 to-blue-900' },
  { id: 'c11_6', classLevel: '11', subject: 'chemistry', title: 'Ch 8 & 11: Industrial Eq.', desc: 'Master Le Chateliers Principle in Haber & Contact process control panels.', built: true, bg: 'from-purple-700 to-fuchsia-900' },
  { id: 'c11_7', classLevel: '11', subject: 'chemistry', title: 'Ch 9: Acids & Bases', desc: 'Perform drop-by-drop pH titrations and explore biological blood buffers.', built: true, bg: 'from-red-700 to-rose-900' },
  { id: 'c11_8', classLevel: '11', subject: 'chemistry', title: 'Ch 12-14: Environmental Chem', desc: 'Run a municipal water treatment plant and analyze photochemical smog.', built: true, bg: 'from-teal-600 to-cyan-800' },
  { id: 'c11_9', classLevel: '11', subject: 'chemistry', title: 'Ch 18-21: Organic Analysis', desc: 'Use Tollens, Lucas, and 2,4-DNPH tests to identify unknown compounds.', built: true, bg: 'from-orange-600 to-red-800' },
  { id: 'c11_10', classLevel: '11', subject: 'chemistry', title: 'Ch 15-22: Organic Synthesis', desc: 'Distill petrochemicals and perform Retrosynthetic Analysis on complex drugs.', built: true, bg: 'from-slate-700 to-gray-900' },

  // Class 11 Physics
  { id: 'p11_1', classLevel: '11', subject: 'physics', title: 'Unit 1: Physical Quantities', desc: 'Target shooting for precision/accuracy and estimating daily physics.', built: true, bg: 'from-blue-700 to-indigo-900' },
  { id: 'p11_2', classLevel: '11', subject: 'physics', title: 'Unit 2: Vectors', desc: 'Calculate GPS navigation vectors and horizontal force components.', built: true, bg: 'from-emerald-700 to-teal-900' },
  { id: 'p11_3', classLevel: '11', subject: 'physics', title: 'Unit 3: Translatory Motion', desc: 'Calculate projectile air resistance and explosive rocket momentum.', built: true, bg: 'from-amber-600 to-orange-800' },
  { id: 'p11_4', classLevel: '11', subject: 'physics', title: 'Unit 4: Rotational Motion', desc: 'Bank high-speed corners, use centrifuges, and spin ice skaters.', built: true, bg: 'from-rose-700 to-pink-900' },
  { id: 'p11_5', classLevel: '11', subject: 'physics', title: 'Unit 5: Work & Energy', desc: 'Measure weightlifting biomechanics and parachute resistive work.', built: true, bg: 'from-cyan-700 to-blue-900' },
  { id: 'p11_6', classLevel: '11', subject: 'physics', title: 'Unit 6: Fluid Mechanics', desc: 'Test submarine buoyancy, wind tunnel aerodynamics, and Bernoulli airfoils.', built: true, bg: 'from-violet-700 to-fuchsia-900' },
  { id: 'p11_7', classLevel: '11', subject: 'physics', title: 'Unit 7: Physics of Solids', desc: 'Test Young\'s Modulus on suspension bridges and analyze graphene.', built: true, bg: 'from-slate-600 to-gray-800' },
  { id: 'p11_8', classLevel: '11', subject: 'physics', title: 'Unit 8: Thermodynamics', desc: 'Operate 4-stroke IC engines and reverse-flow refrigerator pumps.', built: true, bg: 'from-red-700 to-orange-900' },
  { id: 'p11_9', classLevel: '11', subject: 'physics', title: 'Unit 9: Waves', desc: 'Track objects with Doppler Radar, observe earthquakes, and LIGO interferometers.', built: true, bg: 'from-teal-600 to-cyan-800' },
  { id: 'p11_10', classLevel: '11', subject: 'physics', title: 'Unit 10: Electrostatics', desc: 'Shield objects inside Faraday cages and manipulate MRI ferrofluids.', built: true, bg: 'from-fuchsia-700 to-purple-900' },
  { id: 'p11_11', classLevel: '11', subject: 'physics', title: 'Unit 11: Electricity', desc: 'Build circuits with LDRs and test carbon-fiber concrete resistance.', built: true, bg: 'from-indigo-600 to-blue-800' },
  { id: 'p11_12', classLevel: '11', subject: 'physics', title: 'Unit 12: Electromagnetism', desc: 'Filter particles with velocity selectors and build seismic detectors.', built: true, bg: 'from-orange-600 to-red-800' },
  { id: 'p11_13', classLevel: '11', subject: 'physics', title: 'Unit 13-14: Modern Physics', desc: 'Convert mass to energy, execute PET scans, and operate Synchrotrons.', built: true, bg: 'from-zinc-700 to-black' },

  // Class 11 Computer Science
  { id: 'cs11_1', classLevel: '11', subject: 'computer', title: 'Unit 1: Systems & Networks', desc: 'Logic Gate breadboards, Load Testing, and Firewall Cybersecurity.', built: true, bg: 'from-blue-600 to-indigo-800' },
  { id: 'cs11_2', classLevel: '11', subject: 'computer', title: 'Unit 2: Algorithms', desc: 'Navigate Jeroo grids, trace tables, and track memory sorting arrays.', built: true, bg: 'from-emerald-600 to-teal-800' },
  { id: 'cs11_3', classLevel: '11', subject: 'computer', title: 'Unit 3: Python Fundamentals', desc: 'Draw 2D Turtle graphics, manipulate lists, and use IDE debuggers.', built: true, bg: 'from-amber-500 to-orange-700' },
  { id: 'cs11_4', classLevel: '11', subject: 'computer', title: 'Unit 4: Data Science', desc: 'Run A/B testing, Pandas Visualizations, and K-means Clustering.', built: true, bg: 'from-rose-600 to-pink-800' },
  { id: 'cs11_5', classLevel: '11', subject: 'computer', title: 'Unit 5: Applications of CS', desc: 'Interact with IoT PIR sensors and trace Blockchain ledgers.', built: true, bg: 'from-cyan-600 to-blue-800' },
  { id: 'cs11_6', classLevel: '11', subject: 'computer', title: 'Unit 6: Impacts of Computing', desc: 'Evaluate dataset Bias and test Assistive Screen Readers.', built: true, bg: 'from-violet-600 to-fuchsia-800' },
  { id: 'cs11_7', classLevel: '11', subject: 'computer', title: 'Unit 7: Digital Research', desc: 'Design Google Forms surveys and translate data into Infographics.', built: true, bg: 'from-teal-500 to-emerald-700' },
  { id: 'cs11_8', classLevel: '11', subject: 'computer', title: 'Unit 8: Product Development', desc: 'Neuro-Mat startup simulator: build an MVP and track hardware costs.', built: true, bg: 'from-slate-700 to-gray-900' },

  // Class 11 Biology
  { id: 'b11_1', classLevel: '11', subject: 'biology', title: 'Unit 1: Cytology', desc: 'View cell topography with 50-million-x SEM and route stem cells.', built: true, bg: 'from-emerald-700 to-teal-900' },
  { id: 'b11_2', classLevel: '11', subject: 'biology', title: 'Unit 2: Biomolecules', desc: 'Biochemical tests: Iodine, Benedicts, Biuret, and Sudan-III rings.', built: true, bg: 'from-blue-700 to-indigo-900' },
  { id: 'b11_3', classLevel: '11', subject: 'biology', title: 'Unit 3: Enzymes', desc: 'Filter lactose with alginate beads and evaluate diagnostic blood panels.', built: true, bg: 'from-purple-700 to-fuchsia-900' },
  { id: 'b11_4', classLevel: '11', subject: 'biology', title: 'Unit 4: Bioenergetics', desc: 'Measure chlorophyll absorption spectra with a Spectrophotometer.', built: true, bg: 'from-green-600 to-emerald-800' },
  { id: 'b11_5', classLevel: '11', subject: 'biology', title: 'Unit 5-6: Microbiology', desc: 'Test agar plate antibiotics, construct Phage libraries, and treat HIV.', built: true, bg: 'from-cyan-700 to-blue-900' },
  { id: 'b11_6', classLevel: '11', subject: 'biology', title: 'Unit 7: Fungi', desc: 'Control Rhizopus incubation and track Saccharomyces industrial brewing.', built: true, bg: 'from-amber-700 to-orange-900' },
  { id: 'b11_7', classLevel: '11', subject: 'biology', title: 'Unit 8-9: Botany', desc: 'Graph water potential, test hydroponics, and trace xylem capillary dye.', built: true, bg: 'from-lime-700 to-green-900' },
  { id: 'b11_8', classLevel: '11', subject: 'biology', title: 'Unit 12: Inheritance', desc: 'Transfuse ABO/Rh blood types and extract amniotic fluid via CVS.', built: true, bg: 'from-red-700 to-rose-900' },
  { id: 'b11_9', classLevel: '11', subject: 'biology', title: 'Unit 13: Genetics', desc: 'Centrifuge Meselson-Stahl DNA isotopes and trace Hershey-Chase phages.', built: true, bg: 'from-indigo-700 to-violet-900' },

  // Class 12 Biology
  { id: 'b12_1', classLevel: '12', subject: 'biology', title: 'Unit 1: Digestive', desc: 'Run Biochemical food tests for starch (Iodine) and proteins (NaOH).', built: true, bg: 'from-blue-700 to-indigo-900' },
  { id: 'b12_2', classLevel: '12', subject: 'biology', title: 'Unit 2-3: Cardio/Resp', desc: 'Read Electrocardiograms (ECGs) and perform timed CPR intervals.', built: true, bg: 'from-rose-700 to-red-900' },
  { id: 'b12_3', classLevel: '12', subject: 'biology', title: 'Unit 4: Urinary', desc: 'Simulate Haemodialysis filtering and operate ESWL kidney stone lasers.', built: true, bg: 'from-emerald-700 to-teal-900' },
  { id: 'b12_4', classLevel: '12', subject: 'biology', title: 'Unit 5-6: Neuro/Endo', desc: 'Track NSAID painkillers blocking enzymes and measure reaction times.', built: true, bg: 'from-violet-700 to-fuchsia-900' },
  { id: 'b12_5', classLevel: '12', subject: 'biology', title: 'Unit 7: Skeletal', desc: 'Perform Titanium Arthroplasty and map the 4-step bone repair cycle.', built: true, bg: 'from-amber-700 to-orange-900' },
  { id: 'b12_6', classLevel: '12', subject: 'biology', title: 'Unit 9: Immunity', desc: 'Engineer Monoclonal Antibodies (mAbs) and track transplant rejections.', built: true, bg: 'from-cyan-700 to-blue-900' },
  { id: 'b12_7', classLevel: '12', subject: 'biology', title: 'Unit 10: Biotechnology', desc: 'Splice human insulin into bacterial plasmids and run a PCR thermocycler.', built: true, bg: 'from-indigo-700 to-purple-900' },
  { id: 'b12_8', classLevel: '12', subject: 'biology', title: 'Unit 11-12: Structural', desc: 'Analyze X-Ray Crystallography diffractions and calculate Standard Dev.', built: true, bg: 'from-slate-700 to-gray-900' },
  { id: 'b12_9', classLevel: '12', subject: 'biology', title: 'Unit 13-15: Pharma', desc: 'Run 4-Phase Clinical Drug Trials and track Ocean Acidification.', built: true, bg: 'from-teal-700 to-emerald-900' },

  // Class 11 Mathematics
  { id: 'm11_1', classLevel: '11', subject: 'math', title: 'Unit 1: Complex Numbers', desc: 'Graph complex AC currents and model Simple Harmonic Motion waves.', built: true, bg: 'from-blue-600 to-indigo-800' },
  { id: 'm11_2', classLevel: '11', subject: 'math', title: 'Unit 2: Matrices', desc: 'Encrypt messages with Matrix keys and translate 2D coordinate planes.', built: true, bg: 'from-emerald-600 to-teal-800' },
  { id: 'm11_3', classLevel: '11', subject: 'math', title: 'Unit 3: Vectors in Space', desc: 'Navigate airplane crosswinds and calculate torque cross-products.', built: true, bg: 'from-amber-600 to-orange-800' },
  { id: 'm11_4', classLevel: '11', subject: 'math', title: 'Unit 4: Sequences', desc: 'Track geometric swinging pendulums and radioactive half-life decay.', built: true, bg: 'from-rose-600 to-pink-800' },
  { id: 'm11_5', classLevel: '11', subject: 'math', title: 'Unit 5: Polynomials', desc: 'Use Remainder Theorems for ballistics and factor 3D architecture.', built: true, bg: 'from-cyan-600 to-blue-800' },
  { id: 'm11_6', classLevel: '11', subject: 'math', title: 'Unit 6: Combinatorics', desc: 'Calculate permutation scrambles for Number Plates and Passwords.', built: true, bg: 'from-violet-600 to-fuchsia-800' },
  { id: 'm11_7', classLevel: '11', subject: 'math', title: 'Unit 7: Induction & Binomial', desc: 'Prove formulas via Domino Effects and map probability with Pascal.', built: true, bg: 'from-teal-600 to-emerald-800' },
  { id: 'm11_8', classLevel: '11', subject: 'math', title: 'Unit 8-9: Trigonometry', desc: 'Graph the periodic sinusoidal heights of rotating Ferris Wheels.', built: true, bg: 'from-slate-700 to-gray-900' },

  // Class 12 Mathematics
  { id: 'm12_1', classLevel: '12', subject: 'math', title: 'Unit 2: Derivatives', desc: 'Optimize architectural dimensions and calculate marginal business revenue.', built: true, bg: 'from-red-600 to-rose-800' },
  { id: 'm12_2', classLevel: '12', subject: 'math', title: 'Unit 3: Integration', desc: 'Map Dam hydrostatic force and generate 3D Solids of Revolution.', built: true, bg: 'from-blue-600 to-indigo-800' },
  { id: 'm12_3', classLevel: '12', subject: 'math', title: 'Unit 4: Differential Eq', desc: 'Track Newtons Law of Cooling and ballistics with air resistance.', built: true, bg: 'from-emerald-600 to-teal-800' },
  { id: 'm12_4', classLevel: '12', subject: 'math', title: 'Unit 7: Conics', desc: 'Model Hyperbolic nuclear cooling towers and Elliptical orbits.', built: true, bg: 'from-violet-600 to-fuchsia-800' },
  { id: 'm12_5', classLevel: '12', subject: 'math', title: 'Unit 6: Analytical Geo', desc: 'Map urban traffic intersections and calculate landscaping costs.', built: true, bg: 'from-amber-600 to-orange-800' },
  { id: 'm12_6', classLevel: '12', subject: 'math', title: 'Unit 5: Kinematics', desc: 'Graph 3D particle trajectories and displacement-time vehicular models.', built: true, bg: 'from-cyan-600 to-blue-800' },
  { id: 'm12_7', classLevel: '12', subject: 'math', title: 'Unit 1: Functions', desc: 'Calculate Market Equilibrium points and compound interest growth.', built: true, bg: 'from-indigo-600 to-violet-800' },
  { id: 'm12_8', classLevel: '12', subject: 'math', title: 'Unit 8: Inverse Trig', desc: 'Reverse-engineer 3D rendering algorithms and optics angles.', built: true, bg: 'from-slate-700 to-gray-900' },

  // Class 12 Physics
  { id: 'p12_1', classLevel: '12', subject: 'physics', title: 'Unit 15: Gravitation', desc: 'Simulate Newtons Cannonball and calculate LEO satellite orbits.', built: true, bg: 'from-blue-700 to-slate-900' },
  { id: 'p12_2', classLevel: '12', subject: 'physics', title: 'Unit 16: Thermodynamics', desc: 'Levitate Superconducting Maglevs and balance White Dwarf star pressure.', built: true, bg: 'from-red-700 to-rose-900' },
  { id: 'p12_3', classLevel: '12', subject: 'physics', title: 'Unit 17: SHM', desc: 'Dampen automotive shock absorbers and generate Acoustic Standing Waves.', built: true, bg: 'from-emerald-700 to-teal-900' },
  { id: 'p12_4', classLevel: '12', subject: 'physics', title: 'Unit 18: Diffraction', desc: 'Use destructive interference for noise-canceling headphones.', built: true, bg: 'from-violet-700 to-fuchsia-900' },
  { id: 'p12_5', classLevel: '12', subject: 'physics', title: 'Unit 19: Electric Potential', desc: 'Track Action Potentials in electric eels and charge RC flash circuits.', built: true, bg: 'from-amber-700 to-yellow-900' },
  { id: 'p12_6', classLevel: '12', subject: 'physics', title: 'Unit 20: AC Current', desc: 'Build Full-Wave AC-to-DC Bridge Rectifiers with Capacitive Filters.', built: true, bg: 'from-cyan-700 to-blue-900' },
  { id: 'p12_7', classLevel: '12', subject: 'physics', title: 'Unit 21-22: Quantum/Nuclear', desc: 'Control Nuclear Fission reactors and track PET Scan Pair Annihilation.', built: true, bg: 'from-indigo-700 to-purple-900' },
  { id: 'p12_8', classLevel: '12', subject: 'physics', title: 'Unit 23-24: Cosmology', desc: 'Calculate star surface temperatures and map Red-Shift Doppler effects.', built: true, bg: 'from-slate-700 to-gray-900' },
  { id: 'p12_9', classLevel: '12', subject: 'physics', title: 'Unit 25-26: Medical Imaging', desc: 'Simulate Piezoelectric Ultrasonic Sonography and X-Ray bone absorption.', built: true, bg: 'from-teal-700 to-emerald-900' },

  // Class 12 Chemistry
  { id: 'c12_1', classLevel: '12', subject: 'chemistry', title: 'Unit 2: Electrochemistry', desc: 'Build Galvanic Cells and calculate Avogadros number via Electrolysis.', built: true, bg: 'from-emerald-700 to-teal-900' },
  { id: 'c12_2', classLevel: '12', subject: 'chemistry', title: 'Unit 3-4: Equilibrium/Acid', desc: 'Titrate pH equivalence curves and formulate blood plasma buffers.', built: true, bg: 'from-amber-700 to-orange-900' },
  { id: 'c12_3', classLevel: '12', subject: 'chemistry', title: 'Unit 5-6: Transition Metals', desc: 'Perform metallic Flame Tests and map d-orbital Ligand Exchange.', built: true, bg: 'from-rose-700 to-pink-900' },
  { id: 'c12_4', classLevel: '12', subject: 'chemistry', title: 'Unit 7-14: Organic Synthesis', desc: 'Synthesize Azo-Dyes and run AI Retrosynthetic Drug Analysis.', built: true, bg: 'from-violet-700 to-purple-900' },
  { id: 'c12_5', classLevel: '12', subject: 'chemistry', title: 'Unit 12-15: Biochemistry', desc: 'Run amino acid Electrophoresis and perform DNA Fingerprinting.', built: true, bg: 'from-blue-700 to-indigo-900' },
  { id: 'c12_6', classLevel: '12', subject: 'chemistry', title: 'Unit 17-19: Spectroscopy', desc: 'Analyze molecular structures with NMR, IR, Mass Spec, and TLC.', built: true, bg: 'from-cyan-700 to-blue-900' },
  { id: 'c12_7', classLevel: '12', subject: 'chemistry', title: 'Unit 21: Pharmacology', desc: 'Inhibit COX with Aspirin and rupture cell walls with Penicillin.', built: true, bg: 'from-red-700 to-rose-900' },
  { id: 'c12_8', classLevel: '12', subject: 'chemistry', title: 'Unit 22: Agriculture', desc: 'Apply NPK Fertilizers and track Acid Rain soil leaching.', built: true, bg: 'from-green-700 to-emerald-900' },
  { id: 'c12_9', classLevel: '12', subject: 'chemistry', title: 'Unit 20-23: Industry', desc: 'Operate a 1450C Cement Kiln and perform Petrochemical Cracking.', built: true, bg: 'from-slate-700 to-gray-900' },

  // Class 12 Computer Science
  { id: 'cs12_1', classLevel: '12', subject: 'computer', title: 'Unit 1: Computer Systems', desc: 'Simulate A/B Testing, Accessibility, and balance MFA vs Usability.', built: true, bg: 'from-blue-800 to-slate-900' },
  { id: 'cs12_2', classLevel: '12', subject: 'computer', title: 'Unit 2: Data Structures', desc: 'Manipulate Stacks, Queues, Graphs, and Binary Tree traversals.', built: true, bg: 'from-emerald-800 to-teal-900' },
  { id: 'cs12_3', classLevel: '12', subject: 'computer', title: 'Unit 3: Programming', desc: 'Model OOP Encapsulation and execute SQLite 3NF Database Normalization.', built: true, bg: 'from-violet-800 to-purple-900' },
  { id: 'cs12_4', classLevel: '12', subject: 'computer', title: 'Unit 4: Data & Analysis', desc: 'Train ML models calculating Accuracy, Precision, and P-Values.', built: true, bg: 'from-rose-800 to-red-900' },
  { id: 'cs12_5', classLevel: '12', subject: 'computer', title: 'Unit 5: Deep Learning', desc: 'Trace Neural Network Feedforward/Backpropagation pathways.', built: true, bg: 'from-amber-800 to-orange-900' },
  { id: 'cs12_6', classLevel: '12', subject: 'computer', title: 'Unit 5: IoT & Cloud', desc: 'Deploy an IoT sensor array and track Blockchain ledger hashes.', built: true, bg: 'from-cyan-800 to-blue-900' },
  { id: 'cs12_7', classLevel: '12', subject: 'computer', title: 'Unit 6: Cybersecurity', desc: 'Defend against DDoS and encode data via Asymmetric Cryptography.', built: true, bg: 'from-indigo-800 to-violet-900' },
  { id: 'cs12_8', classLevel: '12', subject: 'computer', title: 'Unit 7: Digital Literacy', desc: 'Master advanced database searches and GDPR Data Anonymization.', built: true, bg: 'from-teal-800 to-emerald-900' },
  { id: 'cs12_9', classLevel: '12', subject: 'computer', title: 'Unit 8: Entrepreneurship', desc: 'Simulate launching an MVP and analyzing Beta Testing metrics.', built: true, bg: 'from-slate-800 to-gray-900' }
];

const CLASSES = ['6', '7', '8', '9', '10', '11', '12'];

const getSubjectsForClass = (classLevel: string) => {
  const num = parseInt(classLevel);
  if (num >= 6 && num <= 8) {
    return ['science', 'computer'];
  } else {
    return ['physics', 'chemistry', 'biology', 'math', 'computer'];
  }
};

const formatSubject = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function Breadcrumbs() {
  const { classId, subjectId } = useParams();
  
  return (
    <div className="inline-flex items-center gap-2 text-sm text-slate-500 mb-6 bg-white py-2 px-4 rounded-lg shadow-sm border border-slate-200">
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSearchModules = LAB_MODULES.filter(m => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    return (
      m.title.toLowerCase().includes(query) ||
      m.desc.toLowerCase().includes(query) ||
      m.subject.toLowerCase().includes(query) ||
      `class ${m.classLevel}`.includes(query)
    );
  }).slice(0, 8); // Limit to 8 results

  return (
    <Layout>
      <div className="flex flex-col relative">
        <Breadcrumbs />

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 p-10 mb-12 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-outfit tracking-tight">
              Welcome to Virtual<span className="text-blue-300">Lab</span>
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8 font-medium">
              Explore our massive library of <span className="font-bold text-white bg-blue-500/30 px-2 py-0.5 rounded">384 interactive modules</span> across Physics, Chemistry, Biology, Mathematics, and Computer Science.
            </p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div ref={searchRef} className="relative max-w-2xl mx-auto w-full mb-10 z-50">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search by topic, chapter, subject, or class..."
              className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-sm text-lg outline-none transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
          </div>

          {/* Auto-complete Dropdown */}
          {isDropdownOpen && searchQuery.trim() !== '' && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
              {filteredSearchModules.length > 0 ? (
                <ul className="max-h-96 overflow-y-auto py-2">
                  {filteredSearchModules.map(module => (
                    <li key={module.id}>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setSearchQuery('');
                          navigate(`/class/${module.classLevel}/${module.subject}/lab/${module.id}`);
                        }}
                        className="w-full text-left px-6 py-3 hover:bg-slate-50 transition-colors flex flex-col gap-1 border-b border-slate-50 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">{module.title}</span>
                          <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">
                            Class {module.classLevel} &bull; {formatSubject(module.subject)}
                          </span>
                        </div>
                        <span className="text-sm text-slate-500 line-clamp-1">{module.desc}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center text-slate-500">
                  No labs found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
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
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
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
                  className={`glass rounded-3xl ${lab.built ? 'hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 border-white/40 cursor-pointer' : 'border-dashed border-slate-300 opacity-80'} overflow-hidden transition-all duration-300 group flex flex-col h-full relative`}
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
                      <span className="bg-white/30 backdrop-blur-md border border-white/40 text-white text-xs font-bold tracking-wide px-3 py-1.5 rounded-full shadow-sm">{formatSubject(lab.subject)}</span>
                      <span className="bg-black/30 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wide px-3 py-1.5 rounded-full shadow-sm">Class {lab.classLevel}</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col relative bg-white/60 backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className={`text-xl font-bold font-outfit ${lab.built ? 'text-slate-800 group-hover:text-blue-700' : 'text-slate-600'} transition-colors leading-tight`}>{lab.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-6 font-medium">
                      {lab.desc}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-200/60">
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

function LabRunner() {
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-2xl border border-slate-200">
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
      <div className="flex flex-col min-h-[70vh] bg-white rounded-3xl border border-slate-200 shadow-sm mt-8 p-12">
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
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-3xl border border-slate-200 shadow-sm mt-8 p-12">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4 font-outfit tracking-tight">Platform Settings</h2>
        <p className="text-slate-500 max-w-md text-center text-lg">Accessibility controls, audio settings, and theme configurations will be available here soon.</p>
      </div>
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ClassSelection />} />
      <Route path="/login" element={<Login />} />
      <Route path="/progress" element={<HistoryDashboard />} />
      <Route path="/history" element={<HistoryDashboard />} />
      <Route path="/settings" element={<SettingsPanel />} />
      <Route path="/class/:classId" element={<SubjectSelection />} />
      <Route path="/class/:classId/:subjectId" element={<ModuleSelection />} />
      <Route path="/class/:classId/:subjectId/lab/:moduleId" element={<LabRunner />} />
    </Routes>
  );
}
