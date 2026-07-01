import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabC7ConditionalLogic({ onExit }: LabProps) {
 const [selectedScenario, setSelectedScenario] = useState(0);
 
 const scenarios = [
 {
  text: "If you do not win scholarship, your father will be very sad.",
  correct: ['IF', 'NOT win_scholarship', 'THEN', 'father_sad'],
  options: ['IF', 'THEN', 'ELSE', 'NOT win_scholarship', 'win_scholarship', 'father_sad', 'father_happy']
 },
 {
  text: "If you don't brush your teeth regularly, your teeth decays.",
  correct: ['IF', 'NOT brush_teeth', 'THEN', 'teeth_decay'],
  options: ['IF', 'THEN', 'ELSE', 'brush_teeth', 'NOT brush_teeth', 'teeth_decay', 'teeth_clean']
 },
 {
  text: "If it rains tomorrow, I will stay at home, otherwise I will go for picnic.",
  correct: ['IF', 'rains', 'THEN', 'stay_home', 'ELSE', 'go_picnic'],
  options: ['IF', 'THEN', 'ELSE', 'rains', 'sunny', 'stay_home', 'go_picnic']
 }
 ];

 const [workspace, setWorkspace] = useState<string[]>([]);
 const [completed, setCompleted] = useState<boolean[]>([false, false, false]);

 const handleDrop = (block: string) => {
 setWorkspace([...workspace, block]);
 };

 const handleRemove = (index: number) => {
 setWorkspace(workspace.filter((_, i) => i !== index));
 };

 const checkSolution = () => {
 const current = scenarios[selectedScenario];
 if (JSON.stringify(workspace) === JSON.stringify(current.correct)) {
  const newCompleted = [...completed];
  newCompleted[selectedScenario] = true;
  setCompleted(newCompleted);
 }
 };

 const nextScenario = () => {
 if (selectedScenario < 2) {
  setSelectedScenario(selectedScenario + 1);
  setWorkspace([]);
 }
 };

 const isAllComplete = completed.every(c => c);

 return (
 <div className="flex flex-col h-screen font-sans bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Conditional Logic Translation" />
  <div className="flex-1 px-8 pb-8 flex flex-col lg:overflow-y-auto">

  <p className="text-slate-600 dark:text-[#a1a1aa] mb-8">Translate the English scenario into a strict algorithmic IF-THEN or IF-THEN-ELSE structure.</p>

  {isAllComplete && (
   <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl mb-6 flex items-center border border-emerald-300 shadow-sm w-fit">
   <CheckCircle className="w-6 h-6 mr-3" />
   <span className="font-bold">Great Job!</span> You translated all three logical scenarios correctly.
   </div>
  )}

  <div className="rounded-xl shadow-lg border p-8 max-w-4xl mx-auto w-full" style={{backgroundColor: 'rgb(var(--slate-50))', borderColor: 'rgb(var(--slate-200))'}}>
   <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
   <h2 className="text-xl font-bold text-slate-700 dark:text-[#ffffff]">Scenario {selectedScenario + 1} of 3</h2>
   <div className="flex gap-2">
    {[0, 1, 2].map(idx => (
    <div key={idx} className={`w-3 h-3 rounded-full ${completed[idx] ? 'bg-emerald-500' : selectedScenario === idx ? 'bg-blue-500' : 'bg-slate-200 dark:bg-[#121212]'}`} />
    ))}
   </div>
   </div>

   <div className="text-xl text-center italic font-serif mb-8 p-6 rounded-lg border" style={{backgroundColor: 'rgb(var(--slate-50))', borderColor: 'rgb(var(--slate-200))', color: 'rgb(var(--slate-600))'}}>
   "{scenarios[selectedScenario].text}"
   </div>

   <div className="flex gap-8">
   {/* Palette */}
   <div className="w-64">
    <h3 className="font-bold text-sm uppercase text-slate-400 tracking-wider mb-4">Logic Blocks</h3>
    <div className="flex flex-col gap-2">
    {scenarios[selectedScenario].options.map((opt, i) => {
     let bgColor = 'bg-blue-100 border-blue-300 text-blue-800';
     if (['IF', 'THEN', 'ELSE'].includes(opt)) bgColor = 'bg-rose-100 border-rose-300 text-rose-800';
     
     return (
     <button 
      key={i}
      onClick={() => handleDrop(opt)}
      className={`p-3 border-2 rounded-lg font-bold shadow-sm transition-transform hover:-translate-y-1 ${bgColor} text-left`}
     >
      {opt}
     </button>
     )
    })}
    </div>
   </div>

   {/* Workspace */}
   <div className="flex-1 rounded-xl p-6 shadow-inner relative border-4 bg-slate-100 dark:bg-[#121212] border-slate-300 dark:border-[#1c1b1b]">
    <h3 className="font-bold text-sm uppercase text-slate-400 tracking-wider mb-4 text-center">Translation Workspace</h3>
    
    <div className="flex flex-wrap gap-2 mb-6 min-h-[100px] content-start">
    {workspace.map((block, i) => {
     let bgColor = 'bg-blue-100 border-blue-300 text-blue-800';
     if (['IF', 'THEN', 'ELSE'].includes(block)) bgColor = 'bg-rose-100 border-rose-300 text-rose-800';
     
     return (
     <div 
      key={i}
      onClick={() => handleRemove(i)}
      className={`p-2 border-2 rounded-md font-bold cursor-pointer hover:opacity-80 flex items-center ${bgColor}`}
     >
      {block} <span className="ml-2 text-xs opacity-50">×</span>
     </div>
     )
    })}
    {workspace.length === 0 && (
     <div className="w-full text-center text-slate-500 dark:text-[#71717a] font-medium italic mt-8">Click logic blocks to add them here</div>
    )}
    </div>

    {!completed[selectedScenario] ? (
    <div className="flex gap-4">
     <button onClick={() => setWorkspace([])} className="flex-1 py-3 font-bold rounded-lg transition-colors border bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-[#1c1b1b] text-slate-800 dark:text-[#ffffff] hover:bg-slate-300 dark:hover:bg-slate-600">Clear</button>
     <button onClick={checkSolution} className="flex-1 py-3 font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">Check Code</button>
    </div>
    ) : (
    <div className="text-center">
     <div className="text-emerald-400 font-bold mb-4 flex justify-center items-center"><CheckCircle className="w-5 h-5 mr-2" /> Correct Logic Structure!</div>
     {selectedScenario < 2 && (
     <button onClick={nextScenario} className="w-full py-3 font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">Next Scenario &rarr;</button>
     )}
    </div>
    )}
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
