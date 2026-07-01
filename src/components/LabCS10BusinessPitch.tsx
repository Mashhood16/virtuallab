import { useState, useEffect, useRef } from 'react';
import { CheckCircle, Layout, Clock, Play, Square } from 'lucide-react';
import LabHeader from './LabHeader';

interface Props {
 onExit?: () => void;
}

export default function LabCS10BusinessPitch({ onExit }: Props) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 // Middle Column: Pitch Simulator
 const [timerRunning, setTimerRunning] = useState(false);
 const [timeLeft, setTimeLeft] = useState(60);
 const timerRef = useRef<number | null>(null);
 
 const [pitchStage, setPitchStage] = useState<'Hook' | 'Problem' | 'Solution' | 'Ask'>('Hook');

 // Sticky Notes
 const [notes, setNotes] = useState<{ id: number; text: string; x: number; y: number }[]>([
 { id: 1, text: "Problem: Too much plastic waste", x: 10, y: 10 },
 { id: 2, text: "Solution: Edible packaging", x: 40, y: 40 }
 ]);
 const [newNote, setNewNote] = useState('');
 const [draggingNoteId, setDraggingNoteId] = useState<number | null>(null);

 // Right Column: Doc Analyzer (Drag & Drop simplified to clicking categories)
 const itemsToCategorize = [
 { id: 1, text: "Detailed Financial Projections (5 yrs)", correct: "Plan" },
 { id: 2, text: "Team Bios & Vision Slide", correct: "Deck" },
 { id: 3, text: "Operational Logistics", correct: "Plan" },
 { id: 4, text: "The 'Ask' (Funding Needed)", correct: "Deck" }
 ];
 
 const [categorizedItems, setCategorizedItems] = useState<{ id: number; text: string; assigned: 'Plan' | 'Deck' | null; correct: string }[]>(
 itemsToCategorize.map(item => ({ ...item, assigned: null }))
 );
 const [analyzerFeedback, setAnalyzerFeedback] = useState<string | null>(null);

 // Data Logging
 const [logs, setLogs] = useState<{ id: number; timeLogged: number; stageCompleted: string }[]>([]);

 useEffect(() => {
 if (timerRunning && timeLeft > 0) {
  timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
  
  // Update stage based on time
  if (timeLeft <= 15) setPitchStage('Ask');
  else if (timeLeft <= 35) setPitchStage('Solution');
  else if (timeLeft <= 50) setPitchStage('Problem');
  else setPitchStage('Hook');
  
 } else if (timeLeft === 0 && timerRunning) {
  setTimerRunning(false);
  handleRecordData();
 }
 return () => {
  if (timerRef.current) clearTimeout(timerRef.current);
 };
 }, [timerRunning, timeLeft]);

 const toggleTimer = () => {
 if (timerRunning) {
  setTimerRunning(false);
  if (timerRef.current) clearTimeout(timerRef.current);
 } else {
  if (timeLeft === 0) setTimeLeft(60);
  setTimerRunning(true);
 }
 };

 const handleRecordData = () => {
 setLogs(prev => [...prev, {
  id: prev.length + 1,
  timeLogged: 60 - timeLeft,
  stageCompleted: pitchStage
 }]);
 };

 const addNote = () => {
 if (!newNote.trim()) return;
 setNotes(prev => [...prev, {
  id: Date.now(),
  text: newNote,
  x: Math.random() * 50,
  y: Math.random() * 50
 }]);
 setNewNote('');
 };

 const handleCategorize = (id: number, cat: 'Plan' | 'Deck') => {
 setCategorizedItems(prev => prev.map(item => item.id === id ? { ...item, assigned: cat } : item));
 };

 const checkCategorization = () => {
 const allAssigned = categorizedItems.every(i => i.assigned !== null);
 if (!allAssigned) {
  setAnalyzerFeedback("Please categorize all items first.");
  return;
 }
 const allCorrect = categorizedItems.every(i => i.assigned === i.correct);
 if (allCorrect) {
  setAnalyzerFeedback("Perfect! You correctly identified Business Plan vs Pitch Deck components.");
 } else {
  setAnalyzerFeedback("Some items are incorrect. Remember: A Pitch Deck is visual and high-level, a Business Plan is detailed and text-heavy.");
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Lab: Business Pitch & Brainstorming" />

  
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
  <main className="lg:flex-1 p-4 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 overflow-y-auto lg:overflow-visible">
  
  {/* Column 1: Theory */}
  <section className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col gap-4  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
   <Layout className="text-indigo-600" /> Pitch Theory
   </h2>
   
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] space-y-4">
   <div>
    <h3 className="text-md font-semibold text-slate-700 dark:text-[#ffffff]">The Elevator Pitch</h3>
    <p>A brief, persuasive speech that you use to spark interest in what your organization does. It should last no longer than a short elevator ride (about 30 to 60 seconds).</p>
    <ul className="list-disc pl-5 mt-2 space-y-1">
    <li><strong>Hook:</strong> Grab attention immediately.</li>
    <li><strong>Problem:</strong> What pain point are you solving?</li>
    <li><strong>Solution:</strong> Your unique product/service.</li>
    <li><strong>The Ask:</strong> What do you want from the listener?</li>
    </ul>
   </div>
   
   <div>
    <h3 className="text-md font-semibold text-slate-700 dark:text-[#ffffff]">Business Plan vs. Pitch Deck</h3>
    <p><strong>Pitch Deck:</strong> A 10-15 slide presentation used to get a meeting or spark interest. Highly visual.</p>
    <p><strong>Business Plan:</strong> A 15-50 page document detailing every aspect of the business. Text-heavy, deep financials.</p>
   </div>
   </div>
  </section>

  {/* Column 2: Simulation */}
  <section className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex flex-col gap-6  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
   <Clock className="text-indigo-600" /> Pitch Simulator
   </h2>
   
   {/* Timed Simulator */}
   <div className={`w-full bg-[#000000] dark:bg-[#121212] lg:dark:bg-[#121212] text-white p-6 rounded-xl flex flex-col items-center justify-center relative overflow-  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className={`absolute top-0 left-0 h-1 bg-indigo-500 transition-all duration-1000`} style={{ width: `${(timeLeft/60)*100}%` }} />
   
   <div className="text-6xl font-mono font-black mb-2 tracking-wider">
    00:{timeLeft.toString().padStart(2, '0')}
   </div>
   <div className="text-lg font-bold text-indigo-300 uppercase tracking-widest mb-6">
    Stage: {pitchStage}
   </div>

   <div className="flex gap-4">
    <button 
    onClick={toggleTimer}
    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-transform active:scale-95 ${timerRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
    >
    {timerRunning ? <><Square size={20} fill="currentColor" /> Stop</> : <><Play size={20} fill="currentColor" /> Start Pitch</>}
    </button>
   </div>
   </div>

   {/* Sticky Note Board */}
   <div className={`flex-1 bg-amber-50 rounded-lg border-2 border-dashed border-amber-200 p-2 relative min-h-[200px] lg:overflow- dark:bg-[#121212] dark:border-[#1c1b1b] `}>
   <h3 className="text-xs font-bold text-amber-800/50 absolute top-2 left-2 uppercase tracking-widest dark:text-[#ffffff]">Ideation Board</h3>
   
   {notes.map(note => (
    <div 
    key={note.id}
    className={`absolute w-32 h-32 bg-yellow-200 shadow-md p-2 text-xs font-handwriting cursor-move transform rotate-1 transition-transform hover:scale-105 hover:z-10 text-slate-800 dark:text-[#ffffff] flex-col `}
    style={{ left: `${note.x}%`, top: `${note.y}%` }}
    onMouseDown={() => setDraggingNoteId(note.id)}
    onMouseMove={(e) => {
     if (draggingNoteId === note.id) {
     const rect = e.currentTarget.parentElement?.getBoundingClientRect();
     if (!rect) return;
     const x = ((e.clientX - rect.left) / rect.width) * 100 - 10;
     const y = ((e.clientY - rect.top) / rect.height) * 100 - 10;
     setNotes(prev => prev.map(n => n.id === note.id ? { ...n, x: Math.max(0, Math.min(x, 80)), y: Math.max(0, Math.min(y, 80)) } : n));
     }
    }}
    onMouseUp={() => setDraggingNoteId(null)}
    onMouseLeave={() => setDraggingNoteId(null)}
    >
    {note.text}
    </div>
   ))}
   </div>
   
   <div className="flex gap-2">
   <input 
    type="text" 
    value={newNote}
    onChange={(e) => setNewNote(e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && addNote()}
    className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
    placeholder="Type idea and press Enter..."
   />
   <button onClick={addNote} className={`bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-semibold dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40 flex-col `}>
    Add Note
   </button>
   </div>
  </section>

  {/* Column 3: Analysis */}
  <section className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col gap-6">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
   <CheckCircle className="text-indigo-600" /> Assessment & Logs
   </h2>

   <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
   <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] mb-3 text-sm">Document Analyzer</h3>
   <p className="text-xs text-slate-500 dark:text-[#71717a] mb-4">Assign each item to its correct document type.</p>
   
   <div className="space-y-3">
    {categorizedItems.map(item => (
    <div key={item.id} className="flex flex-col gap-1 p-2 bg-slate-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-[#1c1b1b] shadow-sm">
     <span className="text-xs font-medium text-slate-700 dark:text-[#ffffff]">{item.text}</span>
     <div className="flex gap-2 mt-1">
     <button 
      onClick={() => handleCategorize(item.id, 'Plan')}
      className={`flex-1 text-[10px] py-1 rounded transition-colors ${item.assigned === 'Plan' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
     >
      Business Plan
     </button>
     <button 
      onClick={() => handleCategorize(item.id, 'Deck')}
      className={`flex-1 text-[10px] py-1 rounded transition-colors ${item.assigned === 'Deck' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
     >
      Pitch Deck
     </button>
     </div>
    </div>
    ))}
   </div>

   <button 
    onClick={checkCategorization}
    className="mt-4 w-full bg-[#121212] dark:bg-[#121212] text-white py-2 rounded-md hover:bg-[#000000] dark:bg-[#121212] transition-colors text-sm font-semibold"
   >
    Verify Assignments
   </button>
   {analyzerFeedback && (
    <div className={`mt-3 p-2 rounded-md text-sm ${analyzerFeedback.startsWith('Perfect') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
    {analyzerFeedback}
    </div>
   )}
   </div>

   <div className="flex-1 overflow-auto mt-2">
   <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] mb-2 text-sm">Pitch Practice Logs</h3>
   <table className="w-full text-xs text-left text-slate-600 dark:text-[#a1a1aa]">
    <thead className="bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] uppercase">
    <tr>
     <th className="p-2">Attempt</th>
     <th className="p-2">Time Elapsed</th>
     <th className="p-2">Final Stage</th>
    </tr>
    </thead>
    <tbody>
    {logs.length === 0 ? (
     <tr><td colSpan={3} className="p-2 text-center text-slate-400">No pitches recorded.</td></tr>
    ) : (
     logs.map((log) => (
     <tr key={log.id} className="border-b border-slate-100">
      <td className="p-2">{log.id}</td>
      <td className="p-2">{log.timeLogged}s</td>
      <td className="p-2 font-medium text-indigo-600">{log.stageCompleted}</td>
     </tr>
     ))
    )}
    </tbody>
   </table>
   </div>

  </section>

  </main>
 </div>
 );
}
