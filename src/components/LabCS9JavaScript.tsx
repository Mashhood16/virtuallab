import { useState } from 'react';
import { Play, CheckCircle, XCircle, Code, BookOpen, ListChecks } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabCS9JavaScriptProps {
 onExit?: () => void;
}

export default function LabCS9JavaScript({ onExit }: LabCS9JavaScriptProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [code, setCode] = useState(`// Write your logic here
// The variable 'score' is provided.
// You must return a grade as a string ('A+', 'A', 'B', 'C', 'F').

if (score >= 90) {
 return 'A+';
} else if (score >= 80) {
 return 'A';
} else {
 return 'F';
}
`);

 const [testResults, setTestResults] = useState<{score: number, expected: string, actual: string, passed: boolean}[]>([]);
 const [isPassed, setIsPassed] = useState(false);

 // Randomize test cases on load
 const [testCases] = useState(() => [
 { score: Math.floor(Math.random() * 5) + 95, expected: 'A+' }, // 95-99
 { score: Math.floor(Math.random() * 10) + 80, expected: 'A' }, // 80-89
 { score: Math.floor(Math.random() * 10) + 70, expected: 'B' }, // 70-79
 { score: Math.floor(Math.random() * 10) + 60, expected: 'C' }, // 60-69
 { score: Math.floor(Math.random() * 60), expected: 'F' },  // 0-59
 ]);

 const runCode = () => {
 try {
  // eslint-disable-next-line no-new-func
  const userFunc = new Function('score', code);
  const results = testCases.map(tc => {
  try {
   const actual = String(userFunc(tc.score));
   return {
   score: tc.score,
   expected: tc.expected,
   actual,
   passed: actual === tc.expected
   };
  } catch (err: any) {
   return {
   score: tc.score,
   expected: tc.expected,
   actual: 'Error: ' + err.message,
   passed: false
   };
  }
  });
  setTestResults(results);
  if (results.every(r => r.passed)) {
  setIsPassed(true);
  } else {
  setIsPassed(false);
  }
 } catch (err: any) {
  alert("Syntax Error in your code: " + err.message);
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff]">
  <div className="flex items-center justify-between bg-indigo-600 text-white p-4 shadow-md dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent">
  <LabHeader onExit={onExit} title="JavaScript Logic Sandbox" />
  </div>

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    Theory
   </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >Lab</button>
  </div>
  <div className="lg:flex-1 p-4 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 overflow-y-auto lg:overflow-visible">
  {/* Left Column: Theory */}
  <div className={`bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
   <BookOpen size={24} /> Theory & Context
   </h2>
   <div className="prose prose-slate flex-1 lg:overflow-y-auto">
   <p>
    In JavaScript, <code>if/else</code> statements allow you to execute different blocks of code based on conditions.
   </p>
   <h3 className="font-semibold text-lg mt-4 mb-2">Grading System</h3>
   <p>Your task is to write logic to determine a student's grade based on their <code>score</code>.</p>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li><code>score &gt;= 90</code> : <b>A+</b></li>
    <li><code>score &gt;= 80</code> and <code>&lt; 90</code> : <b>A</b></li>
    <li><code>score &gt;= 70</code> and <code>&lt; 80</code> : <b>B</b></li>
    <li><code>score &gt;= 60</code> and <code>&lt; 70</code> : <b>C</b></li>
    <li><code>score &lt; 60</code> : <b>F</b></li>
   </ul>
   <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b] font-mono text-sm text-slate-700 dark:text-[#ffffff] mb-4 whitespace-pre-wrap flex-col `}>
    {`if (score >= 90) {\n return 'A+';\n} else if (score >= 80) {\n return 'A';\n}`}
   </div>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">
    Ensure you handle all possible conditions. The automated test suite will run your logic against random scores to verify correctness.
   </p>
   </div>
  </div>

  {/* Middle Column: Interactive Sandbox */}
  <div className={`bg-[#000000] dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col text-slate-100 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
   <Code size={24} /> Code Editor
   </h2>
   <div className="flex-1 flex flex-col gap-2">
   <div className="font-mono text-sm text-slate-400">
    function getGrade(score) {'{'}
   </div>
   <textarea
    className="flex-1 w-full bg-[#121212] dark:bg-[#121212] text-green-400 p-4 font-mono text-sm rounded border border-[#1c1b1b] dark:border-[#1c1b1b] focus:outline-none focus:border-blue-500 resize-none"
    value={code}
    onChange={(e) => setCode(e.target.value)}
    spellCheck={false}
   />
   <div className="font-mono text-sm text-slate-400">
    {'}'}
   </div>
   </div>
   <button
   onClick={runCode}
   className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded flex items-center justify-center gap-2 transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
   >
   <Play size={20} /> Run Tests
   </button>
  </div>

  {/* Right Column: Assessment */}
  <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
   <ListChecks size={24} /> Automated Test Suite
   </h2>
   <div className="flex-1 lg:overflow-y-auto">
   {testResults.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
    <ListChecks size={48} className="opacity-50" />
    <p>Run your code to see test results</p>
    </div>
   ) : (
    <div className="space-y-3">
    {testResults.map((result, idx) => (
     <div key={idx} className={`p-3 rounded-lg border ${result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} flex flex-col gap-1 `}>
     <div className="flex items-center justify-between">
      <span className="font-bold text-slate-700 dark:text-[#ffffff]">Test {idx + 1}: Score = {result.score}</span>
      {result.passed ? (
      <CheckCircle size={20} className="text-green-600" />
      ) : (
      <XCircle size={20} className="text-red-600" />
      )}
     </div>
     <div className="text-sm text-slate-600 dark:text-[#a1a1aa]">
      Expected: <span className="font-mono bg-slate-50 dark:bg-[#121212] px-1 border rounded">{result.expected}</span>
     </div>
     <div className="text-sm text-slate-600 dark:text-[#a1a1aa]">
      Actual: <span className="font-mono bg-slate-50 dark:bg-[#121212] px-1 border rounded text-red-600">{result.actual}</span>
     </div>
     </div>
    ))}
    </div>
   )}
   </div>
   {testResults.length > 0 && (
   <div className={`mt-6 p-4 rounded-xl text-center font-bold text-lg ${isPassed ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
    {isPassed ? 'All Tests Passed! Excellent Work!' : 'Some tests failed. Check your logic and try again.'}
   </div>
   )}
  </div>
  </div>
 </div>
 );
}
