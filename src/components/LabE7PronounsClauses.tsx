import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Search, ShieldAlert, Award, Zap , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

const PRONOUN_TYPES = [
 "Personal", "Possessive", "Reflexive", "Relative", 
 "Demonstrative", "Interrogative", "Indefinite", "Intensive"
];

const PRONOUN_TASKS: { words: string[], answers: Record<number, string> }[] = [
 { 
  words: ["She", "bought", "herself", "a", "book", "that", "was", "expensive."], 
  answers: { 0: "Personal", 2: "Reflexive", 5: "Relative" } 
 },
 { 
  words: ["This", "is", "the", "man", "who", "helped", "us", "yesterday."], 
  answers: { 0: "Demonstrative", 4: "Relative", 6: "Personal" } 
 },
 { 
  words: ["Someone", "left", "their", "bag", "on", "the", "table."], 
  answers: { 0: "Indefinite", 2: "Possessive" } 
 }
];

const SYNTAX_TASKS = [
 { text: "in the early morning", type: "Phrase" },
 { text: "when the sun finally rises", type: "Clause" },
 { text: "a beautiful singing bird", type: "Phrase" },
 { text: "because she was very tired", type: "Clause" },
];

export default function LabE7PronounsClauses({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [mode, setMode] = useState<'pronouns' | 'syntax'>('pronouns');
 const [taskIndex, setTaskIndex] = useState(0);
 const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
 const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
 const [feedback, setFeedback] = useState("");
 const [score, setScore] = useState(0);

 const currentPronounTask = PRONOUN_TASKS[taskIndex % PRONOUN_TASKS.length];
 const currentSyntaxTask = SYNTAX_TASKS[taskIndex % SYNTAX_TASKS.length];

 useEffect(() => {
  setTaskIndex(0);
  setSelectedWordIndex(null);
  setUserAnswers({});
  setFeedback("");
 }, [mode]);

 const handleWordClick = (index: number) => {
  if (mode !== 'pronouns') return;
  setSelectedWordIndex(index);
 };

 const handlePronounTypeSelect = (type: string) => {
  if (selectedWordIndex === null) return;
  const newAnswers = { ...userAnswers, [selectedWordIndex]: type };
  setUserAnswers(newAnswers);
  setSelectedWordIndex(null);
  
  const correctAnswers = currentPronounTask.answers;
  let allCorrect = true;
  let anyWrong = false;

  for (const [idx, ans] of Object.entries(newAnswers)) {
   if (correctAnswers[Number(idx) as keyof typeof correctAnswers] !== ans) {
    anyWrong = true;
   }
  }

  for (const [idx, ans] of Object.entries(correctAnswers)) {
   if (newAnswers[Number(idx)] !== ans) {
    allCorrect = false;
   }
  }

  if (anyWrong) {
   setFeedback("Hmm, some of those aren't quite right. Keep scanning!");
  } else if (allCorrect) {
   setFeedback("Perfect scan! All pronouns identified correctly.");
   setScore(s => s + 10);
   setTimeout(() => {
    setTaskIndex(i => i + 1);
    setUserAnswers({});
    setFeedback("");
   }, 2000);
  } else {
   setFeedback("Good find! Keep scanning for more pronouns.");
  }
 };

 const handleSyntaxGuess = (guess: string) => {
  if (currentSyntaxTask.type === guess) {
   setFeedback("Correct! " + (guess === 'Clause' ? "It has a subject and a verb." : "It's missing a subject or a verb."));
   setScore(s => s + 10);
   setTimeout(() => {
    setTaskIndex(i => i + 1);
    setFeedback("");
   }, 2000);
  } else {
   setFeedback("Incorrect. Remember: Clauses need both a subject and a working verb.");
  }
 };

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-900 dark:text-[#ffffff]">
   {/* Header */}
   <div className="flex items-center justify-between p-4 bg-indigo-600 text-white shadow-md">
    <div className="flex items-center gap-3">
     <button onClick={onExit} className="p-2 hover:bg-white/20 rounded-full transition-colors whitespace-nowrap flex-shrink-0 dark:bg-[#121212]">
      <ArrowLeft className="w-6 h-6" />
     </button>
     <h1 className="text-lg md:text-xl font-bold flex items-center gap-2">
      <Search className="w-6 h-6" />
      Syntax Scanner: Pronouns & Clauses
     </h1>
    </div>
  <button
   onClick={toggleTheme}
   className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0 ml-4 dark:bg-[#121212]"
   title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
   {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
    <div className="flex items-center gap-4">
     <div className="flex items-center gap-2 bg-indigo-800 px-4 py-2 rounded-full font-bold">
      <Award className="w-5 h-5 text-yellow-400" />
      Score: {score}
     </div>
    </div>
   </div>

   {/* Main Content */}
   <div className="lg:flex-1 flex flex-col lg:grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4 p-4 lg:min-h-0 overflow-y-auto lg:overflow-visible">
    
    {/* Left Column: Controls & Workspace */}
    <div className={`w-full flex flex-col gap-4 bg-white dark:!bg-[#121212] rounded-2xl shadow-sm p-6 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b]  ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-slate-800 dark:text-[#ffffff]">
      <Zap className="w-5 h-5 text-indigo-500" />
      Mission Control
     </h2>
     
     <div className="flex gap-2 mb-4 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
      <button 
       className={`flex-1 min-w-0 py-2 rounded-md font-semibold transition-colors whitespace-nowrap flex-shrink-0 ${mode === 'pronouns' ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-[#ffffff] hover:bg-white/50 dark:hover:bg-slate-600/50'}`}
       onClick={() => setMode('pronouns')}
      >
       Pronoun Scanner
      </button>
      <button 
       className={`flex-1 min-w-0 py-2 rounded-md font-semibold transition-colors whitespace-nowrap flex-shrink-0 ${mode === 'syntax' ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-[#ffffff] hover:bg-white/50 dark:hover:bg-slate-600/50'}`}
       onClick={() => setMode('syntax')}
      >
       Clause Identifier
      </button>
     </div>

     <div className="prose dark:prose-invert text-sm mb-6 text-slate-700 dark:text-[#a1a1aa]">
      {mode === 'pronouns' ? (
       <>
        <h3 className="text-slate-800 dark:text-[#ffffff]">Target Profile: Pronouns</h3>
        <p>Scan the sentence and identify all pronouns. Select a word in the scanner, then classify it here.</p>
        <ul className="grid grid-cols-2 gap-2 list-none p-0 mt-4">
         {PRONOUN_TYPES.map(type => (
          <li key={type} className="m-0">
           <button 
            disabled={selectedWordIndex === null}
            onClick={() => handlePronounTypeSelect(type)}
            className="w-full text-left px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium whitespace-nowrap flex-shrink-0 border border-indigo-200 dark:border-indigo-800"
           >
            {type}
           </button>
          </li>
         ))}
        </ul>
       </>
      ) : (
       <>
        <h3 className="text-slate-800 dark:text-[#ffffff]">Target Profile: Clauses & Phrases</h3>
        <p>Analyze the highlighted segment. Does it contain BOTH a subject and a working verb? If so, it's a clause!</p>
        <div className="flex gap-4 mt-6">
         <button 
          onClick={() => handleSyntaxGuess('Phrase')}
          className="flex-1 min-w-0 py-4 bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded-xl font-bold transition-colors border border-emerald-300 dark:border-emerald-700 whitespace-nowrap flex-shrink-0 flex items-center justify-center gap-2"
         >
          It's a Phrase
         </button>
         <button 
          onClick={() => handleSyntaxGuess('Clause')}
          className="flex-1 min-w-0 py-4 bg-indigo-100 dark:bg-indigo-900/40 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 rounded-xl font-bold transition-colors border border-indigo-300 dark:border-indigo-700 whitespace-nowrap flex-shrink-0 flex items-center justify-center gap-2"
         >
          It's a Clause
         </button>
        </div>
       </>
      )}
     </div>

     {feedback && (
      <div className={`w-full mt-auto p-4 rounded-lg flex items-center gap-3 ${feedback.includes('Perfect') || feedback.includes('Correct') ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200' : feedback.includes('Hmm') || feedback.includes('Incorrect') ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200'} flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
       {feedback.includes('Perfect') || feedback.includes('Correct') ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <ShieldAlert className="w-5 h-5 flex-shrink-0" />}
       <span className="font-medium text-sm whitespace-pre-wrap">{feedback}</span>
      </div>
     )}
    </div>

    {/* Right Column: Simulation Canvas */}
    <div className="bg-[#000000] rounded-2xl shadow-sm p-2 flex flex-col relative overflow-hidden border border-[#1c1b1b] h-full min-h-[400px]">
     <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10 opacity-20"></div>
     
     <div className={`w-full bg-black/50 p-3 rounded-t-xl border-b border-[#1c1b1b] flex items-center justify-between z-20 flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
      <div className="flex items-center gap-2">
       <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
       <span className="text-emerald-500 font-mono text-sm tracking-wider">SCANNER_ACTIVE</span>
      </div>
      <span className="text-slate-500 font-mono text-xs">V. 7.0.2</span>
     </div>

     <div className="flex-1 p-8 flex items-center justify-center relative z-20">
      {mode === 'pronouns' ? (
       <div className="flex flex-wrap justify-center gap-y-12 gap-x-3 text-2xl md:text-4xl font-mono text-slate-300">
        {currentPronounTask.words.map((word, idx) => {
         const isSelected = selectedWordIndex === idx;
         const answeredType = userAnswers[idx];
         const isCorrectAnswer = currentPronounTask.answers[idx as keyof typeof currentPronounTask.answers] === answeredType;
         
         let badgeColor = "bg-[#121212] text-slate-400";
         if (answeredType) {
          badgeColor = isCorrectAnswer ? "bg-emerald-900/80 text-emerald-400 border border-emerald-500/50" : "bg-red-900/80 text-red-400 border border-red-500/50";
         }

         return (
          <div key={idx} className="relative group cursor-pointer flex flex-col items-center" onClick={() => handleWordClick(idx)}>
           <span className={`px-2 py-1 rounded transition-all duration-200 ${isSelected ? 'bg-indigo-600/50 text-indigo-200 outline outline-2 outline-indigo-500' : 'hover:text-white hover:bg-[#121212]'}`}>
            {word}
           </span>
           {answeredType && (
            <span className={`absolute -bottom-8 text-[11px] uppercase font-bold px-3 py-1 rounded-full whitespace-nowrap ${badgeColor}`}>
             {answeredType}
            </span>
           )}
          </div>
         );
        })}
       </div>
      ) : (
       <div className="flex flex-col items-center justify-center gap-8 w-full max-w-xl">
        <div className="text-center font-mono text-slate-400 mb-4 uppercase tracking-widest text-sm">
         Analyzing target string...
        </div>
        <div className="relative p-8 border-2 border-emerald-500/30 rounded-xl bg-emerald-900/10 w-full text-center">
         <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-500 rounded-tl"></div>
         <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-500 rounded-tr"></div>
         <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-500 rounded-bl"></div>
         <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-500 rounded-br"></div>
         
         <span className="text-3xl md:text-5xl font-mono text-emerald-400">
          "{currentSyntaxTask.text}"
         </span>
        </div>
       </div>
      )}
     </div>
    </div>
   </div>
  </div>
 );
}
