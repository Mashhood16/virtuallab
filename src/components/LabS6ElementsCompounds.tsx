import { useState } from 'react';
import { CheckCircle, HelpCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabS6ElementsCompounds({ onExit }: LabProps) {
 const [answers, setAnswers] = useState<Record<number, 'Element' | 'Compound'>>({});
 const [showResults, setShowResults] = useState(false);

 const questions = [
 { id: 1, name: 'Water (H₂O)', correct: 'Compound', desc: 'Made of two Hydrogen atoms and one Oxygen atom chemically bonded.' },
 { id: 2, name: 'Gold (Au)', correct: 'Element', desc: 'Made entirely of Gold atoms.' },
 { id: 3, name: 'Carbon Dioxide (CO₂)', correct: 'Compound', desc: 'Made of Carbon and Oxygen chemically bonded.' },
 { id: 4, name: 'Oxygen Gas (O₂)', correct: 'Element', desc: 'Made of only Oxygen atoms (even though they are bonded in pairs).' },
 { id: 5, name: 'Table Salt (NaCl)', correct: 'Compound', desc: 'Made of Sodium and Chlorine chemically bonded.' },
 { id: 6, name: 'Iron (Fe)', correct: 'Element', desc: 'Made entirely of Iron atoms.' }
 ];

 const handleSelect = (id: number, answer: 'Element' | 'Compound') => {
 setAnswers({ ...answers, [id]: answer });
 };

 const calculateScore = () => {
 return questions.filter(q => answers[q.id] === q.correct).length;
 };

 return (
 <div className="flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] font-sans">
  <LabHeader onExit={onExit} title="Unit 6: Elements vs. Compounds" />

  <div className="flex-1 flex flex-col p-8 items-center lg:overflow-y-auto">
  <div className="w-full max-w-3xl bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8">
   
   <div className="bg-blue-50 border border-blue-200 text-blue-800 p-6 rounded-xl mb-8 dark:bg-teal-950/20 dark:border-teal-900 dark:text-[#ffffff]">
   <h2 className="font-bold text-lg mb-2 flex items-center gap-2"><HelpCircle className="w-6 h-6" /> Identification Activity</h2>
   <p className="text-sm">
    An <strong>Element</strong> consists of only one type of atom. A <strong>Compound</strong> consists of two or more different types of atoms chemically bonded together. Classify the following substances.
   </p>
   </div>

   <div className="space-y-4 mb-8">
   {questions.map((q) => (
    <div key={q.id} className="p-4 border border-slate-200 dark:border-[#1c1b1b] rounded-xl bg-slate-50 dark:bg-[#121212] flex items-center justify-between">
    <span className="font-bold text-slate-800 dark:text-[#ffffff] text-lg w-1/3">{q.name}</span>
    
    <div className="flex gap-2 w-1/3 justify-center">
     <button 
     onClick={() => handleSelect(q.id, 'Element')}
     disabled={showResults}
     className={`px-4 py-2 rounded font-bold border-2 transition-colors ${answers[q.id] === 'Element' ? 'bg-blue-500 border-blue-500 text-white' : 'bg-slate-50 dark:bg-[#121212] border-slate-300 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:border-blue-300'}`}
     >
     Element
     </button>
     <button 
     onClick={() => handleSelect(q.id, 'Compound')}
     disabled={showResults}
     className={`px-4 py-2 rounded font-bold border-2 transition-colors ${answers[q.id] === 'Compound' ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-slate-50 dark:bg-[#121212] border-slate-300 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:border-indigo-300'}`}
     >
     Compound
     </button>
    </div>

    <div className="w-1/3 text-right">
     {showResults && (
     <span className={`text-sm font-bold ${answers[q.id] === q.correct ? 'text-emerald-600' : 'text-red-500'}`}>
      {answers[q.id] === q.correct ? '✓ Correct' : `✗ Incorrect (It's a ${q.correct})`}
      <p className="text-xs text-slate-500 dark:text-[#71717a] font-normal mt-1 text-left">{q.desc}</p>
     </span>
     )}
    </div>
    </div>
   ))}
   </div>

   {!showResults ? (
   <button 
    onClick={() => setShowResults(true)}
    disabled={Object.keys(answers).length < questions.length}
    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-slate-700 dark:disabled:text-slate-400 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
   >
    Check Answers
   </button>
   ) : (
   <div className="text-center p-6 bg-slate-100 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
    <h3 className="text-2xl font-black text-slate-800 dark:text-[#ffffff] mb-2">Score: {calculateScore()} / {questions.length}</h3>
    {calculateScore() === questions.length ? (
    <p className="text-emerald-600 font-bold flex items-center justify-center gap-2"><CheckCircle className="w-5 h-5" /> Perfect! You understand the difference.</p>
    ) : (
    <button onClick={() => { setShowResults(false); setAnswers({}); }} className="px-6 py-2 bg-slate-100 dark:bg-[#121212] border-2 border-slate-300 dark:border-[#1c1b1b] rounded font-bold text-slate-600 dark:text-[#a1a1aa] hover:bg-slate-200 dark:bg-[#121212] transition-colors">Try Again</button>
    )}
   </div>
   )}

  </div>
  </div>
 </div>
 );
}
