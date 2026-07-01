import { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Globe, Star, Image as ImageIcon, DownloadCloud, CheckCircle, XCircle , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

const tasks = [
 { 
 prompt: "You found a great article on 'Space Travel'. You want to save the link so you can easily find it later.", 
 answer: "Bookmark", 
 options: ["Refresh", "Log In", "Scroll Down", "Bookmark"] 
 },
 { 
 prompt: "You want to find more information that is hidden at the bottom of the webpage.", 
 answer: "Scroll Down", 
 options: ["Download", "Scroll Down", "Bookmark", "Refresh"] 
 },
 { 
 prompt: "You already have an account and want to access your personal dashboard.", 
 answer: "Log In", 
 options: ["Sign Up", "Log In", "Download", "Refresh"] 
 },
 { 
 prompt: "You want to save a high-resolution picture of Mars from the web page onto your computer's hard drive.", 
 answer: "Download", 
 options: ["Log In", "Bookmark", "Download", "Scroll Down"] 
 },
 { 
 prompt: "The page is taking too long to load and seems stuck. You want to try loading it again.", 
 answer: "Refresh", 
 options: ["Refresh", "Scroll Down", "Log In", "Bookmark"] 
 }
];

export default function LabE6WritingMechanics({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [currentIndex, setCurrentIndex] = useState(0);
 const [selectedAction, setSelectedAction] = useState<string | null>(null);
 const [browserAction, setBrowserAction] = useState<string | null>(null);
 const [feedback, setFeedback] = useState<{type: 'success' | 'error' | null, message: string}>({type: null, message: ''});
 const [score, setScore] = useState(0);

 const currentTask = tasks[currentIndex];

 const handleExecute = () => {
 if (!selectedAction) {
  setFeedback({ type: 'error', message: 'Please select an action first.' });
  return;
 }

 if (selectedAction === currentTask.answer) {
  setBrowserAction(selectedAction);
  setFeedback({ type: 'success', message: 'Correct action executed!' });
  
  setTimeout(() => {
  if (currentIndex < tasks.length - 1) {
   setScore(s => s + 1);
   setCurrentIndex(i => i + 1);
   setSelectedAction(null);
   setBrowserAction(null);
   setFeedback({ type: null, message: '' });
  } else {
   setScore(s => s + 1);
   setFeedback({ type: 'success', message: `Lab Complete! Final Score: ${score + 1}/${tasks.length}` });
  }
  }, 3000);
 } else {
  setFeedback({ type: 'error', message: 'Incorrect action. Try again.' });
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] transition-colors duration-300">
  {/* Header */}
  <header className="flex items-center justify-between p-4 shadow-sm z-10">
  <div className="flex items-center gap-4">
   {onExit && (
   <button
    onClick={onExit}
    className="px-4 py-2 flex items-center gap-2 text-slate-600 dark:text-[#a1a1aa] hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
   >
    <ArrowLeft className="w-5 h-5" />
    Go Back
   </button>
   )}
   <h1 className="text-lg md:text-xl font-bold">Class 6: Writing Mechanics (Internet Verbs)</h1>
  </div>
  <div className="flex items-center gap-4">
   <div className="text-sm font-medium bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full">
   Score: {score}/{tasks.length}
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

  {/* Main content */}
  <div className="lg:flex-1 lg: flex flex-col lg:grid grid-cols-1 lg:grid-cols-2 overflow-y-auto lg:overflow-visible">
  {/* Left Column: Interactive Controls */}
  <div className="flex flex-col p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b] space-y-6">
   <div>
   <h2 className="text-2xl font-bold mb-2">Web Browser Simulator</h2>
   <p className="text-slate-600 dark:text-[#71717a]">Choose the correct internet verb to navigate the digital world.</p>
   </div>

   <div className={`bg-white dark:!bg-[#121212] rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
   <h3 className="text-lg font-semibold mb-4 text-indigo-700 dark:text-indigo-400">
    Task {currentIndex + 1} of {tasks.length}
   </h3>
   <p className={`text-lg font-medium mb-6 bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
    "{currentTask.prompt}"
   </p>

   <div className="grid grid-cols-2 gap-3 mb-6">
    {currentTask.options.map(opt => (
    <button
     key={opt}
     onClick={() => setSelectedAction(opt)}
     disabled={browserAction === currentTask.answer}
     className={`p-4 rounded-xl text-base font-medium transition-colors border whitespace-nowrap flex-shrink-0 ${ selectedAction === opt ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-md' : ' border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] hover:border-indigo-300 dark:hover:border-indigo-600 disabled:opacity-50 shadow-sm' } flex-col ${activeMobileTab 'lab' 'flex' 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}
    >
     {opt}
    </button>
    ))}
   </div>

   <div className="flex items-center gap-4">
    <button
    onClick={handleExecute}
    disabled={browserAction === currentTask.answer}
    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
    Execute Action
    </button>
   </div>

   {feedback.message && (
    <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${ feedback.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' }`}>
    {feedback.type === 'success' ? <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" /> : <XCircle className="w-5 h-5 mt-0.5 shrink-0" />}
    <p>{feedback.message}</p>
    </div>
   )}
   </div>
  </div>

  {/* Right Column: Simulation Canvas */}
  <div className="flex flex-col p-6 overflow-hidden bg-slate-200 dark:bg-slate-950 items-center justify-center relative">
   <div className="w-full max-w-2xl bg-white dark:!bg-[#121212] rounded-xl shadow-2xl border border-slate-300 dark:border-[#1c1b1b] overflow-hidden flex flex-col h-[500px]">
   {/* Browser Chrome */}
   <div className="bg-slate-100 dark:bg-[#121212] border-b border-slate-300 dark:border-[#1c1b1b] p-3 flex items-center gap-2 z-20">
    <div className="flex gap-1.5 px-2">
    <div className="w-3 h-3 rounded-full bg-red-500" />
    <div className="w-3 h-3 rounded-full bg-yellow-500" />
    <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-[#121212] dark:border-[#1c1b1b]" />
    </div>
    <div className="flex items-center gap-2 flex-1 ml-4">
    <button className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700"><ArrowLeft className="w-4 h-4 text-slate-600 dark:text-[#71717a]"/></button>
    <button className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700"><ArrowRight className="w-4 h-4 text-slate-600 dark:text-[#71717a]"/></button>
    <button className={`p-1.5 rounded transition-colors ${browserAction === 'Refresh' ? 'bg-indigo-200 dark:bg-indigo-900/50 text-indigo-700' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
     <RotateCw className={`w-4 h-4 ${browserAction === 'Refresh' ? 'animate-spin' : 'text-slate-600 dark:text-[#a1a1aa]'}`} />
    </button>
    
    <div className="flex-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-[#1c1b1b] rounded-full px-4 py-1.5 flex items-center text-sm font-mono text-slate-500 dark:text-[#71717a] shadow-inner">
     <Globe className="w-3.5 h-3.5 mr-2 opacity-70" />
     https://www.space-explorer.edu
    </div>
    
    <button className={`p-1.5 rounded transition-colors ${browserAction === 'Bookmark' ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
     <Star className={`w-4 h-4 ${browserAction === 'Bookmark' ? 'fill-current animate-bounce' : ''}`} />
    </button>
    </div>
   </div>

   {/* Browser Content */}
   <div className={`flex-1 relative bg-slate-50 dark:bg-slate-950 overflow-hidden flex flex-col transition-opacity duration-500 ${browserAction === 'Refresh' ? 'opacity-30' : 'opacity-100'}`}>
    {/* Page content scroll container */}
    <div className={`absolute inset-0 p-8 transition-transform duration-1000 ease-in-out ${browserAction === 'Scroll Down' ? '-translate-y-1/2' : 'translate-y-0'}`}>
     {/* Content mockups */}
     <div className="max-w-xl mx-auto space-y-8">
      {/* Top section */}
      <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-[#ffffff]">Mars Explorer</h1>
      <div className="flex gap-4">
       <button className={`px-5 py-2 rounded-lg font-bold transition-all ${browserAction === 'Log In' ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff]'}`}>
        Log In
       </button>
      </div>
      </div>

      <div className="aspect-video bg-slate-200 dark:bg-[#121212] rounded-xl flex items-center justify-center relative overflow-hidden group border border-slate-300 dark:border-[#1c1b1b]">
      <ImageIcon className="w-16 h-16 text-slate-400 dark:text-slate-600" />
      {/* Download overlay */}
      <div className={`absolute inset-0 bg-indigo-900/80 flex items-center justify-center transition-opacity duration-300 ${browserAction === 'Download' ? 'opacity-100' : 'opacity-0'}`}>
       <div className="flex flex-col items-center text-white">
        <DownloadCloud className="w-16 h-16 mb-2 animate-bounce" />
        <span className="font-semibold text-lg">Downloading Mars_Image_HQ.jpg...</span>
       </div>
      </div>
      </div>

      <div className="space-y-4">
      <div className="h-4 bg-slate-200 dark:bg-[#121212] rounded w-full"></div>
      <div className="h-4 bg-slate-200 dark:bg-[#121212] rounded w-5/6"></div>
      <div className="h-4 bg-slate-200 dark:bg-[#121212] rounded w-4/6"></div>
      <div className="h-4 bg-slate-200 dark:bg-[#121212] rounded w-[90%]"></div>
      <div className="h-4 bg-slate-200 dark:bg-[#121212] rounded w-full"></div>
      </div>
      
      {/* Bottom section (visible on scroll) */}
      <div className="pt-24 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-[#ffffff]">Mission Details (Hidden Footer Data)</h2>
      <div className="space-y-4">
       <div className="h-4 bg-slate-200 dark:bg-[#121212] rounded w-full"></div>
       <div className="h-4 bg-slate-200 dark:bg-[#121212] rounded w-5/6"></div>
       <div className="h-4 bg-slate-200 dark:bg-[#121212] rounded w-full"></div>
       <div className="h-4 bg-slate-200 dark:bg-[#121212] rounded w-3/4"></div>
      </div>
      </div>
     </div>
    </div>
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
