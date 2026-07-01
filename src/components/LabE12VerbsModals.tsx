import { useState } from 'react';
import { Activity, ArrowLeft, Zap, Box, Lock, ShieldAlert, BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabE12VerbsModals({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeMode, setActiveMode] = useState<'transitivity' | 'modals'>('modals');

 // Transitivity State
 const actionScenarios = [
  { sentence: "The pitcher [threw] the ball.", object: "the ball", type: "Transitive" },
  { sentence: "The baby [slept] peacefully.", object: "none", type: "Intransitive" },
  { sentence: "She [gave] her brother a gift.", object: "a gift (and her brother)", type: "Ditransitive" }
 ];
 const [actionIndex, setActionIndex] = useState(0);
 const [selectedObject, setSelectedObject] = useState<string | null>(null);

 // Modal Stress Tester State
 const modalConstraints = [
  { context: "A toxic gas leak has been detected in the sector.", requirement: "Obligation / Necessity", target: "must", value: 100 },
  { context: "The radiation shield is fully charged.", requirement: "Ability", target: "can", value: 80 },
  { context: "There are strange anomalies on the radar.", requirement: "Possibility", target: "might", value: 30 },
  { context: "Requesting clearance to enter the docking bay.", requirement: "Permission", target: "may", value: 60 }
 ];
 const [modalIndex, setModalIndex] = useState(0);
 const [powerLevel, setPowerLevel] = useState<number>(0);
 const [selectedModal, setSelectedModal] = useState<string | null>(null);

 const handleModalSelect = (modal: string, val: number) => {
  setSelectedModal(modal);
  setPowerLevel(val);
 };

 const isModalCorrect = selectedModal === modalConstraints[modalIndex].target;

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
   <LabHeader onExit={onExit} title="Kinetic Engine Lab" />

   
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
   
   <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 overflow-y-auto lg:overflow-visible">
    {/* Window 1: Theory */}
    <section className={`rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
      <BookOpen className="mr-2 text-indigo-500" /> Grammar Theory
     </h2>
     <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
      <p>
       <strong>Verbs</strong> are the engine of a sentence. They express action, condition, or a state of being.
      </p>
      
      <h4 className="font-bold text-slate-800 dark:text-gray-200 mt-4">Transitivity (Action Transfer)</h4>
      <p className="mt-2">Transitivity refers to whether a verb requires an object to receive its action.</p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
       <li><strong>Transitive:</strong> The action transfers to a direct object. (e.g., He <em>kicked</em> the <strong>ball</strong>).</li>
       <li><strong>Intransitive:</strong> The action does not transfer to an object. (e.g., The sun <em>rises</em>).</li>
       <li><strong>Ditransitive:</strong> The action takes two objects—a direct and indirect object. (e.g., She <em>gave</em> <strong>him</strong> a <strong>gift</strong>).</li>
      </ul>

      <hr className="my-6 border-slate-200 dark:border-gray-800" />

      <h4 className="font-bold text-slate-800 dark:text-gray-200 mt-4">Modal Auxiliaries</h4>
      <p className="mt-2">
       Modal verbs help the main verb express a specific mood, such as necessity, possibility, or ability.
      </p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
       <li><strong>Must:</strong> Expresses strong obligation or logical necessity.</li>
       <li><strong>Can:</strong> Expresses physical or mental ability.</li>
       <li><strong>May:</strong> Expresses permission or a strong possibility.</li>
       <li><strong>Might:</strong> Expresses a weak possibility or hypothetical situation.</li>
      </ul>
     </div>
    </section>

    {/* Window 2: Controls */}
    <section className={`bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
      <Activity className="text-[#4158D1]" /> Kinetic Modulator
     </h2>
     
     <div className="flex gap-2 mb-6">
      <button 
       onClick={() => setActiveMode('modals')}
       className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeMode === 'modals' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#2a2a2a] text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
      >
       Modal Stress Test
      </button>
      <button 
       onClick={() => setActiveMode('transitivity')}
       className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeMode === 'transitivity' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#2a2a2a] text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
      >
       Transitivity
      </button>
     </div>

     <div className="flex-1 overflow-y-auto">
      {activeMode === 'modals' && (
       <div className="space-y-6">
        <div className={`p-4 rounded-xl border border-slate-200 dark:border-[#2a2a2a] flex-col `}>
         <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
          <ShieldAlert className="w-5 h-5 text-amber-500" /> Constraint Protocol
         </h3>
         
         <div className={`mb-6 p-4 bg-black/80 text-green-400 font-mono text-sm rounded-lg shadow-inner flex-col `}>
          <p>&gt; SYSTEM_ALERT: {modalConstraints[modalIndex].context}</p>
          <p className="mt-2 text-yellow-400">&gt; REQ_PROTOCOL: {modalConstraints[modalIndex].requirement}</p>
         </div>

         <div className="grid grid-cols-2 gap-3">
          {[
           { m: 'might', v: 30 }, { m: 'may', v: 60 }, 
           { m: 'can', v: 80 }, { m: 'must', v: 100 }
          ].map(opt => (
           <button 
            key={opt.m}
            onClick={() => handleModalSelect(opt.m, opt.v)}
            className={`p-3 border-2 rounded-xl font-bold transition-all ${selectedModal === opt.m ? 'border-[#4158D1] bg-[#4158D1] text-white' : 'border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-[#1a1a1a] text-slate-700 dark:text-gray-300 hover:border-[#4158D1]'}`}
           >
            {opt.m.toUpperCase()}
           </button>
          ))}
         </div>

         {selectedModal && (
          <div className={`mt-6 p-4 rounded-lg font-bold text-center border-2 ${isModalCorrect ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-500' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-500'}`}>
           {isModalCorrect ? `Protocol Verified! System stable at ${powerLevel}%.` : `Error: Incorrect certainty parameters applied.`}
           {isModalCorrect && (
            <button 
             onClick={() => { setModalIndex(p => (p + 1) % modalConstraints.length); setSelectedModal(null); setPowerLevel(0); }}
             className={`mt-3 w-full py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex-col `}
            >
             Next Protocol
            </button>
           )}
          </div>
         )}
        </div>
       </div>
      )}

      {activeMode === 'transitivity' && (
       <div className="space-y-6">
        <div className="p-4 rounded-xl border border-indigo-200 dark:border-[#2a2a2a]">
         <h3 className="font-bold text-indigo-800 dark:text-white flex items-center gap-2 mb-4">
          <Box className="w-5 h-5 text-indigo-500" /> Object Detector
         </h3>
         <p className="text-lg font-medium mb-6 text-center py-4 bg-indigo-50 dark:bg-[#1a1a1a] rounded-lg border border-indigo-100 dark:border-gray-800 dark:text-white">
          {actionScenarios[actionIndex].sentence}
         </p>
         <div className="flex flex-col gap-2">
          {['Transitive', 'Intransitive', 'Ditransitive'].map(type => (
           <button 
            key={type}
            onClick={() => setSelectedObject(type)}
            className={`p-3 text-sm font-bold border-2 rounded-xl transition-all ${selectedObject === type ? (actionScenarios[actionIndex].type === type ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-red-500 bg-red-500 text-white') : 'border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-[#1a1a1a] text-slate-700 dark:text-gray-300 hover:border-indigo-500'}`}
           >
            {type}
           </button>
          ))}
         </div>
         {selectedObject === actionScenarios[actionIndex].type && (
          <button 
           onClick={() => { setActionIndex(p => (p + 1) % actionScenarios.length); setSelectedObject(null); }}
           className="mt-6 w-full py-3 bg-[#4158D1] text-white rounded-xl font-bold hover:bg-blue-700"
          >
           Next Action
          </button>
         )}
        </div>
       </div>
      )}
     </div>
    </section>

    {/* Window 3: Simulation */}
    <section className={`bg-[#111] rounded-xl shadow-sm border border-[#333] relative flex items-center justify-center p-8 lg:min-h-[35vh] lg:min-h-[500px] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
     {/* Background Grid */}
     <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

     {activeMode === 'modals' && (
      <div className="relative w-full max-w-lg z-10">
       <h2 className="text-center font-mono text-gray-400 mb-4 tracking-widest">CERTAINTY METER CORE</h2>
       
       {/* The Meter Tube */}
       <div className="h-64 w-32 mx-auto bg-black border-4 border-gray-800 rounded-2xl relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* Ticks */}
        <div className="absolute inset-y-0 right-0 w-4 flex flex-col justify-between py-2 pr-1 opacity-50 z-20">
         <div className="h-[1px] w-full bg-white"></div>
         <div className="h-[1px] w-full bg-white"></div>
         <div className="h-[1px] w-full bg-white"></div>
         <div className="h-[1px] w-full bg-white"></div>
        </div>

        {/* Fluid Level */}
        <div 
         className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out flex items-center justify-center ${powerLevel >= 80 ? 'bg-red-500 shadow-[0_0_30px_#ef4444]' : powerLevel >= 50 ? 'bg-yellow-500 shadow-[0_0_30px_#eab308]' : powerLevel > 0 ? 'bg-blue-500 shadow-[0_0_30px_#3b82f6]' : 'bg-transparent'}`}
         style={{ height: `${powerLevel}%` }}
        >
         {powerLevel > 0 && (
          <div className="absolute inset-0 opacity-50 overflow-hidden">
           <div className="w-[200%] h-full animate-wave" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 20%, transparent 20%)', backgroundSize: '20px 20px' }}></div>
          </div>
         )}
        </div>
       </div>
       
       <div className="mt-8 flex justify-between px-10 text-mono text-xl font-black text-gray-300">
        <span>0%</span>
        <span>{powerLevel}%</span>
        <span>100%</span>
       </div>
      </div>
     )}

     {activeMode === 'transitivity' && (
      <div className="text-center z-10">
       <Lock className="w-32 h-32 text-gray-700 mx-auto mb-8" />
       <h2 className="text-3xl font-black tracking-widest text-gray-700 uppercase">Kinetic Transfer Offline</h2>
      </div>
     )}

     <style>{`
      @keyframes wave {
       0% { transform: translateX(0) translateY(0); }
       50% { transform: translateX(-20px) translateY(-5px); }
       100% { transform: translateX(-40px) translateY(0); }
      }
      .animate-wave {
       animation: wave 2s linear infinite;
      }
     `}</style>
    </section>
   </main>
  </div>
 );
}
