import { useState } from 'react';
import { Columns, ArrowLeft, Braces, Code, CheckCircle, Network, BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabE12PhrasesClauses({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeMode, setActiveMode] = useState<'tree' | 'phrases'>('tree');

 // Tree Dissector State
 const sentence = "Because it was raining, we stayed inside.";
 const nodes = [
  { id: 1, text: "Because it was raining", correctType: "Dependent Clause", pos: "top" },
  { id: 2, text: "we stayed inside", correctType: "Independent Clause", pos: "bottom" }
 ];
 
 const [node1Type, setNode1Type] = useState<string | null>(null);
 const [node2Type, setNode2Type] = useState<string | null>(null);

 const isNode1Correct = node1Type === nodes[0].correctType;
 const isNode2Correct = node2Type === nodes[1].correctType;
 const treeComplete = isNode1Correct && isNode2Correct;

 // Phrase Parsing State
 const phraseScenarios = [
  { text: "[In the morning], I drink coffee.", type: "Prepositional" },
  { text: "The girl [with the red hat] is my sister.", type: "Adjectival" },
  { text: "He ran [very quickly].", type: "Adverbial" },
  { text: "I enjoy [reading books].", type: "Gerund" }
 ];
 const [phraseIndex, setPhraseIndex] = useState(0);
 const [selectedPhrase, setSelectedPhrase] = useState<string | null>(null);

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
   <LabHeader onExit={onExit} title="Syntax Dissector Lab" />

   
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
       <strong>Clauses and Phrases</strong> are the building blocks of sentence structure. Understanding how to deconstruct them is crucial for mastering syntax.
      </p>
      
      <h4 className="font-bold text-slate-800 dark:text-gray-200 mt-4">Clauses (Subject + Verb)</h4>
      <p className="mt-2">A clause is a group of words containing a subject and a predicate (verb).</p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
       <li><strong>Independent:</strong> Can stand alone as a complete sentence. (e.g., <em>The sun is shining.</em>)</li>
       <li><strong>Dependent:</strong> Cannot stand alone because it begins with a subordinating conjunction. (e.g., <em>Because the sun is shining...</em>)</li>
      </ul>

      <hr className="my-6 border-slate-200 dark:border-gray-800" />

      <h4 className="font-bold text-slate-800 dark:text-gray-200 mt-4">Phrases (Lacking Subject/Verb logic)</h4>
      <p className="mt-2">
       A phrase acts as a single part of speech but lacks a subject-verb pairing.
      </p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
       <li><strong>Prepositional:</strong> Begins with a preposition. (e.g., <em>On the table</em>).</li>
       <li><strong>Adjectival:</strong> Modifies a noun. (e.g., The man <em>in the blue suit</em>).</li>
       <li><strong>Adverbial:</strong> Modifies a verb. (e.g., She ran <em>with great speed</em>).</li>
       <li><strong>Gerund:</strong> Acts as a noun. (e.g., <em>Running marathons</em> takes effort).</li>
      </ul>
     </div>
    </section>

    {/* Window 2: Controls */}
    <section className={`bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
      <Columns className="text-[#4158D1]" /> Structural Decomposition
     </h2>
     
     <div className="flex gap-2 mb-6">
      <button 
       onClick={() => setActiveMode('tree')}
       className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeMode === 'tree' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#2a2a2a] text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
      >
       Clause Tree
      </button>
      <button 
       onClick={() => setActiveMode('phrases')}
       className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeMode === 'phrases' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#2a2a2a] text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
      >
       Phrase Nodes
      </button>
     </div>

     <div className="flex-1 overflow-y-auto">
      {activeMode === 'tree' && (
       <div className="space-y-6">
        <div className={`p-4 rounded-xl border border-slate-200 dark:border-[#2a2a2a] flex-col `}>
         <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
          <Network className="w-5 h-5 text-indigo-500" /> Diagram Assigner
         </h3>
         
         <div className="space-y-4">
          <div className={`p-3 border-2 border-slate-300 dark:border-gray-700 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] flex-col `}>
           <p className="text-sm font-bold text-slate-500 dark:text-gray-400 mb-2">Node 1: "{nodes[0].text}"</p>
           <select 
            className={`w-full p-2 rounded-lg border dark:bg-[#111] dark:border-gray-600 dark:text-white flex-col `}
            value={node1Type || ''}
            onChange={e => setNode1Type(e.target.value)}
           >
            <option value="" disabled>Select Classification...</option>
            <option value="Independent Clause">Independent Clause</option>
            <option value="Dependent Clause">Dependent Clause</option>
            <option value="Relative Clause">Relative Clause</option>
           </select>
          </div>

          <div className="p-3 border-2 border-slate-300 dark:border-gray-700 rounded-xl bg-slate-50 dark:bg-[#1a1a1a]">
           <p className="text-sm font-bold text-slate-500 dark:text-gray-400 mb-2">Node 2: "{nodes[1].text}"</p>
           <select 
            className="w-full p-2 rounded-lg border dark:bg-[#111] dark:border-gray-600 dark:text-white"
            value={node2Type || ''}
            onChange={e => setNode2Type(e.target.value)}
           >
            <option value="" disabled>Select Classification...</option>
            <option value="Independent Clause">Independent Clause</option>
            <option value="Dependent Clause">Dependent Clause</option>
            <option value="Relative Clause">Relative Clause</option>
           </select>
          </div>
         </div>

         {treeComplete && (
          <div className="mt-6 p-4 rounded-lg bg-emerald-500/20 border border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold text-center flex justify-center items-center gap-2">
           <CheckCircle className="w-5 h-5" /> Hierarchy Validated
          </div>
         )}
        </div>
       </div>
      )}

      {activeMode === 'phrases' && (
        <div className="space-y-6">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#2a2a2a]">
         <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
          <Braces className="w-5 h-5 text-blue-500" /> Sub-Node Parsing
         </h3>
         <p className="text-lg font-medium mb-6 text-center py-4 bg-slate-50 dark:bg-[#1a1a1a] rounded-lg border border-slate-200 dark:border-gray-800 dark:text-white">
          {phraseScenarios[phraseIndex].text}
         </p>
         <div className="grid grid-cols-2 gap-2">
          {["Prepositional", "Adjectival", "Adverbial", "Gerund"].map(type => (
           <button 
            key={type}
            onClick={() => setSelectedPhrase(type)}
            className={`p-2 text-sm font-bold border-2 rounded-xl transition-all ${selectedPhrase === type ? (phraseScenarios[phraseIndex].type === type ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-red-500 bg-red-500 text-white') : 'border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-[#1a1a1a] text-slate-700 dark:text-gray-300 hover:border-blue-500'}`}
           >
            {type}
           </button>
          ))}
         </div>
         {selectedPhrase === phraseScenarios[phraseIndex].type && (
          <button 
           onClick={() => { setPhraseIndex(p => (p + 1) % phraseScenarios.length); setSelectedPhrase(null); }}
           className="mt-6 w-full py-3 bg-[#4158D1] text-white rounded-xl font-bold hover:bg-blue-700"
          >
           Next Phrase
          </button>
         )}
        </div>
       </div>
      )}
     </div>
    </section>

    {/* Window 3: Simulation */}
    <section className={`bg-white lg:bg-slate-900 rounded-xl shadow-sm border border-slate-800 relative flex items-center justify-center p-8 lg:min-h-[35vh] lg:min-h-[500px] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
     <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

     {activeMode === 'tree' && (
      <div className="relative w-full max-w-3xl flex flex-col items-center justify-center z-10">
       {/* Root Node */}
       <div className="bg-[#4158D1] text-white px-8 py-4 rounded-xl font-black text-xl shadow-[0_0_30px_rgba(65,88,209,0.5)] z-10 mb-12 border-4 border-blue-400">
        S (Sentence)
        <div className="text-xs font-normal opacity-80 block text-center mt-1">"{sentence}"</div>
       </div>

       {/* Lines */}
       <div className="absolute top-[80px] w-64 h-20 border-t-4 border-l-4 border-r-4 border-[#4158D1] rounded-t-xl z-0 opacity-50" />

       {/* Child Nodes */}
       <div className="flex gap-4 md:gap-16 z-10">
        {/* Node 1 */}
        <div className={`w-32 md:w-48 p-4 rounded-xl border-4 text-center transition-all duration-300 shadow-xl ${isNode1Correct ? 'bg-emerald-900/50 border-emerald-500' : 'bg-slate-800 border-slate-600'}`}
        >
         <div className="text-[10px] md:text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
          {node1Type || "Unclassified Node"}
         </div>
         <div className={`font-mono text-sm ${isNode1Correct ? 'text-emerald-400' : 'text-white'}`}>
          {nodes[0].text}
         </div>
        </div>

        {/* Node 2 */}
        <div className={`w-32 md:w-48 p-4 rounded-xl border-4 text-center transition-all duration-300 shadow-xl ${isNode2Correct ? 'bg-emerald-900/50 border-emerald-500' : 'bg-slate-800 border-slate-600'}`}
        >
         <div className="text-[10px] md:text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
          {node2Type || "Unclassified Node"}
         </div>
         <div className={`font-mono text-sm ${isNode2Correct ? 'text-emerald-400' : 'text-white'}`}>
          {nodes[1].text}
         </div>
        </div>
       </div>
       
       {treeComplete && (
        <div className="mt-8 p-4 bg-emerald-500/20 border border-emerald-500 rounded-xl animate-pulse">
         <p className="text-emerald-400 font-bold text-xl tracking-widest uppercase">Hierarchy Stabilized</p>
        </div>
       )}
      </div>
     )}

     {activeMode === 'phrases' && (
      <div className="text-center opacity-20 z-10">
       <Columns className="w-32 h-32 text-white mx-auto mb-8" />
       <h2 className="text-3xl font-black tracking-widest text-white uppercase">Hierarchy Viewer Offline</h2>
      </div>
     )}
    </section>
   </main>
  </div>
 );
}
