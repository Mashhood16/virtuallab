import { useState, useEffect, useRef } from 'react';
import { Zap, Camera, CheckCircle, XCircle, Activity, Settings2, Database, Calculator } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP12ElectricPotential({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [mode, setMode] = useState<'eel' | 'rc'>('eel');
 
 // Eel State
 const [electrocytes, setElectrocytes] = useState<number>(5000);
 const [voltPerCell, setVoltPerCell] = useState<number>(0.15);
 const [isShocking, setIsShocking] = useState(false);
 
 // RC State
 const [capacitance, setCapacitance] = useState<number>(100);
 const [resistance, setResistance] = useState<number>(500);
 const [supplyVoltage, setSupplyVoltage] = useState<number>(100);
 const [isCharging, setIsCharging] = useState(false);
 const [vCap, setVCap] = useState(0);
 
 const vCapRef = useRef(0);
 const lastTime = useRef(performance.now());
 const [vHistory, setVHistory] = useState<number[]>([]);

 // Logs and Assessments
 const [logs, setLogs] = useState<Array<any>>([]);
 const [ans1, setAns1] = useState('');
 const [ans2, setAns2] = useState('');
 const [feedback, setFeedback] = useState('');

 const totalEelVoltage = electrocytes * voltPerCell;

 useEffect(() => {
 let rid: number;
 const update = (timeNow: number) => {
  const dt = Math.min((timeNow - lastTime.current) / 1000, 0.1);
  lastTime.current = timeNow;
  
  const RC = resistance * (capacitance * 1e-6);
  let cv = vCapRef.current;
  
  if (isCharging) {
  cv += ((supplyVoltage - cv) / RC) * dt;
  } else {
  cv += (-cv / RC) * dt;
  }
  
  vCapRef.current = cv;
  setVCap(cv);
  rid = requestAnimationFrame(update);
 };
 rid = requestAnimationFrame(update);
 return () => cancelAnimationFrame(rid);
 }, [isCharging, resistance, capacitance, supplyVoltage]);

 useEffect(() => {
 const interval = setInterval(() => {
  setVHistory(prev => {
  const next = [...prev, vCapRef.current];
  return next.length > 60 ? next.slice(-60) : next;
  });
 }, 50);
 return () => clearInterval(interval);
 }, []);

 const handleRecord = () => {
 if (mode === 'eel') {
  setLogs([...logs, { type: 'Eel', info: `${electrocytes} cells`, val1: `${voltPerCell}V/cell`, val2: `${totalEelVoltage.toFixed(1)}V` }]);
 } else {
  const tau = (resistance * capacitance * 1e-6).toFixed(3);
  setLogs([...logs, { type: 'RC', info: `C=${capacitance}μF, R=${resistance}Ω`, val1: `Vs=${supplyVoltage}V`, val2: `τ=${tau}s` }]);
 }
 };

 const checkAnswers = () => {
 let score = 0;
 if (ans1.trim() === '750') score++;
 if (ans2.trim() === '0.1') score++;
 if (score === 2) setFeedback('Excellent work! Both calculations are correct.');
 else setFeedback('Please check your calculations and try again.');
 };

 const handleShock = () => {
 setIsShocking(true);
 setTimeout(() => setIsShocking(false), 500);
 };

 const renderEelSVG = () => {
 const segments = Math.min(Math.floor(electrocytes / 200), 50);
 const activeColor = isShocking ? '#fde047' : '#3b82f6';
 const bodyParts = [];
 for(let i=0; i<segments; i++) {
  bodyParts.push(
   <rect key={i} x={50 + i * 6} y={150 + Math.sin(i*0.3)*10} width="5" height="20" rx="2" fill={activeColor} opacity={0.6 + 0.4*(voltPerCell/0.15)} />
  );
 }
 return (
  <svg viewBox="0 0 400 300" className="w-full h-full bg-[#000000] dark:bg-[#121212] rounded-lg shadow-inner">
  {isShocking && (
   <circle cx="200" cy="150" r="100" fill="#fef08a" opacity="0.2" className="animate-ping" />
  )}
  <text x="10" y="30" fill="white" fontSize="14" fontWeight="bold">Electrophorus electricus</text>
  <path d={`M 30,160 Q 40,150 50,150`} stroke="#1e3a8a" fill="none" strokeWidth="20" strokeLinecap="round" />
  {bodyParts}
  {isShocking && (
   <>
    <path d="M 200,50 L 220,90 L 190,100 L 230,140" stroke="#fde047" fill="none" strokeWidth="4" />
    <path d="M 100,250 L 120,210 L 90,200 L 130,160" stroke="#fde047" fill="none" strokeWidth="4" />
    <path d="M 300,100 L 320,140 L 290,150 L 330,190" stroke="#fde047" fill="none" strokeWidth="4" />
    <text x="140" y="80" fill="#fde047" fontSize="24" fontWeight="bold" className="animate-pulse">{totalEelVoltage.toFixed(0)} V SHOCK!</text>
   </>
  )}
  <text x="10" y="280" fill="#aaa" fontSize="12">Internal Bio-Capacitors Series Connection</text>
  </svg>
 );
 };

 const renderRCSVG = () => {
 // Generate graph line
 const points = vHistory.map((v, i) => `${i * (400 / 60)},${250 - (v / 300) * 200}`);
 const bulbBrightness = vCap / 300; // max brightness at 300V
 
 return (
  <svg viewBox="0 0 400 300" className="w-full h-full bg-[#000000] dark:bg-[#121212] rounded-lg shadow-inner">
  <text x="10" y="30" fill="white" fontSize="14" fontWeight="bold">Voltage Across Capacitor (V vs Time)</text>
  
  {/* Graph background/grid */}
  <line x1="0" y1="250" x2="400" y2="250" stroke="#555" />
  <line x1="0" y1="183.3" x2="400" y2="183.3" stroke="#333" strokeDasharray="4" />
  <text x="5" y="178" fill="#666" fontSize="10">100V</text>
  <line x1="0" y1="50" x2="400" y2="50" stroke="#333" strokeDasharray="4" />
  <text x="5" y="45" fill="#666" fontSize="10">300V</text>

  {/* Live Graph Line */}
  {points.length > 0 && (
   <path d={`M ${points.join(' L ')}`} stroke="#22c55e" fill="none" strokeWidth="3" />
  )}

  {/* Flash Bulb Visual */}
  <g transform="translate(320, 50)">
   <circle cx="0" cy="0" r="30" fill={!isCharging && vCap > 10 ? `rgba(255, 255, 255, ${bulbBrightness})` : '#111'} stroke="#555" strokeWidth="2" />
   <path d="M -10,15 L -10,35 L 10,35 L 10,15" fill="#333" />
   <text x="-45" y="55" fill="white" fontSize="10">Camera Flash</text>
   {!isCharging && vCap > 10 && (
    <circle cx="0" cy="0" r={30 + bulbBrightness * 20} fill="#fde047" opacity={bulbBrightness * 0.5} className="animate-ping" />
   )}
  </g>
  
  <text x="10" y="280" fill="#22c55e" fontSize="14" fontWeight="bold">Current: {vCap.toFixed(1)} V</text>
  </svg>
 );
 };

 return (
 <div className="flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] font-sans select-none overflow-hidden">
  <LabHeader onExit={onExit} title="Lab P12.2: Capacitors & Bioelectricity" />

  
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
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg: overflow-y-auto lg:overflow-visible">
  
  {/* Left Column: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col  ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center mb-4 text-emerald-700">
   <Activity className="w-6 h-6 mr-2" />
   <h2 className="text-lg font-bold">Theory & Context</h2>
   </div>
   <div className="text-slate-700 dark:text-[#ffffff] space-y-4 text-sm leading-relaxed lg:overflow-y-auto flex-1 pr-2">
   <p>
    A <strong>Capacitor</strong> is a device that stores electrical energy in an electric field. 
    The amount of charge <em>Q</em> it stores depends on its capacitance <em>C</em> and voltage <em>V</em>:
   </p>
   <div className={`bg-emerald-50 p-3 rounded-lg font-mono text-center border border-emerald-100 flex-col `}>
    Q = C · V
   </div>
   
   <h3 className="font-bold text-emerald-800 mt-4">Bioelectricity (The Eel)</h3>
   <p>
    The electric eel creates shocks using specialized cells called <em>electrocytes</em>. 
    Each cell acts like a tiny battery/capacitor. By connecting thousands in <strong>series</strong>, 
    the voltages add up, generating lethal shocks of over 800V!
   </p>
   
   <h3 className="font-bold text-emerald-800 mt-4">RC Circuits (Camera Flash)</h3>
   <p>
    In circuits, charging or discharging a capacitor through a resistor <em>R</em> takes time. 
    The rate is determined by the time constant <strong>τ (tau)</strong>:
   </p>
   <div className={`bg-emerald-50 p-3 rounded-lg font-mono text-center border border-emerald-100 flex-col `}>
    τ = R · C
   </div>
   <p>
    A camera flash slowly charges a capacitor (taking seconds) and then rapidly discharges it through a low-resistance bulb (taking milliseconds), releasing an intense burst of light.
   </p>
   </div>
  </div>

  {/* Middle Column: Simulation */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className="flex justify-between items-center mb-4">
   <div className="flex items-center text-emerald-700">
    <Settings2 className="w-6 h-6 mr-2" />
    <h2 className="text-lg font-bold">Interactive Simulator</h2>
   </div>
   <div className={`flex overflow-x-auto hide-scrollbar bg-slate-100 dark:bg-[#121212] rounded-lg p-1 `}>
    <button 
    onClick={() => setMode('eel')}
    className={`px-3 py-1 rounded-md text-sm font-medium flex items-center transition-colors ${mode === 'eel' ? 'bg-slate-50 dark:bg-[#121212] shadow text-emerald-700' : 'text-slate-500 dark:text-[#a1a1aa]'}`}
    >
    <Zap className="w-4 h-4 mr-1" /> Eel
    </button>
    <button 
    onClick={() => setMode('rc')}
    className={`px-3 py-1 rounded-md text-sm font-medium flex items-center transition-colors ${mode === 'rc' ? 'bg-slate-50 dark:bg-[#121212] shadow text-emerald-700' : 'text-slate-500 dark:text-[#a1a1aa]'}`}
    >
    <Camera className="w-4 h-4 mr-1" /> RC Flash
    </button>
   </div>
   </div>

   <div className="h-64 mb-6 rounded-lg overflow-hidden border border-[#1c1b1b] dark:border-[#1c1b1b] relative">
   {mode === 'eel' ? renderEelSVG() : renderRCSVG()}
   </div>

   <div className="flex-1 space-y-4">
   {mode === 'eel' ? (
    <div className={`space-y-4 bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
    <div>
     <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
     <span>Number of Electrocytes</span>
     <span className="text-emerald-600 font-bold">{electrocytes}</span>
     </label>
     <input type="range" min="1000" max="10000" step="100" value={electrocytes} onChange={(e) => setElectrocytes(Number(e.target.value))} className="w-full accent-emerald-600" />
    </div>
    <div>
     <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
     <span>Voltage per Cell</span>
     <span className="text-emerald-600 font-bold">{voltPerCell.toFixed(2)} V</span>
     </label>
     <input type="range" min="0.10" max="0.20" step="0.01" value={voltPerCell} onChange={(e) => setVoltPerCell(Number(e.target.value))} className="w-full accent-emerald-600" />
    </div>
    <button onClick={handleShock} className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 rounded shadow-sm transition-colors flex justify-center items-center dark:text-white dark:text-white dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-yellow-500/40">
     <Zap className="w-5 h-5 mr-2" /> Trigger Shock!
    </button>
    </div>
   ) : (
    <div className="space-y-4 bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
    <div>
     <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
     <span>Capacitance (C)</span>
     <span className="text-emerald-600 font-bold">{capacitance} μF</span>
     </label>
     <input type="range" min="10" max="1000" step="10" value={capacitance} onChange={(e) => setCapacitance(Number(e.target.value))} className="w-full accent-emerald-600" />
    </div>
    <div>
     <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
     <span>Resistance (R)</span>
     <span className="text-emerald-600 font-bold">{resistance} Ω</span>
     </label>
     <input type="range" min="10" max="2000" step="50" value={resistance} onChange={(e) => setResistance(Number(e.target.value))} className="w-full accent-emerald-600" />
    </div>
    <div>
     <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
     <span>Supply Voltage</span>
     <span className="text-emerald-600 font-bold">{supplyVoltage} V</span>
     </label>
     <input type="range" min="10" max="300" step="10" value={supplyVoltage} onChange={(e) => setSupplyVoltage(Number(e.target.value))} className="w-full accent-emerald-600" />
    </div>
    <div className="flex gap-2 pt-2">
     <button 
     onMouseDown={() => setIsCharging(true)} 
     onMouseUp={() => setIsCharging(false)}
     onMouseLeave={() => setIsCharging(false)}
     className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded shadow-sm transition-colors select-none dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
     >
     Hold to Charge
     </button>
    </div>
    </div>
   )}
   </div>
  </div>

  {/* Right Column: Assessment & Data */}
  <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <div className="flex items-center justify-between mb-4 text-emerald-700">
   <div className="flex items-center">
    <Database className="w-6 h-6 mr-2" />
    <h2 className="text-lg font-bold">Data Log & Analysis</h2>
   </div>
   <button onClick={handleRecord} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded hover:bg-emerald-200 text-sm font-semibold transition-colors">
    Record Data
   </button>
   </div>

   <div className="max-h-40 lg:overflow-y-auto mb-6 border border-slate-200 dark:border-[#1c1b1b] rounded-lg">
   <table className="w-full text-sm text-left text-slate-600 dark:text-[#a1a1aa]">
    <thead className="text-xs text-slate-700 dark:text-[#ffffff] uppercase bg-slate-50 dark:bg-[#121212] sticky top-0">
    <tr>
     <th className="px-3 py-2">System</th>
     <th className="px-3 py-2">Parameters</th>
     <th className="px-3 py-2">Input</th>
     <th className="px-3 py-2 font-bold text-emerald-700">Output</th>
    </tr>
    </thead>
    <tbody>
    {logs.length === 0 ? (
     <tr><td colSpan={4} className="px-3 py-4 text-center text-slate-400">No data recorded yet.</td></tr>
    ) : (
     logs.map((log, i) => (
     <tr key={i} className="border-t border-slate-100">
      <td className="px-3 py-2 font-medium">{log.type}</td>
      <td className="px-3 py-2 text-xs">{log.info}</td>
      <td className="px-3 py-2 text-xs">{log.val1}</td>
      <td className="px-3 py-2 font-bold text-emerald-600">{log.val2}</td>
     </tr>
     ))
    )}
    </tbody>
   </table>
   </div>

   <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
   <div className="flex items-center mb-3 text-slate-800 dark:text-[#ffffff]">
    <Calculator className="w-5 h-5 mr-2 text-emerald-600" />
    <h3 className="font-bold">Knowledge Check</h3>
   </div>
   
   <div className="space-y-4 flex-1">
    <div>
    <label className="block text-sm text-slate-700 dark:text-[#ffffff] mb-1">
     1. An eel has exactly 5000 electrocytes connected in series, each producing 0.15V. What is the total voltage output (in V)?
    </label>
    <input 
     type="text" 
     value={ans1} 
     onChange={e => setAns1(e.target.value)} 
     placeholder="e.g. 500" 
     className="w-full border border-slate-300 dark:border-[#1c1b1b] rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
    </div>
    
    <div>
    <label className="block text-sm text-slate-700 dark:text-[#ffffff] mb-1">
     2. In an RC circuit, if C = 200 μF and R = 500 Ω, calculate the time constant τ in seconds.
    </label>
    <input 
     type="text" 
     value={ans2} 
     onChange={e => setAns2(e.target.value)} 
     placeholder="e.g. 0.5" 
     className="w-full border border-slate-300 dark:border-[#1c1b1b] rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
    </div>
   </div>

   {feedback && (
    <div className={`mt-4 p-3 rounded text-sm flex items-start ${feedback.includes('Excellent') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
    {feedback.includes('Excellent') ? <CheckCircle className="w-5 h-5 mr-2 shrink-0" /> : <XCircle className="w-5 h-5 mr-2 shrink-0" />}
    {feedback}
    </div>
   )}

   <button onClick={checkAnswers} className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition-colors dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">
    Check Answers
   </button>
   </div>

  </div>
  </div>
 </div>
 );
}
