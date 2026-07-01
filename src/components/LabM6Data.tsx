import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Dices, Coins, BarChart3, PieChart, CheckCircle, XCircle } from 'lucide-react';

export default function LabM6Data({ onExit }: { onExit?: () => void }) {
 const containerRef = useRef<HTMLDivElement>(null);
 const [source, setSource] = useState<'coin' | 'dice'>('coin');
 const [results, setResults] = useState<number[]>([]);
 const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
 const [isRolling, setIsRolling] = useState(false);

 const [questionVal, setQuestionVal] = useState<string>('Heads');
 const [studentAnswer, setStudentAnswer] = useState('');
 const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');

 // Coin: 0=Heads, 1=Tails
 // Dice: 0=1, 1=2, 2=3, 3=4, 4=5, 5=6
 const optionsCount = source === 'coin' ? 2 : 6;
 const labels = source === 'coin' ? ['Heads', 'Tails'] : ['1', '2', '3', '4', '5', '6'];
 const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#5560F1', '#06b6d4'];

 const roll = (count: number) => {
 setIsRolling(true);
 setTimeout(() => {
  const newResults = Array.from({ length: count }, () => Math.floor(Math.random() * optionsCount));
  setResults(prev => [...prev, ...newResults]);
  setIsRolling(false);
  setFeedback('none');
  setStudentAnswer('');
 }, 300);
 };

 const clearData = () => {
 setResults([]);
 setFeedback('none');
 setStudentAnswer('');
 };

 useEffect(() => {
 clearData();
 if (source === 'coin') setQuestionVal('Heads');
 else setQuestionVal('6');
 }, [source]);

 const frequencies = new Array(optionsCount).fill(0);
 results.forEach(r => frequencies[r]++);
 const maxFreq = Math.max(...frequencies, 1);
 const total = results.length;

 const checkAnswer = () => {
 let targetIndex = labels.indexOf(questionVal);
 if (targetIndex === -1) return;
 const correctValue = frequencies[targetIndex];
 if (parseInt(studentAnswer) === correctValue) {
  setFeedback('correct');
 } else {
  setFeedback('incorrect');
 }
 };

 // Pie chart calculation
 let cumulativeAngle = 0;
 const pieSlices = frequencies.map((f, i) => {
 if (total === 0) return null;
 const angle = (f / total) * 360;
 const startAngle = cumulativeAngle;
 cumulativeAngle += angle;
 return { label: labels[i], f, startAngle, angle, color: colors[i % colors.length] };
 });

 const getPiePath = (startAngle: number, angle: number) => {
 if (angle === 360) return "M 0,0 m -100,0 a 100,100 0 1,0 200,0 a 100,100 0 1,0 -200,0";
 if (angle === 0) return "";
 const startRad = (startAngle - 90) * Math.PI / 180;
 const endRad = (startAngle + angle - 90) * Math.PI / 180;
 const x1 = 100 * Math.cos(startRad);
 const y1 = 100 * Math.sin(startRad);
 const x2 = 100 * Math.cos(endRad);
 const y2 = 100 * Math.sin(endRad);
 const largeArc = angle > 180 ? 1 : 0;
 return `M 0 0 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`;
 };

 // Tally Marks render
 const renderTally = (count: number) => {
 const groups = Math.floor(count / 5);
 const remainder = count % 5;
 const elements = [];
 for (let i = 0; i < groups; i++) {
  elements.push(
   <span key={`g-${i}`} className="inline-block mr-2 font-bold tracking-tighter line-through decoration-2">
   ||||
   </span>
  );
 }
 if (remainder > 0) {
  elements.push(
  <span key={`r`} className="inline-block font-bold tracking-tighter">
   {'|'.repeat(remainder)}
  </span>
  );
 }
 return elements;
 };

 return (
 <div ref={containerRef} className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-900 dark:text-[#ffffff]">
  <header className="flex items-center p-4 shadow-sm z-10">
  <button onClick={onExit} className="mr-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
   <ArrowLeft size={24} />
  </button>
  <h1 className="text-2xl font-bold flex-1">Unit 10: Data Dashboard</h1>
  </header>

  <div className="lg:flex-1 min-w-0 flex flex-col lg:grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4 p-4 overflow-y-auto lg:overflow-visible">
  {/* Left: Controls */}
  <div className={`w-full bg-white dark:!bg-[#121212] rounded-2xl shadow-sm p-6 flex flex-col gap-6 lg:overflow-y-auto  ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex gap-4 border-b border-slate-200 dark:border-[#1c1b1b] pb-4">
   <button
    onClick={() => setSource('coin')}
    className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors ${source === 'coin' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-[#ffffff]'}`}
   >
    <Coins size={20} /> Coin Flipper
   </button>
   <button
    onClick={() => setSource('dice')}
    className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors ${source === 'dice' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-[#ffffff]'}`}
   >
    <Dices size={20} /> Dice Roller
   </button>
   </div>

   <div className="flex flex-wrap gap-2">
   <button onClick={() => roll(1)} disabled={isRolling} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">Generate 1</button>
   <button onClick={() => roll(10)} disabled={isRolling} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">Generate 10</button>
   <button onClick={() => roll(100)} disabled={isRolling} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">Generate 100</button>
   <button onClick={clearData} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-[#ffffff] rounded-lg transition-colors ml-auto">Clear</button>
   </div>

   <div className="mt-2">
   <h3 className="font-semibold mb-2">Tally Table (Total: {total})</h3>
   <div className="border border-slate-200 dark:border-[#1c1b1b] rounded-xl overflow-hidden">
    <table className="w-full text-sm text-left">
    <thead className="bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-[#a1a1aa] border-b border-slate-200 dark:border-[#1c1b1b]">
     <tr>
     <th className="px-4 py-2">Outcome</th>
     <th className="px-4 py-2">Tally Marks</th>
     <th className="px-4 py-2 text-right">Freq</th>
     </tr>
    </thead>
    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
     {labels.map((label, i) => (
     <tr key={label} className="">
      <td className="px-4 py-2 font-medium">{label}</td>
      <td className="px-4 py-2 text-lg text-slate-500 dark:text-[#71717a]">
      {renderTally(frequencies[i])}
      </td>
      <td className="px-4 py-2 text-right font-semibold">{frequencies[i]}</td>
     </tr>
     ))}
    </tbody>
    </table>
   </div>
   </div>

   <div className={`w-full bg-white lg:bg-slate-100 dark:bg-white lg:bg-slate-700 p-4 rounded-xl space-y-4 mt-auto  'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-xl font-semibold">Assessment</h2>
   <div className="flex flex-col gap-2">
    <label className="text-sm dark:text-[#a1a1aa] flex items-center flex-wrap">
    What is the exact frequency of getting
    <select value={questionVal} onChange={e => setQuestionVal(e.target.value)} className="mx-2 p-1 rounded border border-slate-300 dark:border-[#1c1b1b] outline-none">
     {labels.map(l => <option key={l} value={l}>{l}</option>)}
    </select>?
    </label>
   </div>
   <div className="flex flex-wrap gap-2">
    <input
    type="number"
    value={studentAnswer}
    onChange={(e) => setStudentAnswer(e.target.value)}
    placeholder="Enter frequency..."
    className="flex-1 min-w-0 px-4 py-2 rounded-lg border border-slate-300 dark:border-[#1c1b1b] focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <button
    onClick={checkAnswer}
    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
    Check
    </button>
   </div>

   {feedback !== 'none' && (
    <div className={`w-full flex items-center gap-2 p-3 rounded-lg ${feedback === 'correct' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'} flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
    {feedback === 'correct' ? <CheckCircle size={20} /> : <XCircle size={20} />}
    <span className="font-medium">{feedback === 'correct' ? 'Correct!' : 'Incorrect. Check the tally table!'}</span>
    </div>
   )}
   </div>
  </div>

  {/* Right: Simulation Stage */}
  <div className="bg-white dark:!bg-[#121212] rounded-2xl shadow-sm p-6 flex flex-col items-center min-h-[400px]">
   <div className="flex justify-between w-full items-center mb-6">
   <h2 className="text-xl font-semibold">Live Graph</h2>
   <div className="flex gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
    <button onClick={() => setChartType('bar')} className={`p-2 rounded-md transition-colors ${chartType === 'bar' ? ' shadow' : 'hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
    <BarChart3 size={20} />
    </button>
    <button onClick={() => setChartType('pie')} className={`p-2 rounded-md transition-colors ${chartType === 'pie' ? ' shadow' : 'hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
    <PieChart size={20} />
    </button>
   </div>
   </div>

   <div className="flex-1 min-w-0 w-full flex items-center justify-center relative">
   {total === 0 ? (
    <div className="text-slate-400 dark:text-[#71717a] flex flex-col items-center">
    <BarChart3 size={48} className="mb-4 opacity-50" />
    <p>No data yet. Generate some rolls!</p>
    </div>
   ) : chartType === 'bar' ? (
    <svg viewBox="0 0 400 300" className="w-full h-full max-h-[400px]">
    {/* Axes */}
    <line x1="40" y1="260" x2="380" y2="260" stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth="2" />
    <line x1="40" y1="260" x2="40" y2="20" stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth="2" />
    
    {/* Y-axis labels */}
    <text x="30" y="260" textAnchor="end" fill="currentColor" className="text-xs">0</text>
    <text x="30" y="40" textAnchor="end" fill="currentColor" className="text-xs">{maxFreq}</text>
    <text x="30" y="150" textAnchor="end" fill="currentColor" className="text-xs">{Math.round(maxFreq / 2)}</text>

    {/* Bars */}
    {frequencies.map((f, i) => {
     const barWidth = (320 / optionsCount) * 0.6;
     const spacing = (320 / optionsCount);
     const barHeight = (f / maxFreq) * 220;
     const x = 40 + spacing * i + (spacing - barWidth) / 2;
     const y = 260 - barHeight;
     return (
     <g key={`bar-${i}`}>
      <rect
      x={x}
      y={y}
      width={barWidth}
      height={barHeight}
      fill={colors[i % colors.length]}
      rx="2"
      className="transition-all duration-300"
      />
      <text x={x + barWidth / 2} y="275" textAnchor="middle" fill="currentColor" className="text-xs font-medium">{labels[i]}</text>
      <text x={x + barWidth / 2} y={y - 5} textAnchor="middle" fill="currentColor" className="text-xs font-semibold">{f}</text>
     </g>
     );
    })}
    </svg>
   ) : (
    <svg viewBox="-150 -150 300 300" className="w-full h-full max-h-[400px]">
    {pieSlices.map((slice, i) => {
     if (!slice || slice.angle === 0) return null;
     return (
     <g key={`pie-${i}`}>
      <path
      d={getPiePath(slice.startAngle, slice.angle)}
      fill={slice.color}
      stroke="#fff"
      strokeWidth="1"
      className="transition-all duration-300 dark:stroke-slate-800"
      />
      {slice.angle > 15 && (
      <text
       x={140 * Math.cos((slice.startAngle + slice.angle / 2 - 90) * Math.PI / 180)}
       y={140 * Math.sin((slice.startAngle + slice.angle / 2 - 90) * Math.PI / 180)}
       textAnchor="middle"
       dominantBaseline="middle"
       fill="currentColor"
       className="text-xs font-semibold"
      >
       {slice.label} ({(slice.f / total * 100).toFixed(1)}%)
      </text>
      )}
     </g>
     );
    })}
    </svg>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
