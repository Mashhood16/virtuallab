import { useState } from 'react';
import { Activity, CheckCircle2, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface Props {
 onExit?: () => void;
}

export default function LabM10ComplexApplications({ onExit }: Props) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 // Simulator State
 const [resistance, setResistance] = useState<number>(10); // Real part
 const [reactance, setReactance] = useState<number>(5); // Imaginary part
 const [currentReal, setCurrentReal] = useState<number>(2);
 const [currentImag, setCurrentImag] = useState<number>(1);
 
 // Assessment State
 const [ansReal, setAnsReal] = useState<string>('');
 const [ansImag, setAnsImag] = useState<string>('');
 const [feedback, setFeedback] = useState<string | null>(null);
 
 // Derived values for E = I * Z
 // Z = R + jX
 // I = cR + jcI
 // E = (cR + jcI)(R + jX) = (cR*R - cI*X) + j(cR*X + cI*R)
 const vReal = currentReal * resistance - currentImag * reactance;
 const vImag = currentReal * reactance + currentImag * resistance;

 const checkAnswer = () => {
 if (parseFloat(ansReal) === vReal && parseFloat(ansImag) === vImag) {
  setFeedback('Correct! You correctly applied E = IZ.');
 } else {
  setFeedback('Incorrect. Remember: (a + bj)(c + dj) = (ac - bd) + (ad + bc)j');
 }
 };

 const generateWaveform = () => {
 // E = Vm * sin(wt + phi)
 const Vm = Math.sqrt(vReal*vReal + vImag*vImag);
 const phi = Math.atan2(vImag, vReal);
 
 let path = `M 0,100 `;
 for(let x = 0; x <= 400; x+=2) {
  const t = x / 50;
  const y = 100 - Vm * Math.sin(t + phi) * 2; // scale for visibility
  path += `L ${x},${y} `;
 }
 return path;
 };

 const generateCurrentWave = () => {
  const Im = Math.sqrt(currentReal*currentReal + currentImag*currentImag);
  const phiI = Math.atan2(currentImag, currentReal);
  let path = `M 0,100 `;
  for(let x = 0; x <= 400; x+=2) {
  const t = x / 50;
  const y = 100 - Im * Math.sin(t + phiI) * 10; // scale for visibility
  path += `L ${x},${y} `;
  }
  return path;
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Complex Numbers: AC Circuit Applications" />

  
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
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 flex-grow overflow-y-auto lg:overflow-visible">
  {/* LEFT: Theory */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
   <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2 dark:text-[#ffffff]">
   <Activity /> Theory & Context
   </h2>
   <div className="prose text-slate-700 dark:text-[#ffffff]">
   <p>
    In Alternating Current (AC) circuits, voltage and current oscillate over time. 
    Because they can be out of phase, engineers use <strong>Complex Numbers</strong> to represent them.
   </p>
   <p>
    <strong>Ohm's Law for AC:</strong> <code>E = I × Z</code>
   </p>
   <ul className="list-disc pl-5 space-y-2 mt-2">
    <li><strong>E (Voltage):</strong> Complex Voltage (Phasor)</li>
    <li><strong>I (Current):</strong> Complex Current (Phasor)</li>
    <li><strong>Z (Impedance):</strong> Complex resistance</li>
   </ul>
   <div className={`bg-slate-100 dark:bg-[#121212] p-4 rounded-lg mt-4 border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff]">Impedance (Z)</h3>
    <p>Z = R + jX</p>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">R = Resistance (Real), X = Reactance (Imaginary)</p>
   </div>
   <p className="mt-4 text-sm text-slate-600 dark:text-[#a1a1aa]">
    Note: Electrical engineers use <code>j</code> instead of <code>i</code> for the imaginary unit to avoid confusion with current!
   </p>
   </div>
  </div>

  {/* MIDDLE: Simulation */}
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col items-center ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold text-indigo-800 mb-4 dark:text-[#ffffff]">Oscilloscope & Phasor Simulation</h2>
   
   <div className={`w-full max-w-md space-y-4 mb-6 bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
   <div>
    <label className="block text-sm font-semibold mb-1">Resistance (R): {resistance} Ω</label>
    <input type="range" min="0" max="20" value={resistance} onChange={e => setResistance(Number(e.target.value))} className="w-full accent-indigo-600" />
   </div>
   <div>
    <label className="block text-sm font-semibold mb-1">Reactance (X): {reactance} Ω (j)</label>
    <input type="range" min="-20" max="20" value={reactance} onChange={e => setReactance(Number(e.target.value))} className="w-full accent-indigo-600" />
   </div>
   <div className="grid grid-cols-2 gap-4">
    <div>
     <label className="block text-sm font-semibold mb-1">Current Real: {currentReal} A</label>
     <input type="range" min="-5" max="5" value={currentReal} onChange={e => setCurrentReal(Number(e.target.value))} className="w-full accent-blue-600" />
    </div>
    <div>
     <label className="block text-sm font-semibold mb-1">Current Imag: {currentImag} A (j)</label>
     <input type="range" min="-5" max="5" value={currentImag} onChange={e => setCurrentImag(Number(e.target.value))} className="w-full accent-blue-600" />
    </div>
   </div>
   </div>

   <div className={`relative w-full h-48 bg-[#000000] dark:bg-[#121212] rounded-lg overflow- border-2 border-[#1c1b1b] dark:border-[#1c1b1b] shadow-inner flex-col `}>
   <svg viewBox="0 0 400 200" className="w-full h-full">
    {/* Grid lines */}
    <line x1="0" y1="100" x2="400" y2="100" stroke="#334155" strokeWidth="2" />
    <line x1="200" y1="0" x2="200" y2="200" stroke="#334155" strokeWidth="2" />
    
    {/* Voltage Waveform (Red) */}
    <path d={generateWaveform()} fill="none" stroke="#ef4444" strokeWidth="2" />
    
    {/* Current Waveform (Blue) */}
    <path d={generateCurrentWave()} fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.8" />
   </svg>
   <div className="absolute top-2 right-2 text-xs flex flex-col gap-1 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div> <span className="text-slate-300">Voltage (E)</span></div>
    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full dark:bg-teal-950/20 dark:border-teal-900"></div> <span className="text-slate-300">Current (I)</span></div>
   </div>
   </div>
  </div>

  {/* RIGHT: Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#1c1b1b] `}>
   <h2 className="text-xl font-bold text-indigo-800 mb-4 dark:text-[#ffffff]">Laboratory Assessment</h2>
   
   <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-6 dark:bg-[#121212] dark:border-[#1c1b1b]">
   <h3 className="font-semibold text-indigo-900 mb-2 dark:text-[#ffffff]">Calculate Complex Voltage</h3>
   <p className="text-slate-700 dark:text-[#ffffff] mb-4">
    Using the simulator values, calculate the resulting Voltage <code>E = I × Z</code> in standard complex form <code>a + bj</code>.
   </p>
   <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded border border-slate-200 dark:border-[#1c1b1b] mb-4 font-mono text-sm">
    <p>Z = {resistance} {reactance >= 0 ? '+' : '-'} {Math.abs(reactance)}j Ω</p>
    <p>I = {currentReal} {currentImag >= 0 ? '+' : '-'} {Math.abs(currentImag)}j A</p>
   </div>
   
   <div className="flex items-center gap-2 mb-4">
    <span className="font-semibold">E =</span>
    <input 
    type="number" 
    value={ansReal} 
    onChange={e => setAnsReal(e.target.value)}
    className="w-20 p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-indigo-500 outline-none"
    placeholder="Real"
    />
    <span className="font-semibold">+</span>
    <input 
    type="number" 
    value={ansImag} 
    onChange={e => setAnsImag(e.target.value)}
    className="w-20 p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-indigo-500 outline-none"
    placeholder="Imag"
    />
    <span className="font-semibold">j V</span>
   </div>

   <button 
    onClick={checkAnswer}
    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
   >
    Check Answer
   </button>

   {feedback && (
    <div className={`mt-4 p-3 rounded flex items-start gap-2 ${feedback.includes('Correct') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
    {feedback.includes('Correct') ? <CheckCircle2 className="shrink-0 mt-0.5" size={18} /> : <XCircle className="shrink-0 mt-0.5" size={18} />}
    <span>{feedback}</span>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
