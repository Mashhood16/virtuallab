import { useState } from 'react';
import { 
 BookOpen, CheckCircle, RefreshCcw, Hammer, Layers, ChevronRight, BookA, Info, Star,
 History, HelpCircle
} from 'lucide-react';
import LabHeader from './LabHeader';

interface ForgeRule {
 base: string;
 baseType: string;
 suffix: string;
 result: string;
 rule: string;
}

const FORGE_RULES: ForgeRule[] = [
 { base: 'beauty', baseType: 'Noun', suffix: 'ful', result: 'beautiful', rule: 'Change y to i, add -ful (full of)' },
 { base: 'create', baseType: 'Verb', suffix: 'ive', result: 'creative', rule: 'Drop e, add -ive (tending to)' },
 { base: 'child', baseType: 'Noun', suffix: 'ish', result: 'childish', rule: 'Add -ish (having characteristics of)' },
 { base: 'danger', baseType: 'Noun', suffix: 'ous', result: 'dangerous', rule: 'Add -ous (full of / possessing)' },
 { base: 'magic', baseType: 'Noun', suffix: 'al', result: 'magical', rule: 'Add -al (relating to)' },
 { base: 'act', baseType: 'Verb', suffix: 'ive', result: 'active', rule: 'Add -ive (tending to)' },
 { base: 'rely', baseType: 'Verb', suffix: 'able', result: 'reliable', rule: 'Change y to i, add -able (capable of)' },
];

const ASSESSMENT_QUESTIONS = [
 {
 question: 'Which suffix turns the noun "comfort" into an adjective?',
 options: ['-able', '-ful', '-ous', '-ive'],
 answer: 0
 },
 {
 question: 'What is the morphological rule when adding "-ful" to "beauty"?',
 options: ['Drop the y completely', 'Change y to i before adding the suffix', 'Keep the y and add the suffix', 'Double the y'],
 answer: 1
 },
 {
 question: 'The suffix "-ous" typically means:',
 options: ['Relating to', 'Capable of', 'Full of / possessing', 'Action or process'],
 answer: 2
 }
];

export default function LabE9PartsOfSpeech({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [selectedBase, setSelectedBase] = useState<string>('');
 const [selectedSuffix, setSelectedSuffix] = useState<string>('');
 const [forgeResult, setForgeResult] = useState<ForgeRule | null>(null);
 const [forgeError, setForgeError] = useState<string>('');
 const [forgedLog, setForgedLog] = useState<ForgeRule[]>([]);
 
 const [assessmentScores, setAssessmentScores] = useState<number[]>(Array(ASSESSMENT_QUESTIONS.length).fill(-1));
 const [showResults, setShowResults] = useState(false);

 const bases = Array.from(new Set(FORGE_RULES.map(r => r.base)));
 const suffixes = Array.from(new Set(FORGE_RULES.map(r => r.suffix)));

 const handleForge = () => {
 setForgeError('');
 setForgeResult(null);
 if (!selectedBase || !selectedSuffix) {
  setForgeError('Select both a base word and a suffix to forge.');
  return;
 }

 const match = FORGE_RULES.find(r => r.base === selectedBase && r.suffix === selectedSuffix);
 if (match) {
  setForgeResult(match);
  if (!forgedLog.find(log => log.result === match.result)) {
  setForgedLog(prev => [match, ...prev]);
  }
 } else {
  setForgeError(`Incompatible combination: ${selectedBase} + -${selectedSuffix}. Try another!`);
 }
 };

 const handleAssessment = (qIndex: number, optIndex: number) => {
 const newScores = [...assessmentScores];
 newScores[qIndex] = optIndex;
 setAssessmentScores(newScores);
 };

 const calculateScore = () => {
 let score = 0;
 assessmentScores.forEach((ans, i) => {
  if (ans === ASSESSMENT_QUESTIONS[i].answer) score++;
 });
 return score;
 };

 return (
 <div className="min-h-screen bg-slate-50 dark:bg-[#000000] flex flex-col font-sans">
  <LabHeader title="Parts of Speech: Word Forge" onExit={onExit} />
  
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

  <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 overflow-y-auto lg:overflow-visible">
  
  {/* Window 1: Theory */}
  <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b]  ? 'block' : 'hidden'} lg:block`}>
   <div className="flex items-center gap-3 mb-6">
   <div className={`p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex-col `}>
    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
   </div>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">Morphology Theory</h2>
   </div>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-2 flex items-center gap-2">
    <BookA className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
    What is Morphology?
   </h3>
   <p className="mb-4 text-sm leading-relaxed">
    Morphology is the study of words, how they are formed, and their relationship to other words in the same language. 
    It analyzes the structure of words and parts of words, such as stems, root words, prefixes, and suffixes.
   </p>

   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-2 flex items-center gap-2 mt-6">
    <Layers className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
    Derivational Suffixes
   </h3>
   <p className="mb-4 text-sm leading-relaxed">
    A derivational suffix is added to a base word to create a new word with a different meaning or part of speech. 
    For example, adding "-ness" to "happy" creates "happiness", changing an adjective to a noun.
   </p>

   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-2 flex items-center gap-2 mt-6">
    <Info className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
    Common Adjective Suffixes
   </h3>
   <ul className="space-y-2 mb-4 text-sm">
    <li className="flex items-start gap-2">
    <ChevronRight className="w-4 h-4 mt-0.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
    <span><strong>-ful</strong> (full of): beauty → beautiful</span>
    </li>
    <li className="flex items-start gap-2">
    <ChevronRight className="w-4 h-4 mt-0.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
    <span><strong>-ous</strong> (possessing): danger → dangerous</span>
    </li>
    <li className="flex items-start gap-2">
    <ChevronRight className="w-4 h-4 mt-0.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
    <span><strong>-ive</strong> (tending to): create → creative</span>
    </li>
    <li className="flex items-start gap-2">
    <ChevronRight className="w-4 h-4 mt-0.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
    <span><strong>-ish</strong> (characteristic of): child → childish</span>
    </li>
    <li className="flex items-start gap-2">
    <ChevronRight className="w-4 h-4 mt-0.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
    <span><strong>-able / -ible</strong> (capable of): rely → reliable</span>
    </li>
    <li className="flex items-start gap-2">
    <ChevronRight className="w-4 h-4 mt-0.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
    <span><strong>-al</strong> (relating to): magic → magical</span>
    </li>
   </ul>

   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-2 mt-6">Spelling Rules for Suffixes</h3>
   <p className="mb-2 text-sm leading-relaxed">When adding suffixes, spelling changes often occur in the base word:</p>
   <ul className="space-y-3 text-sm">
    <li className={`bg-slate-50 dark:bg-[#1c1b1b] p-3 rounded-lg border border-slate-100 dark:border-[#2a2a2a] flex-col `}>
    <strong>Change Y to I:</strong> If a word ends in a consonant + y, change the 'y' to 'i' before adding a suffix. <br/><em className="text-slate-500 dark:text-slate-400">Example: beauty + ful = beautiful</em>.
    </li>
    <li className={`bg-slate-50 dark:bg-[#1c1b1b] p-3 rounded-lg border border-slate-100 dark:border-[#2a2a2a] flex-col `}>
    <strong>Drop the Silent E:</strong> Drop the silent 'e' before adding a suffix that begins with a vowel. <br/><em className="text-slate-500 dark:text-slate-400">Example: create + ive = creative</em>.
    </li>
    <li className="bg-slate-50 dark:bg-[#1c1b1b] p-3 rounded-lg border border-slate-100 dark:border-[#2a2a2a]">
    <strong>Double the Consonant:</strong> If a word ends in a single consonant preceded by a single vowel, double the consonant before adding a suffix starting with a vowel. <br/><em className="text-slate-500 dark:text-slate-400">Example: run + er = runner</em>.
    </li>
   </ul>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`w-full bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex items-center gap-3 mb-6">
   <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
    <Hammer className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
   </div>
   <div>
    <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">Word Forge</h2>
    <p className="text-sm text-slate-500 dark:text-[#a1a1aa]">Combine bases and suffixes to craft adjectives</p>
   </div>
   </div>

   <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 h-[500px]">
   <div className="space-y-6">
    {/* Base Selector */}
    <div className="space-y-3">
    <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">1. Select Base Word</label>
    <div className="grid grid-cols-2 gap-3">
     {bases.map(b => (
     <button
      key={b}
      onClick={() => setSelectedBase(b)}
      className={`px-3 py-3 rounded-xl text-left text-sm font-medium transition-all ${ selectedBase === b ? 'bg-blue-600 text-white shadow-md' : ' text-slate-700 dark:text-[#a1a1aa] hover:bg-slate-100 dark:hover:bg-[#2a2a2a] border border-slate-200 dark:border-[#2a2a2a]' }`}
     >
      {b.charAt(0).toUpperCase() + b.slice(1)}
      <span className="block text-xs opacity-70 mt-0.5">
      {FORGE_RULES.find(r => r.base === b)?.baseType}
      </span>
     </button>
     ))}
    </div>
    </div>

    {/* Suffix Selector */}
    <div className="space-y-3">
    <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">2. Select Suffix</label>
    <div className="grid grid-cols-2 gap-3">
     {suffixes.map(s => (
     <button
      key={s}
      onClick={() => setSelectedSuffix(s)}
      className={`px-3 py-3 rounded-xl text-left text-sm font-medium transition-all ${ selectedSuffix === s ? 'bg-indigo-600 text-white shadow-md' : ' text-slate-700 dark:text-[#a1a1aa] hover:bg-slate-100 dark:hover:bg-[#2a2a2a] border border-slate-200 dark:border-[#2a2a2a]' }`}
     >
      -{s}
     </button>
     ))}
    </div>
    </div>
   </div>

   {/* Forge Action */}
   <div className="mt-auto flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] relative ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
    <div className="flex items-center justify-center gap-4 mb-6 w-full">
    <div className={`flex-1 p-4 text-center rounded-xl font-bold text-lg shadow-inner ${selectedBase ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-slate-100 dark:bg-[#1c1b1b] text-slate-400'}`}>
     {selectedBase || '?'}
    </div>
    <div className="text-2xl text-slate-400 font-bold">+</div>
    <div className={`flex-1 p-4 text-center rounded-xl font-bold text-lg shadow-inner ${selectedSuffix ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'bg-slate-100 dark:bg-[#1c1b1b] text-slate-400'}`}>
     {selectedSuffix ? `-${selectedSuffix}` : '?'}
    </div>
    </div>

    <button
    onClick={handleForge}
    className="w-full py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
    >
    <Hammer className="w-5 h-5" />
    FORGE WORD
    </button>

    {forgeError && (
    <div className="mt-4 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-4 py-3 rounded-lg text-center w-full">
     {forgeError}
    </div>
    )}
   </div>
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`bg-slate-100 dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] relative flex flex-col p-6 overflow-hidden min-h-[500px] `}>
   <div className="flex items-center gap-3 mb-6">
   <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
    <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
   </div>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">Results & Assessment</h2>
   </div>

   <div className="flex-1 overflow-y-auto pr-2 space-y-6 h-[500px]">
   {/* Simulation Result Area */}
   {forgeResult && (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center shadow-sm">
     <div className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">Success! Adjective Formed:</div>
     <div className="text-4xl font-black text-green-700 dark:text-green-300 tracking-tight">
     {forgeResult.result}
     </div>
     <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800/50 text-sm text-green-700 dark:text-green-400">
     <strong>Rule applied:</strong> {forgeResult.rule}
     </div>
    </div>
    </div>
   )}

   {/* Log Section */}
   <section>
    <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-3 flex items-center gap-2">
    <History className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
    Forged Dictionary
    </h3>
    {forgedLog.length === 0 ? (
    <div className="text-sm text-slate-500 dark:text-[#a1a1aa] italic p-4 rounded-xl text-center border border-dashed border-slate-200 dark:border-[#2a2a2a]">
     No words forged yet. Use the Word Forge to create adjectives!
    </div>
    ) : (
    <div className="space-y-2">
     {forgedLog.map((log, idx) => (
     <div key={idx} className="p-3 rounded-lg border border-slate-200 dark:border-[#2a2a2a] flex justify-between items-center shadow-sm">
      <div>
      <span className="font-bold text-slate-800 dark:text-[#ffffff]">{log.result}</span>
      <span className="text-xs text-slate-500 dark:text-[#a1a1aa] ml-2">({log.base} + -{log.suffix})</span>
      </div>
      <Star className="w-4 h-4 text-yellow-500 dark:text-yellow-400 fill-current" />
     </div>
     ))}
    </div>
    )}
   </section>

   {/* Assessment Section */}
   <section className="pt-6 border-t border-slate-200 dark:border-[#2a2a2a]">
    <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
    <HelpCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
    Knowledge Check
    </h3>
    
    <div className="space-y-6">
    {ASSESSMENT_QUESTIONS.map((q, qIndex) => (
     <div key={qIndex} className="space-y-3">
     <p className="text-sm font-medium text-slate-800 dark:text-[#ffffff]">
      {qIndex + 1}. {q.question}
     </p>
     <div className="space-y-2">
      {q.options.map((opt, oIndex) => {
      const isSelected = assessmentScores[qIndex] === oIndex;
      const isCorrect = showResults && oIndex === q.answer;
      const isWrong = showResults && isSelected && oIndex !== q.answer;
      
      let btnClass = " border-slate-200 dark:border-[#2a2a2a] text-slate-700 dark:text-[#a1a1aa] hover:bg-slate-50 dark:hover:bg-[#1c1b1b]";
      
      if (isSelected && !showResults) {
       btnClass = "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-300";
      } else if (isCorrect) {
       btnClass = "bg-green-100 dark:bg-green-900/40 border-green-500 text-green-800 dark:text-green-300";
      } else if (isWrong) {
       btnClass = "bg-red-100 dark:bg-red-900/40 border-red-500 text-red-800 dark:text-red-300";
      } else if (showResults) {
       btnClass = "bg-slate-50 dark:bg-[#121212] border-slate-200 dark:border-[#2a2a2a] text-slate-400 opacity-50";
      }

      return (
       <button
       key={oIndex}
       disabled={showResults}
       onClick={() => handleAssessment(qIndex, oIndex)}
       className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${btnClass}`}
       >
       {opt}
       </button>
      );
      })}
     </div>
     </div>
    ))}

    {!showResults ? (
     <button
     onClick={() => setShowResults(true)}
     disabled={assessmentScores.includes(-1)}
     className={`w-full py-3 rounded-xl font-bold transition-all ${ assessmentScores.includes(-1) ? 'bg-slate-200 dark:bg-[#2a2a2a] text-slate-400 dark:text-[#71717a] cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' }`}
     >
     Check Answers
     </button>
    ) : (
     <div className="p-4 rounded-xl border border-slate-200 dark:border-[#2a2a2a] text-center space-y-3 shadow-sm">
     <div className="text-2xl font-black text-slate-800 dark:text-[#ffffff]">
      {calculateScore()} / {ASSESSMENT_QUESTIONS.length}
     </div>
     <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">
      {calculateScore() === ASSESSMENT_QUESTIONS.length 
      ? 'Excellent work! You are a master of morphology.' 
      : 'Good try! Review the rules and try again.'}
     </p>
     <button
      onClick={() => {
      setShowResults(false);
      setAssessmentScores(Array(ASSESSMENT_QUESTIONS.length).fill(-1));
      }}
      className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
     >
      <RefreshCcw className="w-4 h-4" />
      Retry Assessment
     </button>
     </div>
    )}
    </div>
   </section>
   </div>
  </section>

  </main>
 </div>
 );
}
