import { useState, useEffect } from 'react';
import { BookOpen, Activity, CheckCircle, Calculator} from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabM12Derivatives({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [tab] = useState<'box' | 'kinematics' | 'business'>('box');
 
 //States
 const [volume, setVolume] = useState(1000);
 const [xBox] = useState(10);
 const [x, setX] = useState(10);
 
 // Kinematics States
 const [timeK, setTimeK] = useState(5);
 
 // Business States
 const [qBus, setQBus] = useState(50);

 // Assessment States
 const [userAns, setUserAns] = useState<string>('');
 const [feedback, setFeedback] = useState<string | null>(null);

 useEffect(() => {
  setUserAns('');
  setFeedback(null);
 }, [tab, volume, xBox, timeK, qBus]);

 const checkAnswer = () => {
  const parsed = parseFloat(userAns);
  if (isNaN(parsed)) {
   setFeedback('Please enter a valid number.');
   return;
  }
  
  if (tab === 'box') {
   const optimalX = Math.pow(2 * volume, 1/3);
   if (Math.abs(parsed - optimalX) < 0.1) setFeedback('Correct! You found the minimum surface area dimension.');
   else setFeedback('Incorrect. Remember to set dS/dx = 0.');
  } else if (tab === 'kinematics') {
   const exactV = -9.8 * timeK + 50;
   if (Math.abs(parsed - exactV) < 0.1) setFeedback('Correct! Instantaneous velocity is the derivative of position.');
   else setFeedback(`Incorrect. Evaluate v(t) = s'(t) at t=${timeK}.`);
  } else if (tab === 'business') {
   const exactQ = 40 / 0.6; // 66.67
   if (Math.abs(parsed - exactQ) < 0.5) setFeedback('Correct! Marginal Revenue equals Marginal Cost at maximum profit.');
   else setFeedback('Incorrect. Set P\'(q) = 0 or MR = MC.');
  }
 };

 // --- BOX RENDER HELPERS ---
 const yBox = volume / (xBox * xBox);
 const s = x * x + 4 * volume / x;
 const boxPts = [];
 for (let i = 5; i <= 25; i += 0.5) {
  boxPts.push(`${(i / 25) * 300},${200 - ((i * i + 4 * volume / i) / 2000) * 200}`);
 }
 const iso = (X: number, Y: number, Z: number) => ({ px: 150 + (X - Y) * 0.866, py: 320 + (X + Y) * 0.5 - Z });
 const scale = 1.5;
 const sx = xBox * scale; const sy = yBox * scale;
 const v1 = iso(sx/2, -sx/2, 0); const v2 = iso(sx/2, sx/2, 0); const v3 = iso(-sx/2, sx/2, 0);
 const v4 = iso(-sx/2, -sx/2, sy); const v5 = iso(sx/2, -sx/2, sy); const v6 = iso(sx/2, sx/2, sy); const v7 = iso(-sx/2, sx/2, sy);

 // --- KINEMATICS RENDER HELPERS ---
 const sKin = -4.9 * timeK * timeK + 50 * timeK + 10;
 const vKin = -9.8 * timeK + 50;
 const sPts = []; const vPts = [];
 for(let t=0; t<=10.2; t+=0.1) {
  sPts.push(`${(t/10.2)*300},${200 - ((-4.9*t*t + 50*t + 10 + 50)/200)*200}`);
  vPts.push(`${(t/10.2)*300},${200 - ((-9.8*t + 50 + 50)/200)*200}`);
 }

 // --- BUSINESS RENDER HELPERS ---
 const cBus = 1000 + 10 * qBus + 0.1 * qBus * qBus;
 const rBus = 50 * qBus - 0.2 * qBus * qBus;
 const pBus = rBus - cBus;
 const cPts = []; const rPts = []; const pPts = [];
 for(let q=0; q<=100; q+=1) {
  cPts.push(`${(q/100)*300},${200 - ((1000 + 10*q + 0.1*q*q + 1000)/6000)*200}`);
  rPts.push(`${(q/100)*300},${200 - ((50*q - 0.2*q*q + 1000)/6000)*200}`);
  pPts.push(`${(q/100)*300},${200 - ((-0.3*q*q + 40*q - 1000 + 1000)/6000)*200}`);
 }

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
   <LabHeader onExit={onExit} title="M12 Derivatives Lab" />

   
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
  <div className="p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 flex-grow overflow-y-auto lg:overflow-visible">
    {/* Theory Column */}
    <div className={`bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center"><BookOpen className="w-5 h-5 mr-2 text-blue-600" />Theory & Context</h2>
     <div className="prose prose-slate prose-sm text-slate-600 dark:text-[#a1a1aa]">
      {tab === 'box' && (
       <>
        <p><strong>ArchitecturalOptimization:</strong></p>
        <p>We need to design a box with a square base (side $x$) and height ($y$) such that its volume $V = x^2 y$ is fixed, but its Surface Area $S$ is minimized to save material costs.</p>
        <p>{"$$ S = x^2 + 4xy $$"}</p>
        <p>By substituting $y = V/x^2$, we express $S$ entirely in terms of $x$:</p>
        <p className="font-semibold text-blue-700">{"$$ S(x) = x^2 + \\frac{4V}{x} $$"}</p>
        <p>To find the minimum surface area, we calculate the derivative $S'(x)$ and set it to zero to find the critical points.</p>
       </>
      )}
      {tab === 'kinematics' && (
       <>
        <p><strong>Instantaneous Projectile Kinematics:</strong></p>
        <p>A projectile is fired vertically. Its position $s(t)$ (in meters) over time is given by:</p>
        <p className="font-semibold text-blue-700">{"$$ s(t) = -4.9t^2 + v_0 t + h_0 $$"}</p>
        <p>Where $v_0 = 50$ m/s is initial velocity and $h_0 = 10$ m is initial height.</p>
        <p>The instantaneous velocity $v(t)$ is the first derivative of position with respect to time:</p>
        <p>{"$$ v(t) = s'(t) = -9.8t + v_0 $$"}</p>
       </>
      )}
      {tab === 'business' && (
       <>
        <p><strong>Business Marginal Cost & Revenue:</strong></p>
        <p>Let $q$ be the production quantity. The Total Cost $C(q)$ and Total Revenue $R(q)$ are given as:</p>
        <ul className="list-disc pl-4 space-y-1">
         <li>$C(q) = 1000 + 10q + 0.1q^2$</li>
         <li>$R(q) = 50q - 0.2q^2$</li>
        </ul>
        <p>Profit $P(q) = R(q) - C(q)$.</p>
        <p>To maximize profit, we set Marginal Profit $P'(q) = 0$, which is equivalent to setting Marginal Revenue equal to Marginal Cost:</p>
        <p className="font-semibold text-blue-700">{"$$ MR = MC \\implies R'(q) = C'(q) $$"}</p>
       </>
      )}
     </div>
    </div>

    {/* Interactive Simulator Column */}
    <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center"><Activity className="w-5 h-5 mr-2 text-blue-600" />Interactive Simulator</h2>
     
     {tab === 'box' && (
      <div className="flex-grow flex flex-col">
       <svg viewBox="0 0 300 400" className={`w-full bg-slate-50 dark:bg-[#121212] rounded-lg shadow-inner border mb-4 flex-col `}>
        {/* Graph Top Half */}
        <line x1="0" y1="200" x2="300" y2="200" stroke="#94a3b8" />
        <line x1="0" y1="0" x2="0" y2="200" stroke="#94a3b8" />
        <path d={`M ${boxPts.join(' L ')}`} fill="none" stroke="#ef4444" strokeWidth="2" />
        <circle cx={(x/25)*300} cy={200 - (s/2000)*200} r="4" fill="#ef4444" />
        
        {/* 3DBottom Half */}
        <polygon points={`${v4.px},${v4.py} ${v5.px},${v5.py} ${v6.px},${v6.py} ${v7.px},${v7.py}`} fill="#93c5fd" stroke="#2563eb" strokeWidth="1" />
        <polygon points={`${v1.px},${v1.py} ${v2.px},${v2.py} ${v6.px},${v6.py} ${v5.px},${v5.py}`} fill="#60a5fa" stroke="#2563eb" strokeWidth="1" />
        <polygon points={`${v3.px},${v3.py} ${v2.px},${v2.py} ${v6.px},${v6.py} ${v7.px},${v7.py}`} fill="#3b82f6" stroke="#2563eb" strokeWidth="1" />
        <text x="10" y="380" fontSize="12" fill="#64748b">Volume = {volume} cm³</text>
       </svg>
       <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Target Volume ($V$): {volume}</label>
       <input type="range" min="500" max="2000" step="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="mb-4" />
       <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Base Side ($x$): {x.toFixed(1)} cm</label>
       <input type="range" min="5" max="25" step="0.1" value={x} onChange={(e) => setX(Number(e.target.value))} />
      </div>
     )}

     {tab === 'kinematics' && (
      <div className="flex-grow flex flex-col">
       <svg viewBox="0 0 300 200" className="w-full bg-slate-50 dark:bg-[#121212] rounded-lg shadow-inner border mb-4">
        <line x1="0" y1="150" x2="300" y2="150" stroke="#94a3b8" /> {/* Zero axis adjusted for shift */}
        <path d={`M ${sPts.join(' L ')}`} fill="none" stroke="#3b82f6" strokeWidth="2" />
        <path d={`M ${vPts.join(' L ')}`} fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" />
        <circle cx={(timeK/10.2)*300} cy={200 - ((sKin + 50)/200)*200} r="4" fill="#3b82f6" />
        <circle cx={(timeK/10.2)*300} cy={200 - ((vKin + 50)/200)*200} r="4" fill="#ef4444" />
        <text x="10" y="20" fontSize="10" fill="#3b82f6">Position s(t)</text>
        <text x="10" y="35" fontSize="10" fill="#ef4444">Velocity v(t)</text>
       </svg>
       <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Time ($t$): {timeK.toFixed(1)} s</label>
       <input type="range" min="0" max="10" step="0.1" value={timeK} onChange={(e) => setTimeK(Number(e.target.value))} />
       <div className="mt-4 text-sm text-slate-600 dark:text-[#a1a1aa] bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] p-3 rounded ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
        <p>Position: {sKin.toFixed(2)} m</p>
        <p>Velocity: {vKin.toFixed(2)} m/s</p>
       </div>
      </div>
     )}

     {tab === 'business' && (
      <div className="flex-grow flex flex-col">
       <svg viewBox="0 0 300 200" className="w-full bg-slate-50 dark:bg-[#121212] rounded-lg shadow-inner border mb-4">
        <line x1="0" y1="166" x2="300" y2="166" stroke="#94a3b8" /> {/* Zero axis */}
        <path d={`M ${cPts.join(' L ')}`} fill="none" stroke="#ef4444" strokeWidth="2" />
        <path d={`M ${rPts.join(' L ')}`} fill="none" stroke="#22c55e" strokeWidth="2" />
        <path d={`M ${pPts.join(' L ')}`} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" />
        <circle cx={(qBus/100)*300} cy={200 - ((pBus + 1000)/6000)*200} r="4" fill="#3b82f6" />
        <text x="10" y="20" fontSize="10" fill="#22c55e">Revenue R(q)</text>
        <text x="10" y="35" fontSize="10" fill="#ef4444">Cost C(q)</text>
        <text x="10" y="50" fontSize="10" fill="#3b82f6">Profit P(q)</text>
       </svg>
       <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Quantity ($q$): {qBus}</label>
       <input type="range" min="0" max="100" step="1" value={qBus} onChange={(e) => setQBus(Number(e.target.value))} />
       <div className="mt-4 text-sm text-slate-600 dark:text-[#a1a1aa] bg-slate-100 dark:bg-[#121212] p-3 rounded">
        <p>Profit: ${pBus.toFixed(2)}</p>
        <p>Marginal Profit: {(-0.6*qBus + 40).toFixed(2)}</p>
       </div>
      </div>
     )}
    </div>

    {/* Assessment Column */}
    <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center"><Calculator className="w-5 h-5 mr-2 text-blue-600" />Assessment</h2>
     <div className={`bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-sm text-blue-900 dark:bg-teal-950/20 dark:border-teal-900 dark:text-[#ffffff] `}>
      {tab === 'box' && <p>Given the Volume $V = {volume}$ cm³, calculate the exact base side length $x$ that minimizes the surface area. (Round to 2 decimal places).</p>}
      {tab === 'kinematics' && <p>Calculate the exact instantaneous velocity $v$ at time $t = {timeK}$ seconds.</p>}
      {tab === 'business' && <p>Calculate the exact production quantity $q$ that maximizes the overall profit by setting $MR = MC$.</p>}
     </div>
     
     <div className="space-y-4">
      <div>
       <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Your Answer</label>
       <input 
        type="text" 
        value={userAns} 
        onChange={(e) => setUserAns(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter numerical value..."
       />
      </div>
      <button 
       onClick={checkAnswer}
       className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
      >
       Check Answer
      </button>
      
      {feedback && (
       <div className={`p-4 rounded-md text-sm flex items-start ${feedback.includes('Correct') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
        {feedback.includes('Correct') ? <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" /> : <Activity className="w-5 h-5 mr-2 flex-shrink-0" />}
        <span>{feedback}</span>
       </div>
      )}
     </div>
    </div>
   </div>
  </div>
 );
}
