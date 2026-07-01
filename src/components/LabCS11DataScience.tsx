import { useState, useEffect } from 'react';
import { Play, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];

export default function LabCS11DataScience({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [points, setPoints] = useState<{ x: number; y: number; cluster: number }[]>([]);
 const [centroids, setCentroids] = useState<{ x: number; y: number }[]>([]);
 const [k, setK] = useState(3);
 const [step, setStep] = useState(0);

 const [assessmentAns, setAssessmentAns] = useState('');
 const [feedback, setFeedback] = useState<string | null>(null);

 const generateData = () => {
 const newPoints = [];
 for (let i = 0; i < 50; i++) {
  const cx = 100 + Math.random() * 200;
  const cy = 100 + Math.random() * 200;
  newPoints.push({ x: cx + (Math.random() * 40 - 20), y: cy + (Math.random() * 40 - 20), cluster: -1 });
 }
 setPoints(newPoints);
 setCentroids([]);
 setStep(0);
 setFeedback(null);
 setAssessmentAns('');
 };

 useEffect(() => {
 generateData();
 }, []);

 const initCentroids = () => {
 const newCentroids = [];
 for (let i = 0; i < k; i++) {
  newCentroids.push({ x: 50 + Math.random() * 300, y: 50 + Math.random() * 300 });
 }
 setCentroids(newCentroids);
 setPoints(points.map(p => ({ ...p, cluster: -1 })));
 setStep(1);
 setFeedback(null);
 };

 const doStep = () => {
 if (centroids.length === 0) return;
 if (step % 2 === 1) {
  // Assign points
  const newPoints = points.map(p => {
  let minDist = Infinity;
  let bestC = -1;
  centroids.forEach((c, i) => {
   const d = Math.hypot(p.x - c.x, p.y - c.y);
   if (d < minDist) {
   minDist = d;
   bestC = i;
   }
  });
  return { ...p, cluster: bestC };
  });
  setPoints(newPoints);
 } else {
  // Update centroids
  const newCentroids = centroids.map((c, i) => {
  const clusterPoints = points.filter(p => p.cluster === i);
  if (clusterPoints.length === 0) return c;
  const sumX = clusterPoints.reduce((sum, p) => sum + p.x, 0);
  const sumY = clusterPoints.reduce((sum, p) => sum + p.y, 0);
  return { x: sumX / clusterPoints.length, y: sumY / clusterPoints.length };
  });
  setCentroids(newCentroids);
 }
 setStep(step + 1);
 };

 const checkAnswer = () => {
 const count0 = points.filter(p => p.cluster === 0).length;
 if (parseInt(assessmentAns) === count0) {
  setFeedback('Correct! You accurately tracked the final cluster population.');
 } else {
  setFeedback('Incorrect. Ensure you ran the simulation and check the stats panel below the graph.');
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Lab: Data Science & Analytics" />

  
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
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:min-h-0 overflow-y-auto lg:overflow-visible">
  {/* Left Column: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-4 lg:overflow-y-auto  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 shrink-0">Theory & Setup</h2>
   
   <div className="text-slate-600 dark:text-[#a1a1aa] space-y-4 text-sm">
   <p><strong>K-Means Clustering</strong> is an unsupervised machine learning algorithm that groups data into <em>k</em> distinct clusters.</p>
   <ol className="list-decimal pl-5 space-y-2">
    <li><strong>Initialization:</strong> Choose <em>k</em> random centroids.</li>
    <li><strong>Assignment:</strong> Assign each data point to the closest centroid.</li>
    <li><strong>Update:</strong> Move each centroid to the mean (center of mass) of all points assigned to it.</li>
    <li><strong>Repeat:</strong> Continue Assignment and Update until centroids stop moving (convergence).</li>
   </ol>
   
   <div className={`bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>
    <h3 className="font-semibold text-blue-800 mb-2 dark:text-[#ffffff]">Distance Formula (Euclidean)</h3>
    <p className="font-mono text-xs">d = √((x₂ - x₁)² + (y₂ - y₁)²)</p>
   </div>
   
   <p><strong>A/B Testing Note:</strong> Similar statistical grouping logic applies when analyzing distinct variant groups to find performance differences!</p>
   </div>
  </div>

  {/* Middle Column: Simulator */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col relative lg:  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4 shrink-0">Interactive Visualizer</h2>
   
   <div className="flex gap-4 mb-4 shrink-0">
   <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-[#ffffff]">
    Clusters (k):
    <input type="range" min="2" max="4" value={k} onChange={(e) => setK(parseInt(e.target.value))} className="w-24" />
    {k}
   </label>
   <button onClick={generateData} className={`px-3 py-1.5 bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:bg-[#121212] rounded text-sm font-medium flex items-center gap-1 text-slate-700 dark:text-[#ffffff] transition-colors flex-col `}>
    <RefreshCw size={16} /> New Data
   </button>
   </div>

   <div className="flex gap-2 mb-4 shrink-0">
   <button onClick={initCentroids} className={`flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40 flex-col `}>
    1. Init Centroids
   </button>
   <button onClick={doStep} disabled={centroids.length === 0} className={`flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm flex items-center justify-center gap-1 transition-colors dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40 `}>
    <Play size={16} /> {step % 2 === 1 ? '2. Assign Points' : '3. Update Centroids'}
   </button>
   </div>

   <div className="flex-1 border rounded-lg bg-slate-50 dark:bg-[#121212] flex flex-col items-center justify-center overflow-hidden min-h-[300px]">
   <svg viewBox="0 0 400 400" className="w-full h-full max-h-80 object-contain bg-slate-50 dark:bg-[#121212]">
    <rect width="400" height="400" fill="#f8fafc" />
    {/* Grid */}
    <path d="M0,100 H400 M0,200 H400 M0,300 H400 M100,0 V400 M200,0 V400 M300,0 V400" stroke="#e2e8f0" strokeWidth="1" />
    
    {/* Points */}
    {points.map((p, i) => (
    <circle
     key={`p-${i}`}
     cx={p.x}
     cy={p.y}
     r={4}
     fill={p.cluster >= 0 ? COLORS[p.cluster] : '#94a3b8'}
     className="transition-all duration-500"
    />
    ))}

    {/* Centroids */}
    {centroids.map((c, i) => (
    <g key={`c-${i}`} transform={`translate(${c.x}, ${c.y})`} className="transition-all duration-500">
     <polygon
     points="0,-8 8,8 -8,8"
     fill={COLORS[i]}
     stroke="#fff"
     strokeWidth="1.5"
     />
     <circle cx="0" cy="0" r="12" fill="none" stroke={COLORS[i]} strokeWidth="2" strokeDasharray="2,2" opacity="0.5" />
    </g>
    ))}
   </svg>
   
   <div className="w-full bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] p-2 flex flex-wrap gap-4 justify-center text-xs border-t flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    {centroids.length === 0 && <span className="text-slate-500 dark:text-[#71717a] italic">Centroids not initialized.</span>}
    {centroids.map((_, i) => (
    <div key={i} className="flex items-center gap-1 font-bold" style={{ color: COLORS[i] }}>
     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
     Cluster {i}: {points.filter(p => p.cluster === i).length} pts
    </div>
    ))}
   </div>
   </div>
   
   <div className="mt-4 text-center text-sm text-slate-500 dark:text-[#71717a] font-medium shrink-0">
   Current Stage: {step === 0 ? 'Data Generated' : (step % 2 === 1 ? 'Needs Assignment' : 'Needs Update')} | Step Count: {step}
   </div>
  </div>

  {/* Right Column: Assessment */}
  <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col lg:overflow-y-auto">
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4 shrink-0">Assessment & Analysis</h2>
   
   <div className="space-y-6 flex-1 pr-2">
   <div className="p-4 bg-slate-50 dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">Q1: Cluster Population Analysis</h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">
    1. Initialize the centroids.<br/>
    2. Alternate clicking the green Step button until the clusters stop changing.<br/>
    3. Look at the stats panel. How many data points ended up assigned to the <strong>Red Cluster (Cluster 0)</strong>?
    </p>
    
    <div className="flex gap-2">
    <input
     type="number"
     value={assessmentAns}
     onChange={e => setAssessmentAns(e.target.value)}
     className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
     placeholder="Enter point count..."
    />
    <button
     onClick={checkAnswer}
     className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
     Check
    </button>
    </div>
    
    {feedback && (
    <div className={`mt-3 p-3 rounded-md flex items-center gap-2 text-sm font-medium ${feedback.includes('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
     {feedback.includes('Correct') ? <CheckCircle size={16} /> : <XCircle size={16} />}
     {feedback}
    </div>
    )}
   </div>

   <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 dark:bg-[#121212] dark:border-[#1c1b1b]">
    <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2 dark:text-[#ffffff]">
     Observation Task
    </h3>
    <p className="text-sm text-amber-900 leading-relaxed dark:text-[#ffffff]">
     Notice how the centroids iteratively move towards the <strong>center of mass</strong> of their assigned points. 
     Try regenerating new data and observe how the initial random placement of centroids can drastically alter the final cluster boundaries!
    </p>
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
