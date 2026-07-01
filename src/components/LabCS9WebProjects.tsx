import { useState, useEffect } from 'react';
import { Code, Layout, BookOpen, CheckSquare } from 'lucide-react';
import LabHeader from './LabHeader';

interface Project {
 id: string;
 title: string;
 description: string;
 defaultCode: string;
 requirements: { id: string; text: string; validator: (code: string) => boolean }[];
}

const PROJECTS: Project[] = [
 {
 id: 'school-function',
 title: 'Annual School Function',
 description: 'Create a webpage for the upcoming Annual School Function. It must include a main heading, an image banner, and an unordered list of events.',
 defaultCode: `<!DOCTYPE html>
<html>
<head>
 <style>
 body { font-family: Arial, sans-serif; text-align: center; }
 /* Add your styles here */
 </style>
</head>
<body>
 <!-- Add your HTML here -->
 
</body>
</html>`,
 requirements: [
  { id: 'heading', text: 'Include an <h1> heading', validator: (c) => /<h1/i.test(c) },
  { id: 'image', text: 'Include an <img> tag', validator: (c) => /<img/i.test(c) },
  { id: 'list', text: 'Include an unordered list (<ul>) with at least 2 items', validator: (c) => {
  const hasUl = /<ul/i.test(c);
  const lis = (c.match(/<li/ig) || []).length;
  return hasUl && lis >= 2;
  }}
 ]
 },
 {
 id: 'personal-hobbies',
 title: 'Personal Hobbies',
 description: 'Design a page showcasing your hobbies. Use a table to list your hobbies, their frequency, and a brief description.',
 defaultCode: `<!DOCTYPE html>
<html>
<body>
 <h2>My Hobbies</h2>
 <!-- Create a table here -->
 
</body>
</html>`,
 requirements: [
  { id: 'table', text: 'Include a <table> element', validator: (c) => /<table/i.test(c) },
  { id: 'row', text: 'Include at least 2 table rows (<tr>)', validator: (c) => (c.match(/<tr/ig) || []).length >= 2 },
  { id: 'header', text: 'Include table headers (<th>)', validator: (c) => /<th/i.test(c) }
 ]
 },
 {
 id: 'ecommerce',
 title: 'E-Commerce Food',
 description: 'Build a simple food ordering form. Include text inputs for name, a dropdown for food items, and a submit button.',
 defaultCode: `<!DOCTYPE html>
<html>
<body>
 <h2>Order Food Online</h2>
 <!-- Create a form here -->
 
</body>
</html>`,
 requirements: [
  { id: 'form', text: 'Include a <form> element', validator: (c) => /<form/i.test(c) },
  { id: 'input', text: 'Include a text <input>', validator: (c) => /<input/i.test(c) },
  { id: 'select', text: 'Include a dropdown <select>', validator: (c) => /<select/i.test(c) },
  { id: 'button', text: 'Include a submit button', validator: (c) => /<button/i.test(c) || /type=["']submit["']/i.test(c) }
 ]
 }
];

interface LabCS9WebProjectsProps {
 onExit?: () => void;
}

export default function LabCS9WebProjects({ onExit }: LabCS9WebProjectsProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [activeProjectIdx, setActiveProjectIdx] = useState(0);
 const [code, setCode] = useState(PROJECTS[0].defaultCode);
 const [debouncedCode, setDebouncedCode] = useState(code);

 const activeProject = PROJECTS[activeProjectIdx];

 useEffect(() => {
 const timer = setTimeout(() => {
  setDebouncedCode(code);
 }, 500);
 return () => clearTimeout(timer);
 }, [code]);

 const handleProjectSwitch = (idx: number) => {
 setActiveProjectIdx(idx);
 setCode(PROJECTS[idx].defaultCode);
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff]">
  <div className="flex items-center justify-between bg-emerald-600 text-white p-4 shadow-md dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent">
  <LabHeader onExit={onExit} title="Web Development Projects IDE" />
  </div>

  
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
  <div className="lg:flex-1 p-4 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 overflow-y-auto lg:overflow-visible">
  {/* Left Column: Theory & Projects */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col gap-4  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-700">
   <BookOpen size={24} /> Select a Project
   </h2>
   <div className="flex flex-col gap-2">
   {PROJECTS.map((proj, idx) => (
    <button
    key={proj.id}
    onClick={() => handleProjectSwitch(idx)}
    className={`p-3 text-left rounded-lg border-2 transition-all ${activeProjectIdx === idx ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-800' : 'border-slate-200 dark:border-[#1c1b1b] hover:border-emerald-300'}`}
    >
    {proj.title}
    </button>
   ))}
   </div>
   
   <div className={`mt-4 p-4 bg-slate-100 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-1 flex flex-col `}>
   <h3 className="font-bold text-lg mb-2">{activeProject.title}</h3>
   <p className="text-slate-600 dark:text-[#a1a1aa] mb-4 text-sm leading-relaxed">{activeProject.description}</p>
   
   <h4 className="font-bold text-sm text-slate-700 dark:text-[#ffffff] mb-2 flex items-center gap-1">
    <CheckSquare size={16} /> Requirements Checklist
   </h4>
   <div className="space-y-2 flex-1">
    {activeProject.requirements.map(req => {
    const isMet = req.validator(debouncedCode);
    return (
     <div key={req.id} className="flex items-start gap-2 text-sm">
     <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${isMet ? 'bg-green-500 text-white' : 'bg-slate-300 dark:bg-[#121212]'}`}>
      {isMet && <CheckSquare size={12} />}
     </div>
     <span className={isMet ? 'text-green-700 line-through opacity-70' : 'text-slate-600 dark:text-[#ffffff]'}>
      {req.text}
     </span>
     </div>
    )
    })}
   </div>
   
   <div className={`mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>
    <h4 className="font-bold text-blue-800 mb-1 text-sm dark:text-[#ffffff]">Tip:</h4>
    <p className="text-blue-700 text-xs">Write your HTML in the middle column. The preview on the right will update automatically after half a second.</p>
   </div>
   </div>
  </div>

  {/* Middle Column: IDE */}
  <div className={`w-full bg-[#1e1e1e] p-4 rounded-xl shadow-sm border border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col text-slate-100  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
   <Code size={24} /> HTML Editor
   </h2>
   <textarea
   className="flex-1 w-full bg-[#1e1e1e] text-[#d4d4d4] p-2 font-mono text-sm focus:outline-none resize-none border border-[#1c1b1b] dark:border-[#1c1b1b] rounded-lg"
   value={code}
   onChange={(e) => setCode(e.target.value)}
   spellCheck={false}
   />
  </div>

  {/* Right Column: Live Preview */}
  <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-emerald-700">
   <Layout size={24} /> Live Preview
   </h2>
   <div className="flex-1 border border-slate-300 dark:border-[#1c1b1b] rounded-lg overflow-hidden bg-slate-50 dark:bg-[#121212]">
   <iframe
    title="preview"
    srcDoc={debouncedCode}
    className="w-full h-full bg-slate-50 dark:bg-[#121212]"
    sandbox="allow-scripts"
   />
   </div>
  </div>
  </div>
 </div>
 );
}
