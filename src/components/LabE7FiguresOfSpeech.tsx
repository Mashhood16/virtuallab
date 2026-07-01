import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Maximize2, User, Repeat, Type, Wand2 , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

type DeviceId = 'Simile' | 'Metaphor' | 'Personification' | 'Hyperbole' | 'Alliteration';

const DEVICES: { id: DeviceId; label: string; icon: any; color: string }[] = [
 { id: 'Simile', label: 'Simile', icon: Wand2, color: 'text-pink-600 bg-pink-100 dark:text-pink-300 dark:bg-pink-900 border-pink-400' },
 { id: 'Metaphor', label: 'Metaphor', icon: Repeat, color: 'text-indigo-600 bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-900 border-indigo-400' },
 { id: 'Personification', label: 'Personification', icon: User, color: 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900 border-green-400' },
 { id: 'Hyperbole', label: 'Hyperbole', icon: Maximize2, color: 'text-orange-600 bg-orange-100 dark:text-orange-300 dark:bg-orange-900 border-orange-400' },
 { id: 'Alliteration', label: 'Alliteration', icon: Type, color: 'text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900 border-blue-400' }
];

const POEM_LINES = [
 { id: 'l1', text: "The moon was a ghostly galleon tossed upon cloudy seas.", device: 'Metaphor' },
 { id: 'l2', text: "The stars sparkled like diamonds in the dark night sky.", device: 'Simile' },
 { id: 'l3', text: "The old house groaned and complained in the strong wind.", device: 'Personification' },
 { id: 'l4', text: "I carried my backpack, which weighed a ton, all the way home.", device: 'Hyperbole' },
 { id: 'l5', text: "Whispering winds wandered through the weeping willows.", device: 'Alliteration' }
];

export default function LabE7FiguresOfSpeech({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [activeTool, setActiveTool] = useState<DeviceId | null>(null);
 const [solvedLines, setSolvedLines] = useState<Record<string, DeviceId>>({});
 const [errorLine, setErrorLine] = useState<string | null>(null);
 const [assessmentInput, setAssessmentInput] = useState('');
 const [assessmentResult, setAssessmentResult] = useState<string | null>(null);
 
 const handleLineClick = (lineId: string, correctDevice: string) => {
 if (!activeTool) return;
 if (solvedLines[lineId]) return; // Already solved

 if (activeTool === correctDevice) {
  setSolvedLines(prev => ({ ...prev, [lineId]: activeTool }));
  setErrorLine(null);
 } else {
  setErrorLine(lineId);
  setTimeout(() => setErrorLine(null), 800);
 }
 };

 const handleCheckAssessment = () => {
 const text = assessmentInput.toLowerCase().trim();
 if (text.includes('like') || text.includes('as')) {
  setAssessmentResult('Excellent! You correctly used "like" or "as" to form a simile.');
 } else {
  setAssessmentResult('Not quite. Remember, a simile uses "like" or "as" to compare things.');
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-900 dark:text-[#ffffff]">
  <style>{`
  @keyframes shake {
   0%, 100% { transform: translateX(0); }
   25% { transform: translateX(-5px); }
   50% { transform: translateX(5px); }
   75% { transform: translateX(-5px); }
  }
  .animate-shake {
   animation: shake 0.4s ease-in-out;
  }
  `}</style>
  
  {/* Header */}
  <header className="flex items-center p-4 shadow-sm z-10">
  <button onClick={onExit} className="mr-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 whitespace-nowrap flex-shrink-0 transition-colors">
   <ArrowLeft size={20} />
  </button>
  <h1 className="text-lg md:text-xl font-bold">Poetry Visualizer: Figures of Speech</h1>
  
  <button
   onClick={toggleTheme}
   className="p-2 rounded-full hover:bg-white/20 transition-colors shrink-0 ml-4 dark:bg-[#121212]"
   title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
   {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
  </header>

  {/* Main layout */}
  <div className="flex-1 flex flex-col md:flex-row lg:overflow-hidden">
  {/* Left Column: Controls */}
  <div className="w-full md:w-1/2 lg:w-5/12 p-6 flex flex-col gap-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b]">
   
   <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
   <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-2">Instructions</h2>
   <p className="text-sm text-indigo-800 dark:text-indigo-200">
    Select a highlighting tool below, then click on the corresponding line in the poem to identify its figure of speech. Find all 5!
   </p>
   </div>
   
   <div>
   <h3 className="font-semibold mb-3">Highlighter Tools</h3>
   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {DEVICES.map(device => {
     const Icon = device.icon;
     const isActive = activeTool === device.id;
     const isCompleted = Object.values(solvedLines).includes(device.id);
     return (
     <button
      key={device.id}
      onClick={() => setActiveTool(device.id)}
      disabled={isCompleted}
      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all whitespace-nowrap flex-shrink-0 ${ isActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900 dark:border-indigo-400' : isCompleted ? 'opacity-50 grayscale border-slate-200 dark:border-[#1c1b1b] cursor-not-allowed' : 'border-slate-200 dark:border-[#1c1b1b] hover:border-indigo-300 dark:hover:border-indigo-600' }`}
     >
      <div className={`p-2 rounded-md ${device.color.split(' ')[1]} ${device.color.split(' ')[0]}`}>
       <Icon size={18} />
      </div>
      <span className="font-medium">{device.label}</span>
      {isCompleted && <CheckCircle2 size={16} className="ml-auto text-green-500" />}
     </button>
     );
    })}
   </div>
   </div>

   <div className="p-4 bg-slate-50 dark:bg-[#121212]/50 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
    <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold">Progress</h3>
    <span className="font-bold text-indigo-600 dark:text-indigo-400">{Object.keys(solvedLines).length} / 5</span>
    </div>
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
    <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(Object.keys(solvedLines).length / 5) * 100}%` }}></div>
    </div>
    {Object.keys(solvedLines).length === 5 && (
    <div className="mt-4 p-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg flex items-center gap-2">
     <CheckCircle2 size={20} />
     <span className="font-semibold">All figures of speech identified!</span>
    </div>
    )}
   </div>

   <div className="mt-auto p-4 bg-slate-100 dark:bg-[#121212]/80 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
   <h3 className="font-semibold mb-2 flex items-center gap-2"><Wand2 size={16}/> Assessment Challenge</h3>
   <p className="text-sm mb-3 text-slate-600 dark:text-[#71717a]">Write your own Simile (must contain 'like' or 'as').</p>
   <div className="flex gap-2">
    <input 
    type="text" 
    value={assessmentInput}
    onChange={(e) => setAssessmentInput(e.target.value)}
    placeholder="e.g., As brave as a lion..."
    className="flex-1 min-w-0 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <button 
    onClick={handleCheckAssessment}
    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md whitespace-nowrap flex-shrink-0 transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
    Check Answer
    </button>
   </div>
   {assessmentResult && (
    <p className={`text-sm mt-2 font-medium ${assessmentResult.includes('Excellent') ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
     {assessmentResult}
    </p>
   )}
   </div>
  </div>

  {/* Right Column: Canvas */}
  <div className="w-full md:w-1/2 lg:w-7/12 p-8 flex flex-col relative bg-slate-50 dark:bg-[#121212] items-center lg:overflow-y-auto">
   
   <div className="text-center mb-8">
    <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-[#ffffff] mb-2">Midnight Musings</h2>
    <p className="text-slate-500 dark:text-[#71717a] italic">An interactive poem</p>
   </div>
   
   <div className="max-w-2xl w-full mx-auto p-8 bg-[#fdfbf7] dark:!bg-[#121212] rounded-xl shadow-lg border border-amber-100 dark:border-[#1c1b1b] font-serif space-y-6">
   {POEM_LINES.map(line => {
    const isSolved = !!solvedLines[line.id];
    const solvedDevice = DEVICES.find(d => d.id === solvedLines[line.id]);
    const isError = errorLine === line.id;
    
    return (
     <div 
      key={line.id} 
      onClick={() => handleLineClick(line.id, line.device)}
      className={`p-4 rounded-lg cursor-pointer transition-all ${
      isSolved 
       ? `${solvedDevice?.color} border bg-opacity-30 dark:bg-opacity-30` 
       : activeTool 
       ? 'hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-[1.02] border border-transparent hover:border-slate-300 dark:hover:border-slate-600' 
       : 'border border-transparent'
      } ${isError ? 'animate-shake bg-red-100 dark:bg-red-900 border-red-500' : ''}`}
     >
      <p className={`text-xl md:text-2xl leading-relaxed ${isSolved ? 'font-medium' : ''}`}>{line.text}</p>
      {isSolved && (
      <div className="mt-2 flex items-center gap-1 text-sm font-semibold opacity-80">
       <CheckCircle2 size={16} />
       Identified as: {solvedDevice?.label}
      </div>
      )}
     </div>
    );
   })}
   </div>

   {/* Data Table and Graph */}
   <div className="w-full max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
   <div className="bg-white dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] overflow-x-auto">
    <h3 className="font-semibold mb-2">Identified Devices Table</h3>
    <table className="w-full text-sm text-left">
     <thead className="bg-slate-100 dark:bg-slate-700">
      <tr>
      <th className="px-3 py-2 rounded-tl-lg">Device</th>
      <th className="px-3 py-2 rounded-tr-lg">Status</th>
      </tr>
     </thead>
     <tbody>
      {DEVICES.map((d, i) => {
      const isFound = Object.values(solvedLines).includes(d.id);
      return (
       <tr key={i} className="border-b border-slate-100 dark:border-[#1c1b1b]">
        <td className="px-3 py-2 font-medium">{d.label}</td>
        <td className="px-3 py-2">{isFound ? '✅ Found' : '❌ Pending'}</td>
       </tr>
      )
      })}
     </tbody>
    </table>
   </div>

   <div className="bg-white dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <h3 className="font-semibold mb-2">Discovery Graph</h3>
    <svg viewBox="0 0 200 150" className="w-full h-auto bg-slate-50 dark:bg-[#121212] rounded-lg">
     {(() => {
      const found = Object.keys(solvedLines).length;
      const pending = 5 - found;
      return (
      <>
       <rect x="40" y={130 - (found/5)*100} width="40" height={(found/5)*100} fill="#22c55e" rx="2" />
       <text x="60" y={130 - (found/5)*100 - 5} textAnchor="middle" fill="#64748b" fontSize="10">{found}</text>
       <text x="60" y="145" textAnchor="middle" fill="#64748b" fontSize="10">Found</text>

       <rect x="120" y={130 - (pending/5)*100} width="40" height={(pending/5)*100} fill="#ef4444" rx="2" />
       <text x="140" y={130 - (pending/5)*100 - 5} textAnchor="middle" fill="#64748b" fontSize="10">{pending}</text>
       <text x="140" y="145" textAnchor="middle" fill="#64748b" fontSize="10">Pending</text>

       <line x1="15" y1="130" x2="195" y2="130" stroke="#cbd5e1" strokeWidth="2" />
      </>
      )
     })()}
    </svg>
   </div>
   </div>

  </div>
  </div>
 </div>
 );
}
