import { useState, useEffect } from 'react';
import { ArrowLeft, Send, CheckCircle2, XCircle, Mail, Newspaper, User, PenTool , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

const SCENARIOS = [
 {
 id: 1,
 reader: "Sleepless Sam",
 avatar: "😴",
 letterParts: ["Dear Advisor,\nI feel exhausted ", " studying late. I keep falling asleep ", " my classes! What can I do?"],
 blanks: [
  { id: "s1_1", type: "prep", options: ["because of", "in spite of", "along with"], answer: "because of" },
  { id: "s1_2", type: "prep", options: ["during", "instead of", "out of"], answer: "during" }
 ],
 adviceParts: ["Dear Sam,\nYou ", " get more sleep. You ", " try studying earlier in the day."],
 adviceBlanks: [
  { id: "s1_3", type: "modal", options: ["must", "can", "might"], answer: "must" },
  { id: "s1_4", type: "modal", options: ["should", "mustn't", "have to"], answer: "should" }
 ]
 },
 {
 id: 2,
 reader: "Angry Anna",
 avatar: "😠",
 letterParts: ["Dear Advisor,\nMy friend is ignoring me ", " a misunderstanding. She walked right ", " me today!"],
 blanks: [
  { id: "s2_1", type: "prep", options: ["due to", "in addition to", "apart from"], answer: "due to" },
  { id: "s2_2", type: "prep", options: ["past", "through", "under"], answer: "past" }
 ],
 adviceParts: ["Dear Anna,\nYou ", " talk to her honestly. Friends ", " communicate to resolve issues."],
 adviceBlanks: [
  { id: "s2_3", type: "modal", options: ["should", "mustn't", "can't"], answer: "should" },
  { id: "s2_4", type: "modal", options: ["have to", "might", "would"], answer: "have to" }
 ]
 },
 {
 id: 3,
 reader: "Confused Carl",
 avatar: "🤔",
 letterParts: ["I want to join the soccer team ", " the basketball team. But I am not allowed ", " school rules."],
 blanks: [
  { id: "s3_1", type: "prep", options: ["in addition to", "in front of", "out of"], answer: "in addition to" },
  { id: "s3_2", type: "prep", options: ["according to", "because of", "instead of"], answer: "according to" }
 ],
 adviceParts: ["Dear Carl,\nYou ", " choose just one sport for now. You ", " follow the rules."],
 adviceBlanks: [
  { id: "s3_3", type: "modal", options: ["have to", "shouldn't", "mustn't"], answer: "have to" },
  { id: "s3_4", type: "modal", options: ["must", "can", "might"], answer: "must" }
 ]
 }
];

export default function LabE7PrepositionsModals({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
 const [selections, setSelections] = useState<Record<string, string>>({});
 const [status, setStatus] = useState<"drafting" | "error" | "published" | "finished">("drafting");
 const [score, setScore] = useState(0);
 const [showErrors, setShowErrors] = useState(false);

 const scenario = SCENARIOS[currentScenarioIdx];

 // Auto-clear errors on input change
 useEffect(() => {
 if (status === "error") {
  setStatus("drafting");
  setShowErrors(false);
 }
 }, [selections, status]);

 const handleSelect = (id: string, val: string) => {
 setSelections(prev => ({ ...prev, [id]: val }));
 };

 const handlePublish = () => {
 if (!scenario) return;
 const allBlanks = [...scenario.blanks, ...scenario.adviceBlanks];
 
 // Check if all filled
 if (allBlanks.some(b => !selections[b.id])) {
  setStatus("error");
  setShowErrors(true);
  return;
 }

 // Check if all correct
 const allCorrect = allBlanks.every(b => selections[b.id] === b.answer);
 
 if (allCorrect) {
  setStatus("published");
  setScore(s => s + 10);
  setShowErrors(false);
 } else {
  setStatus("error");
  setShowErrors(true);
 }
 };

 const handleNext = () => {
 if (currentScenarioIdx < SCENARIOS.length - 1) {
  setCurrentScenarioIdx(prev => prev + 1);
  setSelections({});
  setStatus("drafting");
  setShowErrors(false);
 } else {
  setStatus("finished");
 }
 };

 const renderTextWithBlanks = (parts: string[], blanks: any[], typeClass: string) => {
 const elements = [];
 for (let i = 0; i < parts.length; i++) {
  elements.push(<span key={`part-${i}`} className="whitespace-pre-wrap">{parts[i]}</span>);
  if (i < blanks.length) {
  const b = blanks[i];
  const isWrong = showErrors && selections[b.id] && selections[b.id] !== b.answer;
  elements.push(
   <select
   key={`blank-${b.id}`}
   value={selections[b.id] || ""}
   onChange={(e) => handleSelect(b.id, e.target.value)}
   className={`inline-block mx-1 px-2 py-1 border-2 rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-0 flex-1
    ${isWrong ? 'border-red-500 text-red-600 dark:text-red-400' : `border-${typeClass} text-${typeClass}`}
    ${status === 'published' ? 'pointer-events-none opacity-80' : ''}`}
   >
   <option value="" disabled>___</option>
   {b.options.map((opt: string) => (
    <option key={opt} value={opt}>{opt}</option>
   ))}
   </select>
  );
  }
 }
 return elements;
 };

 if (status === "finished") {
 return (
  <div className="flex flex-col h-screen items-center justify-center bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] select-none p-6">
  <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
  <h1 className="text-4xl font-bold mb-4">Well Done, Advisor!</h1>
  <p className="text-xl mb-8">You successfully helped all readers using proper prepositions and modals.</p>
  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-8">Final Score: {score}</div>
  <button
   onClick={onExit}
   className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md transition-colors whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
  >
   Return to Dashboard
  </button>
  </div>
 );
 }

 return (
 <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] select-none">
  {/* Header */}
  <header className="flex items-center justify-between px-6 py-4 shadow-sm border-b border-slate-200 dark:border-[#1c1b1b] shrink-0">
  <div className="flex items-center space-x-4">
   <button onClick={onExit} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 whitespace-nowrap flex-shrink-0 transition-colors">
   <ArrowLeft className="w-5 h-5" />
   </button>
   <h1 className="text-lg md:text-xl font-bold hidden sm:block">Advice Columnist Simulator</h1>
  </div>
  <div className="flex items-center space-x-4">
   <div className="font-semibold px-4 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full shadow-inner">
   Score: {score}
   </div>
  </div>
  
  <button
   onClick={toggleTheme}
   className="p-2 rounded-full hover:bg-white/20 transition-colors shrink-0 ml-4 dark:bg-[#121212]"
   title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
   {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
  </header>

  <main className="flex flex-1 lg:overflow-hidden flex-col lg:flex-row">
  {/* Left Column: Interactive Controls / Workspace */}
  <section className="w-full lg:w-1/2 flex flex-col p-4 sm:p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b] relative">
   <div className="max-w-2xl w-full mx-auto space-y-6 pb-20 lg:pb-0">
   <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
    <h2 className="text-lg font-bold text-indigo-800 dark:text-indigo-300 flex items-center mb-2">
    <PenTool className="w-5 h-5 mr-2" />
    Case #{scenario.id}: Help {scenario.reader}
    </h2>
    <p className="text-sm text-indigo-600 dark:text-indigo-400">
    Complete the reader's letter with the correct <strong>prepositional phrases</strong>, then draft your advice using <strong>modals of obligation</strong> (should, must, have to).
    </p>
   </div>

   {/* Reader's Letter */}
   <div className="bg-white dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 relative">
    <div className="absolute top-4 right-4 text-4xl opacity-50">{scenario.avatar}</div>
    <h3 className="font-bold text-slate-500 dark:text-[#71717a] flex items-center mb-4 uppercase text-sm tracking-wider">
    <Mail className="w-4 h-4 mr-2" />
    Incoming Letter
    </h3>
    <div className="text-lg leading-loose text-slate-700 dark:text-[#ffffff]">
    {renderTextWithBlanks(scenario.letterParts, scenario.blanks, 'slate-400')}
    </div>
   </div>

   {/* Advisor's Draft */}
   <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800 p-6">
    <h3 className="font-bold text-blue-600 dark:text-blue-400 flex items-center mb-4 uppercase text-sm tracking-wider">
    <User className="w-4 h-4 mr-2" />
    Your Advice Draft
    </h3>
    <div className="text-lg leading-loose text-slate-700 dark:text-[#ffffff]">
    {renderTextWithBlanks(scenario.adviceParts, scenario.adviceBlanks, 'blue-500')}
    </div>
   </div>

   {/* Action Bar */}
   <div className="flex flex-col sm:flex-row items-center justify-between mt-6 p-4 bg-white dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <div className="flex-1 mb-4 sm:mb-0">
    {status === "error" && showErrors && (
     <div className="flex items-center text-red-600 dark:text-red-400 text-sm font-semibold">
     <XCircle className="w-5 h-5 mr-2" />
     Review your choices! Some are incorrect or missing.
     </div>
    )}
    {status === "published" && (
     <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-semibold">
     <CheckCircle2 className="w-5 h-5 mr-2" />
     Perfect advice! Published successfully.
     </div>
    )}
    </div>
    
    {status !== "published" ? (
    <button
     onClick={handlePublish}
     className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md transition-colors whitespace-nowrap flex-shrink-0 flex items-center justify-center dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
     <Send className="w-4 h-4 mr-2" />
     Publish Advice
    </button>
    ) : (
    <button
     onClick={handleNext}
     className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-md transition-colors whitespace-nowrap flex-shrink-0 flex items-center justify-center animate-pulse dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"
    >
     Next Case
     <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
    </button>
    )}
   </div>
   </div>
  </section>

  {/* Right Column: Newspaper Preview */}
  <section className="hidden lg:flex w-1/2 bg-slate-200 dark:bg-slate-950 flex-col items-center justify-center p-8 relative overflow-hidden">
   <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
   
   <div className="bg-white text-black w-full max-w-lg aspect-[3/4] shadow-2xl rotate-1 transform transition-transform hover:rotate-0 flex flex-col p-8 relative dark:bg-[#121212]">
   {/* Newspaper Header */}
   <div className="border-b-4 border-black pb-4 mb-6 text-center">
    <h1 className="text-4xl font-serif font-black tracking-tighter uppercase flex items-center justify-center">
    <Newspaper className="w-8 h-8 mr-3" />
    The Daily Advice
    </h1>
    <p className="text-xs uppercase tracking-widest mt-2 font-bold text-gray-500">Volume XLII • Expert Opinions</p>
   </div>

   {/* Newspaper Body */}
   <div className="flex-1 flex flex-col space-y-6">
    <div className="font-serif">
    <h2 className="font-bold text-xl mb-2 border-b-2 border-gray-300 pb-1">Q: From {scenario.reader}</h2>
    <p className="text-sm leading-relaxed text-gray-800 italic">
     {scenario.letterParts.map((part, i) => (
     <span key={i}>
      {part}
      {i < scenario.blanks.length && (
      <span className={`font-bold not-italic border-b border-black px-1 ${status === 'published' ? 'bg-yellow-200' : 'text-gray-400'}`}>
       {selections[scenario.blanks[i].id] || '_______'}
      </span>
      )}
     </span>
     ))}
    </p>
    </div>

    <div className="font-serif">
    <h2 className="font-bold text-xl mb-2 border-b-2 border-gray-300 pb-1">A: The Expert Says</h2>
    <p className="text-sm leading-relaxed text-gray-800">
     {scenario.adviceParts.map((part, i) => (
     <span key={i}>
      {part}
      {i < scenario.adviceBlanks.length && (
      <span className={`font-bold underline decoration-2 decoration-blue-500 px-1 ${status === 'published' ? 'bg-blue-100 text-blue-900' : 'text-gray-400'}`}>
       {selections[scenario.adviceBlanks[i].id] || '_______'}
      </span>
      )}
     </span>
     ))}
    </p>
    </div>
   </div>

   {/* Published Stamp */}
   {status === "published" && (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
    <div className="transform -rotate-12 border-4 border-red-500 text-red-500 font-black text-5xl uppercase tracking-widest p-4 rounded-lg opacity-80 mix-blend-multiply drop-shadow-md bg-white/50 dark:bg-[#121212]">
     PUBLISHED
    </div>
    </div>
   )}
   </div>
  </section>
  </main>
 </div>
 );
}
