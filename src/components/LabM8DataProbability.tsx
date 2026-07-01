import { useState, useRef, useMemo } from 'react';
import { ArrowLeft, BarChart2, Settings, Play, Target, Activity } from 'lucide-react';

export default function LabM8DataProbability({ onExit }: { onExit?: () => void }) {
 // --- STATE ---
 const [trueValue, setTrueValue] = useState<number>(25.0); // True Temperature in °C
 const [noiseStd, setNoiseStd] = useState<number>(2.0); // Standard Deviation of sensor noise
 const [sampleSize, setSampleSize] = useState<number>(50);
 
 const [currentBatch, setCurrentBatch] = useState<number[]>([]);
 const [history, setHistory] = useState<{ id: number; n: number; mean: number; variance: number; std: number; range: number }[]>([]);
 const nextBatchId = useRef(1);

 const [assessmentAnswer, setAssessmentAnswer] = useState<string>('');
 const [assessmentFeedback, setAssessmentFeedback] = useState<string>('');

 // --- MATH UTILS ---
 // Box-Muller transform for Gaussian random numbers
 const generateGaussian = (mean: number, std: number) => {
 let u = 0, v = 0;
 while(u === 0) u = Math.random();
 while(v === 0) v = Math.random();
 const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
 return z * std + mean;
 };

 // --- HANDLERS ---
 const takeMeasurements = () => {
 const newBatch = [];
 for (let i = 0; i < sampleSize; i++) {
  newBatch.push(generateGaussian(trueValue, noiseStd));
 }
 setCurrentBatch(newBatch);

 // Calculate stats
 const min = Math.min(...newBatch);
 const max = Math.max(...newBatch);
 const range = max - min;
 const sum = newBatch.reduce((a, b) => a + b, 0);
 const mean = sum / sampleSize;
 const sqDiffs = newBatch.map(val => Math.pow(val - mean, 2));
 const variance = sqDiffs.reduce((a, b) => a + b, 0) / (sampleSize - 1);
 const std = Math.sqrt(variance);

 setHistory(prev => [
  ...prev,
  { id: nextBatchId.current++, n: sampleSize, mean, variance, std, range }
 ]);
 };

 const checkAssessment = () => {
 // Dataset: 24.5, 25.1, 24.8, 25.5, 25.1
 // Mean = 25.0
 // Deviations: -0.5, 0.1, -0.2, 0.5, 0.1
 // Sq Diffs: 0.25, 0.01, 0.04, 0.25, 0.01 -> Sum = 0.56
 // Variance (n-1) = 0.56 / 4 = 0.14
 const correctVariance = 0.14;
 const userAns = parseFloat(assessmentAnswer);
 
 if (isNaN(userAns)) {
  setAssessmentFeedback("Please enter a valid number.");
 } else if (Math.abs(userAns - correctVariance) < 0.01) {
  setAssessmentFeedback("Correct! You accurately calculated the sample variance using s² = Σ(x - x̄)² / (n-1).");
 } else {
  setAssessmentFeedback("Incorrect. Find the mean first (25.0), subtract mean from each value, square them, sum them, and divide by n-1 (4).");
 }
 };

 // --- HISTOGRAM & THEORETICAL CURVE ---
 const { bins, binWidth, minVal, maxVal, maxFreq } = useMemo(() => {
 if (currentBatch.length === 0) return { bins: [], binWidth: 0, minVal: 0, maxVal: 0, maxFreq: 0 };
 
 // Fixed axis bounds based on true parameters to keep chart stable
 const plotMin = trueValue - 10;
 const plotMax = trueValue + 10;
 const numBins = 15;
 const bw = (plotMax - plotMin) / numBins;
 
 const freqs = new Array(numBins).fill(0);
 currentBatch.forEach(val => {
  let binIdx = Math.floor((val - plotMin) / bw);
  if (binIdx < 0) binIdx = 0;
  if (binIdx >= numBins) binIdx = numBins - 1;
  freqs[binIdx]++;
 });

 return { 
  bins: freqs, 
  binWidth: bw, 
  minVal: plotMin, 
  maxVal: plotMax, 
  maxFreq: Math.max(...freqs, 5) // at least 5 for scale
 };
 }, [currentBatch, trueValue]);

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none dark:!bg-[#000000] dark:text-[#ffffff]">
  {/* HEADER */}
  <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#1c1b1b] flex-shrink-0">
  <div className="flex items-center gap-3">
   {onExit && (
   <button
    onClick={onExit}
    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors whitespace-nowrap flex-shrink-0"
   >
    <ArrowLeft className="w-5 h-5" />
   </button>
   )}
   <h1 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
   <BarChart2 className="w-6 h-6 text-emerald-500" />
   Weather Sensor Quality Control (Probability & Data)
   </h1>
  </div>
  </header>

  {/* 3-COLUMN LAYOUT */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 flex-1 items-start">
  
  {/* COLUMN 1: THEORY & SETUP */}
  <div className="bg-white dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col gap-6">
   <div>
   <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-slate-800 dark:text-white">
    <Settings className="w-5 h-5 text-blue-500" />
    Sensor Environment
   </h2>
   <p className="text-sm text-slate-600 dark:text-[#71717a] mb-4">
    Simulate taking weather temperature readings. All sensors have inherent thermal noise (Variance). Adjust parameters to see the effect on experimental data.
   </p>

   <div className="space-y-4">
    <div className="flex flex-col gap-1">
    <label className="text-sm font-medium flex justify-between">
     <span>True Environment Temp (°C)</span>
     <span>{trueValue.toFixed(1)}</span>
    </label>
    <input
     type="range"
     min="15"
     max="35"
     step="0.5"
     value={trueValue}
     onChange={(e) => setTrueValue(parseFloat(e.target.value))}
     className="w-full"
    />
    </div>

    <div className="flex flex-col gap-1">
    <label className="text-sm font-medium flex justify-between">
     <span>Sensor Noise (Std Dev, σ)</span>
     <span>{noiseStd.toFixed(1)} °C</span>
    </label>
    <input
     type="range"
     min="0.5"
     max="5.0"
     step="0.5"
     value={noiseStd}
     onChange={(e) => setNoiseStd(parseFloat(e.target.value))}
     className="w-full"
    />
    </div>

    <div className="flex flex-col gap-1">
    <label className="text-sm font-medium flex justify-between">
     <span>Sample Size (n)</span>
     <span>{sampleSize} readings</span>
    </label>
    <input
     type="range"
     min="10"
     max="500"
     step="10"
     value={sampleSize}
     onChange={(e) => setSampleSize(parseInt(e.target.value))}
     className="w-full"
    />
    </div>
   </div>
   </div>
   
   <button
   onClick={takeMeasurements}
   className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
   >
   <Play className="w-4 h-4 fill-current" />
   Simulate Readings
   </button>

   <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300">
   <strong>Theoretical Note:</strong> The sample mean (x̄) should approach the True Temp (μ) as sample size (n) increases, demonstrating the Law of Large Numbers.
   </div>
  </div>

  {/* COLUMN 2: SIMULATION STAGE */}
  <div className="bg-white dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col items-center min-h-[400px] relative">
   <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-2 flex items-center gap-2 self-start">
   <Target className="w-5 h-5 text-indigo-500" />
   Frequency Distribution vs Theoretical Probability
   </h2>
   
   <div className="w-full h-64 mt-4 relative border-b-2 border-l-2 border-slate-300 dark:border-[#1c1b1b]">
   {currentBatch.length > 0 ? (
    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
    {/* Histogram Bars */}
    {bins.map((freq, i) => {
     const x = (i / bins.length) * 100;
     const width = (1 / bins.length) * 100 * 0.9; // 10% gap
     const height = (freq / maxFreq) * 90; // max 90% height
     const y = 100 - height;
     return (
     <rect
      key={i}
      x={x}
      y={y}
      width={width}
      height={height}
      fill="#34d399"
      opacity="0.7"
     />
     );
    })}

    {/* Theoretical Curve (Gaussian) */}
    <path
     d={`M 0 100 ${Array.from({ length: 50 }).map((_, i) => {
     const x = (i / 49); // 0 to 1
     const actualX = minVal + x * (maxVal - minVal);
     // Gaussian PDF
     const coeff = 1 / (noiseStd * Math.sqrt(2 * Math.PI));
     const exp = Math.exp(-0.5 * Math.pow((actualX - trueValue) / noiseStd, 2));
     const prob = coeff * exp;
     
     // Scale probability to histogram heights
     // Expected freq in bin = prob * binWidth * sampleSize
     const expectedFreq = prob * binWidth * sampleSize;
     const y = 100 - (expectedFreq / maxFreq) * 90;
     return `L ${x * 100} ${y}`;
     }).join(' ')}`}
     fill="none"
     stroke="#ef4444"
     strokeWidth="2"
     vectorEffect="non-scaling-stroke"
    />
    </svg>
   ) : (
    <div className="flex items-center justify-center h-full text-slate-400 italic text-sm">
    Run simulation to view probability distribution.
    </div>
   )}
   </div>

   <div className="w-full flex justify-between mt-2 text-xs text-slate-500 dark:text-[#71717a] font-mono px-2">
   <span>{currentBatch.length > 0 ? minVal.toFixed(1) : '15.0'} °C</span>
   <span>{currentBatch.length > 0 ? trueValue.toFixed(1) : '25.0'} °C</span>
   <span>{currentBatch.length > 0 ? maxVal.toFixed(1) : '35.0'} °C</span>
   </div>
   
   <div className="mt-4 flex items-center justify-center gap-4 text-sm w-full">
   <div className="flex items-center gap-1">
    <div className="w-3 h-3 bg-[#34d399] opacity-70"></div>
    <span>Experimental Frequency</span>
   </div>
   <div className="flex items-center gap-1">
    <div className="w-4 h-0.5 bg-[#ef4444]"></div>
    <span>Theoretical Probability</span>
   </div>
   </div>
  </div>

  {/* COLUMN 3: DATA & ASSESSMENT */}
  <div className="flex flex-col gap-4">
   
   {/* Data Table */}
   <div className="bg-white dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] max-h-[300px] flex flex-col">
   <h2 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">Batch Analytics</h2>
   <div className="lg:overflow-y-auto flex-1">
    <table className="w-full text-sm text-left">
    <thead className="sticky top-0 text-slate-500 dark:text-[#71717a]">
     <tr>
     <th className="py-2">Batch</th>
     <th className="py-2">n</th>
     <th className="py-2">Mean (x̄)</th>
     <th className="py-2">Std (s)</th>
     </tr>
    </thead>
    <tbody>
     {history.map(h => (
     <tr key={h.id} className="border-t border-slate-100 dark:border-[#1c1b1b]">
      <td className="py-2">#{h.id}</td>
      <td className="py-2">{h.n}</td>
      <td className="py-2 font-mono text-emerald-600 dark:text-emerald-400">{h.mean.toFixed(2)}</td>
      <td className="py-2 font-mono text-indigo-600 dark:text-indigo-400">{h.std.toFixed(2)}</td>
     </tr>
     ))}
     {history.length === 0 && (
     <tr>
      <td colSpan={4} className="py-4 text-center text-slate-400 italic">No batches recorded.</td>
     </tr>
     )}
    </tbody>
    </table>
   </div>
   </div>

   {/* Assessment */}
   <div className="bg-white dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
   <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-slate-800 dark:text-white">
    <Activity className="w-5 h-5 text-amber-500" />
    QC Assessment
   </h2>
   <p className="text-sm text-slate-600 dark:text-[#71717a] mb-3">
    During quality control, a technician pulls 5 sensor readings: <br/>
    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">24.5, 25.1, 24.8, 25.5, 25.1</span><br/>
    Calculate the sample variance (s²).
   </p>
   <div className="flex flex-wrap gap-2">
    <input
    type="number"
    step="0.01"
    value={assessmentAnswer}
    onChange={(e) => setAssessmentAnswer(e.target.value)}
    placeholder="e.g. 0.25"
    className="flex-1 min-w-0 p-2 border rounded-md text-sm dark:bg-slate-700 dark:border-[#1c1b1b] dark:text-white"
    />
    <button
    onClick={checkAssessment}
    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40"
    >
    Check Answer
    </button>
   </div>
   {assessmentFeedback && (
    <div className={`mt-3 text-sm p-2 rounded-md ${assessmentFeedback.includes('Correct') ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
    {assessmentFeedback}
    </div>
   )}
   </div>

  </div>
  </div>
 </div>
 );
}
