import { useState } from 'react';
import { Play, CheckCircle, Sliders, BookOpen, Network, Save } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabCS12DeepLearning({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [w11, setW11] = useState(0.5);
 const [w21, setW21] = useState(-0.5);
 const [w31, setW31] = useState(1.0);
 const [b1, setB1] = useState(0.0);
 const [b2, setB2] = useState(-0.5);
 const [selected, setSelected] = useState<string | null>(null);
 const [isForwarded, setIsForwarded] = useState(false);

 const i1 = 1.0;
 const i2 = -1.0;
 
 const h1_in = i1 * w11 + i2 * w21 + b1;
 const h1_out = Math.max(0, h1_in);
 const o1_in = h1_out * w31 + b2;
 const o1_out = Math.max(0, o1_in);

 const [ansH1In, setAnsH1In] = useState('');
 const [ansH1Out, setAnsH1Out] = useState('');
 const [ansO1In, setAnsO1In] = useState('');
 const [ansO1Out, setAnsO1Out] = useState('');
 const [feedback, setFeedback] = useState('');

 const checkAnswers = () => {
  let score = 0;
  if (Math.abs(parseFloat(ansH1In) - h1_in) < 0.05) score++;
  if (Math.abs(parseFloat(ansH1Out) - h1_out) < 0.05) score++;
  if (Math.abs(parseFloat(ansO1In) - o1_in) < 0.05) score++;
  if (Math.abs(parseFloat(ansO1Out) - o1_out) < 0.05) score++;

  if (score === 4) setFeedback('Excellent! You manually traced the network correctly.');
  else setFeedback(`Score: ${score}/4. Check your calculations! (They change based on the weights you set)`);
 };

 const renderControls = () => {
  if (!selected) return <p className="text-sm text-slate-500 dark:text-[#71717a] italic p-4 bg-slate-50 dark:bg-[#121212] rounded">Click a weight (line) or bias (node) in the diagram to edit.</p>;
  
  let val = 0, setVal: (n: number) => void = () => {}, label = '';
  if (selected === 'w11') { val = w11; setVal = setW11; label = 'Weight i1 \u2192 h1'; }
  else if (selected === 'w21') { val = w21; setVal = setW21; label = 'Weight i2 \u2192 h1'; }
  else if (selected === 'w31') { val = w31; setVal = setW31; label = 'Weight h1 \u2192 o1'; }
  else if (selected === 'b1') { val = b1; setVal = setB1; label = 'Bias h1'; }
  else if (selected === 'b2') { val = b2; setVal = setB2; label = 'Bias o1'; }

  return (
   <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-[#1c1b1b]">
    <label className="font-semibold text-sm text-slate-700 dark:text-[#ffffff]">{label}: {val.toFixed(2)}</label>
    <input 
     type="range" min="-2" max="2" step="0.1" 
     value={val} 
     onChange={(e) => {
      setVal(parseFloat(e.target.value));
      setIsForwarded(false);
     }}
     className="w-full"
    />
   </div>
  );
 };

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
   {/* Header */}
   <LabHeader onExit={onExit} variant="dark" title="Lab 12.2: Deep Learning Neural Networks" />

   
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
      <p>Deep Learning models use Artificial Neural Networks to process complex data.</p>
      <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">Key Components</h3>
      <ul className="list-disc pl-5 space-y-1">
       <li><strong>Neurons (Nodes):</strong> Hold a value based on inputs.</li>
       <li><strong>Weights (w):</strong> Multipliers that strengthen or weaken signals between neurons.</li>
       <li><strong>Biases (b):</strong> Constants added to inputs to shift the activation function.</li>
      </ul>
      <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">Feedforward Flow</h3>
      <p>Data propagates from input to output. For any neuron:</p>
      <p className={`bg-slate-100 dark:bg-[#121212] p-2 rounded font-mono text-xs flex-col `}>Z = (i1 \u00d7 w1) + (i2 \u00d7 w2) + b</p>
      <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">Activation (ReLU)</h3>
      <p>Introduces non-linearity. Rectified Linear Unit (ReLU) outputs the input if positive, else 0:</p>
      <p className={`bg-slate-100 dark:bg-[#121212] p-2 rounded font-mono text-xs flex-col `}>Output = max(0, Z)</p>
     </div>
    </div>

    {/* Column 2 */}
    <div className="bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] p-6 rounded-xl shadow border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col lg: ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2 shrink-0">
      <Network className="text-indigo-500" /> Architecture Visualizer
     </h2>

     <div className="flex gap-2 mb-4 shrink-0">
      <button 
       onClick={() => setIsForwarded(true)} 
       className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded flex justify-center items-center gap-2 text-sm font-medium transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
      >
       <Play size={16} /> Run Feedforward
      </button>
     </div>

     <div className="relative w-full h-64 bg-slate-100 dark:bg-[#121212] rounded-lg shadow-inner mb-4 overflow-hidden border border-slate-200 dark:border-[#1c1b1b] shrink-0">
      <svg viewBox="0 0 300 200" className="w-full h-full">
       <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
         <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
        </marker>
        <marker id="arrow-selected" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
         <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
        </marker>
       </defs>

       <line x1="50" y1="50" x2="150" y2="100" stroke="transparent" strokeWidth="20" className="cursor-pointer" onClick={() => setSelected('w11')} />
       <line x1="50" y1="150" x2="150" y2="100" stroke="transparent" strokeWidth="20" className="cursor-pointer" onClick={() => setSelected('w21')} />
       <line x1="150" y1="100" x2="250" y2="100" stroke="transparent" strokeWidth="20" className="cursor-pointer" onClick={() => setSelected('w31')} />

       <line x1="50" y1="50" x2="150" y2="100" stroke={selected === 'w11' ? '#3b82f6' : '#94a3b8'} strokeWidth="3" markerEnd={selected === 'w11' ? "url(#arrow-selected)" : "url(#arrow)"} className="pointer-events-none" />
       <line x1="50" y1="150" x2="150" y2="100" stroke={selected === 'w21' ? '#3b82f6' : '#94a3b8'} strokeWidth="3" markerEnd={selected === 'w21' ? "url(#arrow-selected)" : "url(#arrow)"} className="pointer-events-none" />
       <line x1="150" y1="100" x2="250" y2="100" stroke={selected === 'w31' ? '#3b82f6' : '#94a3b8'} strokeWidth="3" markerEnd={selected === 'w31' ? "url(#arrow-selected)" : "url(#arrow)"} className="pointer-events-none" />

       <text x="90" y="65" fontSize="10" fill="#475569" className="pointer-events-none">w={w11.toFixed(1)}</text>
       <text x="90" y="145" fontSize="10" fill="#475569" className="pointer-events-none">w={w21.toFixed(1)}</text>
       <text x="190" y="90" fontSize="10" fill="#475569" className="pointer-events-none">w={w31.toFixed(1)}</text>

       <circle cx="50" cy="50" r="18" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
       <text x="50" y="54" textAnchor="middle" fontSize="12" fontWeight="bold">i1</text>
       <text x="50" y="25" textAnchor="middle" fontSize="10" fill="#1d4ed8">{i1.toFixed(1)}</text>

       <circle cx="50" cy="150" r="18" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
       <text x="50" y="154" textAnchor="middle" fontSize="12" fontWeight="bold">i2</text>
       <text x="50" y="180" textAnchor="middle" fontSize="10" fill="#1d4ed8">{i2.toFixed(1)}</text>

       <circle cx="150" cy="100" r="18" fill={selected === 'b1' ? '#bfdbfe' : '#f1f5f9'} stroke="#3b82f6" strokeWidth="2" className="cursor-pointer" onClick={() => setSelected('b1')} />
       <text x="150" y="104" textAnchor="middle" fontSize="12" fontWeight="bold" className="pointer-events-none">h1</text>
       <text x="150" y="75" textAnchor="middle" fontSize="10" fill="#475569" className="pointer-events-none">b={b1.toFixed(1)}</text>

       <circle cx="250" cy="100" r="18" fill={selected === 'b2' ? '#bfdbfe' : '#f1f5f9'} stroke="#10b981" strokeWidth="2" className="cursor-pointer" onClick={() => setSelected('b2')} />
       <text x="250" y="104" textAnchor="middle" fontSize="12" fontWeight="bold" className="pointer-events-none">o1</text>
       <text x="250" y="75" textAnchor="middle" fontSize="10" fill="#475569" className="pointer-events-none">b={b2.toFixed(1)}</text>

       {isForwarded && (
        <>
         <text x="150" y="135" textAnchor="middle" fontSize="10" fill="#b91c1c" fontWeight="bold">out={h1_out.toFixed(2)}</text>
         <text x="250" y="135" textAnchor="middle" fontSize="10" fill="#b91c1c" fontWeight="bold">out={o1_out.toFixed(2)}</text>
        </>
       )}
      </svg>
     </div>

     <div className="mt-auto shrink-0">
      <h3 className="text-sm font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2 mb-2">
       <Sliders size={16} className="text-slate-500 dark:text-[#71717a]" /> Tweak Parameters
      </h3>
      {renderControls()}
     </div>
    </div>

    {/* Column 3 */}
    <div className="bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] p-6 rounded-xl shadow border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2 shrink-0">
      <CheckCircle className="text-indigo-500" /> Assessment & Trace
     </h2>
     
     <div className="space-y-4 flex-1 lg:overflow-y-auto text-sm pr-2">
      <p className="text-slate-600 dark:text-[#a1a1aa] bg-slate-50 dark:bg-[#121212] p-3 rounded">
       Based on your currently set weights and biases, trace the data flow manually.
      </p>
      <div>
       <label className="block text-slate-700 dark:text-[#ffffff] mb-1 font-medium">1. Calc h1 pre-activation (Z): <br/> <span className="text-xs font-normal">Z = i1&times;w11 + i2&times;w21 + b1</span></label>
       <input type="number" step="0.01" value={ansH1In} onChange={e => setAnsH1In(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded" />
      </div>
      <div>
       <label className="block text-slate-700 dark:text-[#ffffff] mb-1 font-medium">2. Calc h1 ReLU output:<br/> <span className="text-xs font-normal">Out = max(0, Z)</span></label>
       <input type="number" step="0.01" value={ansH1Out} onChange={e => setAnsH1Out(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded" />
      </div>
      <div>
       <label className="block text-slate-700 dark:text-[#ffffff] mb-1 font-medium">3. Calc o1 pre-activation (Z):<br/> <span className="text-xs font-normal">Z = h1_out&times;w31 + b2</span></label>
       <input type="number" step="0.01" value={ansO1In} onChange={e => setAnsO1In(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded" />
      </div>
      <div>
       <label className="block text-slate-700 dark:text-[#ffffff] mb-1 font-medium">4. Calc o1 ReLU output:<br/> <span className="text-xs font-normal">Out = max(0, Z)</span></label>
       <input type="number" step="0.01" value={ansO1Out} onChange={e => setAnsO1Out(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded" />
      </div>

      <button onClick={checkAnswers} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">
       Check Answers
      </button>

      {feedback && (
       <div className={`p-3 rounded mt-4 font-medium ${feedback.includes('Excellent') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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
