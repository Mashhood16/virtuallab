import { useState } from 'react';
import { Database, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabB12StructuralStats({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [humidity, setHumidity] = useState(92);
 const [measurements, setMeasurements] = useState<number[]>([]);
 const [meanAns, setMeanAns] = useState('');
 const [sdAns, setSdAns] = useState('');
 const [feedback, setFeedback] = useState('');

 const isBForm = humidity >= 80;
 const truePitch = isBForm ? 3.4 : 2.8;
 const angle = isBForm ? 34 : 25;

 const takeMeasurements = () => {
 const newMeas = Array.from({length: 5}, () => {
  const noise = (Math.random() * 0.4) - 0.2;
  return Number((truePitch + noise).toFixed(2));
 });
 setMeasurements(newMeas);
 setFeedback('');
 setMeanAns('');
 setSdAns('');
 };

 const checkAnswers = () => {
 if (measurements.length === 0) return;
 
 // Calculate actual
 const sum = measurements.reduce((a, b) => a + b, 0);
 const mean = sum / measurements.length;
 
 const squaredDiffs = measurements.map(m => Math.pow(m - mean, 2));
 const variance = squaredDiffs.reduce((a, b) => a + b, 0) / (measurements.length - 1);
 const sd = Math.sqrt(variance);

 const userMean = parseFloat(meanAns);
 const userSd = parseFloat(sdAns);

 let correct = 0;
 if (Math.abs(userMean - mean) < 0.05) correct++;
 if (Math.abs(userSd - sd) < 0.05) correct++;

 if (correct === 2) {
  setFeedback('Perfect! Both Mean and Standard Deviation are correct.');
 } else {
  setFeedback(`You got ${correct}/2 correct. Check your calculations. (Hint: Mean = ${mean.toFixed(2)})`);
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Structural Biophysics & Stats" subtitle="X-Ray Crystallography & DNA Conformations" />

  
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
  <main className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:min-h-0 overflow-y-auto lg:overflow-visible">
  {/* Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col lg:overflow-y-auto  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4">Theory & Context</h2>
   <div className="space-y-4 text-sm text-slate-600 dark:text-[#a1a1aa]">
   <p>
    <strong>X-Ray Crystallography:</strong> Used by Rosalind Franklin to deduce the helical structure of DNA (Photo 51). The "X" pattern indicates a helix, while the distance between layer lines reveals the helical pitch.
   </p>
   <p>
    <strong>DNA Conformations:</strong>
    <ul className="list-disc pl-5 mt-1 space-y-1">
    <li><strong>B-form:</strong> High hydration (&gt;80%), pitch ~3.4 nm (10 bp/turn).</li>
    <li><strong>A-form:</strong> Low hydration, more compact, pitch ~2.8 nm (11 bp/turn).</li>
    </ul>
   </p>
   <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded-lg mt-4 flex-col `}>
    <strong>Biostatistics: Standard Deviation</strong>
    <p className="mt-2">Formula for sample SD (<em>s</em>):</p>
    <div className="text-center font-serif text-lg mt-2 mb-2">
    s = √[ Σ(x - x̄)² / (n - 1) ]
    </div>
    <ul className="list-disc pl-5 text-xs">
    <li>x̄ = sample mean</li>
    <li>n = sample size (degrees of freedom = n-1)</li>
    <li>x = individual measurement</li>
    </ul>
   </div>
   </div>
  </div>

  {/* Interactive */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4">Diffraction Simulator</h2>
   
   <div className="flex-1 flex flex-col items-center">
   <div className="mb-4 w-full">
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
    <span>Fiber Hydration: {humidity}%</span>
    <span>{isBForm ? 'B-Form DNA' : 'A-Form DNA'}</span>
    </label>
    <input 
    type="range" min="50" max="98" value={humidity} 
    onChange={(e) => setHumidity(Number(e.target.value))}
    className="w-full accent-indigo-600"
    />
   </div>

   <div className={`relative w-64 h-64 bg-[#000000] dark:bg-[#121212] rounded-lg flex items-center justify-center shadow-inner overflow- border-4 border-[#1c1b1b] dark:border-[#1c1b1b] flex-col `}>
    {/* X-ray pattern */}
    <svg viewBox="-100 -100 200 200" className="w-full h-full opacity-80 blur-[1px]">
    {/* Central spot */}
    <circle cx="0" cy="0" r="10" fill="white" className="opacity-90" />
    
    {/* Cross spots */}
    {Array.from({ length: 4 }).map((_, i) => (
     <g key={`arm1-${i}`} transform={`rotate(${angle})`}>
     <circle cx="0" cy={-25 - i*15} r={3 + i} fill="white" className="opacity-70" />
     <circle cx="0" cy={25 + i*15} r={3 + i} fill="white" className="opacity-70" />
     </g>
    ))}
    {Array.from({ length: 4 }).map((_, i) => (
     <g key={`arm2-${i}`} transform={`rotate(${-angle})`}>
     <circle cx="0" cy={-25 - i*15} r={3 + i} fill="white" className="opacity-70" />
     <circle cx="0" cy={25 + i*15} r={3 + i} fill="white" className="opacity-70" />
     </g>
    ))}
    
    {/* Layer lines for scale */}
    <line x1="-80" y1="-70" x2="80" y2="-70" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
    <line x1="-80" y1="70" x2="80" y2="70" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
    </svg>
   </div>

   <button 
    onClick={takeMeasurements}
    className={`mt-6 flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 font-semibold transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40 flex-col `}>
    <Database className="w-5 h-5" /> Collect Experimental Data
   </button>
   </div>
  </div>

  {/* Assessment */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex flex-col lg:  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4">Data Analysis</h2>
   
   <div className="space-y-6">
   <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
    <h3 className="text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-2">Raw Measurements (Pitch in nm)</h3>
    {measurements.length > 0 ? (
    <div className="flex flex-wrap gap-2">
     {measurements.map((m, i) => (
     <span key={i} className="bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] px-3 py-1 rounded font-mono text-sm shadow-sm text-indigo-700 font-bold">
      {m.toFixed(2)}
     </span>
     ))}
    </div>
    ) : (
    <p className="text-sm text-slate-400 italic">Click "Collect Data" to begin.</p>
    )}
   </div>

   <div className="space-y-4">
    <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff]">
     Calculate the Mean (x̄):
    </label>
    <input 
     type="number" step="0.01"
     className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
     value={meanAns}
     onChange={e => setMeanAns(e.target.value)}
     disabled={measurements.length === 0}
    />
    </div>

    <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff]">
     Calculate the Sample Standard Deviation (s):
    </label>
    <input 
     type="number" step="0.01"
     className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
     value={sdAns}
     onChange={e => setSdAns(e.target.value)}
     disabled={measurements.length === 0}
    />
    </div>
   </div>

   <button 
    onClick={checkAnswers}
    disabled={measurements.length === 0}
    className="w-full bg-[#121212] dark:bg-[#121212] text-white font-semibold py-2 rounded hover:bg-[#000000] dark:bg-[#121212] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
    <CheckCircle className="w-5 h-5" /> Verify Calculations
   </button>

   {feedback && (
    <div className={`p-3 rounded text-sm font-medium ${feedback.includes('Perfect') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
    {feedback}
    </div>
   )}
   </div>
  </div>
  </main>
 </div>
 );
}
