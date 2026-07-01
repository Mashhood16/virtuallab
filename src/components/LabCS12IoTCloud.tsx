import { useState, useEffect } from 'react';
import { Database, ShieldAlert, Cpu, Link as LinkIcon, CheckCircle, BookOpen, Save } from 'lucide-react';
import LabHeader from './LabHeader';

interface Block {
 index: number;
 sensor: string;
 pm25: number;
 prevHash: number;
 hash: number;
 tampered: boolean;
}

export default function LabCS12IoTCloud({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const calcHash = (pm25: number, prevHash: number) => {
  return (pm25 * 7 + prevHash * 13) % 10000;
 };

 const [blocks, setBlocks] = useState<Block[]>([
  { index: 0, sensor: 'Genesis', pm25: 0, prevHash: 0, hash: calcHash(0, 0), tampered: false }
 ]);
 const [sensors, setSensors] = useState({ s1: 45, s2: 80, s3: 15 });

 useEffect(() => {
  const interval = setInterval(() => {
   setSensors(prev => ({
    s1: Math.max(0, Math.min(500, prev.s1 + Math.floor(Math.random() * 11) - 5)),
    s2: Math.max(0, Math.min(500, prev.s2 + Math.floor(Math.random() * 15) - 7)),
    s3: Math.max(0, Math.min(500, prev.s3 + Math.floor(Math.random() * 7) - 3)),
   }));
  }, 2000);
  return () => clearInterval(interval);
 }, []);

 const addBlock = (sensor: string, pm25: number) => {
  setBlocks(prev => {
   const prevBlock = prev[prev.length - 1];
   const newBlock: Block = {
    index: prev.length,
    sensor,
    pm25,
    prevHash: prevBlock.hash,
    hash: calcHash(pm25, prevBlock.hash),
    tampered: false
   };
   return [...prev, newBlock];
  });
 };

 const tamperBlock = (index: number, newPm25: number) => {
  setBlocks(prev => {
   const updated = [...prev];
   const block = updated[index];
   if (!block) return prev;
   updated[index] = {
    ...block,
    pm25: newPm25,
    hash: calcHash(newPm25, block.prevHash),
    tampered: true
   };
   // Note: Intentionally NOT updating subsequent blocks to show broken chain
   return updated;
  });
 };

 const [ansHash, setAnsHash] = useState('');
 const [ansBroken, setAnsBroken] = useState('');
 const [ansDecentralized, setAnsDecentralized] = useState('');
 const [feedback, setFeedback] = useState('');

 const checkAnswers = () => {
  let score = 0;
  if (ansHash.trim() === '1650') score++;
  if (ansBroken.trim() === '3') score++;
  if (ansDecentralized.toLowerCase().trim() === 'no') score++;

  if (score === 3) setFeedback('Superb! You understand Blockchain immutability.');
  else setFeedback(`Score: ${score}/3. Review how hash linking secures data.`);
 };

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
   {/* Header */}
   <LabHeader onExit={onExit} variant="dark" title="Lab 12.3: Distributed IoT & Blockchain" />

   
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
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:flex-1 lg:h-full lg:min-h-0 overflow-y-auto lg:overflow-visible">
    {/* Column 1 */}
    <div className={`bg-slate-50 dark:bg-[#121212] p-6 rounded-xl shadow border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
      <BookOpen className="text-indigo-500" /> Theory & Context
     </h2>
     <div className="text-sm text-slate-700 dark:text-[#ffffff] space-y-4">
      <p><strong>Internet of Things (IoT)</strong> systems connect physical sensors to the Cloud to monitor real-world metrics like Air Quality (PM2.5).</p>
      
      <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">The Trust Problem</h3>
      <p>How do we ensure that collected data is never secretly altered (tampered)? We use a <strong>Blockchain Ledger</strong>.</p>
      
      <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">Blockchain Mechanics</h3>
      <p>Each time data is logged, it is packaged into a Block.</p>
      <ul className="list-disc pl-5 space-y-1">
       <li>Each block calculates a cryptographic <strong>Hash</strong> based on its data and the previous block's hash.</li>
       <li><span className="font-mono bg-slate-100 dark:bg-[#121212] px-1 rounded text-xs">Hash = f(Data, PrevHash)</span></li>
      </ul>
      <p>Because each block includes the hash of the block before it, they form an unbreakable chain. If an attacker modifies an old block's data, its Hash changes. This breaks the link to the next block, immediately exposing the tampering.</p>
      <p>Because the blockchain is distributed across many decentralized nodes, attackers cannot simply recalculate and update the entire chain everywhere simultaneously.</p>
     </div>
    </div>

    {/* Column 2 */}
    <div className={`bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] p-6 rounded-xl shadow border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col lg: ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2 shrink-0">
      <Database className="text-indigo-500" /> IoT Network & Ledger
     </h2>

     <div className="grid grid-cols-3 gap-4 mb-4 shrink-0">
      {(['s1', 's2', 's3'] as const).map(s => (
       <div key={s} className={`bg-slate-50 dark:bg-[#121212] p-4 rounded border border-slate-200 dark:border-[#1c1b1b] text-center relative shadow-sm flex-col `}>
        <Cpu className="mx-auto text-indigo-500 mb-2" size={24} />
        <h3 className="font-bold text-slate-700 dark:text-[#ffffff] uppercase">{s}</h3>
        <div className="text-xl lg:text-2xl font-black text-slate-800 dark:text-[#ffffff] my-2">
         {sensors[s]} <span className="text-xs text-slate-500 dark:text-[#71717a] font-normal">PM2.5</span>
        </div>
        <button 
         onClick={() => addBlock(s.toUpperCase(), sensors[s])}
         className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-bold py-2 px-3 rounded w-full transition-colors"
        >
         Log to Chain
        </button>
       </div>
      ))}
     </div>

     <div className="flex flex-col gap-4 lg:overflow-y-auto p-2 bg-slate-100 dark:bg-[#121212] rounded-lg shadow-inner flex-1 border border-slate-200 dark:border-[#1c1b1b]">
      {blocks.map((b, i) => {
       const isPrevValid = i === 0 || b.prevHash === blocks[i-1].hash;
       return (
        <div key={b.index} className={`relative p-4 rounded border-2 shadow-sm transition-colors ${!isPrevValid ? 'border-red-500 bg-red-50' : b.tampered ? 'border-orange-500 bg-orange-50' : 'border-emerald-500 bg-slate-50 dark:bg-[#121212]'}`}>
         {i > 0 && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10 bg-slate-50 dark:bg-[#121212] rounded-full">
           <LinkIcon className={isPrevValid ? 'text-emerald-500' : 'text-red-500'} size={20} />
          </div>
         )}
         <div className="flex justify-between items-center border-b border-slate-200 dark:border-[#1c1b1b] pb-2 mb-2">
          <h4 className="font-bold text-sm text-slate-800 dark:text-[#ffffff]">Block {b.index}</h4>
          {b.tampered && <span className="text-xs font-bold text-orange-600 flex items-center gap-1"><ShieldAlert size={14}/> Tampered Data</span>}
          {!isPrevValid && <span className="text-xs font-bold text-red-600 flex items-center gap-1"><ShieldAlert size={14}/> Broken Link</span>}
         </div>
         <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
          <div><strong className="text-slate-500 dark:text-[#71717a] uppercase text-[10px]">Sensor ID</strong><br/><span className="font-medium text-sm">{b.sensor}</span></div>
          <div>
           <strong className="text-slate-500 dark:text-[#71717a] uppercase text-[10px]">Data (PM2.5)</strong><br/>
           <input 
            type="number" 
            className={`w-20 p-1 border rounded text-sm ${b.tampered ? 'bg-orange-100 border-orange-300' : 'bg-slate-50 dark:bg-[#121212] border-slate-300 dark:border-[#1c1b1b]'} hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer`} 
            value={b.pm25} 
            onChange={(e) => tamperBlock(b.index, parseInt(e.target.value) || 0)}
            title="Click to edit and simulate tampering"
           />
          </div>
          <div className={!isPrevValid ? 'text-red-600' : ''}>
           <strong className="text-slate-500 dark:text-[#71717a] uppercase text-[10px] block mb-0.5">Previous Hash</strong>
           <span className="font-mono bg-slate-200 dark:bg-[#121212]/50 px-1 py-0.5 rounded">{b.prevHash}</span>
          </div>
          <div>
           <strong className="text-slate-500 dark:text-[#71717a] uppercase text-[10px] block mb-0.5">Current Hash</strong>
           <span className="font-mono bg-slate-200 dark:bg-[#121212]/50 px-1 py-0.5 rounded">{b.hash}</span>
          </div>
         </div>
        </div>
       );
      })}
     </div>
    </div>

    {/* Column 3 */}
    <div className="bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] p-6 rounded-xl shadow border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2 shrink-0">
      <CheckCircle className="text-indigo-500" /> Assessment & Analysis
     </h2>
     
     <div className="space-y-4 flex-1 lg:overflow-y-auto text-sm pr-2">
      <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded text-slate-600 dark:text-[#a1a1aa] border border-slate-200 dark:border-[#1c1b1b]">
       <strong>Lab Formula:</strong> <br/>
       <code className="text-xs">Hash = (Data &times; 7 + PrevHash &times; 13) % 10000</code>
      </div>
      
      <div>
       <label className="block text-slate-700 dark:text-[#ffffff] mb-1 font-medium">1. Given Data=50, PrevHash=100. Calculate the exact Hash:</label>
       <input type="text" value={ansHash} onChange={e => setAnsHash(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded" />
      </div>
      
      <div>
       <label className="block text-slate-700 dark:text-[#ffffff] mb-1 font-medium">2. Log a few blocks. If you tamper with Block 2's data by editing the PM2.5 value, which block index is the FIRST to show a broken PrevHash link? (Enter number)</label>
       <input type="text" value={ansBroken} onChange={e => setAnsBroken(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded" />
      </div>
      
      <div>
       <label className="block text-slate-700 dark:text-[#ffffff] mb-1 font-medium">3. Is it possible for a hacker to silently tamper a block without breaking the chain if copies of the ledger exist on thousands of decentralized nodes? (Yes/No)</label>
       <input type="text" value={ansDecentralized} onChange={e => setAnsDecentralized(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded" />
      </div>

      <button onClick={checkAnswers} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">
       Check Answers
      </button>

      {feedback && (
       <div className={`p-3 rounded mt-4 font-medium ${feedback.includes('Superb') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {feedback}
       </div>
      )}

      <div className="pt-4 border-t border-slate-200 dark:border-[#1c1b1b] mt-6">
       <button 
        onClick={() => {
         if (onExit) onExit();
        }}
        className={`w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40 `}
       >
        <Save size={20} />
        Submit Results & Exit
       </button>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
