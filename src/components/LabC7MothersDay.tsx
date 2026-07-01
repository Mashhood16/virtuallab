import { useState } from 'react';
import { Save, Palette, Type, Image as ImageIcon } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabC7MothersDay({ onExit }: LabProps) {
 const [bgClass, setBgClass] = useState('bg-pink-100');
 const [message, setMessage] = useState('Happy Mother\'s Day!');
 const [image, setImage] = useState<string | null>(null);

 const backgrounds = ['bg-pink-100', 'bg-indigo-100', 'bg-rose-100', 'bg-amber-100', 'bg-sky-100'];
 const images = [
 '🌸', '💐', '❤️', '💝', '🦋', '👩‍👧‍👦'
 ];

 return (
 <div className="flex flex-col h-screen font-sans bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Mother's Day Card Competition" />
  <div className="flex-1 px-8 pb-8 flex flex-col lg:overflow-y-auto">

  <p className="text-slate-600 dark:text-[#a1a1aa] mb-8">Design a creative greeting card applying your digital art skills.</p>

  <div className="flex gap-8 max-w-5xl mx-auto w-full flex-1">
   {/* Toolbar */}
   <div className="w-80 bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-8">
   <div>
    <h3 className="font-bold text-sm uppercase tracking-wider mb-3 flex items-center text-slate-400"><Palette className="w-4 h-4 mr-2" /> Card Color</h3>
    <div className="flex gap-2">
    {backgrounds.map(bg => (
     <button 
     key={bg}
     onClick={() => setBgClass(bg)}
     className={`w-10 h-10 rounded-full border-4 shadow-inner ${bg} ${bgClass === bg ? 'border-[#1c1b1b] dark:border-slate-500' : 'border-transparent'}`}
     />
    ))}
    </div>
   </div>

   <div>
    <h3 className="font-bold text-sm uppercase tracking-wider mb-3 flex items-center text-slate-400"><Type className="w-4 h-4 mr-2" /> Message</h3>
    <textarea 
    className="w-full h-24 border border-slate-300 dark:border-[#1c1b1b] rounded-lg p-3 outline-none focus:border-pink-500 resize-none font-serif"
    value={message}
    onChange={e => setMessage(e.target.value)}
    />
   </div>

   <div>
    <h3 className="font-bold text-sm uppercase tracking-wider mb-3 flex items-center text-slate-400"><ImageIcon className="w-4 h-4 mr-2" /> Sticker</h3>
    <div className="grid grid-cols-3 gap-2">
    {images.map(img => (
     <button 
     key={img}
     onClick={() => setImage(img)}
     className={`text-3xl bg-slate-50 dark:bg-[#121212] p-2 rounded-lg border hover:bg-slate-100 dark:bg-[#121212] transition-colors ${image === img ? 'border-pink-500 bg-pink-50' : 'border-slate-200 dark:border-[#1c1b1b]'}`}
     >
     {img}
     </button>
    ))}
    </div>
   </div>

   <div className="mt-auto pt-6 border-t border-slate-200 dark:border-[#1c1b1b]">
    <button className="w-full bg-rose-500 text-white font-bold py-3 rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors shadow-md dark:text-white dark:text-white dark:bg-rose-500 dark:hover:bg-rose-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-rose-500/40">
    <Save className="w-5 h-5 mr-2" /> Submit Design
    </button>
   </div>
   </div>

   {/* Canvas */}
   <div className="flex-1 flex items-center justify-center p-8 bg-slate-200 dark:bg-[#121212] rounded-xl shadow-inner border-2 border-slate-300 dark:border-[#1c1b1b]">
   {/* The Card */}
   <div className={`w-[400px] aspect-[3/4] shadow-2xl rounded-2xl border-8 border-white p-12 flex flex-col items-center justify-center relative overflow-hidden transition-colors ${bgClass}`}>
    
    {/* Decorative corners */}
    <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#1c1b1b] dark:border-[#1c1b1b]/20 rounded-tl-xl" />
    <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#1c1b1b] dark:border-[#1c1b1b]/20 rounded-tr-xl" />
    <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#1c1b1b] dark:border-[#1c1b1b]/20 rounded-bl-xl" />
    <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#1c1b1b] dark:border-[#1c1b1b]/20 rounded-br-xl" />

    {image && (
    <div className="text-8xl mb-8 drop-shadow-lg animate-in zoom-in">
     {image}
    </div>
    )}
    
    <h2 className="font-serif text-3xl text-center font-bold leading-snug drop-shadow-sm break-words w-full text-slate-800 dark:text-[#ffffff]">
    {message || "..."}
    </h2>
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
