import { useState, useMemo } from 'react';
import {Play, CheckCircle, XCircle, PenTool } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabCS11Python({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [code, set] = useState('FD 100\nRT 90\nFD 100\nRT 90\nFD 100\nRT 90\nFD 100\nRT 90');
 
 const parseCode = (source: string) => {
 let x = 200;
 let y = 200;
 let angle = -90; // Up
 
 const newPoints = [{x, y}];
 const lines = source.toUpperCase().split('\n');
 let err: string | null = null;
 
 for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  const parts = line.split(/\s+/);
  const cmd = parts[0];
  const val = parseInt(parts[1] || '0', 10);
  
  if (cmd === 'FD') {
  x += val * Math.cos(angle * Math.PI / 180);
  y += val * Math.sin(angle * Math.PI / 180);
  newPoints.push({x, y});
  } else if (cmd === 'RT') {
  angle += val;
  } else if (cmd === 'LT') {
  angle -= val;
  } else {
  err = `Unknown command at line ${i+1}: ${cmd}`;
  break;
  }
 }
 return { points: newPoints, error: err };
 };

 const { points, error } = useMemo(() => parseCode(code), [code]);

 const [feedback, setFeedback] = useState<string | null>(null);

 const checkAnswer = () => {
  if (error) {
  setFeedback('Fix the errors in your code first!');
  return;
  }
  
  // Triangle test: 4 points, first and last match, total 3 segments
  if (points.length === 4) {
  const start = points[0];
  const end = points[3];
  const dist = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
  if (dist < 1) {
   setFeedback('Correct! You programmed a closed triangle using Turtle graphics.');
   return;
  }
  }
  setFeedback('Incorrect. A triangle must draw exactly 3 sides and return to the starting point. Hint: Use 120 degree turns (360/3).');
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="CS11: Python Turtle Graphics" />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    Theory
   </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >Lab</button>
  </div>
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 overflow-y-auto lg:overflow-visible">
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
   <PenTool className="text-indigo-500" />
   Turtle Engine Theory
   </h2>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] flex-1 lg:overflow-y-auto">
   <p>
    <strong>Turtle Graphics</strong> is a popular way for introducing programming to kids. It was part of the original Logo programming language.
   </p>
   <p className="mt-4">
    Imagine a robotic turtle starting at the center of the screen. You can control it using simple text commands:
   </p>
   <ul className={`space-y-2 mt-4 font-mono bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] p-4 rounded-md text-slate-800 dark:text-[#ffffff] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
    <li><strong>FD 50</strong> : Forward 50 pixels</li>
    <li><strong>RT 90</strong> : Right Turn 90 degrees</li>
    <li><strong>LT 45</strong> : Left Turn 45 degrees</li>
   </ul>
   <p className="mt-4">
    To draw regular polygons, you use the formula <strong>360 / N</strong> to find the turn angle, where N is the number of sides. 
    For example, a square (4 sides) uses 90 degree turns (360/4).
   </p>
   </div>
  </div>

  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col items-center ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
   <Play className="text-amber-500" />
   Interactive Canvas Simulator
   </h2>
   
   <div className="w-full flex gap-4 h-full">
   <div className="w-1/3 flex flex-col">
    <label className="text-xs font-bold text-slate-500 dark:text-[#71717a] mb-1 uppercase">Command Trace</label>
    <textarea 
    value={code}
    onChange={e => set(e.target.value)}
    className={`flex-1 w-full bg-[#000000] dark:bg-[#121212] text-green-400 font-mono text-sm p-4 rounded-xl border-4 border-[#1c1b1b] dark:border-[#1c1b1b] outline-none resize-none focus:border-indigo-500 transition-colors flex-col `}
    spellCheck={false}
    />
   </div>

   <div className={`w-2/3 relative bg-slate-50 dark:bg-[#121212] border-2 border-slate-200 dark:border-[#1c1b1b] rounded-xl shadow-inner overflow- flex items-center justify-center flex-col `}>
    <div className="absolute top-2 left-2 flex gap-2">
    <div className="px-2 py-1 bg-slate-100 dark:bg-[#121212] rounded text-xs font-mono text-slate-500 dark:text-[#71717a] border border-slate-200 dark:border-[#1c1b1b]">
     X: {Math.round(points[points.length-1]?.x - 200)}
    </div>
    <div className="px-2 py-1 bg-slate-100 dark:bg-[#121212] rounded text-xs font-mono text-slate-500 dark:text-[#71717a] border border-slate-200 dark:border-[#1c1b1b]">
     Y: {Math.round(200 - points[points.length-1]?.y)}
    </div>
    </div>
    
    <svg width="400" height="400" className="bg-slate-50 dark:bg-[#121212]/50">
    <g transform="translate(0,0)">
     {/* Grid */}
     <line x1="200" y1="0" x2="200" y2="400" stroke="#e2e8f0" strokeWidth="1" />
     <line x1="0" y1="200" x2="400" y2="200" stroke="#e2e8f0" strokeWidth="1" />
     
     {/* Path */}
     <polyline 
     points={points.map(p => `${p.x},${p.y}`).join(' ')} 
     fill="none" 
     stroke="#4f46e5" 
     strokeWidth="3" 
     strokeLinejoin="round"
     strokeLinecap="round"
     />
     
     {/* Turtle cursor */}
     {points.length > 0 && (
     <circle cx={points[points.length-1].x} cy={points[points.length-1].y} r="4" fill="#ef4444" />
     )}
    </g>
    </svg>
    
    {error && (
    <div className="absolute bottom-4 left-4 right-4 bg-red-100 text-red-800 text-xs font-bold p-2 rounded border border-red-300 ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block">
     {error}
    </div>
    )}
   </div>
   </div>
  </div>

  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col `}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
   <CheckCircle className="text-green-500" />
   Programming Challenge
   </h2>
   <div className="flex-1">
   <p className="text-slate-600 dark:text-[#a1a1aa] mb-4">
    Your task is to write a sequence of commands in the simulator to draw a perfect <strong>Equilateral Triangle</strong>.
   </p>
   <p className="text-slate-600 dark:text-[#a1a1aa] mb-6">
    Requirements:
    <br/>- Exactly 3 sides (use FD).
    <br/>- Must return exactly to the starting position.
    <br/>- Hint: The exterior angle of a triangle is 120 degrees.
   </p>
   
   <button
    onClick={checkAnswer}
    className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
   >
    Verify Drawing
   </button>

   {feedback && (
    <div className={`mt-4 p-4 rounded-md flex items-start gap-3 ${feedback.includes('Correct') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
    {feedback.includes('Correct') ? <CheckCircle className="shrink-0 mt-0.5" size={18} /> : <XCircle className="shrink-0 mt-0.5" size={18} />}
    <p className="text-sm font-medium">{feedback}</p>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
