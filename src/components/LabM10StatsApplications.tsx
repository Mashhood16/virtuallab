import { useState, useEffect, useCallback, useMemo } from 'react';
import { Calculator, BookOpen, LineChart, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import LabHeader from './LabHeader';

interface Point {
 x: number;
 y: number;
}

export default function LabM10StatsApplications({ onExit }: { onExit: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [points, setPoints] = useState<Point[]>([]);
 
 // Generator state
 const [trend, setTrend] = useState<number>(1); // 1 = positive, -1 = negative, 0 = none
 const [noise, setNoise] = useState<number>(15);

 const generateData = useCallback(() => {
  const newPoints: Point[] = [];
  for (let i = 0; i < 30; i++) {
   const x = Math.random() * 80 + 10;
   let y = 50;
   if (trend === 1) y = x * 0.8 + 10;
   else if (trend === -1) y = -x * 0.8 + 90;
   
   y += (Math.random() - 0.5) * noise * 2;
   y = Math.max(5, Math.min(95, y));
   newPoints.push({ x, y });
  }
  setPoints(newPoints);
 }, [trend, noise]);

 useEffect(() => {
  generateData();
 }, [generateData]);

 const stats = useMemo(() => {
  if (points.length < 2) return null;
  
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  const n = points.length;
  
  points.forEach(p => {
   sumX += p.x;
   sumY += p.y;
   sumXY += p.x * p.y;
   sumX2 += p.x * p.x;
   sumY2 += p.y * p.y;
  });

  const meanX = sumX / n;
  const meanY = sumY / n;

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  const r = denominator === 0 ? 0 : numerator / denominator;

  const slope = (n * sumX2 - sumX * sumX) === 0 ? 0 : (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = meanY - slope * meanX;

  return { r, slope, intercept, meanX, meanY };
 }, [points]);

 // Problem state
 const [predictX, setPredictX] = useState<number>(50);
 const [userPredictY, setUserPredictY] = useState<string>('');
 const [userCorrelation, setUserCorrelation] = useState<string>('positive');
 const [feedback, setFeedback] = useState<string | null>(null);

 useEffect(() => {
  setPredictX(Math.floor(Math.random() * 60) + 20);
  setUserPredictY('');
  setFeedback(null);
 }, [points]);

 const checkAnswer = () => {
  if (!stats) return;
  const numPredict = parseFloat(userPredictY);
  if (isNaN(numPredict)) {
   setFeedback("Please enter a valid number for your prediction.");
   return;
  }

  const expectedY = stats.slope * predictX + stats.intercept;
  const isPredictCorrect = Math.abs(numPredict - expectedY) <= 8; // generous margin due to visual estimating
  
  const actualCorr = stats.r > 0.4 ? 'positive' : stats.r < -0.4 ? 'negative' : 'none';
  const isCorrCorrect = userCorrelation === actualCorr;

  if (isPredictCorrect && isCorrCorrect) {
   setFeedback("Correct! You accurately identified the correlation and predicted the value.");
  } else if (!isCorrCorrect) {
   setFeedback(`Incorrect correlation. Based on the data, the correlation is ${actualCorr} (r ≈ ${stats.r.toFixed(2)}).`);
  } else {
   setFeedback(`Incorrect prediction. Using the line of best fit, we expect roughly ~${expectedY.toFixed(1)}`);
  }
 };

 // SVG coordinates
 // x: 0 to 100 maps to 50 to 350
 const mapX = (x: number) => 50 + (x / 100) * 300;
 // y: 0 to 100 maps to 250 to 50
 const mapY = (y: number) => 250 - (y / 100) * 200;

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
   {/* Header */}
   <LabHeader onExit={onExit} title="Statistics & Scatter Plots" />

   {/* Main Content Grid */}
   
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center  ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    Theory
   </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center  'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >Lab</button>
  </div>
  <div className="lg:flex-1 min-w-0 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg: overflow-y-auto lg:overflow-visible">
    {/* Column 1: Theory */}
    <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 flex flex-col lg:overflow-y-auto border-t-4 border-orange-500  ? 'flex' : 'hidden'} lg:flex`}>
     <div className="flex items-center mb-4 text-orange-800 shrink-0">
      <BookOpen className="mr-2" size={24} />
      <h2 className="text-xl font-semibold">Theory & Context</h2>
     </div>
     <div className="prose prose-orange flex-1 text-slate-700 dark:text-[#ffffff]">
      <p>
       <strong>Scatter plots</strong> are used to visualize the relationship (or correlation) between two distinct variables.
      </p>
      <h3 className="text-lg font-bold mt-4 text-slate-800 dark:text-[#ffffff]">Types of Correlation</h3>
      <ul className="list-disc pl-5 space-y-2">
       <li><strong>Positive Correlation:</strong> As one variable increases, the other also increases.</li>
       <li><strong>Negative Correlation:</strong> As one variable increases, the other decreases.</li>
       <li><strong>No Correlation:</strong> The points are scattered randomly with no clear pattern.</li>
      </ul>
      
      <h3 className="text-lg font-bold mt-4 text-slate-800 dark:text-[#ffffff]">Line of Best Fit</h3>
      <p>
       A <strong>Line of Best Fit</strong> (or trendline) is a straight line drawn through the center of the data points that best represents the trend. It can be used to make <strong>predictions</strong> (interpolation or extrapolation).
      </p>
      
      <h3 className="text-lg font-bold mt-4 text-slate-800 dark:text-[#ffffff]">Pearson Correlation (r)</h3>
      <p>
       The correlation coefficient <code>r</code> measures the strength of the linear relationship, ranging from -1 (perfect negative) to 1 (perfect positive).
      </p>
     </div>
    </div>

    {/* Column 2: Simulator */}
    <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 flex flex-col border-t-4 border-blue-500  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
     <div className="flex items-center mb-4 text-blue-800 shrink-0 dark:text-[#ffffff]">
      <LineChart className="mr-2" size={24} />
      <h2 className="text-xl font-semibold">Interactive Visualizer</h2>
     </div>
     
     <div className={`flex-1 min-w-0 relative bg-slate-50 dark:bg-[#121212] rounded-lg overflow- border border-slate-200 dark:border-[#1c1b1b] flex flex-col min-h-[300px] `}>
      <div className="flex-1 min-w-0 relative w-full h-full p-2">
       <svg viewBox="0 0 400 300" className="w-full h-full absolute inset-0">
        {/* Axes */}
        <line x1="50" y1="250" x2="350" y2="250" stroke="#334155" strokeWidth="2" />
        <line x1="50" y1="50" x2="50" y2="250" stroke="#334155" strokeWidth="2" />
        
        {/* Grid Lines & Ticks */}
        {[20, 40, 60, 80, 100].map(val => (
         <g key={`x-${val}`}>
          <line x1={mapX(val)} y1="50" x2={mapX(val)} y2="250" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
          <text x={mapX(val)} y="265" textAnchor="middle" fill="#64748b" fontSize="10">{val}</text>
         </g>
        ))}
        {[20, 40, 60, 80, 100].map(val => (
         <g key={`y-${val}`}>
          <line x1="50" y1={mapY(val)} x2="350" y2={mapY(val)} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
          <text x="40" y={mapY(val) + 4} textAnchor="end" fill="#64748b" fontSize="10">{val}</text>
         </g>
        ))}

        {/* Axis Labels */}
        <text x="200" y="290" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="bold">Active Minutes per Day</text>
        <text x="15" y="150" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="bold" transform="rotate(-90 15 150)">Overall Fitness Score</text>

        {/* Points */}
        {points.map((p, i) => (
         <circle key={i} cx={mapX(p.x)} cy={mapY(p.y)} r="4" fill="#3b82f6" opacity="0.7" className="hover:r-6 hover:fill-orange-500 transition-all cursor-pointer" />
        ))}

        {/* Line of Best Fit */}
        {stats && points.length > 1 && (
         <line 
          x1={mapX(0)} 
          y1={mapY(stats.intercept)} 
          x2={mapX(100)} 
          y2={mapY(stats.slope * 100 + stats.intercept)} 
          stroke="#f97316" 
          strokeWidth="3" 
          strokeDasharray="6 6"
         />
        )}

        {/* Prediction Marker */}
        {stats && (
         <g>
          <line x1={mapX(predictX)} y1="250" x2={mapX(predictX)} y2={mapY(stats.slope * predictX + stats.intercept)} stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx={mapX(predictX)} cy={mapY(stats.slope * predictX + stats.intercept)} r="5" fill="#10b981" />
          <text x={mapX(predictX) + 8} y={mapY(stats.slope * predictX + stats.intercept) - 8} fill="#047857" fontSize="12" fontWeight="bold">?</text>
         </g>
        )}
       </svg>
      </div>

      <div className={`w-full p-4 bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] border-t border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] space-y-4 shrink-0 shadow-inner flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
       <div className="flex items-center space-x-4">
        <div className="flex-1">
         <label className="block text-xs font-bold text-slate-500 dark:text-[#71717a] mb-1 uppercase tracking-wider">True Trend</label>
         <select 
          value={trend} 
          onChange={(e) => setTrend(Number(e.target.value))}
          className={`w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded text-sm bg-slate-50 dark:bg-[#121212] flex-col `}
         >
          <option value={1}>Positive (More Exercise = Fitter)</option>
          <option value={-1}>Negative (More Exercise = Lower BMI)</option>
          <option value={0}>None (Random / No Relation)</option>
         </select>
        </div>
        <div className="flex-1">
         <label className="block text-xs font-bold text-slate-500 dark:text-[#71717a] mb-1 uppercase tracking-wider">Variance (Noise)</label>
         <input
          type="range"
          min="2"
          max="30"
          value={noise}
          onChange={(e) => setNoise(Number(e.target.value))}
          className="w-full accent-blue-500"
         />
        </div>
       </div>
       
       <div className="flex justify-between items-center bg-blue-100 p-2 rounded border border-blue-200 text-blue-900 text-sm font-mono dark:text-[#ffffff]">
        <span>r ≈ {stats ? stats.r.toFixed(3) : 'N/A'}</span>
        <span>y = {stats ? `${stats.slope.toFixed(2)}x + ${stats.intercept.toFixed(2)}` : 'N/A'}</span>
       </div>
      </div>
     </div>
    </div>

    {/* Column 3: Assessment */}
    <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 flex flex-col border-t-4 border-amber-500 `}>
     <div className="flex items-center mb-4 text-amber-800 shrink-0 dark:text-[#ffffff]">
      <Calculator className="mr-2" size={24} />
      <h2 className="text-xl font-semibold">Data Analysis</h2>
     </div>
     
     <div className="flex-1 min-w-0 flex flex-col space-y-5">
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-slate-800 dark:text-[#ffffff] dark:bg-[#121212] dark:border-[#1c1b1b]">
       <p className="mb-2">
        Observe the generated scatter plot mapping daily <strong>Active Minutes</strong> (x) to a <strong>Fitness Score</strong> (y).
       </p>
      </div>

      <div>
       <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-2">1. What type of correlation does this dataset show?</label>
       <select 
        value={userCorrelation}
        onChange={(e) => setUserCorrelation(e.target.value)}
        className="w-full p-3 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-slate-50 dark:bg-[#121212] text-lg"
       >
        <option value="positive">Positive Correlation</option>
        <option value="negative">Negative Correlation</option>
        <option value="none">No Correlation</option>
       </select>
      </div>

      <div>
       <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-2">
        2. Based on the Line of Best Fit, predict the Fitness Score (y) if a person exercises for <strong>{predictX} minutes</strong>:
       </label>
       <input
        type="number"
        step="1"
        value={userPredictY}
        onChange={(e) => setUserPredictY(e.target.value)}
        className="w-full p-3 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-shadow text-lg font-mono"
        placeholder="e.g. 75"
       />
       <p className="text-xs text-slate-500 dark:text-[#71717a] mt-1">(Estimate using the dashed orange line or the equation)</p>
      </div>

      <button
       onClick={checkAnswer}
       className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors shadow-sm mt-2 dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40"
      >
       Submit Analysis
      </button>

      {feedback && (
       <div className={`p-4 rounded-lg flex items-start space-x-3 shadow-inner ${feedback.includes('Correct!') ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
        {feedback.includes('Correct!') ? <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" /> : <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />}
        <p className="flex-1 min-w-0 font-medium text-sm">{feedback}</p>
       </div>
      )}

      <div className="mt-auto pt-4">
       <button
        onClick={generateData}
        className="w-full py-3 flex items-center justify-center space-x-2 bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] font-bold rounded-lg transition-colors border border-slate-300 dark:border-[#1c1b1b]"
       >
        <RotateCcw size={20} />
        <span>Generate New Dataset</span>
       </button>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
