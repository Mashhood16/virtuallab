import { useState, useEffect } from 'react';
import { Code, Layout, CheckCircle, RefreshCw } from 'lucide-react';
import LabHeader from './LabHeader';

interface WebTask {
 id: number;
 desc: string;
 check: (h: string, c: string) => boolean;
}

const tasks: WebTask[] = [
 { id: 1, desc: 'Create an <h1> element with text "My Website"', check: (h) => /<h1[^>]*>\s*My Website\s*<\/h1>/i.test(h) },
 { id: 2, desc: 'Create a <p> tag with some text', check: (h) => /<p[^>]*>.*?[a-zA-Z]+.*?<\/p>/i.test(h) },
 { id: 3, desc: 'Make h1 text color red using CSS', check: (_, c) => /h1\s*\{[^}]*color\s*:\s*red\s*;?[^}]*\}/i.test(c) },
 { id: 4, desc: 'Create a <ul> list with at least two <li> elements', check: (h) => /<ul[^>]*>[\s\S]*?<li[^>]*>.*?<\/li>[\s\S]*?<li[^>]*>.*?<\/li>[\s\S]*?<\/ul>/i.test(h) },
];

export default function LabCS9WebBasics({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [htmlCode, setHtmlCode] = useState('<h1>Hello</h1>\n<p>Start typing here...</p>\n\n\n');
 const [cssCode, setCssCode] = useState('h1 {\n color: black;\n}\n\n');
 const [srcDoc, setSrcDoc] = useState('');
 
 const [taskStatus, setTaskStatus] = useState<Record<number, boolean>>({});

 useEffect(() => {
 const timeout = setTimeout(() => {
  setSrcDoc(`
  <!DOCTYPE html>
  <html>
  <head>
   <style>${cssCode}</style>
  </head>
  <body style="font-family: sans-serif; padding: 1rem;">
   ${htmlCode}
  </body>
  </html>
  `);
 }, 500);
 return () => clearTimeout(timeout);
 }, [htmlCode, cssCode]);

 const runValidations = () => {
 const status: Record<number, boolean> = {};
 tasks.forEach(t => {
  try {
  status[t.id] = t.check(htmlCode, cssCode);
  } catch (e) {
  status[t.id] = false;
  }
 });
 setTaskStatus(status);
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Web Basics Lab" subtitle="HTML & CSS Fundamentals" variant="amber" rightContent={<button onClick={runValidations} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-semibold transition-colors flex items-center gap-2 shadow dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40"><CheckCircle className="w-4 h-4" /> Validate Tasks</button>} />

  
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
  <div className="lg:flex-1 p-4 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 lg:min-h-0 overflow-y-auto lg:overflow-visible">
  
  <div className={`bg-slate-50 dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex flex-col gap-4 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2">Concepts & Tasks</h2>
   
   <div className="text-sm text-slate-600 dark:text-[#a1a1aa] space-y-3 leading-relaxed">
   <p><strong>HTML</strong> (HyperText Markup Language) provides the structure of a webpage. Tags define elements like headings <code>&lt;h1&gt;</code>, paragraphs <code>&lt;p&gt;</code>, and lists <code>&lt;ul&gt;</code>.</p>
   <p><strong>CSS</strong> (Cascading Style Sheets) provides the visual styling. It uses selectors (like <code>h1</code>) and declarations (like <code>color: red;</code>).</p>
   </div>

   <div className={`bg-orange-50 border border-orange-200 rounded-lg p-4 mt-2 shadow-inner ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h3 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
    <Layout className="w-5 h-5" /> Mission Objectives
   </h3>
   <ul className="space-y-3">
    {tasks.map(t => (
    <li key={t.id} className="flex gap-3 text-sm text-slate-700 dark:text-[#ffffff] items-start">
     {taskStatus[t.id] ? (
     <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
     ) : (
     <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-[#1c1b1b] shrink-0 mt-0.5" />
     )}
     <span>{t.desc}</span>
    </li>
    ))}
   </ul>
   </div>
  </div>

  <div className={`bg-[#000000] dark:bg-[#121212] lg:dark:bg-[#121212] p-4 rounded-xl shadow-inner border border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col gap-4 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2 shrink-0">
   <Code className="w-5 h-5 text-orange-400" /> Code Editor
   </h2>
   
   <div className="flex-1 flex flex-col gap-2 min-h-0">
   <div className="flex justify-between items-end mb-1 shrink-0">
    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">index.html</span>
   </div>
   <textarea
    className={`w-full flex-1 bg-[#121212] dark:bg-[#121212] text-orange-200 p-3 rounded-lg font-mono text-sm border border-slate-600 dark:border-[#1c1b1b] focus:outline-none focus:border-orange-500 resize-none shadow-inner flex-col `}
    value={htmlCode}
    onChange={(e) => setHtmlCode(e.target.value)}
    spellCheck={false}
   />
   </div>

   <div className="flex-1 flex flex-col gap-2 min-h-0">
   <div className="flex justify-between items-end mb-1 shrink-0">
    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">styles.css</span>
   </div>
   <textarea
    className={`w-full flex-1 bg-[#121212] dark:bg-[#121212] text-blue-300 p-3 rounded-lg font-mono text-sm border border-slate-600 dark:border-[#1c1b1b] focus:outline-none focus:border-blue-500 resize-none shadow-inner flex-col `}
    value={cssCode}
    onChange={(e) => setCssCode(e.target.value)}
    spellCheck={false}
   />
   </div>
  </div>

  <div className={`bg-slate-50 dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] overflow- flex flex-col `}>
   <div className="flex justify-between items-center border-b pb-2 mb-4 shrink-0">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
    <Layout className="w-5 h-5 text-indigo-500" /> Live Browser Preview
   </h2>
   <RefreshCw className="w-4 h-4 text-slate-400" />
   </div>
   
   <div className="flex-1 border-2 border-dashed border-slate-300 dark:border-[#1c1b1b] rounded-lg overflow-hidden bg-slate-50 dark:bg-[#121212] shadow-inner relative">
   <iframe 
    srcDoc={srcDoc} 
    className="absolute inset-0 w-full h-full border-none bg-slate-50 dark:bg-[#121212]"
    title="Live Preview"
    sandbox="allow-scripts"
   />
   </div>
  </div>

  </div>
 </div>
 );
}
