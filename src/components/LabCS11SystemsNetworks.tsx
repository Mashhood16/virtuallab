import { useState } from 'react';
import {Zap, CheckCircle, XCircle, Power, ShieldAlert } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabCS11SystemsNetworks({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [inputA, setInputA] = useState<boolean>(false);
 const [inputB, setInputB] = useState<boolean>(false);
 const [gateType, setGateType] = useState<'AND' | 'OR' | 'XOR' | 'NAND'>('AND');
 
 let output = false;
 if (gateType === 'AND') output = inputA && inputB;
 if (gateType === 'OR') output = inputA || inputB;
 if (gateType === 'XOR') output = inputA !== inputB;
 if (gateType === 'NAND') output = !(inputA && inputB);

 const [assessmentAns, setAssessmentAns] = useState('');
 const [feedback, setFeedback] = useState<string | null>(null);

 const handleCheck = () => {
 if (assessmentAns.trim().toUpperCase() === 'XOR') {
  setFeedback('Correct! XOR outputs 1 only when inputs are different.');
 } else {
  setFeedback('Incorrect. Review the truth tables again.');
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="CS11: Logic Gates & Systems" />

  
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
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 overflow-y-auto lg:overflow-visible">
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
   <ShieldAlert className="text-indigo-500" />
   Systems Theory
   </h2>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] flex-1 lg:overflow-y-auto">
   <p>
    In computer systems, <strong>logic gates</strong> are the fundamental building blocks of digital circuits. 
    They process binary inputs (0 and 1) to produce a single binary output based on a boolean function.
   </p>
   <ul className="space-y-2 mt-4">
    <li><strong>AND Gate:</strong> Outputs 1 only if ALL inputs are 1.</li>
    <li><strong>OR Gate:</strong> Outputs 1 if AT LEAST ONE input is 1.</li>
    <li><strong>XOR (Exclusive OR):</strong> Outputs 1 if inputs are DIFFERENT.</li>
    <li><strong>NAND Gate:</strong> The inverse of AND. Outputs 0 only if ALL inputs are 1.</li>
   </ul>
   <p className="mt-4">
    Use the simulator to observe how different gates react to changing inputs. 
    The glowing lines represent electrical signals (High = 1 = On, Low = 0 = Off).
   </p>
   </div>
  </div>

  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col items-center  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
   <Zap className="text-amber-500" />
   Logic Breadboard Simulator
   </h2>
   
   <div className="w-full flex justify-center gap-4 mb-6">
   {(['AND', 'OR', 'XOR', 'NAND'] as const).map(gate => (
    <button
    key={gate}
    onClick={() => setGateType(gate)}
    className={`px-4 py-2 rounded-md font-semibold transition-colors ${gateType === gate ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
    >
    {gate}
    </button>
   ))}
   </div>

   <div className={`relative w-full max-w-md aspect-video bg-[#000000] dark:bg-[#121212] lg:dark:bg-[#121212] rounded-xl shadow-inner p-4 flex items-center justify-between border-4 border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex flex-col gap-12 z-10">
    <button 
    onClick={() => setInputA(!inputA)}
    className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all ${inputA ? 'bg-green-500 border-green-300 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'bg-slate-600 dark:bg-[#121212] border-slate-500 dark:border-slate-500'}`}
    >
    <Power size={20} className={inputA ? 'text-white' : 'text-slate-400'} />
    </button>
    <button 
    onClick={() => setInputB(!inputB)}
    className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all ${inputB ? 'bg-green-500 border-green-300 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'bg-slate-600 dark:bg-[#121212] border-slate-500 dark:border-slate-500'}`}
    >
    <Power size={20} className={inputB ? 'text-white' : 'text-slate-400'} />
    </button>
   </div>

   <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 400 200">
    <path d="M 50 60 L 150 60 L 150 80 L 180 80" fill="none" stroke={inputA ? '#22c55e' : '#475569'} strokeWidth="4" />
    <path d="M 50 140 L 150 140 L 150 120 L 180 120" fill="none" stroke={inputB ? '#22c55e' : '#475569'} strokeWidth="4" />
    
    <rect x="180" y="60" width="80" height="80" rx="10" fill="#312e81" stroke="#4f46e5" strokeWidth="3" />
    <text x="220" y="105" fill="white" fontSize="20" fontWeight="bold" textAnchor="middle">{gateType}</text>
    
    <path d="M 260 100 L 330 100" fill="none" stroke={output ? '#ef4444' : '#475569'} strokeWidth="4" />
   </svg>

   <div className="z-10">
    <div className={`w-16 h-16 rounded-full border-4 transition-all flex items-center justify-center ${output ? 'bg-red-500 border-red-300 shadow-[0_0_30px_rgba(239,68,68,0.8)]' : 'bg-slate-700 dark:bg-[#121212] border-slate-600 dark:border-slate-500'}`}>
    <span className={`font-bold text-xl ${output ? 'text-white' : 'text-slate-500 dark:text-[#a1a1aa]'}`}>{output ? '1' : '0'}</span>
    </div>
   </div>
   </div>
   
   <div className="mt-8 text-center text-slate-600 dark:text-[#a1a1aa]">
   <p>Toggle the inputs to see the truth table in action!</p>
   <div className="flex justify-center gap-4 mt-2">
    <span className="px-3 py-1 bg-slate-200 dark:bg-[#121212] rounded text-sm">Input A: {inputA ? '1' : '0'}</span>
    <span className="px-3 py-1 bg-slate-200 dark:bg-[#121212] rounded text-sm">Input B: {inputB ? '1' : '0'}</span>
    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded font-bold text-sm dark:text-[#ffffff]">Output: {output ? '1' : '0'}</span>
   </div>
   </div>
  </div>

  <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
   <CheckCircle className="text-green-500" />
   System Analysis Task
   </h2>
   <div className="flex-1">
   <p className="text-slate-600 dark:text-[#a1a1aa] mb-4">
    A security system uses a two-factor authentication logic. 
    The vault opens (Output = 1) <strong>only if</strong> the user provides a Pin (Input A) 
    or a Biometric scan (Input B), but <strong>not both</strong> (to prevent system override attacks).
   </p>
   
   <table className="w-full text-left border-collapse mb-6">
    <thead>
    <tr className="bg-slate-100 dark:bg-[#121212]">
     <th className="p-2 border border-slate-200 dark:border-[#1c1b1b]">A</th>
     <th className="p-2 border border-slate-200 dark:border-[#1c1b1b]">B</th>
     <th className="p-2 border border-slate-200 dark:border-[#1c1b1b]">Output</th>
    </tr>
    </thead>
    <tbody>
    <tr>
     <td className="p-2 border border-slate-200 dark:border-[#1c1b1b]">0</td>
     <td className="p-2 border border-slate-200 dark:border-[#1c1b1b]">0</td>
     <td className="p-2 border border-slate-200 dark:border-[#1c1b1b]">0</td>
    </tr>
    <tr>
     <td className="p-2 border border-slate-200 dark:border-[#1c1b1b]">0</td>
     <td className="p-2 border border-slate-200 dark:border-[#1c1b1b]">1</td>
     <td className="p-2 border border-slate-200 dark:border-[#1c1b1b] text-indigo-600 font-bold">1</td>
    </tr>
    <tr>
     <td className="p-2 border border-slate-200 dark:border-[#1c1b1b]">1</td>
     <td className="p-2 border border-slate-200 dark:border-[#1c1b1b]">0</td>
     <td className="p-2 border border-slate-200 dark:border-[#1c1b1b] text-indigo-600 font-bold">1</td>
    </tr>
    <tr>
     <td className="p-2 border border-slate-200 dark:border-[#1c1b1b]">1</td>
     <td className="p-2 border border-slate-200 dark:border-[#1c1b1b]">1</td>
     <td className="p-2 border border-slate-200 dark:border-[#1c1b1b]">0</td>
    </tr>
    </tbody>
   </table>

   <div className="mb-4">
    <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-2">Which logic gate does this system use?</label>
    <input
    type="text"
    value={assessmentAns}
    onChange={e => setAssessmentAns(e.target.value)}
    placeholder="Enter gate name (e.g., AND)"
    className="w-full px-4 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
    />
   </div>
   
   <button
    onClick={handleCheck}
    className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
   >
    Check Answer
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
