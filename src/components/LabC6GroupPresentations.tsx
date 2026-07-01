import { useState } from 'react';
import { ArrowLeft, Play, Presentation, Image as ImageIcon, Type, PlusCircle, Monitor, HardDrive, Cpu, Radio, Mouse } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabC6GroupPresentations({ onExit }: LabProps) {
 const topics = [
 { id: 'input', label: 'Input Devices', icon: Mouse, color: 'text-indigo-500' },
 { id: 'output', label: 'Output Devices', icon: Monitor, color: 'text-pink-500' },
 { id: 'storage', label: 'Storage Devices', icon: HardDrive, color: 'text-amber-500' },
 { id: 'comm', label: 'Communication Devices', icon: Radio, color: 'text-emerald-500' },
 { id: 'mobo', label: 'Components of Motherboard', icon: Cpu, color: 'text-blue-500' }
 ];

 const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
 const [slides, setSlides] = useState([{ title: 'Title Slide', content: 'Presenting our group topic.' }]);
 const [currentSlide, setCurrentSlide] = useState(0);
 const [isPlaying, setIsPlaying] = useState(false);
 const [activeFormat, setActiveFormat] = useState('text');

 const addSlide = () => {
 setSlides([...slides, { title: 'New Slide', content: '' }]);
 setCurrentSlide(slides.length);
 };

 const updateSlide = (field: 'title' | 'content', value: string) => {
 const newSlides = [...slides];
 newSlides[currentSlide][field] = value;
 setSlides(newSlides);
 };

 if (isPlaying) {
 return (
  <div className="flex h-screen bg-[#000000] dark:!bg-[#000000] text-white flex-col items-center justify-center p-8 relative">
  <button 
   onClick={() => setIsPlaying(false)} 
   className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center"
  >
   <ArrowLeft className="w-5 h-5 mr-2" /> End Show
  </button>
  
  <div className="w-full max-w-5xl aspect-video bg-[#121212] dark:!bg-[#121212] rounded-2xl shadow-2xl p-16 flex flex-col justify-center items-center text-center relative border border-[#1c1b1b] dark:border-[#1c1b1b]">
   <div className="absolute top-8 right-8 flex items-center gap-3 text-slate-500 dark:text-[#71717a]">
   {topics.find(t => t.id === selectedTopic)?.icon && (() => {
    const Icon = topics.find(t => t.id === selectedTopic)!.icon;
    return <Icon className="w-8 h-8" />;
   })()}
   <span className="font-bold tracking-widest uppercase text-sm">{topics.find(t => t.id === selectedTopic)?.label}</span>
   </div>

   <h1 className="text-6xl font-bold mb-12 text-blue-400 leading-tight">
   {slides[currentSlide].title || 'Untitled Slide'}
   </h1>
   <p className="text-3xl text-slate-300 max-w-4xl leading-relaxed">
   {slides[currentSlide].content || 'No content added.'}
   </p>
  </div>

  <div className="mt-12 flex gap-4">
   <button 
   disabled={currentSlide === 0}
   onClick={() => setCurrentSlide(c => c - 1)}
   className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold transition-colors text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
   >
   Previous
   </button>
   <div className="px-6 py-3 font-bold text-slate-400">
   Slide {currentSlide + 1} of {slides.length}
   </div>
   <button 
   disabled={currentSlide === slides.length - 1}
   onClick={() => setCurrentSlide(c => c + 1)}
   className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold transition-colors text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
   >
   Next
   </button>
  </div>
  </div>
 );
 }

 return (
 <div className="flex flex-col h-screen font-sans bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Unit 1: Group Presentations" subtitle={selectedTopic ? `Presenting: ${topics.find(t => t.id === selectedTopic)?.label}` : undefined} />
  <div className="flex-1 px-8 pb-8 flex flex-col lg:overflow-y-auto">
  

  <div className="flex justify-between items-end mb-6">
   <div>
   <p className="text-slate-600 dark:text-[#a1a1aa]">Select a hardware topic and prepare your slides.</p>
   </div>
   
   <button 
   onClick={() => {
    if (selectedTopic) {
    setCurrentSlide(0);
    setIsPlaying(true);
    }
   }}
   disabled={!selectedTopic}
   className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
   >
   <Play className="w-5 h-5" fill="currentColor" />
   Present
   </button>
  </div>

  <div className="flex gap-8 flex-1 h-[600px]">
   {/* Sidebar */}
   <div className="w-64 flex flex-col gap-6">
   <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5">
    <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mb-3 text-sm tracking-wider uppercase">1. Select Topic</h3>
    <div className="flex flex-col gap-2">
    {topics.map(topic => {
     const Icon = topic.icon;
     return (
     <button
      key={topic.id}
      onClick={() => setSelectedTopic(topic.id)}
      className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left font-bold text-sm transition-colors ${ selectedTopic === topic.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 dark:border-[#1c1b1b] hover:border-slate-300 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff]' }`}
     >
      <Icon className={`w-5 h-5 ${topic.color}`} />
      {topic.label}
     </button>
     );
    })}
    </div>
   </div>

   <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-1 flex flex-col overflow-hidden">
    <div className="flex justify-between items-center mb-4">
    <h3 className="font-bold text-slate-700 dark:text-[#ffffff] text-sm tracking-wider uppercase">2. Slides</h3>
    <button onClick={addSlide} className="text-blue-600 hover:text-blue-700" title="Add Slide">
     <PlusCircle className="w-5 h-5" />
    </button>
    </div>
    <div className="flex flex-col gap-3 lg:overflow-y-auto pr-2 pb-2 flex-1">
    {slides.map((slide, idx) => (
     <button
     key={idx}
     onClick={() => setCurrentSlide(idx)}
     className={`aspect-video rounded-lg border-2 flex items-center justify-center p-4 text-center transition-colors shadow-sm relative overflow-hidden ${ currentSlide === idx ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] hover:border-blue-300' }`}
     >
     <div className="text-xs font-bold text-slate-600 dark:text-[#a1a1aa] line-clamp-3">
      {slide.title || `Slide ${idx + 1}`}
     </div>
     <div className="absolute top-2 left-2 w-5 h-5 bg-[#121212] dark:bg-[#121212] text-white rounded-full text-[10px] flex items-center justify-center font-bold">
      {idx + 1}
     </div>
     </button>
    ))}
    </div>
   </div>
   </div>

   {/* Editor Area */}
   <div className="flex-1 bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col">
   <div className="border-b border-slate-200 dark:border-[#1c1b1b] p-4 flex gap-4 bg-slate-50 dark:bg-[#121212] rounded-t-xl">
    <button onClick={() => setActiveFormat('text')} className={`flex flex-col items-center gap-1 p-2 rounded w-16 transition-colors ${activeFormat === 'text' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/50' : 'text-slate-500 dark:text-[#a1a1aa] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-[#121212]'}`}>
    <Type className="w-5 h-5" />
    <span className="text-[10px] font-bold">Text</span>
    </button>
    <button onClick={() => alert("Image format simulation not available in this demo.")} className="flex flex-col items-center gap-1 p-2 rounded w-16 transition-colors text-slate-500 dark:text-[#71717a] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-neutral-800 dark:bg-teal-950/20 dark:border-teal-900">
    <ImageIcon className="w-5 h-5" />
    <span className="text-[10px] font-bold">Image</span>
    </button>
    <button onClick={() => alert("Layout formatting not available in this demo.")} className="flex flex-col items-center gap-1 p-2 rounded w-16 transition-colors text-slate-500 dark:text-[#71717a] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-neutral-800 dark:bg-teal-950/20 dark:border-teal-900">
    <Presentation className="w-5 h-5" />
    <span className="text-[10px] font-bold">Layout</span>
    </button>
   </div>

   <div className="flex-1 p-12 bg-slate-100 dark:bg-[#121212]/50 flex flex-col lg:overflow-y-auto">
    {!selectedTopic ? (
    <div className="m-auto text-center p-12 text-slate-400">
     <Presentation className="w-24 h-24 mx-auto mb-6 opacity-20" />
     <p className="text-xl font-medium">Please select a hardware topic first.</p>
    </div>
    ) : (
    <div className="w-full max-w-3xl mx-auto aspect-video bg-slate-50 dark:bg-[#121212] shadow-lg border border-slate-200 dark:border-[#1c1b1b] p-12 flex flex-col justify-center">
     <input
     type="text"
     value={slides[currentSlide].title}
     onChange={(e) => updateSlide('title', e.target.value)}
     placeholder="Click to add title"
     className="text-4xl font-bold text-center mb-8 outline-none border-b-2 border-transparent hover:border-slate-200 dark:border-[#1c1b1b] focus:border-blue-500 bg-transparent transition-colors placeholder:text-slate-300"
     />
     <textarea
     value={slides[currentSlide].content}
     onChange={(e) => updateSlide('content', e.target.value)}
     placeholder="Click to add text"
     className="text-xl text-center flex-1 outline-none border-2 border-transparent hover:border-slate-200 dark:border-[#1c1b1b] focus:border-blue-500 rounded-xl p-4 bg-transparent transition-colors resize-none placeholder:text-slate-300"
     />
    </div>
    )}
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
