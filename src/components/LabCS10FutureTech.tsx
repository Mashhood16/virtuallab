import { useState, useEffect, useRef } from 'react';
import { Home, Lightbulb, Cloud, Brain, Check, X, Activity, FileText, Server } from 'lucide-react';
import LabHeader from './LabHeader';

interface Props {
 onExit?: () => void;
}

export default function LabCS10FutureTech({ onExit }: Props) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [tab, setTab] = useState<'iot' | 'ai' | 'cloud'>('iot');

 // IoT State
 const [acOn, setAcOn] = useState(false);
 const [lightOn, setLightOn] = useState(false);
 const [energyLog, setEnergyLog] = useState<{t: number, e: number}[]>([]);
 const timeRef = useRef<number>(0);
 const iotRef = useRef({ ac: false, light: false });

 // AI State
 const [candidates] = useState([
 { id: 1, name: 'John D.', gender: 'M', exp: 5 },
 { id: 2, name: 'Sarah M.', gender: 'F', exp: 6 },
 { id: 3, name: 'Mike T.', gender: 'M', exp: 2 },
 { id: 4, name: 'Emma W.', gender: 'F', exp: 4 },
 { id: 5, name: 'David L.', gender: 'M', exp: 8 },
 { id: 6, name: 'Lisa K.', gender: 'F', exp: 7 },
 ]);
 const [screened, setScreened] = useState(false);

 // Cloud State
 const [docText, setDocText] = useState('Project Goals:\n');
 const [syncLogs, setSyncLogs] = useState<string[]>([]);
 const docRef = useRef<string>(docText);

 useEffect(() => {
 iotRef.current = { ac: acOn, light: lightOn };
 }, [acOn, lightOn]);

 useEffect(() => {
 let timer: ReturnType<typeof setInterval>;
 if (tab === 'iot') {
  timer = setInterval(() => {
  timeRef.current += 1;
  let e = 0;
  if (iotRef.current.ac) e += 1500;
  if (iotRef.current.light) e += 60;
  setEnergyLog(prev => [...prev.slice(-19), { t: timeRef.current, e }]);
  }, 1000);
 }
 return () => clearInterval(timer);
 }, [tab]);

 useEffect(() => {
 let timer: ReturnType<typeof setInterval>;
 if (tab === 'cloud') {
  timer = setInterval(() => {
  if (Math.random() > 0.5) {
   const additions = ["- Integrate API\n", "- Update UI\n", "- Fix bugs\n"];
   const addition = additions[Math.floor(Math.random() * additions.length)];
   setDocText(prev => prev + addition);
   setSyncLogs(prev => [`Alice added text (Latency: ${Math.floor(Math.random()*50 + 10)}ms)`, ...prev.slice(0, 4)]);
  }
  }, 2500);
 }
 return () => clearInterval(timer);
 }, [tab]);

 const [iotAns, setIotAns] = useState('');
 const [aiAns, setAiAns] = useState('');
 const [cloudAns, setCloudAns] = useState('');

 // Graph Path
 const maxE = 1600;
 const points = energyLog.map((p, i) => `${(i / 20) * 100},${100 - (p.e / maxE) * 100}`).join(' ');

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Future Tech Virtual Lab" subtitle="IoT, AI Bias & Cloud Computing" />
  
  
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
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:flex-1 overflow-y-auto lg:overflow-visible">
  {/* LEFT COLUMN: Theory & Setup */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-slate-200 dark:border-[#1c1b1b]  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">1. Select Module</h2>
   <div className="flex gap-2">
   <button onClick={() => setTab('iot')} className={`flex-1 py-2 rounded font-medium ${tab === 'iot' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}>IoT Smart Home</button>
   <button onClick={() => setTab('ai')} className={`flex-1 py-2 rounded font-medium ${tab === 'ai' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}>AI Bias</button>
   <button onClick={() => setTab('cloud')} className={`flex-1 py-2 rounded font-medium ${tab === 'cloud' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}>Cloud Docs</button>
   </div>
   
   <div className={`mt-4 p-4 bg-indigo-50 rounded-lg text-sm text-indigo-900 dark:bg-[#121212] dark:border-[#1c1b1b] dark:text-[#ffffff] flex-col `}>
   {tab === 'iot' && <p><strong>Internet of Things (IoT):</strong> Connects physical devices to the internet. Toggle the AC and Lights to observe energy consumption dynamically.</p>}
   {tab === 'ai' && <p><strong>AI Bias:</strong> Artificial Intelligence models can inherit human biases from training data. Run the AI screening tool and analyze its selections.</p>}
   {tab === 'cloud' && <p><strong>Cloud Computing:</strong> Enables real-time collaboration. Watch how cloud synchronization handles concurrent text edits.</p>}
   </div>

   {tab === 'iot' && (
   <div className="mt-4 border-t pt-4">
    <h3 className="font-semibold mb-2">Device Controls</h3>
    <div className={`flex justify-between items-center bg-slate-50 dark:bg-[#121212] p-3 rounded mb-2 flex-col `}>
    <span className="flex items-center gap-2"><Home size={18}/> AC Unit (1500W)</span>
    <button onClick={() => setAcOn(!acOn)} className={`px-3 py-1 rounded text-white ${acOn ? 'bg-green-500' : 'bg-red-500'}`}>{acOn ? 'ON' : 'OFF'}</button>
    </div>
    <div className={`flex justify-between items-center bg-slate-50 dark:bg-[#121212] p-3 rounded flex-col `}>
    <span className="flex items-center gap-2"><Lightbulb size={18}/> Smart Lights (60W)</span>
    <button onClick={() => setLightOn(!lightOn)} className={`px-3 py-1 rounded text-white ${lightOn ? 'bg-green-500' : 'bg-red-500'}`}>{lightOn ? 'ON' : 'OFF'}</button>
    </div>
   </div>
   )}
  </div>

  {/* MIDDLE COLUMN: Simulation */}
  <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] p-5 rounded-xl shadow-sm flex flex-col items-center justify-center border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
   {tab === 'iot' && (
    <div className={`w-full max-w-md bg-slate-100 dark:bg-[#121212] rounded-xl p-6 relative shadow-inner `}>
    <h3 className="text-center font-bold mb-6 text-slate-700 dark:text-[#ffffff]">Smart Home Floor Plan</h3>
    <div className="grid grid-cols-2 gap-4 h-48">
     <div className={`border-2 rounded flex flex-col items-center justify-center transition-colors ${acOn || lightOn ? 'bg-blue-50 border-blue-300' : 'bg-slate-200 dark:bg-[#121212] border-slate-300 dark:border-[#1c1b1b]'}`}>
     <Home size={32} className={lightOn ? 'text-yellow-500' : 'text-slate-400'} />
     <span className="mt-2 font-semibold">Living Room</span>
     {acOn && <span className="text-xs text-blue-500 font-bold mt-1">AC Cooling...</span>}
     </div>
     <div className="border-2 border-slate-300 dark:border-[#1c1b1b] bg-slate-200 dark:bg-[#121212] rounded flex flex-col items-center justify-center">
     <Home size={32} className="text-slate-400" />
     <span className="mt-2 font-semibold">Garage (Offline)</span>
     </div>
    </div>
    </div>
   )}

   {tab === 'ai' && (
    <div className="w-full flex flex-col h-full">
    <div className="flex justify-between items-center mb-4">
     <h3 className="font-bold flex items-center gap-2"><Brain className="text-indigo-600"/> AI Resume Screener</h3>
     <button onClick={() => setScreened(true)} className="bg-indigo-600 text-white px-4 py-2 rounded font-bold hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">Run Screening</button>
    </div>
    <div className="flex-1 lg:overflow-y-auto space-y-2">
     {candidates.map(c => {
     const rejected = screened && c.gender === 'F';
     const accepted = screened && c.gender === 'M';
     return (
      <div key={c.id} className={`p-3 rounded border flex justify-between items-center ${rejected ? 'bg-red-50 border-red-200' : accepted ? 'bg-green-50 border-green-200' : 'bg-slate-50 dark:bg-[#121212]'}`}>
      <div>
       <p className="font-bold">{c.name}</p>
       <p className="text-xs text-slate-500 dark:text-[#71717a]">Gender: {c.gender} | Experience: {c.exp} yrs</p>
      </div>
      {rejected && <X className="text-red-500" />}
      {accepted && <Check className="text-green-500" />}
      </div>
     );
     })}
    </div>
    </div>
   )}

   {tab === 'cloud' && (
   <div className="w-full flex flex-col h-full">
    <h3 className="font-bold mb-4 flex items-center gap-2"><Cloud className="text-indigo-600"/> Collaborative Document</h3>
    <textarea 
     className={`flex-1 border-2 border-indigo-200 rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:border-indigo-400 `}
     value={docText}
     onChange={(e) => {
     setDocText(e.target.value);
     docRef.current = e.target.value;
     }}
    />
    <div className="mt-4 h-24 bg-[#000000] dark:bg-[#121212] text-green-400 font-mono text-xs p-2 rounded lg:overflow-y-auto">
     <p className="text-slate-400 mb-1">Server Sync Logs:</p>
     {syncLogs.map((log, i) => <div key={i}>{log}</div>)}
    </div>
   </div>
   )}
  </div>

  {/* RIGHT COLUMN: Data & Analysis */}
  <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] lg: ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">3. Data Logging & Analysis</h2>
   
   {tab === 'iot' && (
   <>
    <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border">
    <h3 className="font-bold flex items-center gap-2 mb-2"><Activity size={18}/> Energy Graph (W)</h3>
    <svg viewBox="0 0 100 100" className="w-full h-32 bg-slate-50 dark:bg-[#121212] rounded border overflow-visible">
     <polyline points={points} fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinejoin="round" />
    </svg>
    <div className="flex justify-between text-xs text-slate-400 mt-1">
     <span>Past</span><span>Now</span>
    </div>
    </div>
    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b]">
    <h3 className="font-bold mb-2">Assessment</h3>
    <p className="text-sm mb-2">If both the AC and Lights are left on for 5 hours, what is the total energy consumed in Watt-hours (Wh)? (AC=1500W, Light=60W)</p>
    <input type="number" value={iotAns} onChange={e=>setIotAns(e.target.value)} className="w-full p-2 border rounded mb-2" placeholder="Enter total Wh..." />
    <button className="w-full bg-indigo-600 text-white py-2 rounded dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40" onClick={() => alert(iotAns === '7800' ? 'Correct! (1560W * 5h)' : 'Incorrect. Try again.')}>Check Answer</button>
    </div>
   </>
   )}

   {tab === 'ai' && (
    <>
    <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border">
     <h3 className="font-bold flex items-center gap-2 mb-2"><FileText size={18}/> Data Table</h3>
     <table className="w-full text-sm text-left">
     <thead>
      <tr className="border-b"><th className="pb-2">Group</th><th className="pb-2">Accepted</th><th className="pb-2">Rejected</th></tr>
     </thead>
     <tbody>
      <tr className="border-b"><td>Male (M)</td><td>{screened ? 3 : 0}</td><td>0</td></tr>
      <tr><td>Female (F)</td><td>0</td><td>{screened ? 3 : 0}</td></tr>
     </tbody>
     </table>
    </div>
    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b]">
     <h3 className="font-bold mb-2">Assessment</h3>
     <p className="text-sm mb-2">Based on the data table, the AI shows a strong bias against which group?</p>
     <select value={aiAns} onChange={e=>setAiAns(e.target.value)} className="w-full p-2 border rounded mb-2">
     <option value="">Select...</option>
     <option value="M">Male Candidates</option>
     <option value="F">Female Candidates</option>
     <option value="N">No Bias</option>
     </select>
     <button className="w-full bg-indigo-600 text-white py-2 rounded dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40" onClick={() => alert(aiAns === 'F' ? 'Correct! All female candidates were rejected regardless of experience.' : 'Incorrect. Look at the accepted vs rejected columns.')}>Check Answer</button>
    </div>
    </>
   )}

   {tab === 'cloud' && (
    <>
    <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border">
     <h3 className="font-bold flex items-center gap-2 mb-2"><Server size={18}/> Network Logs</h3>
     <div className="text-sm space-y-1">
     <p className="flex justify-between"><span>Packets Sent:</span> <strong>{syncLogs.length * 4}</strong></p>
     <p className="flex justify-between"><span>Avg Latency:</span> <strong>35ms</strong></p>
     <p className="flex justify-between"><span>Connections:</span> <strong>2 Active</strong></p>
     </div>
    </div>
    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mt-auto dark:bg-[#121212] dark:border-[#1c1b1b]">
     <h3 className="font-bold mb-2">Assessment</h3>
     <p className="text-sm mb-2">If Alice's connection drops, what mechanism ensures she doesn't lose offline edits?</p>
     <select value={cloudAns} onChange={e => setCloudAns(e.target.value)} className="w-full p-2 border rounded mb-2 text-sm">
     <option value="">Select...</option>
     <option value="drop">Edits are permanently dropped</option>
     <option value="sync">Local caching and conflict resolution</option>
     <option value="email">Changes are emailed to Bob</option>
     </select>
     <button className="w-full bg-indigo-600 text-white py-2 rounded dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40" onClick={() => alert(cloudAns === 'sync' ? 'Correct! The local edits are cached and synchronized once restored.' : 'Incorrect.')}>Check Answer</button>
    </div>
    </>
   )}

  </div>
  </div>
 </div>
 );
}
