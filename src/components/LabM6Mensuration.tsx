import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Ruler, Box, CheckCircle, XCircle } from 'lucide-react';

export default function LabM6Mensuration({ onExit }: { onExit?: () => void }) {
 const containerRef = useRef<HTMLDivElement>(null);
 const [mode, setMode] = useState<'2D' | '3D'>('2D');
 const [length, setLength] = useState(10);
 const [width, setWidth] = useState(8);
 const [height, setHeight] = useState(5);
 const [costPerUnit, setCostPerUnit] = useState(25);
 
 const [studentAnswer, setStudentAnswer] = useState('');
 const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');

 const [questionType, setQuestionType] = useState<'area' | 'perimeter' | 'volume'>('area');

 useEffect(() => {
 setStudentAnswer('');
 setFeedback('none');
 }, [mode, length, width, height, costPerUnit, questionType]);

 const checkAnswer = () => {
 let correctValue = 0;
 if (mode === '2D') {
  if (questionType === 'area') {
  correctValue = length * width * costPerUnit; // cost of carpeting
  } else {
  correctValue = 2 * (length + width) * costPerUnit; // cost of fencing
  }
 } else {
  correctValue = length * width * height * 1000; // volume in liters
 }

 if (parseFloat(studentAnswer) === correctValue) {
  setFeedback('correct');
 } else {
  setFeedback('incorrect');
 }
 };

 return (
 <div ref={containerRef} className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-900 dark:text-[#ffffff]">
  {/* Header */}
  <header className="flex items-center p-4 shadow-sm z-10">
  <button onClick={onExit} className="mr-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
   <ArrowLeft size={24} />
  </button>
  <h1 className="text-2xl font-bold flex-1">Unit 9: Mensuration Sandbox</h1>
  </header>

  {/* Main Content */}
  <div className="lg:flex-1 min-w-0 flex flex-col lg:grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4 p-4 overflow-y-auto lg:overflow-visible">
  {/* Left: Controls */}
  <div className={`w-full bg-white dark:!bg-[#121212] rounded-2xl shadow-sm p-6 flex flex-col gap-6 lg:overflow-y-auto  ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex gap-4 border-b border-slate-200 dark:border-[#1c1b1b] pb-4">
   <button
    onClick={() => { setMode('2D'); setQuestionType('area'); }}
    className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors ${mode === '2D' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-[#ffffff]'}`}
   >
    <Ruler size={20} /> 2D Area & Perimeter
   </button>
   <button
    onClick={() => { setMode('3D'); setQuestionType('volume'); }}
    className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors ${mode === '3D' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-[#ffffff]'}`}
   >
    <Box size={20} /> 3D Volume
   </button>
   </div>

   <div className="space-y-4">
   <h2 className="text-xl font-semibold">Dimensions (m)</h2>
   <div className="grid grid-cols-2 gap-4">
    <div>
    <label className="block text-sm font-medium mb-1">Length: {length} m</label>
    <input type="range" min={1} max={20} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-blue-500" />
    </div>
    <div>
    <label className="block text-sm font-medium mb-1">Width: {width} m</label>
    <input type="range" min={1} max={20} value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full accent-blue-500" />
    </div>
    {mode === '3D' && (
    <div>
     <label className="block text-sm font-medium mb-1">Depth/Height: {height} m</label>
     <input type="range" min={1} max={10} value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full accent-indigo-500" />
    </div>
    )}
   </div>
   {mode === '2D' && (
    <div className="pt-2">
    <label className="block text-sm font-medium mb-1">Cost per Unit ($): {costPerUnit}</label>
    <input type="range" min={5} max={100} step={5} value={costPerUnit} onChange={(e) => setCostPerUnit(Number(e.target.value))} className="w-full accent-green-500" />
    </div>
   )}
   </div>

   <div className={`w-full bg-white lg:bg-slate-100 dark:bg-white lg:bg-slate-700 p-4 rounded-xl space-y-4  'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-xl font-semibold">Assessment</h2>
   {mode === '2D' ? (
    <div className="flex gap-4 mb-4">
    <label className="flex items-center gap-2 cursor-pointer">
     <input type="radio" checked={questionType === 'area'} onChange={() => setQuestionType('area')} className="accent-blue-500 w-4 h-4 cursor-pointer" />
     Carpet Room (Area)
    </label>
    <label className="flex items-center gap-2 cursor-pointer">
     <input type="radio" checked={questionType === 'perimeter'} onChange={() => setQuestionType('perimeter')} className="accent-blue-500 w-4 h-4 cursor-pointer" />
     Fence Field (Perimeter)
    </label>
    </div>
   ) : null}

   <p className="text-sm dark:text-[#a1a1aa]">
    {mode === '2D' && questionType === 'area' && `Calculate the total cost to carpet a room of ${length}m by ${width}m at $${costPerUnit} per sq. meter.`}
    {mode === '2D' && questionType === 'perimeter' && `Calculate the total cost to fence a field of ${length}m by ${width}m at $${costPerUnit} per meter.`}
    {mode === '3D' && `Calculate the capacity of a water tank of ${length}m × ${width}m × ${height}m in liters. (Hint: 1 m³ = 1000 liters)`}
   </p>

   <div className="flex flex-wrap gap-2">
    <input
    type="number"
    value={studentAnswer}
    onChange={(e) => setStudentAnswer(e.target.value)}
    placeholder="Enter your answer..."
    className="flex-1 min-w-0 px-4 py-2 rounded-lg border border-slate-300 dark:border-[#1c1b1b] focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
    onClick={checkAnswer}
    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
    Check
    </button>
   </div>

   {feedback !== 'none' && (
    <div className={`w-full flex items-center gap-2 p-3 rounded-lg ${feedback === 'correct' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'} flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
    {feedback === 'correct' ? <CheckCircle size={20} /> : <XCircle size={20} />}
    <span className="font-medium">{feedback === 'correct' ? 'Correct! Great job.' : 'Incorrect. Try again!'}</span>
    </div>
   )}
   </div>
  </div>

  {/* Right: Simulation Stage */}
  <div className="bg-white dark:!bg-[#121212] rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center min-h-[400px]">
   <h2 className="text-xl font-semibold mb-6 self-start">Simulation Stage</h2>
   <div className="flex-1 min-w-0 w-full flex items-center justify-center relative">
   <svg viewBox="-50 -50 400 400" className="w-full h-full max-h-[500px]">
    {mode === '2D' ? (
    <g>
     {/* Grid background */}
     <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
     <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="1" />
     </pattern>
     <rect x="-50" y="-50" width="400" height="400" fill="url(#grid)" />
     
     {/* The Field/Room */}
     <rect
     x={150 - (length * 10) / 2}
     y={150 - (width * 10) / 2}
     width={length * 10}
     height={width * 10}
     fill={questionType === 'area' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(34, 197, 94, 0.1)'}
     stroke={questionType === 'perimeter' ? '#22c55e' : '#3b82f6'}
     strokeWidth={questionType === 'perimeter' ? 4 : 2}
     strokeDasharray={questionType === 'perimeter' ? '0' : '4'}
     />
     
     {/* Labels */}
     <text x={150} y={150 - (width * 10) / 2 - 10} textAnchor="middle" fill="currentColor" className="text-sm font-semibold">{length} m</text>
     <text x={150 + (length * 10) / 2 + 10} y={150} textAnchor="start" dominantBaseline="middle" fill="currentColor" className="text-sm font-semibold">{width} m</text>
    </g>
    ) : (
    <g transform="translate(50, 80)">
     {/* Simple Isometric Box */}
     {/* back rect */}
     <path d={`M 50 0 L ${50 + length * 10} 0 L ${50 + length * 10} ${height * 15} L 50 ${height * 15} Z`} fill="rgba(168, 85, 247, 0.1)" stroke="#5560F1" />
     {/* bottom rect */}
     <path d={`M 0 ${width * 8 + height * 15} L ${length * 10} ${width * 8 + height * 15} L ${50 + length * 10} ${height * 15} L 50 ${height * 15} Z`} fill="rgba(168, 85, 247, 0.2)" stroke="#5560F1" />
     {/* left side */}
     <path d={`M 0 ${width * 8} L 50 0 L 50 ${height * 15} L 0 ${width * 8 + height * 15} Z`} fill="rgba(168, 85, 247, 0.15)" stroke="#5560F1" />
     {/* front rect */}
     <path d={`M 0 ${width * 8} L ${length * 10} ${width * 8} L ${length * 10} ${width * 8 + height * 15} L 0 ${width * 8 + height * 15} Z`} fill="rgba(168, 85, 247, 0.3)" stroke="#5560F1" strokeWidth="2" />
     {/* top rect */}
     <path d={`M 0 ${width * 8} L ${length * 10} ${width * 8} L ${50 + length * 10} 0 L 50 0 Z`} fill="rgba(56, 189, 248, 0.4)" stroke="#5560F1" />
     
     {/* Dimensions */}
     <text x={length * 5} y={width * 8 + height * 15 + 20} textAnchor="middle" fill="currentColor" className="text-sm font-semibold">{length} m</text>
     <text x={length * 10 + 25} y={width * 4 + height * 15 + 10} textAnchor="start" fill="currentColor" className="text-sm font-semibold">{width} m</text>
     <text x={-10} y={width * 8 + height * 7.5} textAnchor="end" fill="currentColor" className="text-sm font-semibold">{height} m</text>
    </g>
    )}
   </svg>
   </div>
  </div>
  </div>
 </div>
 );
}
