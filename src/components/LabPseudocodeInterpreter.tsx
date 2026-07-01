import { useState } from 'react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabPseudocodeInterpreter({ onExit }: LabProps) {
 const [task, setTask] = useState<'task1' | 'task2'>('task1'); // task1: number check, task2: color logic
 const [inputVal, setInputVal] = useState('');
 const [outputLines, setOutputLines] = useState<string[]>(['System Ready...']);

 // Pseudocode blocks (drag & drop simulation - we'll make it click-to-add for simplicity in this web interface)
 const [codeLines, setCodeLines] = useState<string[]>([]);

 const runCode = () => {
 setOutputLines(['> Executing Pseudocode...']);
 const num = Number(inputVal);

 if (isNaN(num) || inputVal === '') {
  setOutputLines(prev => [...prev, 'Error: Input is not a valid number.']);
  return;
 }

 // Evaluate based on the current task's logic requirement
 // In a real sandbox, we'd parse `codeLines`. Here, we just simulate the expected logic.
 setTimeout(() => {
  if (task === 'task1') {
  // Must check if not 5 or 6
  if (codeLines.includes('IF number != 5 AND number != 6 THEN')) {
   if (num !== 5 && num !== 6) {
    setOutputLines(prev => [...prev, `OUTPUT: "${num} is not a five or a six"`]);
   } else {
    setOutputLines(prev => [...prev, `OUTPUT: "The number is 5 or 6"`]);
   }
  } else {
   setOutputLines(prev => [...prev, 'Error: Required logical condition (IF number != 5 AND number != 6) is missing.']);
  }
  } else {
  // Must check colors
  if (codeLines.includes('IF number > 0 AND number <= 10 THEN OUTPUT "Blue"')) {
   if (num > 0 && num <= 10) setOutputLines(prev => [...prev, 'OUTPUT: "Blue"']);
   else if (num > 10 && num <= 20) setOutputLines(prev => [...prev, 'OUTPUT: "Red"']);
   else if (num > 20 && num <= 30) setOutputLines(prev => [...prev, 'OUTPUT: "Green"']);
   else setOutputLines(prev => [...prev, 'OUTPUT: "Not a correct color option"']);
  } else {
   setOutputLines(prev => [...prev, 'Error: Required conditional logic blocks are missing.']);
  }
  }
 }, 500);
 };

 const addBlock = (block: string) => {
 setCodeLines(prev => [...prev, block]);
 };

 const clearCode = () => setCodeLines([]);

 const blocksTask1 = [
 'INPUT number',
 'IF number != 5 AND number != 6 THEN',
 ' OUTPUT "Number is not 5 or 6"',
 'ELSE',
 ' OUTPUT "Number is 5 or 6"',
 'END IF'
 ];

 const blocksTask2 = [
 'INPUT number',
 'IF number > 0 AND number <= 10 THEN OUTPUT "Blue"',
 'ELSE IF number > 10 AND number <= 20 THEN OUTPUT "Red"',
 'ELSE IF number > 20 AND number <= 30 THEN OUTPUT "Green"',
 'ELSE OUTPUT "Not a correct color option"',
 'END IF'
 ];

 return (
 <div className="w-full h-screen bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] flex flex-col font-sans">
  <LabHeader onExit={onExit} title="Act 3.1: Pseudocode Interpreter" variant="dark" />

  <div className="flex-1 flex lg:overflow-hidden">
  
  {/* Left Panel: Available Blocks */}
  <div className="w-80 bg-[#121212] dark:bg-[#121212] border-r border-[#1c1b1b] dark:border-[#1c1b1b] flex flex-col p-4 z-10 lg:overflow-y-auto">
   
   <div className="flex bg-[#000000] dark:bg-[#121212] rounded-lg p-1 mb-6">
    <button 
    className={`flex-1 py-2 rounded text-xs font-bold transition-colors ${task === 'task1' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
    onClick={() => { setTask('task1'); clearCode(); }}
    >Task 1: Num Check</button>
    <button 
    className={`flex-1 py-2 rounded text-xs font-bold transition-colors ${task === 'task2' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
    onClick={() => { setTask('task2'); clearCode(); }}
    >Task 2: Color Logic</button>
   </div>

   <h3 className="text-xs font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-widest mb-4">Logic Blocks</h3>
   
   <div className="flex flex-col gap-2 lg:overflow-y-auto">
    {(task === 'task1' ? blocksTask1 : blocksTask2).map((block, i) => (
    <button 
     key={i}
     onClick={() => addBlock(block)}
     className="text-left font-mono text-sm p-3 bg-slate-700 dark:bg-[#121212] hover:bg-sky-800 text-slate-200 border border-slate-600 dark:border-[#1c1b1b] rounded transition-colors active:scale-95"
    >
     {block}
    </button>
    ))}
   </div>
  </div>

  {/* Center Panel: Code Editor */}
  <div className="flex-1 bg-[#1e1e1e] flex flex-col relative">
   
   <div className="h-10 bg-[#2d2d2d] flex items-center px-4 justify-between border-b border-black">
    <span className="text-slate-400 font-mono text-sm">main.pseudo</span>
    <button onClick={clearCode} className="text-xs text-slate-400 hover:text-red-400">Clear</button>
   </div>

   <div className="flex-1 p-6 lg:overflow-y-auto font-mono text-slate-300 text-lg">
    {codeLines.length === 0 && <span className="text-slate-600 dark:text-[#a1a1aa] italic">{'// Click blocks from the left to build your algorithm'}</span>}
    {codeLines.map((line, i) => (
    <div key={i} className="flex gap-4">
     <span className="text-slate-600 dark:text-[#a1a1aa] select-none">{i+1}</span>
     <span className={`${line.includes('IF') || line.includes('ELSE') ? 'text-pink-400' : line.includes('OUTPUT') ? 'text-blue-400' : 'text-green-400'}`}>{line}</span>
    </div>
    ))}
   </div>

  </div>

  {/* Right Panel: Terminal / Execution */}
  <div className="w-96 bg-black flex flex-col border-l border-[#1c1b1b] dark:border-[#1c1b1b] shadow-xl z-10 lg:overflow-y-auto">
   
   <div className="h-10 bg-[#2d2d2d] flex items-center px-4 border-b border-black">
    <span className="text-slate-400 font-mono text-sm">Terminal</span>
   </div>

   <div className="flex-1 p-4 font-mono text-sm flex flex-col">
    
    <div className="mb-4">
    <label className="block text-green-500 mb-2">{'>> Enter value for `number`:'}</label>
    <div className="flex">
     <span className="text-slate-400 mr-2">{'>'}</span>
     <input 
     type="number" 
     value={inputVal}
     onChange={(e) => setInputVal(e.target.value)}
     className="bg-transparent text-white outline-none flex-1 border-b border-[#1c1b1b] dark:border-[#1c1b1b] focus:border-green-500"
     placeholder="e.g. 15"
     />
    </div>
    </div>

    <div className="flex-1 bg-[#000000] dark:bg-[#121212] p-4 rounded border border-[#1c1b1b] dark:border-[#1c1b1b] lg:overflow-y-auto text-slate-300">
     {outputLines.map((line, i) => (
     <div key={i} className={`mb-1 ${line.startsWith('Error') ? 'text-red-400' : line.startsWith('OUTPUT') ? 'text-yellow-400 font-bold' : ''}`}>
      {line}
     </div>
     ))}
    </div>

    <button 
    onClick={runCode}
    className="mt-4 w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold font-sans uppercase tracking-widest rounded-xl transition-colors active:scale-95 flex justify-center items-center gap-2 dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"
    >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
    Execute Code
    </button>
   </div>

  </div>

  </div>
 </div>
 );
}
