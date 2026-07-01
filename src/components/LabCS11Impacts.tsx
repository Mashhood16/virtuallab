import { useState, useMemo } from 'react';
import { Globe, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabCS11Impacts({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeTab, setActiveTab] = useState<'bias' | 'a11y'>('bias');

 // Bias Simulator State
 const [boxX, setBoxX] = useState(20);
 const [boxY, setBoxY] = useState(100);
 const boxW = 150;
 const boxH = 150;

 const points = useMemo(() => {
 const pts = [];
 for(let i=0; i<100; i++) {
  const isUrban = i < 60;
  // Urban points concentrated on left (20-180), Rural on right (220-380)
  const x = isUrban ? 20 + Math.random() * 160 : 220 + Math.random() * 160;
  const y = 20 + Math.random() * 360;
  // Connectivity metric (0-100)
  const val = isUrban ? 70 + Math.random() * 30 : 10 + Math.random() * 40;
  pts.push({ id: i, x, y, isUrban, val });
 }
 return pts;
 }, []);

 const samplePoints = points.filter(p => p.x >= boxX && p.x <= boxX + boxW && p.y >= boxY && p.y <= boxY + boxH);
 const popMean = points.reduce((sum, p) => sum + p.val, 0) / points.length;
 const sampleMean = samplePoints.length > 0 ? samplePoints.reduce((sum, p) => sum + p.val, 0) / samplePoints.length : 0;
 const bias = sampleMean - popMean;

 // A11y State
 const [srMode, setSrMode] = useState(false);

 // Assessment State
 const [ans, setAns] = useState('');
 const [feedback, setFeedback] = useState<string | null>(null);

 const checkAnswer = () => {
 if (activeTab === 'bias') {
  const parsed = parseFloat(ans);
  if (!isNaN(parsed) && Math.abs(parsed - bias) < 0.5) {
  setFeedback('Correct! You accurately calculated the selection bias.');
  } else {
  setFeedback(`Incorrect. The current bias is ${bias.toFixed(1)}. Formula: Sample Mean - Population Mean.`);
  }
 } else {
  if (ans.toLowerCase().includes('alt')) {
  setFeedback('Correct! The missing "alt" attribute causes screen readers to redundantly read the raw filename, harming accessibility.');
  } else {
  setFeedback('Incorrect. Hint: What 3-letter HTML attribute provides alternative text descriptions for images?');
  }
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Lab: Global Impacts & Ethics" />

  
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
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:min-h-0 overflow-y-auto lg:overflow-visible">
  {/* Left Col */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-4 lg:overflow-y-auto  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 shrink-0">Concepts & Theory</h2>
   
   <div className={`flex gap-2 bg-slate-100 dark:bg-[#121212] p-1 rounded-lg shrink-0 flex-col `}>
   <button 
    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'bias' ? 'bg-slate-50 dark:bg-[#121212] shadow text-blue-600' : 'text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
    onClick={() => { setActiveTab('bias'); setFeedback(null); setAns(''); }}
   >
    Data Bias Evaluator
   </button>
   <button 
    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'a11y' ? 'bg-slate-50 dark:bg-[#121212] shadow text-indigo-600' : 'text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
    onClick={() => { setActiveTab('a11y'); setFeedback(null); setAns(''); setSrMode(false); }}
   >
    Web Accessibility
   </button>
   </div>

   <div className="text-slate-600 dark:text-[#a1a1aa] space-y-4 text-sm mt-2">
   {activeTab === 'bias' ? (
    <>
    <p><strong>Selection Bias</strong> occurs when the sample data collected is not fully representative of the true global population.</p>
    <p>Consider a survey measuring internet connectivity:</p>
    <ul className="list-disc pl-5 space-y-1">
     <li><strong>Urban areas</strong> (left) generally have high connectivity.</li>
     <li><strong>Rural areas</strong> (right) generally have low connectivity.</li>
    </ul>
    <div className={`p-3 bg-red-50 border border-red-100 rounded-md mt-4 text-red-900 flex-col `}>
     <p className="font-semibold mb-1">Impact:</p>
     Deploying a survey only in easily accessible urban areas will falsely overestimate the national average, leading to biased resource allocation.
    </div>
    </>
   ) : (
    <>
    <p><strong>Web Accessibility (a11y)</strong> ensures that digital tools are usable by everyone, including people with disabilities.</p>
    <ul className="list-disc pl-5 space-y-2">
     <li><strong>Screen Readers:</strong> Software that dictates page content for visually impaired users.</li>
     <li><strong>Semantic HTML:</strong> Critical for screen readers to navigate properly.</li>
    </ul>
    <div className={`p-3 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-md mt-4 flex-col `}>
     When designing applications, we must provide textual descriptions for all visual media to ensure equitable access to information.
    </div>
    </>
   )}
   </div>
  </div>

  {/* Middle Col */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col lg:  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4 shrink-0">
   {activeTab === 'bias' ? 'Selection Bias Simulator' : 'Screen Reader Experience'}
   </h2>

   {activeTab === 'bias' && (
   <div className="flex-1 flex flex-col gap-4 min-h-[400px]">
    <div className="flex gap-4 p-3 bg-slate-100 dark:bg-[#121212] rounded-lg border shrink-0">
    <label className="flex-1 text-sm font-bold text-slate-700 dark:text-[#ffffff]">
     Survey X Position:
     <input type="range" min="0" max="250" value={boxX} onChange={e=>setBoxX(parseInt(e.target.value))} className="w-full mt-2 accent-blue-600" />
    </label>
    <label className="flex-1 text-sm font-bold text-slate-700 dark:text-[#ffffff]">
     Survey Y Position:
     <input type="range" min="0" max="250" value={boxY} onChange={e=>setBoxY(parseInt(e.target.value))} className="w-full mt-2 accent-blue-600" />
    </label>
    </div>

    <div className="flex-1 border rounded-lg bg-slate-50 dark:bg-[#121212] relative overflow-hidden flex items-center justify-center">
    <svg viewBox="0 0 400 400" className="w-full h-full max-h-80 object-contain bg-slate-50 dark:bg-[#121212]">
     {/* Background Regions */}
     <rect x="0" y="0" width="200" height="400" fill="#eff6ff" />
     <rect x="200" y="0" width="200" height="400" fill="#fffbeb" />
     
     <text x="100" y="20" textAnchor="middle" fontSize="12" fill="#3b82f6" fontWeight="bold">Urban Area</text>
     <text x="300" y="20" textAnchor="middle" fontSize="12" fill="#d97706" fontWeight="bold">Rural Area</text>

     {/* Points */}
     {points.map(p => (
     <circle key={p.id} cx={p.x} cy={p.y} r="3" fill={p.isUrban ? '#3b82f6' : '#d97706'} opacity="0.6" />
     ))}

     {/* Survey Box */}
     <rect x={boxX} y={boxY} width={boxW} height={boxH} fill="rgba(34, 197, 94, 0.2)" stroke="#22c55e" strokeWidth="2" strokeDasharray="4,4" className="transition-all duration-100" />
     <text x={boxX + boxW/2} y={boxY - 5} textAnchor="middle" fontSize="10" fill="#16a34a" fontWeight="bold" className="transition-all duration-100">Survey Region</text>
    </svg>
    </div>

    <div className="grid grid-cols-2 gap-4 text-center shrink-0 ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    <div className="p-3 bg-slate-50 dark:!bg-[#121212] border rounded-lg shadow-sm">
     <div className="text-xs text-slate-500 dark:text-[#71717a] font-bold uppercase tracking-wider mb-1">Pop. Mean Connectivity</div>
     <div className="text-2xl font-bold text-slate-800 dark:text-[#ffffff]">{popMean.toFixed(1)}</div>
    </div>
    <div className="p-3 bg-green-50 border border-green-200 rounded-lg shadow-sm dark:!bg-[#121212] dark:border-[#1c1b1b]">
     <div className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">Sample Mean (n={samplePoints.length})</div>
     <div className="text-2xl font-bold text-green-700">{sampleMean.toFixed(1)}</div>
    </div>
    </div>
   </div>
   )}

   {activeTab === 'a11y' && (
   <div className="flex-1 flex flex-col relative border rounded-lg bg-slate-100 dark:bg-[#121212] overflow-hidden min-h-[400px]">
    <div className="p-4 border-b bg-slate-50 dark:bg-[#121212] flex justify-between items-center z-10 relative shadow-sm">
    <span className="font-semibold text-slate-700 dark:text-[#ffffff] flex items-center gap-2">
     <Globe size={18} /> Web Page Preview
    </span>
    <button 
     onClick={() => setSrMode(!srMode)}
     className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${srMode ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] hover:bg-slate-300 dark:bg-[#121212]'}`}
    >
     {srMode ? <EyeOff size={16} /> : <Eye size={16} />}
     Screen Reader: {srMode ? 'ON' : 'OFF'}
    </button>
    </div>
    
    <div className={`flex-1 p-8 bg-slate-50 dark:bg-[#121212] transition-all duration-500 ${srMode ? 'blur-[4px] grayscale opacity-40' : ''}`}>
    <h1 className="text-3xl font-bold mb-4 text-slate-800 dark:text-[#ffffff]">Travel Blog</h1>
    <p className="text-slate-600 dark:text-[#a1a1aa] mb-6">Check out my recent trip to Paris!</p>
    <div className="w-full h-40 bg-slate-200 dark:bg-[#121212] border-2 border-dashed border-slate-300 dark:border-[#1c1b1b] flex items-center justify-center text-slate-500 dark:text-[#71717a] mb-6 font-mono text-sm">
     [Image: eiffel_tower_pic_final_v2.jpg]
    </div>
    <button className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-2 rounded-lg font-bold dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">Read More</button>
    </div>

    {srMode && (
    <div className="absolute bottom-4 left-4 right-4 bg-[#000000] dark:bg-[#121212]/95 text-green-400 font-mono text-sm p-4 rounded-xl shadow-2xl border border-[#1c1b1b] dark:border-[#1c1b1b] animate-in slide-in-from-bottom-4">
     <div className="flex items-center gap-2 mb-3 text-white font-sans font-bold border-b border-[#1c1b1b] dark:border-[#1c1b1b] pb-2">
     <EyeOff size={16} className="text-blue-400"/> Screen Reader Audio Transcript:
     </div>
     <div className="space-y-1.5">
     <p>&gt; {"<Heading Level 1> Travel Blog"}</p>
     <p>&gt; {"<Paragraph> Check out my recent trip to Paris!"}</p>
     <p className="text-red-400 bg-red-900/30 inline-block px-1 rounded">&gt; {"<Image> eiffel underscore tower underscore pic underscore final underscore v2 dot jpg"}</p>
     <p>&gt; {"<Button> Read More"}</p>
     </div>
    </div>
    )}
   </div>
   )}
  </div>

  {/* Right Col */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col lg:overflow-y-auto `}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4 shrink-0">Assessment & Validation</h2>
   
   <div className="space-y-6 flex-1 pr-2">
   {activeTab === 'bias' ? (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 dark:bg-teal-950/20 dark:border-teal-900">
    <h3 className="font-semibold text-blue-800 mb-2 dark:text-[#ffffff]">Q: Calculating Bias</h3>
    <p className="text-sm text-blue-900 mb-4 leading-relaxed dark:text-[#ffffff]">
     Move the survey box completely to the left (Urban Area) using the X slider. 
     Calculate the resulting Selection Bias using the formula:<br/><br/>
     <code className="bg-slate-50 dark:bg-[#121212] px-2 py-1 rounded border">Bias = Sample Mean - Population Mean</code>
    </p>
    <div className="flex gap-2">
     <input
     type="number"
     step="0.1"
     value={ans}
     onChange={e => setAns(e.target.value)}
     className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
     placeholder="Enter bias value..."
     />
     <button onClick={checkAnswer} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md text-sm transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">Submit</button>
    </div>
    </div>
   ) : (
    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 dark:bg-[#121212] dark:border-[#1c1b1b]">
    <h3 className="font-semibold text-indigo-800 mb-2 dark:text-[#ffffff]">Q: Accessibility Flaws</h3>
    <p className="text-sm text-indigo-900 mb-4 leading-relaxed dark:text-[#ffffff]">
     Turn ON Screen Reader Mode. Notice how the image is read out awkwardly as a raw filename instead of a helpful description.
     <br/><br/>
     What specific HTML attribute is missing from the <code>&lt;img&gt;</code> tag that caused this failure?
    </p>
    <div className="flex gap-2">
     <input
     type="text"
     value={ans}
     onChange={e => setAns(e.target.value)}
     className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
     placeholder="Enter attribute name..."
     />
     <button onClick={checkAnswer} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md text-sm transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">Submit</button>
    </div>
    </div>
   )}

   {feedback && (
    <div className={`p-4 rounded-lg flex items-start gap-3 text-sm font-medium border ${feedback.includes('Correct') ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
    <div className="mt-0.5">
     {feedback.includes('Correct') ? <CheckCircle size={18} /> : <XCircle size={18} />}
    </div>
    <div className="leading-relaxed">{feedback}</div>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
