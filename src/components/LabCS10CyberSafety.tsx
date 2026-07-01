import { useState, useRef } from 'react';
import { Shield, AlertTriangle, CheckCircle, Type, Trash2, Star, Send, Image as ImageIcon } from 'lucide-react';
import LabHeader from './LabHeader';

interface PosterElement {
 id: number;
 type: 'text' | 'icon';
 content: string;
 x: number;
 y: number;
 size: number;
}

export default function LabCS10CyberSafety({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [elements, setElements] = useState<PosterElement[]>([]);
 const [draggingId, setDraggingId] = useState<number | null>(null);
 const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
 const canvasRef = useRef<HTMLDivElement>(null);

 const [galleryMode, setGalleryMode] = useState(false);
 const [ratings, setRatings] = useState<number[]>([0, 0, 0]);
 const [mcqAns, setMcqAns] = useState('');

 const addText = () => {
 setElements([...elements, { id: Date.now(), type: 'text', content: 'Double click to edit', x: 50, y: 50, size: 24 }]);
 };

 const addIcon = (iconName: string) => {
 setElements([...elements, { id: Date.now(), type: 'icon', content: iconName, x: 100, y: 100, size: 48 }]);
 };

 const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, id: number) => {
 e.stopPropagation();
 const target = e.target as HTMLDivElement;
 target.setPointerCapture(e.pointerId);
 const el = elements.find(el => el.id === id);
 if (el && canvasRef.current) {
  const rect = canvasRef.current.getBoundingClientRect();
  const x = e.clientX - rect.left - el.x;
  const y = e.clientY - rect.top - el.y;
  setDraggingId(id);
  setDragOffset({ x, y });
 }
 };

 const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
 if (draggingId !== null && canvasRef.current) {
  const rect = canvasRef.current.getBoundingClientRect();
  const newX = e.clientX - rect.left - dragOffset.x;
  const newY = e.clientY - rect.top - dragOffset.y;
  setElements(prev => prev.map(el => el.id === draggingId ? { ...el, x: newX, y: newY } : el));
 }
 };

 const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
 const target = e.target as HTMLDivElement;
 target.releasePointerCapture(e.pointerId);
 setDraggingId(null);
 };

 const removeElement = (id: number) => {
 setElements(elements.filter(e => e.id !== id));
 };

 const renderIcon = (name: string, size: number) => {
 if (name === 'shield') return <Shield size={size} className="text-blue-500" />;
 if (name === 'alert') return <AlertTriangle size={size} className="text-yellow-500" />;
 if (name === 'check') return <CheckCircle size={size} className="text-green-500" />;
 return <ImageIcon size={size} className="text-slate-500 dark:text-[#71717a]" />;
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Cyber Safety Lab" subtitle="Design an Anti-Cyberbullying Poster" />

  
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
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:flex-1 overflow-y-auto lg:overflow-visible">
  
  {/* LEFT COLUMN: Setup */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-slate-200 dark:border-[#1c1b1b]  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">1. Poster Builder Tools</h2>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-2">Design an Anti-Cyberbullying poster. Click elements to add them, then drag them around the canvas.</p>
   
   <button onClick={addText} className={`flex items-center gap-2 bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:bg-[#121212] p-3 rounded font-medium text-slate-700 dark:text-[#ffffff] flex-col `}>
   <Type size={18}/> Add Text Box
   </button>
   
   <div className="border-t pt-4">
   <p className="text-sm font-semibold mb-2">Add Icons:</p>
   <div className="grid grid-cols-3 gap-2">
    <button onClick={() => addIcon('shield')} className={`flex justify-center bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:bg-[#121212] p-3 rounded flex-col `}><Shield className="text-blue-500"/></button>
    <button onClick={() => addIcon('alert')} className={`flex justify-center bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:bg-[#121212] p-3 rounded flex-col `}><AlertTriangle className="text-yellow-500"/></button>
    <button onClick={() => addIcon('check')} className="flex justify-center bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:bg-[#121212] p-3 rounded"><CheckCircle className="text-green-500"/></button>
   </div>
   </div>

   <div className="mt-auto border-t pt-4">
    <button onClick={() => setGalleryMode(true)} className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded font-bold dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">
    <Send size={18}/> Submit to Gallery Walk
    </button>
   </div>
  </div>

  {/* MIDDLE COLUMN: Canvas */}
  <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] p-5 rounded-xl shadow-sm flex flex-col items-center justify-center border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
   <div 
   ref={canvasRef}
   className="w-full max-w-sm aspect-[3/4] bg-slate-100 dark:bg-[#121212] border-2 border-dashed border-slate-300 dark:border-[#1c1b1b] relative shadow-inner overflow-hidden"
   >
   {elements.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">Empty Canvas</div>}
   
   {elements.map(el => (
    <div
    key={el.id}
    className="absolute cursor-move group"
    style={{ left: el.x, top: el.y }}
    onPointerDown={(e) => handlePointerDown(e, el.id)}
    onPointerMove={handlePointerMove}
    onPointerUp={handlePointerUp}
    onPointerCancel={handlePointerUp}
    >
    {el.type === 'text' ? (
     <div className="relative">
     <input 
      type="text" 
      value={el.content} 
      onChange={(e) => setElements(elements.map(x => x.id === el.id ? {...x, content: e.target.value} : x))}
      className="bg-transparent font-bold outline-none border border-transparent focus:border-blue-400 p-1"
      style={{ fontSize: el.size }}
     />
     </div>
    ) : (
     renderIcon(el.content, el.size)
    )}
    <button 
     onClick={() => removeElement(el.id)}
     className={`absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40 `}
    >
     <Trash2 size={12}/>
    </button>
    </div>
   ))}
   </div>
  </div>

  {/* RIGHT COLUMN: Gallery & Assessment */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] lg:  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">3. Gallery Walk & Assessment</h2>
   
   {!galleryMode ? (
   <div className="p-4 bg-emerald-50 rounded-lg text-emerald-800 text-sm">
    Complete your poster and click "Submit to Gallery Walk" to unlock peer reviews and your final assessment.
   </div>
   ) : (
   <>
    <div className="space-y-4">
    <p className="text-sm font-semibold">Rate Peer Posters:</p>
    {[1, 2, 3].map((posterNum, i) => (
     <div key={posterNum} className="p-3 bg-slate-50 dark:bg-[#121212] border rounded-lg flex items-center justify-between">
     <span className="font-medium text-sm">Poster #{posterNum}</span>
     <div className="flex gap-1">
      {[1,2,3,4,5].map(star => (
      <button key={star} onClick={() => {
       const newR = [...ratings];
       newR[i] = star;
       setRatings(newR);
      }}>
       <Star size={18} className={ratings[i] >= star ? "text-yellow-400 fill-yellow-400" : "text-slate-300"} />
      </button>
      ))}
     </div>
     </div>
    ))}
    </div>

    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 mt-4">
     <h3 className="font-bold mb-2">Final Assessment</h3>
     <p className="text-sm mb-2">Which of the following is the BEST immediate action if you witness cyberbullying?</p>
     <select value={mcqAns} onChange={e=>setMcqAns(e.target.value)} className="w-full p-2 border rounded mb-2 text-sm">
     <option value="">Select...</option>
     <option value="A">Reply angrily to the bully</option>
     <option value="B">Take screenshots, block, and report</option>
     <option value="C">Ignore it and delete your account</option>
     </select>
     <button className="w-full bg-emerald-600 text-white py-2 rounded font-bold dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40" onClick={() => alert(mcqAns === 'B' ? 'Correct! Documenting evidence and reporting is the safest action.' : 'Incorrect. Think about safety and evidence.')}>Check Answer</button>
    </div>
   </>
   )}
  </div>

  </div>
 </div>
 );
}
