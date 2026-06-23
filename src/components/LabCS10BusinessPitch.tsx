import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle, Mic, Layout, Clock, Play, Square } from 'lucide-react';

interface Props {
  onExit?: () => void;
}

export default function LabCS10BusinessPitch({ onExit }: Props) {
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
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <header className="bg-purple-600 text-white p-4 shadow-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button onClick={onExit} className="p-2 hover:bg-purple-700 rounded-full transition-colors" title="Exit Lab">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Lab: Business Pitch & Brainstorming</h1>
        </div>
        <div className="flex items-center gap-2">
          <Mic size={20} />
          <span className="font-semibold">Grade 10 Computer Science</span>
        </div>
      </header>

      <main className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Theory */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
            <Layout className="text-purple-600" /> Pitch Theory
          </h2>
          
          <div className="prose prose-sm text-slate-600 space-y-4">
            <div>
              <h3 className="text-md font-semibold text-slate-700">The Elevator Pitch</h3>
              <p>A brief, persuasive speech that you use to spark interest in what your organization does. It should last no longer than a short elevator ride (about 30 to 60 seconds).</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Hook:</strong> Grab attention immediately.</li>
                <li><strong>Problem:</strong> What pain point are you solving?</li>
                <li><strong>Solution:</strong> Your unique product/service.</li>
                <li><strong>The Ask:</strong> What do you want from the listener?</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-md font-semibold text-slate-700">Business Plan vs. Pitch Deck</h3>
              <p><strong>Pitch Deck:</strong> A 10-15 slide presentation used to get a meeting or spark interest. Highly visual.</p>
              <p><strong>Business Plan:</strong> A 15-50 page document detailing every aspect of the business. Text-heavy, deep financials.</p>
            </div>
          </div>
        </section>

        {/* Column 2: Simulation */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-6">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
            <Clock className="text-purple-600" /> Pitch Simulator
          </h2>
          
          {/* Timed Simulator */}
          <div className="bg-slate-900 text-white p-6 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
            <div className={`absolute top-0 left-0 h-1 bg-purple-500 transition-all duration-1000`} style={{ width: `${(timeLeft/60)*100}%` }} />
            
            <div className="text-6xl font-mono font-black mb-2 tracking-wider">
              00:{timeLeft.toString().padStart(2, '0')}
            </div>
            <div className="text-lg font-bold text-purple-300 uppercase tracking-widest mb-6">
              Stage: {pitchStage}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={toggleTimer}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-transform active:scale-95 ${timerRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                {timerRunning ? <><Square size={20} fill="currentColor" /> Stop</> : <><Play size={20} fill="currentColor" /> Start Pitch</>}
              </button>
            </div>
          </div>

          {/* Sticky Note Board */}
          <div className="flex-1 bg-amber-50 rounded-lg border-2 border-dashed border-amber-200 p-2 relative min-h-[200px] overflow-hidden">
            <h3 className="text-xs font-bold text-amber-800/50 absolute top-2 left-2 uppercase tracking-widest">Ideation Board</h3>
            
            {notes.map(note => (
              <div 
                key={note.id}
                className="absolute w-32 h-32 bg-yellow-200 shadow-md p-2 text-xs font-handwriting cursor-move transform rotate-1 transition-transform hover:scale-105 hover:z-10 text-slate-800"
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
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              placeholder="Type idea and press Enter..."
            />
            <button onClick={addNote} className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm font-semibold">
              Add Note
            </button>
          </div>
        </section>

        {/* Column 3: Analysis */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-6">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
            <CheckCircle className="text-purple-600" /> Assessment & Logs
          </h2>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-700 mb-3 text-sm">Document Analyzer</h3>
            <p className="text-xs text-slate-500 mb-4">Assign each item to its correct document type.</p>
            
            <div className="space-y-3">
              {categorizedItems.map(item => (
                <div key={item.id} className="flex flex-col gap-1 p-2 bg-white rounded border border-slate-200 shadow-sm">
                  <span className="text-xs font-medium text-slate-700">{item.text}</span>
                  <div className="flex gap-2 mt-1">
                    <button 
                      onClick={() => handleCategorize(item.id, 'Plan')}
                      className={`flex-1 text-[10px] py-1 rounded transition-colors ${item.assigned === 'Plan' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      Business Plan
                    </button>
                    <button 
                      onClick={() => handleCategorize(item.id, 'Deck')}
                      className={`flex-1 text-[10px] py-1 rounded transition-colors ${item.assigned === 'Deck' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      Pitch Deck
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={checkCategorization}
              className="mt-4 w-full bg-slate-800 text-white py-2 rounded-md hover:bg-slate-900 transition-colors text-sm font-semibold"
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
            <h3 className="font-semibold text-slate-700 mb-2 text-sm">Pitch Practice Logs</h3>
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="bg-slate-100 text-slate-700 uppercase">
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
                      <td className="p-2 font-medium text-purple-600">{log.stageCompleted}</td>
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
