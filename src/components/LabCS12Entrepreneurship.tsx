import { useState } from 'react';
import {Target, Users, BarChart3, Lightbulb, Play, Save } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabCS12Entrepreneurship({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [phase, setPhase] = useState<'build' | 'analyze'>('build');
 const [funds] = useState(50000);
 
 const [features, setFeatures] = useState({
 auth: false,
 dashboard: false,
 aiChat: false,
 darkTheme: false,
 multiplayer: false
 });

 const [users, setUsers] = useState(0);
 const [satisfaction, setSatisfaction] = useState(0);
 const [feedback, setFeedback] = useState<string[]>([]);
 const [spentCost, setSpentCost] = useState(0);

 const [q1Answer, setQ1Answer] = useState('');
 const [q2Answer, setQ2Answer] = useState('');
 const [assessmentStatus, setAssessmentStatus] = useState<string | null>(null);

 const toggleFeature = (key: keyof typeof features) => {
 if (phase !== 'build') return;
 setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
 };

 const getCost = () => {
 let cost = 0;
 if (features.auth) cost += 5000;
 if (features.dashboard) cost += 10000;
 if (features.aiChat) cost += 25000;
 if (features.darkTheme) cost += 2000;
 if (features.multiplayer) cost += 20000;
 return cost;
 };

 const handleLaunch = () => {
 let f: string[] = [];
 let sat = 100;
 let usrs = 500;
 const currentCost = getCost();

 if (!features.auth) { f.push("Security risk! No login screen. Anyone can see my data."); sat -= 40; usrs -= 200; }
 if (!features.dashboard) { f.push("I logged in but there's no data dashboard. Useless app."); sat -= 30; usrs -= 100; }
 if (features.aiChat) { f.push("AI Chat is extremely slow and gave me wrong answers."); sat -= 20; }
 if (features.darkTheme) { f.push("Love the dark mode! Very modern UI."); sat += 10; usrs += 50; }
 if (features.multiplayer) { f.push("Multiplayer disconnected me twice. Frustrating bugs."); sat -= 15; usrs -= 50; }
 
 if (features.auth && features.dashboard && !features.aiChat && !features.multiplayer) {
  f.push("Solid foundation. Really smooth experience. I'll stick around for updates.");
 }

 if (currentCost > funds) {
  f = ["CRITICAL: You ran out of runway and went bankrupt! Keep MVP lean."];
  sat = 0; usrs = 0;
 }

 setFeedback(f);
 setSatisfaction(Math.max(0, Math.min(100, sat)));
 setUsers(Math.max(0, usrs));
 setSpentCost(currentCost);
 setPhase('analyze');
 };

 const resetSim = () => {
 setPhase('build');
 setFeatures({ auth: false, dashboard: false, aiChat: false, darkTheme: false, multiplayer: false });
 setUsers(0);
 setSatisfaction(0);
 setFeedback([]);
 setSpentCost(0);
 };

 const checkAnswers = () => {
 const q1 = q1Answer.toLowerCase().trim();
 const q2 = q2Answer.toLowerCase().trim();
 
 const q1Correct = q1.includes('learning') || q1.includes('feedback') || q1.includes('test');
 const q2Correct = q2.includes('ai') || q2.includes('ai chat');

 if (q1Correct && q2Correct) {
  setAssessmentStatus('Success! You understand Lean Startup principles. Keep iterating!');
 } else {
  setAssessmentStatus('Some answers are incorrect. Hint: MVPs maximize learning, and AI Chat is very buggy.');
 }
 };

 return (
 <div className="flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] font-sans select-none overflow-hidden">
  <div className="flex items-center justify-between bg-[#121212] dark:bg-[#121212] text-white p-4 shadow-md">
  <LabHeader onExit={onExit} title="Grade 12 Entrepreneurship: Lean Startup MVP" />
  <div className="flex gap-4">
   <div className="text-sm font-mono bg-[#000000] dark:bg-[#121212] px-3 py-1 rounded-md text-emerald-400">
   FUNDS: ${phase === 'build' ? funds - getCost() : funds - spentCost}
   </div>
  </div>
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
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg: overflow-y-auto lg:overflow-visible">
  
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col lg:overflow-y-auto `}>
   <div className={`p-4 border-b border-slate-100 bg-slate-50 dark:bg-[#121212]/50 flex-col `}>
   <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-[#ffffff]">
    <Lightbulb size={18} className="text-amber-500" />
    Lean Startup Theory
   </h2>
   </div>
   <div className="p-4 space-y-6 text-slate-600 dark:text-[#a1a1aa] text-sm">
   <section>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">The MVP (Minimum Viable Product)</h3>
    <p className="mb-2">An MVP is a version of a new product which allows a team to collect the maximum amount of validated learning about customers with the least effort.</p>
    <ul className="list-disc pl-4 space-y-2">
    <li><strong>Core Features First:</strong> Only build what is absolutely necessary to solve the user's primary problem.</li>
    <li><strong>Avoid Feature Creep:</strong> Adding flashy or complex features early drains funds and introduces bugs.</li>
    </ul>
   </section>
   
   <section>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">Build-Measure-Learn Loop</h3>
    <p className="mb-2">The fundamental activity of a startup is to turn ideas into products, measure how customers respond, and then learn whether to pivot or persevere.</p>
   </section>
   
   <section>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">Metrics</h3>
    <ul className="list-disc pl-4 space-y-2">
    <li><strong>Acquisition:</strong> How many users sign up.</li>
    <li><strong>Retention / Churn:</strong> How many users stay vs leave. High bug rates increase churn.</li>
    <li><strong>Runway:</strong> How much cash you have left before going bankrupt.</li>
    </ul>
   </section>
   </div>
  </div>

  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col overflow- `}>
   <div className="flex border-b border-slate-200 dark:border-[#1c1b1b]">
   <div className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-colors ${phase === 'build' ? 'border-blue-500 text-blue-600 bg-blue-50/30' : 'border-transparent text-slate-500 dark:text-[#a1a1aa]'}`}>
    1. Build Phase
   </div>
   <div className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-colors ${phase === 'analyze' ? 'border-indigo-500 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-500 dark:text-[#a1a1aa]'}`}>
    2. Analyze Phase
   </div>
   </div>
   
   <div className="flex-1 lg:overflow-y-auto bg-slate-50 dark:bg-[#121212] relative p-4">
   {phase === 'build' ? (
    <div className="space-y-4">
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">Select features for your MVP sprint. Be mindful of your $50,000 budget!</p>
    
    <div className="grid gap-3">
     {[
     { key: 'auth', name: 'User Authentication', cost: 5000, type: 'Core Requirement' },
     { key: 'dashboard', name: 'Data Dashboard', cost: 10000, type: 'Core Requirement' },
     { key: 'aiChat', name: 'AI Chat Assistant', cost: 25000, type: 'High Risk / Complex' },
     { key: 'multiplayer', name: 'Real-time Multiplayer', cost: 20000, type: 'High Risk / Complex' },
     { key: 'darkTheme', name: 'Dark Theme UI', cost: 2000, type: 'Nice to have' },
     ].map(f => (
     <div 
      key={f.key} 
      onClick={() => toggleFeature(f.key as keyof typeof features)}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex justify-between items-center ${features[f.key as keyof typeof features] ? 'border-blue-500 bg-blue-50' : 'border-slate-200 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] hover:border-blue-300'} flex-col ${activeMobileTab === 'theory' 'flex' 'hidden'} lg:flex`}
     >
      <div>
      <div className="font-bold text-slate-800 dark:text-[#ffffff]">{f.name}</div>
      <div className="text-xs text-slate-500 dark:text-[#71717a]">{f.type}</div>
      </div>
      <div className="font-mono text-sm font-semibold text-slate-700 dark:text-[#ffffff]">${f.cost.toLocaleString()}</div>
     </div>
     ))}
    </div>

    <div className="pt-4 flex justify-center">
     <button 
     onClick={handleLaunch}
     className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
     >
     <Play fill="currentColor" size={18} /> Launch MVP
     </button>
    </div>
    </div>
   ) : (
    <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
     <div className="bg-slate-50 dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] text-center">
     <div className="text-xs font-bold text-slate-400 mb-1 uppercase">Active Users</div>
     <div className="text-3xl font-bold text-blue-600 flex items-center justify-center gap-2">
      <Users size={24} /> {users}
     </div>
     </div>
     <div className="bg-slate-50 dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] text-center">
     <div className="text-xs font-bold text-slate-400 mb-1 uppercase">User Satisfaction</div>
     <div className={`text-3xl font-bold flex items-center justify-center gap-2 ${satisfaction >= 70 ? 'text-emerald-500' : satisfaction >= 40 ? 'text-amber-500' : 'text-red-500'}`}>
      <BarChart3 size={24} /> {satisfaction}%
     </div>
     </div>
    </div>

    <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] overflow-hidden">
     <div className="bg-slate-100 dark:bg-[#121212] p-3 border-b border-slate-200 dark:border-[#1c1b1b] text-sm font-bold text-slate-700 dark:text-[#ffffff] flex items-center gap-2">
     <Target size={16} /> Beta Tester Feedback
     </div>
     <div className="p-4 space-y-3">
     {feedback.map((msg, i) => (
      <div key={i} className={`p-3 rounded-md text-sm border-l-4 ${msg.includes('CRITICAL') ? 'bg-red-50 border-red-500 text-red-700' : msg.includes('Solid') || msg.includes('Love') 'bg-emerald-50 border-emerald-500 text-emerald-800' 'bg-amber-50 border-amber-500 text-amber-800'} ${activeMobileTab === 'lab' 'block' 'hidden'} lg:block order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
      {msg}
      </div>
     ))}
     </div>
    </div>

    <div className="flex justify-center">
     <button 
     onClick={resetSim}
     className="text-sm font-medium text-slate-500 dark:text-[#71717a] hover:text-slate-800 dark:text-[#ffffff] underline"
     >
     Pivot & Restart Build
     </button>
    </div>
    </div>
   )}
   </div>
  </div>

  <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col lg:overflow-y-auto">
   <div className="p-4 border-b border-slate-100 bg-slate-50 dark:bg-[#121212]/50">
   <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-[#ffffff]">
    <BarChart3 size={18} className="text-blue-500" />
    Startup Assessment
   </h2>
   </div>
   <div className="p-4 space-y-6 flex-1">
   
   <div className="space-y-3">
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] leading-relaxed">
    1. Based on Lean Startup principles, what is the primary goal of an MVP? (Hint: To maximize validated ______)
    </label>
    <input
    type="text"
    value={q1Answer}
    onChange={(e) => setQ1Answer(e.target.value)}
    placeholder="Enter word..."
    className={`w-full border border-slate-300 dark:border-[#1c1b1b] rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-[#121212] `}
    />
   </div>

   <div className="space-y-3">
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] leading-relaxed">
    2. Test the simulator. Which expensive feature causes the biggest drop in satisfaction due to bugs and slow performance?
    </label>
    <input
    type="text"
    value={q2Answer}
    onChange={(e) => setQ2Answer(e.target.value)}
    placeholder="Enter feature name..."
    className={`w-full border border-slate-300 dark:border-[#1c1b1b] rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-[#121212] `}
    />
   </div>

   <button
    onClick={checkAnswers}
    className="w-full bg-[#121212] dark:!bg-[#121212] text-white font-medium py-3 rounded-lg hover:bg-slate-700 dark:!bg-[#121212] transition-colors shadow-sm"
   >
    Verify Solutions
   </button>

   {assessmentStatus && (
    <div className={`p-4 rounded-lg text-sm font-medium border ${assessmentStatus.includes('Success') ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'} ${activeMobileTab === 'lab' 'block' 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
    {assessmentStatus}
    </div>
   )}

   <div className="pt-4 border-t border-slate-200 dark:border-[#1c1b1b] mt-6">
    <button 
    onClick={() => {
     let score = 0;
     const q1 = q1Answer.toLowerCase().trim();
     const q2 = q2Answer.toLowerCase().trim();
     
     if (q1.includes('learning') || q1.includes('feedback') || q1.includes('test')) score += 50;
     if (q2.includes('ai') || q2.includes('ai chat')) score += 50;

     if (onExit) onExit();
    }}
    className={`w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40 `}
    >
    <Save size={20} />
    Submit Results & Exit
    </button>
   </div>
   </div>
  </div>

  </div>
 </div>
 );
}
