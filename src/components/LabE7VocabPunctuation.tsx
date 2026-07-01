import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Edit3, Award, Zap, AlertCircle , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

type Token = {
 id: string;
 text: string;
 isHomophoneTarget?: boolean;
 homophoneOptions?: string[];
 correctHomophone?: string;
 isModalTarget?: boolean;
 modalOptions?: string[];
 correctModal?: string;
 modalHint?: string;
 correctColonAfter?: boolean;
}

const DOCUMENT_TASKS: { title: string, tokens: Token[] }[] = [
 {
  title: "The Camping Trip",
  tokens: [
   { id: 't1', text: "The" },
   { id: 't2', text: "packing" },
   { id: 't3', text: "list" },
   { id: 't4', text: "is" },
   { id: 't5', text: "simple", correctColonAfter: true },
   { id: 't6', text: "tent," },
   { id: 't7', text: "water," },
   { id: 't8', text: "and" },
   { id: 't9', text: "food." },
   { id: 'br1', text: "\n" },
   { id: 't10', text: "We" },
   { id: 't11', text: "will" },
   { id: 't12', text: "probably", isModalTarget: true, modalOptions: ["definitely", "probably", "rarely", "never"], correctModal: "definitely", modalHint: "100% sure" },
   { id: 't13', text: "leave" },
   { id: 't14', text: "early." },
   { id: 'br2', text: "\n" },
   { id: 't15', text: "Make" },
   { id: 't16', text: "sure" },
   { id: 't17', text: "they're", isHomophoneTarget: true, homophoneOptions: ["there", "their", "they're"], correctHomophone: "their" },
   { id: 't18', text: "bags" },
   { id: 't19', text: "are" },
   { id: 't20', text: "over" },
   { id: 't21', text: "their.", isHomophoneTarget: true, homophoneOptions: ["there.", "their.", "they're."], correctHomophone: "there." }
  ]
 },
 {
  title: "The Space Mission",
  tokens: [
   { id: 't1', text: "Remember" },
   { id: 't2', text: "the" },
   { id: 't3', text: "golden" },
   { id: 't4', text: "rule", correctColonAfter: true },
   { id: 't5', text: "always" },
   { id: 't6', text: "check" },
   { id: 't7', text: "oxygen." },
   { id: 'br1', text: "\n" },
   { id: 't8', text: "It" },
   { id: 't9', text: "is" },
   { id: 't10', text: "certainly", isModalTarget: true, modalOptions: ["certainly", "possibly", "unlikely", "never"], correctModal: "possibly", modalHint: "50% chance" },
   { id: 't11', text: "going" },
   { id: 't12', text: "to" },
   { id: 't13', text: "rain." },
   { id: 'br2', text: "\n" },
   { id: 't14', text: "The" },
   { id: 't15', text: "aliens" },
   { id: 't16', text: "left" },
   { id: 't17', text: "there", isHomophoneTarget: true, homophoneOptions: ["there", "their", "they're"], correctHomophone: "their" },
   { id: 't18', text: "ship" },
   { id: 't19', text: "right" },
   { id: 't20', text: "their.", isHomophoneTarget: true, homophoneOptions: ["there.", "their.", "they're."], correctHomophone: "there." }
  ]
 }
];

export default function LabE7VocabPunctuation({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [taskIndex, setTaskIndex] = useState(0);
 const [colons, setColons] = useState<Set<string>>(new Set());
 const [homophones, setHomophones] = useState<Record<string, string>>({});
 const [modals, setModals] = useState<Record<string, string>>({});
 const [feedback, setFeedback] = useState("");
 const [score, setScore] = useState(0);

 const currentTask = DOCUMENT_TASKS[taskIndex % DOCUMENT_TASKS.length];

 useEffect(() => {
  const initialHomophones: Record<string, string> = {};
  const initialModals: Record<string, string> = {};
  currentTask.tokens.forEach(t => {
   if (t.isHomophoneTarget) initialHomophones[t.id] = t.text;
   if (t.isModalTarget) initialModals[t.id] = t.text;
  });
  setColons(new Set());
  setHomophones(initialHomophones);
  setModals(initialModals);
  setFeedback("");
 }, [taskIndex, currentTask]);

 const toggleColon = (id: string) => {
  const newColons = new Set(colons);
  if (newColons.has(id)) {
   newColons.delete(id);
  } else {
   newColons.add(id);
  }
  setColons(newColons);
 };

 const cycleHomophone = (token: Token) => {
  if (!token.homophoneOptions) return;
  const current = homophones[token.id] || token.text;
  const currentIndex = token.homophoneOptions.indexOf(current);
  const nextIndex = (currentIndex + 1) % token.homophoneOptions.length;
  setHomophones({ ...homophones, [token.id]: token.homophoneOptions[nextIndex] });
 };

 const checkAnswers = () => {
  let allCorrect = true;
  let errors: string[] = [];

  currentTask.tokens.forEach(t => {
   if (t.isHomophoneTarget) {
    if (homophones[t.id] !== t.correctHomophone) {
     allCorrect = false;
     errors.push(`Check homophones (there/their/they're).`);
    }
   }
   if (t.isModalTarget) {
    if (modals[t.id] !== t.correctModal) {
     allCorrect = false;
     errors.push(`Check modal adverbs (hints provided!).`);
    }
   }
   if (t.correctColonAfter) {
    if (!colons.has(t.id)) {
     allCorrect = false;
     errors.push(`Missing a required colon.`);
    }
   } else {
    if (colons.has(t.id)) {
     allCorrect = false;
     errors.push(`Extra colon found where it doesn't belong.`);
    }
   }
  });

  if (allCorrect) {
   setFeedback("Perfect proofreading! All errors fixed.");
   setScore(s => s + 20);
   setTimeout(() => {
    setTaskIndex(i => i + 1);
   }, 2500);
  } else {
   const uniqueErrors = Array.from(new Set(errors));
   setFeedback("Needs work:\n" + uniqueErrors.join("\n"));
  }
 };

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-900 dark:text-[#ffffff]">
   {/* Header */}
   <div className="flex items-center justify-between p-4 bg-teal-600 text-white shadow-md">
    <div className="flex items-center gap-3">
     <button onClick={onExit} className="p-2 hover:bg-white/20 rounded-full transition-colors whitespace-nowrap flex-shrink-0 dark:bg-[#121212]">
      <ArrowLeft className="w-6 h-6" />
     </button>
     <h1 className="text-lg md:text-xl font-bold flex items-center gap-2">
      <Edit3 className="w-6 h-6" />
      Editor's Desk: Punctuation & Vocab
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
     <div className="flex items-center gap-2 bg-teal-800 px-4 py-2 rounded-full font-bold">
      <Award className="w-5 h-5 text-yellow-400" />
      Score: {score}
     </div>
    </div>
   </div>

   {/* Main Content */}
   <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg:min-h-0 overflow-y-auto lg:overflow-visible">
    
    {/* Left Column: Editor Instructions */}
    <div className={`w-full lg:col-span-1 flex flex-col gap-4 bg-white dark:!bg-[#121212] rounded-2xl shadow-sm p-6 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b]  ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-slate-800 dark:text-[#ffffff]">
      <Zap className="w-5 h-5 text-teal-500" />
      Editor's Brief
     </h2>
     
     <div className="prose dark:prose-invert text-sm text-slate-700 dark:text-[#a1a1aa]">
      <p>We have a messy manuscript that needs your keen eye!</p>
      <ul className="space-y-3">
       <li className="flex items-start gap-2">
        <span className="font-bold text-teal-600 dark:text-teal-400 mt-0.5">•</span>
        <div>
         <strong className="text-slate-800 dark:text-[#ffffff]">Colons:</strong> Find where a colon should introduce a list or explanation. Click the space between words to insert a colon.
        </div>
       </li>
       <li className="flex items-start gap-2">
        <span className="font-bold text-blue-600 dark:text-blue-400 mt-0.5">•</span>
        <div>
         <strong className="text-slate-800 dark:text-[#ffffff]">Homophones:</strong> Some <i>there/their/they're</i> mix-ups occurred. Click the blue words to swap them out.
        </div>
       </li>
       <li className="flex items-start gap-2">
        <span className="font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
        <div>
         <strong className="text-slate-800 dark:text-[#ffffff]">Modal Adverbs:</strong> The tone is off. Adjust the modal adverbs to match the required certainty level (hint provided on hover).
        </div>
       </li>
      </ul>
     </div>

     <button 
      onClick={checkAnswers}
      className={`mt-6 w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-colors whitespace-nowrap flex-shrink-0 flex items-center justify-center gap-2 dark:text-white dark:text-white dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40 flex-col `}
     >
      <CheckCircle className="w-5 h-5" />
      Submit Proofread
     </button>

     {feedback && (
      <div className={`w-full mt-auto p-4 rounded-lg flex items-start gap-3 ${feedback.includes('Perfect') ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200' : 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200'} flex-col  'flex' : 'hidden'} lg:flex`}>
       {feedback.includes('Perfect') ? <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
       <span className="font-medium text-sm whitespace-pre-wrap">{feedback}</span>
      </div>
     )}
    </div>

    {/* Right Column: Manuscript Canvas */}
    <div className={`w-full lg:col-span-2 bg-slate-200 dark:!bg-[#121212] rounded-2xl shadow-sm p-4 md:p-8 flex flex-col relative lg:overflow-y-auto border border-slate-300 dark:border-[#1c1b1b] items-center  'flex' : 'hidden'} lg:flex`}>
     
     <div className="bg-[#fdfbf7] dark:bg-[#252525] rounded-sm shadow-xl p-8 max-w-2xl w-full min-h-[60vh] font-serif text-lg text-slate-800 dark:text-[#ffffff] relative border border-slate-300 dark:border-[#1c1b1b]">
      {/* decorative paper lines */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-red-400/30 dark:bg-red-900/30 ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block"></div>
      <div className="absolute left-9 top-0 bottom-0 w-px bg-red-400/30 dark:bg-red-900/30"></div>

      <h2 className="text-2xl font-bold text-center mb-8 pl-8 font-sans">{currentTask.title}</h2>
      
      <div className="leading-loose flex flex-wrap pl-8">
       {currentTask.tokens.map((token) => {
        if (token.text === '\n') {
         return <div key={token.id} className="w-full h-6"></div>;
        }

        let tokenText = token.text;
        if (token.isHomophoneTarget) tokenText = homophones[token.id] || token.text;
        if (token.isModalTarget) tokenText = modals[token.id] || token.text;

        const hasColon = colons.has(token.id);

        return (
         <div key={token.id} className="flex items-center group/token my-1">
          {/* Token Content */}
          {token.isHomophoneTarget ? (
           <button 
            className="text-blue-700 dark:text-blue-400 font-bold border-b-2 border-dashed border-blue-400 dark:border-blue-700 mx-1 px-1 whitespace-nowrap flex-shrink-0 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors dark:bg-teal-950/20 dark:border-teal-900" 
            onClick={() => cycleHomophone(token)}
           >
            {tokenText}
           </button>
          ) : token.isModalTarget ? (
           <div className="relative group/modal inline-block mx-1">
            <select 
             className="appearance-none bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-300 dark:border-indigo-700 cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500 min-w-[100px] text-center"
             value={tokenText}
             onChange={(e) => setModals({ ...modals, [token.id]: e.target.value })}
            >
             {token.modalOptions?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#121212] text-white text-xs px-3 py-1.5 rounded opacity-0 group-hover/modal:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-10 font-sans">
             Target: {token.modalHint}
             <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#121212] rotate-45"></div>
            </div>
           </div>
          ) : (
           <span className="mx-1">{tokenText}</span>
          )}

          {/* Colon Rendering */}
          {hasColon && <span className="font-bold text-teal-600 dark:text-teal-400 -ml-1 text-xl">:</span>}

          {/* Space (Clickable for colons) */}
          <div 
           className="w-3 h-6 cursor-pointer hover:bg-teal-200 dark:hover:bg-teal-900/50 rounded flex items-center justify-center transition-colors mx-0.5"
           onClick={() => toggleColon(token.id)}
           title="Click to insert colon"
          >
           {/* invisible hover zone */}
           <div className="w-1 h-full bg-teal-400/0 group-hover/token:bg-teal-400/20 rounded-full dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40"></div>
          </div>
         </div>
        );
       })}
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
