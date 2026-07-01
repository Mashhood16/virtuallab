import { useState, useEffect } from 'react';
import { BookOpen, Activity, CheckCircle, Calculator, Play, Pause, RotateCcw } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabM12DifferentialEq({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [tab] = useState<'cooling' | 'ballistics'>('cooling');
 
 // Cooling States
 const [kCool, setKCool] = useState(0.05);
 const [t0, setT0] = useState(150);
 const [tEnv, setTEnv] = useState(20);
 const [timeC, setTimeC] = useState(0);
 const [runC, setRunC] = useState(false);
 
 // Ballistics States
 const [drag, setDrag] = useState(0.2);
 const [v0] = useState(50);
 const [angle, setAngle] = useState(60);
 const [timeB, setTimeB] = useState(0);
 const [runB, setRunB] = useState(false);

 // Assessment States
 const [userAns, setUserAns] = useState<string>('');
 const [feedback, setFeedback] = useState<string | null>(null);

 useEffect(() => {
  setUserAns('');
  setFeedback(null);
 }, [tab, kCool, t0, tEnv, drag, v0, angle]);

 const getBallisticsY = (t: number, d: number, v_0: number, ang: number) => {
  const v0y = v_0 * Math.sin(ang * Math.PI / 180);
  if (d === 0) return v0y * t - 0.5 * 9.8 * t * t;
  return (1 / d) * (v0y + 9.8 / d) * (1 - Math.exp(-d * t)) - (9.8 / d) * t;
 };
 const getBallisticsX = (t: number, d: number, v_0: number, ang: number) => {
  const v0x = v_0 * Math.cos(ang * Math.PI / 180);
  if (d === 0) return v0x * t;
  return (v0x / d) * (1 - Math.exp(-d * t));
 };

 useEffect(() => {
  let timer: number;
  if (runC) {
   timer = window.setInterval(() => {
    setTimeC(prev => Math.min(prev + 0.5, 100));
   }, 50);
  }
  return () => window.clearInterval(timer);
 }, [runC]);

 useEffect(() => {
  let timer: number;
  if (runB) {
   timer = window.setInterval(() => {
    setTimeB(prev => {
     const nextT = prev + 0.05;
     if (getBallisticsY(nextT, drag, v0, angle) < 0) {
      setRunB(false);
      return nextT;
     }
     return nextT;
    });
   }, 50);
  }
  return () => window.clearInterval(timer);
 }, [runB, drag, v0, angle]);

 const targetTemp = Math.round(tEnv + 0.4 * (t0 - tEnv));

 const checkAnswer = () => {
  const parsed = parseFloat(userAns);
  if (isNaN(parsed)) {
   setFeedback('Please enter a valid number.');
   return;
  }
  
  if (tab === 'cooling') {
   const exactT = - (1 / kCool) * Math.log((targetTemp - tEnv) / (t0 - tEnv));
   if (Math.abs(parsed - exactT) < 0.5) setFeedback('Correct! You solved the separable differential equation.');
   else setFeedback('Incorrect. Use t = -(1/k) * ln((T-Tenv)/(T0-Tenv)).');
  } else if (tab === 'ballistics') {
   const exactVt = 9.8 / drag;
   if (Math.abs(parsed - exactVt) < 0.5) setFeedback('Correct! Terminal velocity occurs when drag equals gravity.');
   else setFeedback('Incorrect. Set acceleration to 0 to find terminal velocity (mg/k).');
  }
 };

 // --- COOLING RENDER HELPERS ---
 const currTemp = tEnv + (t0 - tEnv) * Math.exp(-kCool * timeC);
 const interpolateColor = (temp: number) => {
  const t = Math.max(0, Math.min(1, temp / 200));
  return `hsl(${210 - t * 150}, ${20 + t * 80}%, ${20 + t * 70}%)`;
 };
 
 const slopeFields = [];
 for (let i = 0; i <= 100; i += 10) {
  for (let j = 0; j <= 200; j += 20) {
   const slope = -kCool * (j - tEnv);
   const m_px = slope * (-260 / 200) / (280 / 100);
   const ang = Math.atan(m_px);
   const cx = 100 + (i / 100) * 280;
   const cy = 280 - (j / 200) * 260;
   slopeFields.push(<line key={`s${i}-${j}`} x1={cx - 4 * Math.cos(ang)} y1={cy - 4 * Math.sin(ang)} x2={cx + 4 * Math.cos(ang)} y2={cy + 4 * Math.sin(ang)} stroke="#cbd5e1" strokeWidth="1" />);
  }
 }
 const cPts = [];
 for (let tau = 0; tau <= timeC; tau += 1) {
  cPts.push(`${100 + (tau / 100) * 280},${280 - ((tEnv + (t0 - tEnv) * Math.exp(-kCool * tau)) / 200) * 260}`);
 }

 // --- BALLISTICS RENDER HELPERS ---
 const mapBx = (x: number) => 40 + (x / 260) * 320;
 const mapBy = (y: number) => 260 - (y / 130) * 220;
 const bPts = [];
 for(let t=0; t<=timeB; t+=0.1) {
  const x = getBallisticsX(t, drag, v0, angle);
  const y = getBallisticsY(t, drag, v0, angle);
  if(y >= 0 || t === 0) bPts.push(`${mapBx(x)},${mapBy(y)}`);
 }
 const currBx = getBallisticsX(timeB, drag, v0, angle);
 const currBy = getBallisticsY(timeB, drag, v0, angle);

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
   <LabHeader onExit={onExit} title="M12 Differential Eq Lab" />

   
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
      {tab === 'cooling' && (
       <>
        <p><strong>Newton's Law of Cooling:</strong></p>
        <p>The rate of change of temperature is proportional to the difference between the object's temperature and the ambient environment.</p>
        <p className="font-semibold text-blue-700">{"$$ \\frac{dT}{dt} = -k(T - T_{env}) $$"}</p>
        <p>This is a separable first-order differential equation. Its exact solution is:</p>
        <p>{"$$ T(t) = T_{env} + (T_0 - T_{env}) e^{-kt} $$"}</p>
       </>
      )}
      {tab === 'ballistics' && (
       <>
        <p><strong>Ballistics with Air Resistance:</strong></p>
        <p>A projectile under gravity experiences air resistance proportional to velocity. The differential equations of motion are:</p>
        <p className="font-semibold text-blue-700">{"$$ m \\frac{dv_x}{dt} = -k v_x $$"}</p>
        <p className="font-semibold text-blue-700">{"$$ m \\frac{dv_y}{dt} = -mg - k v_y $$"}</p>
        <p>Assuming mass $m = 1$ kg, the terminal velocity $v_T$ is reached when the drag force equals gravity: $kv_T = mg$.</p>
       </>
      )}
     </div>
    </div>

    {/* Interactive Simulator Column */}
    <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center"><Activity className="w-5 h-5 mr-2 text-blue-600" />Interactive Simulator</h2>
     
     {tab === 'cooling' && (
      <div className="flex-grow flex flex-col">
       <svg viewBox="0 0 400 300" className={`w-full bg-slate-50 dark:bg-[#121212] rounded-lg shadow-inner border mb-4 flex-col `}>
        <line x1="100" y1="280" x2="380" y2="280" stroke="#94a3b8" />
        <line x1="100" y1="20" x2="100" y2="280" stroke="#94a3b8" />
        {slopeFields}
        {cPts.length > 0 && <path d={`M ${cPts.join(' L ')}`} fill="none" stroke="#ef4444" strokeWidth="3" />}
        <circle cx={100 + (timeC / 100) * 280} cy={280 - (currTemp / 200) * 260} r="5" fill="#ef4444" />
        
        <rect x="10" y="100" width="80" height="100" fill="none" stroke="#94a3b8" strokeDasharray="4" rx="4" />
        <text x="50" y="120" textAnchor="middle" fontSize="10" fill="#64748b">Env: {tEnv}°C</text>
        <circle cx="50" cy="160" r="25" fill={interpolateColor(currTemp)} stroke="#334155" strokeWidth="2" />
        <text x="50" y="164" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">{Math.round(currTemp)}°C</text>
       </svg>
       <div className="flex space-x-2 mb-4">
        <button onClick={() => setRunC(!runC)} className="flex-1 min-w-0 bg-blue-100 text-blue-700 py-2 rounded-md font-medium flex items-center justify-center hover:bg-blue-200">
         {runC ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />} {runC ? 'Pause' : 'Start'}
        </button>
        <button onClick={() => { setRunC(false); setTimeC(0); }} className="flex-1 min-w-0 bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] py-2 rounded-md font-medium flex items-center justify-center hover:bg-slate-200 dark:bg-[#121212]">
         <RotateCcw className="w-4 h-4 mr-2" /> Reset
        </button>
       </div>
       <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Cooling Constant ($k$): {kCool.toFixed(3)}</label>
       <input type="range" min="0.01" max="0.1" step="0.01" value={kCool} onChange={(e) => setKCool(Number(e.target.value))} className="mb-2" />
       <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Initial Temp ($T_0$): {t0}°C</label>
       <input type="range" min="50" max="200" step="10" value={t0} onChange={(e) => setT0(Number(e.target.value))} className="mb-2" />
       <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Ambient Temp ({"$T_{env}$"}): {tEnv}°C</label>
       <input type="range" min="0" max="40" step="1" value={tEnv} onChange={(e) => setTEnv(Number(e.target.value))} />
      </div>
     )}

     {tab === 'ballistics' && (
      <div className="flex-grow flex flex-col">
       <svg viewBox="0 0 400 300" className="w-full bg-slate-50 dark:bg-[#121212] rounded-lg shadow-inner border mb-4">
        <line x1="40" y1="260" x2="360" y2="260" stroke="#94a3b8" />
        <line x1="40" y1="40" x2="40" y2="260" stroke="#94a3b8" />
        {bPts.length > 0 && <path d={`M ${bPts.join(' L ')}`} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" />}
        <circle cx={mapBx(currBx)} cy={mapBy(currBy > 0 ? currBy : 0)} r="6" fill="#1e293b" />
       </svg>
       <div className="flex space-x-2 mb-4">
        <button onClick={() => setRunB(!runB)} className="flex-1 min-w-0 bg-blue-100 text-blue-700 py-2 rounded-md font-medium flex items-center justify-center hover:bg-blue-200">
         {runB ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />} {runB ? 'Pause' : 'Fire'}
        </button>
        <button onClick={() => { setRunB(false); setTimeB(0); }} className="flex-1 min-w-0 bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] py-2 rounded-md font-medium flex items-center justify-center hover:bg-slate-200 dark:bg-[#121212]">
         <RotateCcw className="w-4 h-4 mr-2" /> Reset
        </button>
       </div>
       <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Drag Coefficient ($k$): {drag.toFixed(2)} kg/s</label>
       <input type="range" min="0" max="0.5" step="0.05" value={drag} onChange={(e) => { setDrag(Number(e.target.value)); setTimeB(0); setRunB(false); }} className="mb-2" />
       <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Launch Angle: {angle}°</label>
       <input type="range" min="15" max="85" step="5" value={angle} onChange={(e) => { setAngle(Number(e.target.value)); setTimeB(0); setRunB(false); }} />
      </div>
     )}
    </div>

    {/* Assessment Column */}
    <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center"><Calculator className="w-5 h-5 mr-2 text-blue-600" />Assessment</h2>
     <div className={`bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-sm text-blue-900 dark:bg-teal-950/20 dark:border-teal-900 dark:text-[#ffffff] `}>
      {tab === 'cooling' && <p>An object starts at $T_0 = {t0}$°C in an environment of {"$T_{env}$"} = {tEnv}°C. With $k = {kCool}$, how many seconds will it take to cool down to exactly {"$T_{target}$"} = {targetTemp}°C?</p>}
      {tab === 'ballistics' && <p>Calculate the vertical terminal velocity $v_T$ (in m/s) for a projectile of mass $m=1$ kg and drag coefficient $k = {drag}$ kg/s. (Assume $g = 9.8$ m/s²).</p>}
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
