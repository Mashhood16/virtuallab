import { useState, useMemo } from 'react';
import { BarChart2, Activity, Database, FileText } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit?: () => void;
}

export default function LabCS10DataVisualization({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const rawData = useMemo(() => [
  { id: 1, pet: 'Dog', age: 14 },
  { id: 2, pet: 'Cat', age: null }, // missing
  { id: 3, pet: 'Dog', age: 15 },
  { id: 4, pet: 'Bird', age: 16 },
  { id: 5, pet: 'Cat', age: 15 },
  { id: 6, pet: null, age: 15 }, // missing
  { id: 7, pet: 'Dog', age: 100 }, // outlier
  { id: 8, pet: 'Fish', age: 14 },
  { id: 9, pet: 'Dog', age: 15 },
  { id: 10, pet: 'Cat', age: 14 }
 ], []);

 const [cleaned, setCleaned] = useState<any[]>([]);
 const [logs, setLogs] = useState<string[]>([]);
 
 const [mean, setMean] = useState<number | null>(null);
 const [median, setMedian] = useState<number | null>(null);
 const [mode, setMode] = useState<number | null>(null);
 
 const [assessmentAns, setAssessmentAns] = useState('');
 const [assessmentRes, setAssessmentRes] = useState<boolean | null>(null);
 
 const cleanData = () => {
  const c = rawData.filter(d => d.age !== null && d.pet !== null && d.age < 20);
  setCleaned(c);
  setLogs(prev => [...prev, `Cleaned data: removed ${rawData.length - c.length} invalid rows (nulls/outliers).`]);
 };
 
 const calcStats = () => {
  if (cleaned.length === 0) {
   setLogs(prev => [...prev, `Error: Please clean data first.`]);
   return;
  }
  const ages = cleaned.map(d => d.age as number).sort((a,b)=>a-b);
  const m = ages.reduce((a,b)=>a+b, 0) / ages.length;
  setMean(m);
  const mid = Math.floor(ages.length/2);
  const med = ages.length % 2 !== 0 ? ages[mid] : (ages[mid-1] + ages[mid])/2;
  setMedian(med);
  
  const counts: Record<number, number> = {};
  ages.forEach(a => counts[a] = (counts[a] || 0) + 1);
  let maxCount = 0;
  let md = ages[0];
  for (const a in counts) {
   if (counts[a] > maxCount) {
    maxCount = counts[a];
    md = parseInt(a);
   }
  }
  setMode(md);
  
  setLogs(prev => [...prev, `Stats Calculated -> Mean: ${m.toFixed(1)}, Median: ${med}, Mode: ${md}`]);
 };

 const petCounts = useMemo(() => {
  const counts: Record<string, number> = {};
  cleaned.forEach(d => {
   counts[d.pet] = (counts[d.pet] || 0) + 1;
  });
  return counts;
 }, [cleaned]);

 const checkAssessment = () => {
  if (assessmentAns === median?.toString()) {
   setAssessmentRes(true);
  } else {
   setAssessmentRes(false);
  }
 };

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
   <LabHeader onExit={onExit} title="Data Dashboard Lab" />

   
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
  <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 overflow-y-auto lg:overflow-visible">
    {/* Theory */}
    <section className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b]  ? 'block' : 'hidden'} lg:block`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
      <FileText className="mr-2 text-fuchsia-500" /> Theory & Setup
     </h2>
     <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa]">
      <p>
       Real-world datasets are often messy. Before visualizing data or feeding it into a machine learning model, you must <strong>clean</strong> it.
      </p>
      <ul className="list-disc pl-5 space-y-1">
       <li>Remove missing values (null/NaN)</li>
       <li>Filter out extreme outliers</li>
      </ul>
      <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">Central Tendency</h3>
      <p>
       <strong>Mean:</strong> The average of all values.<br/>
       <strong>Median:</strong> The middle value when sorted.<br/>
       <strong>Mode:</strong> The most frequent value.
      </p>
      
      <div className="mt-6">
       <h4 className="font-semibold text-fuchsia-800 mb-2">Raw Dataset (First 5 rows)</h4>
       <table className="w-full text-sm text-left border-collapse border border-slate-200 dark:border-[#1c1b1b]">
        <thead className="bg-slate-100 dark:bg-[#121212]">
         <tr>
          <th className="border border-slate-200 dark:border-[#1c1b1b] p-2">ID</th>
          <th className="border border-slate-200 dark:border-[#1c1b1b] p-2">Pet</th>
          <th className="border border-slate-200 dark:border-[#1c1b1b] p-2">Age</th>
         </tr>
        </thead>
        <tbody>
         {rawData.slice(0, 5).map(r => (
          <tr key={r.id}>
           <td className="border border-slate-200 dark:border-[#1c1b1b] p-2">{r.id}</td>
           <td className="border border-slate-200 dark:border-[#1c1b1b] p-2 text-red-500 font-medium">{r.pet === null ? 'NULL' : r.pet}</td>
           <td className="border border-slate-200 dark:border-[#1c1b1b] p-2 text-red-500 font-medium">{r.age === null ? 'NULL' : r.age}</td>
          </tr>
         ))}
        </tbody>
       </table>
       <div className="mt-4 flex gap-2">
        <button onClick={cleanData} className={`px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 text-sm font-medium dark:text-white dark:text-white dark:bg-fuchsia-500 dark:hover:bg-fuchsia-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-fuchsia-500/40 flex-col `}>
         Clean Data
        </button>
        <button onClick={calcStats} className={`px-4 py-2 bg-slate-200 dark:bg-[#121212] text-slate-800 dark:text-[#ffffff] rounded-md hover:bg-slate-300 dark:bg-[#121212] text-sm font-medium flex-col `}>
         Calculate Stats
        </button>
       </div>
      </div>
     </div>
    </section>

    {/* Simulation */}
    <section className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
      <BarChart2 className="mr-2 text-fuchsia-500" /> Visualization
     </h2>
     
     <div className="flex-grow flex flex-col items-center justify-center min-h-[300px]">
      {cleaned.length === 0 ? (
       <div className="text-center text-slate-400">
        <Database size={48} className="mx-auto mb-2 opacity-50" />
        <p>Clean data to view visualizations</p>
       </div>
      ) : (
       <div className="w-full">
        <h3 className="text-center font-bold text-slate-700 dark:text-[#ffffff] mb-4">Pet Preferences Chart</h3>
        <div className="flex items-end justify-center gap-6 h-48 border-b-2 border-slate-300 dark:border-[#1c1b1b] pb-2">
         {Object.entries(petCounts).map(([pet, count]) => (
          <div key={pet} className="flex flex-col items-center group">
           <span className="text-sm font-bold text-slate-600 dark:text-[#a1a1aa] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{count}</span>
           <div 
            className={`w-16 bg-fuchsia-400 rounded-t-sm hover:bg-fuchsia-500 transition-all flex-col `}
            style={{ height: `${(count / cleaned.length) * 200}px` }}
           ></div>
           <span className="mt-2 text-sm font-medium text-slate-700 dark:text-[#ffffff]">{pet}</span>
          </div>
         ))}
        </div>
        
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
         <div className="p-3 bg-fuchsia-50 rounded-lg">
          <div className="text-xs text-fuchsia-600 font-bold uppercase tracking-wider">Mean Age</div>
          <div className="text-xl font-black text-slate-800 dark:text-[#ffffff]">{mean?.toFixed(1) || '--'}</div>
         </div>
         <div className="p-3 bg-fuchsia-50 rounded-lg">
          <div className="text-xs text-fuchsia-600 font-bold uppercase tracking-wider">Median Age</div>
          <div className="text-xl font-black text-slate-800 dark:text-[#ffffff]">{median || '--'}</div>
         </div>
         <div className="p-3 bg-fuchsia-50 rounded-lg">
          <div className="text-xs text-fuchsia-600 font-bold uppercase tracking-wider">Mode Age</div>
          <div className="text-xl font-black text-slate-800 dark:text-[#ffffff]">{mode || '--'}</div>
         </div>
        </div>
       </div>
      )}
     </div>
    </section>

    {/* Analysis */}
    <section className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
      <Activity className="mr-2 text-fuchsia-500" /> Data Log & Assessment
     </h2>
     
     <div className="mb-6 flex-grow">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-[#71717a] uppercase mb-2">Process Log</h3>
      <div className="bg-[#000000] dark:bg-[#121212] rounded-lg p-3 h-48 lg:overflow-y-auto font-mono text-xs text-green-400">
       {logs.length === 0 && <span className="text-slate-500 dark:text-[#71717a]">Awaiting data pipeline...</span>}
       {logs.map((log, i) => (
        <div key={i}>{`> ${log}`}</div>
       ))}
      </div>
     </div>

     <div className="bg-fuchsia-50 rounded-lg p-4">
      <h3 className="font-bold text-fuchsia-900 mb-2">Knowledge Check</h3>
      <p className="text-sm text-fuchsia-800 mb-4">
       Based on the cleaned dataset, what is the exact <strong>Median</strong> age?
      </p>
      <div className="flex gap-2">
       <input 
        type="text" 
        value={assessmentAns}
        onChange={(e) => setAssessmentAns(e.target.value)}
        className="w-full p-2 border border-fuchsia-200 rounded-md focus:ring-2 focus:ring-fuchsia-500"
        placeholder="Median Value..."
       />
       <button 
        onClick={checkAssessment}
        className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 dark:text-white dark:text-white dark:bg-fuchsia-500 dark:hover:bg-fuchsia-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-fuchsia-500/40"
       >
        Check
       </button>
      </div>
      {assessmentRes !== null && (
       <p className={`mt-2 text-sm font-semibold ${assessmentRes ? 'text-green-600' : 'text-red-600'}`}>
        {assessmentRes ? 'Correct! Good job.' : 'Incorrect, try calculating the stats.'}
       </p>
      )}
     </div>
    </section>
   </main>
  </div>
 );
}
