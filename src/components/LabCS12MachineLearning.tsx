import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, BarChart2, BookOpen, CheckCircle, Target, Save } from 'lucide-react';
import LabHeader from './LabHeader';

interface Point {
 id: number;
 x: number;
 y: number;
 actual: boolean;
 isTrain: boolean;
 predicted: boolean;
}

export default function LabCS12MachineLearning({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [splitRatio, setSplitRatio] = useState<number>(0.8);
 const [rawPoints, setRawPoints] = useState<{id:number, x:number, y:number, actual:boolean}[]>([]);
 const [points, setPoints] = useState<Point[]>([]);
 const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
 
 const [ansAcc, setAnsAcc] = useState<string>('');
 const [ansPrec, setAnsPrec] = useState<string>('');
 const [ansRec, setAnsRec] = useState<string>('');
 const [ansPVal, setAnsPVal] = useState<string>('');
 const [feedback, setFeedback] = useState<string>('');

 const initData = useCallback(() => {
  const newPoints = [];
  for (let i = 0; i < 100; i++) {
   const actual = i >= 50;
   const cx = actual ? 60 : 40;
   const cy = actual ? 60 : 40;
   newPoints.push({
    id: i,
    x: Math.max(5, Math.min(95, cx + (Math.random() - 0.5) * 45)),
    y: Math.max(5, Math.min(95, cy + (Math.random() - 0.5) * 45)),
    actual
   });
  }
  newPoints.sort(() => Math.random() - 0.5);
  setRawPoints(newPoints);
 }, []);

 useEffect(() => {
  initData();
 }, [initData]);

 useEffect(() => {
  setPoints(rawPoints.map((p, i) => ({
   ...p,
   isTrain: i < rawPoints.length * splitRatio,
   predicted: false
  })));
  setIsEvaluated(false);
 }, [rawPoints, splitRatio]);

 const evaluateModel = () => {
  setPoints(pts => pts.map(p => ({
   ...p,
   predicted: (p.x + p.y) > 100
  })));
  setIsEvaluated(true);
 };

 const testPoints = points.filter(p => !p.isTrain);
 const tp = testPoints.filter(p => p.actual && p.predicted).length;
 const fp = testPoints.filter(p => !p.actual && p.predicted).length;
 const tn = testPoints.filter(p => !p.actual && !p.predicted).length;
 const fn = testPoints.filter(p => p.actual && !p.predicted).length;

 const checkAnswers = () => {
  const acc = testPoints.length > 0 ? (tp + tn) / testPoints.length : 0;
  const prec = (tp + fp) > 0 ? tp / (tp + fp) : 0;
  const rec = (tp + fn) > 0 ? tp / (tp + fn) : 0;

  let score = 0;
  if (Math.abs(parseFloat(ansAcc) - acc) < 0.05) score++;
  if (Math.abs(parseFloat(ansPrec) - prec) < 0.05) score++;
  if (Math.abs(parseFloat(ansRec) - rec) < 0.05) score++;
  if (ansPVal.toLowerCase().trim() === 'yes') score++;

  if (score === 4) setFeedback('Perfect! All answers correct.');
  else setFeedback(`You scored ${score}/4. Keep trying! (Ensure calculations use exact TP, FP, TN, FN)`);
 };

 const handleComplete = () => {
  if (onExit) onExit();
 };

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
   {/* Header */}
   <LabHeader onExit={onExit} title="Lab 12.1: Machine Learning & Statistical Testing" />

   {/* Main 3-column Grid */}
   
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
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:flex-1 lg:h-full lg:min-h-0 overflow-y-auto lg:overflow-visible">
    {/* Column 1: Theory */}
    <div className={`w-full bg-slate-50 dark:bg-[#121212] p-6 rounded-xl shadow border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col  ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
      <BookOpen className="text-indigo-500" /> Theory & Context
     </h2>
     <div className="text-sm text-slate-700 dark:text-[#ffffff] space-y-4">
      <p>In Machine Learning, we evaluate models by splitting our dataset into <strong>Training</strong> and <strong>Testing</strong> subsets to prevent overfitting.</p>
      <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">Confusion Matrix</h3>
      <ul className="list-disc pl-5 space-y-1">
       <li><strong>TP</strong> (True Positives): Actual Positive, Predicted Positive</li>
       <li><strong>TN</strong> (True Negatives): Actual Negative, Predicted Negative</li>
       <li><strong>FP</strong> (False Positives): Actual Negative, Predicted Positive</li>
       <li><strong>FN</strong> (False Negatives): Actual Positive, Predicted Negative</li>
      </ul>
      <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">Key Metrics</h3>
      <p><strong>Accuracy</strong> = (TP + TN) / Total Test</p>
      <p><strong>Precision</strong> = TP / (TP + FP)</p>
      <p><strong>Recall</strong> = TP / (TP + FN)</p>
      <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">Statistical Hypothesis Testing</h3>
      <p>We use p-values to determine if a model's improvement over a baseline is statistically significant. A p-value &lt; alpha (e.g., 0.05) means the result is significant, so we reject the null hypothesis.</p>
     </div>
    </div>

    {/* Column 2: Simulator */}
    <div className={`w-full bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] p-6 rounded-xl shadow border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col lg:  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2 shrink-0">
      <BarChart2 className="text-indigo-500" /> Interactive Data Science
     </h2>
     
     <div className="mb-4 shrink-0">
      <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff] block mb-1">
       Train/Test Split: {Math.round(splitRatio * 100)}% Train / {100 - Math.round(splitRatio * 100)}% Test
      </label>
      <input 
       type="range" min="0.1" max="0.9" step="0.1" 
       value={splitRatio} 
       onChange={(e) => setSplitRatio(parseFloat(e.target.value))}
       className="w-full"
      />
     </div>

     <div className="flex gap-2 mb-4 shrink-0">
      <button onClick={initData} className={`flex-1 bg-slate-200 dark:bg-[#121212] hover:bg-slate-300 dark:bg-[#121212] text-slate-800 dark:text-[#ffffff] py-2 rounded flex justify-center items-center gap-2 text-sm font-medium transition-colors flex-col `}>
       <RefreshCw size={16} /> Reshuffle Data
      </button>
      <button onClick={evaluateModel} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded flex justify-center items-center gap-2 text-sm font-medium transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
       <Target size={16} /> Evaluate on Test Set
      </button>
     </div>

     <svg viewBox="0 0 100 100" className="w-full h-64 bg-slate-100 dark:bg-[#121212] rounded-lg shadow-inner mb-4 shrink-0">
      {isEvaluated && <line x1="0" y1="100" x2="100" y2="0" stroke="#64748b" strokeWidth="1" strokeDasharray="2" />}
      {points.map(p => (
       <circle 
        key={p.id} 
        cx={p.x} cy={p.y} r={p.isTrain ? 2 : 2.5}
        fill={p.actual ? '#3b82f6' : '#ef4444'}
        fillOpacity={p.isTrain ? 0.7 : 0.2}
        stroke={!p.isTrain ? (p.actual ? '#1d4ed8' : '#b91c1c') : 'none'}
        strokeWidth={!p.isTrain ? 0.5 : 0}
       />
      ))}
     </svg>

     {isEvaluated && (
      <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded border border-slate-200 dark:border-[#1c1b1b] shrink-0 mt-auto">
       <h3 className="text-sm font-bold text-slate-800 dark:text-[#ffffff] mb-2">Test Set Results (Confusion Matrix)</h3>
       <div className="grid grid-cols-2 gap-2 text-sm text-slate-700 dark:text-[#ffffff]">
        <div><strong>True Positives (TP):</strong> {tp}</div>
        <div><strong>False Positives (FP):</strong> {fp}</div>
        <div><strong>True Negatives (TN):</strong> {tn}</div>
        <div><strong>False Negatives (FN):</strong> {fn}</div>
        <div className="col-span-2 pt-2 border-t border-slate-200 dark:border-[#1c1b1b]">
         <strong>Total Test Points:</strong> {testPoints.length}
        </div>
       </div>
      </div>
     )}
    </div>

    {/* Column 3: Assessment */}
    <div className="bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] p-6 rounded-xl shadow border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2 shrink-0">
      <CheckCircle className="text-indigo-500" /> Assessment & Analysis
     </h2>
     
     {!isEvaluated ? (
      <div className="text-sm text-slate-500 dark:text-[#71717a] italic p-4 bg-slate-50 dark:bg-[#121212] rounded">
       Please evaluate the model in the simulator first to generate test results.
      </div>
     ) : (
      <div className="space-y-4 flex-1 lg:overflow-y-auto text-sm pr-2">
       <div>
        <label className="block text-slate-700 dark:text-[#ffffff] mb-1 font-medium">1. Calculate Model Accuracy (decimal form, e.g., 0.85):</label>
        <input type="number" step="0.01" value={ansAcc} onChange={e => setAnsAcc(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded" />
       </div>
       <div>
        <label className="block text-slate-700 dark:text-[#ffffff] mb-1 font-medium">2. Calculate Precision (decimal form):</label>
        <input type="number" step="0.01" value={ansPrec} onChange={e => setAnsPrec(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded" />
       </div>
       <div>
        <label className="block text-slate-700 dark:text-[#ffffff] mb-1 font-medium">3. Calculate Recall (decimal form):</label>
        <input type="number" step="0.01" value={ansRec} onChange={e => setAnsRec(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded" />
       </div>
       <div className="pt-2 border-t border-slate-200 dark:border-[#1c1b1b]">
        <label className="block text-slate-700 dark:text-[#ffffff] mb-1 font-medium">4. If a t-test compares our model to a baseline and yields p = 0.03 (alpha = 0.05), is our model significantly different? (Yes/No):</label>
        <input type="text" value={ansPVal} onChange={e => setAnsPVal(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded" />
       </div>

       <button onClick={checkAnswers} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">
        Check Answers
       </button>

       {feedback && (
        <div className={`p-3 rounded mt-4 font-medium ${feedback.includes('Perfect') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
         {feedback}
        </div>
       )}

       <div className="pt-4 border-t border-slate-200 dark:border-[#1c1b1b] mt-6">
        <button 
         onClick={handleComplete}
         className={`w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40 `}
        >
         <Save size={20} />
         Submit Results & Exit
        </button>
       </div>
      </div>
     )}
    </div>
   </div>
  </div>
 );
}
