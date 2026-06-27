import { useState } from 'react';
import { Image as ImageIcon, BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC7IllustratedStory({ onExit }: LabProps) {
  const [story, setStory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [showGallery, setShowGallery] = useState(false);

  const gallery = [
    { id: '1', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400', alt: 'Forest' },
    { id: '2', url: 'https://images.unsplash.com/photo-1506744626753-1fa28f673fac?auto=format&fit=crop&q=80&w=400', alt: 'Mountains' },
    { id: '3', url: 'https://images.unsplash.com/photo-1519068737630-e5bf70cb606d?auto=format&fit=crop&q=80&w=400', alt: 'Lion' },
    { id: '4', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400', alt: 'Beach' }
  ];

  const handleInsertImage = (url: string) => {
    setImages(prev => [...prev, url]);
    setShowGallery(false);
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Illustrated Story Writing" />
      <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto">

        <p className="text-slate-600 dark:text-slate-300 mb-8">Write a short story and insert relevant pictures from the gallery to illustrate it.</p>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow border border-slate-300 dark:border-slate-700 dark:border-slate-500 flex flex-col flex-1 max-w-4xl mx-auto w-full overflow-hidden relative">
          
          {/* Toolbar */}
          <div className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 dark:border-slate-500 p-3 flex gap-4 items-center">
            <button 
              onClick={() => setShowGallery(!showGallery)}
              className="flex items-center px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 dark:border-slate-500 hover:bg-slate-50 dark:bg-slate-900 rounded text-sm font-medium transition-colors"
            >
              <ImageIcon className="w-4 h-4 mr-2 text-rose-500" />
              Insert Picture
            </button>
            <div className="ml-auto flex items-center text-slate-400 text-sm">
              <BookOpen className="w-4 h-4 mr-2" />
              Story Mode
            </div>
          </div>

          {/* Gallery Modal Overlay */}
          {showGallery && (
            <div className="absolute top-16 left-0 right-0 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 dark:border-slate-500 shadow-lg p-6 z-20 grid grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="col-span-4 flex justify-between items-center mb-2">
                <h3 className="font-bold text-slate-700 dark:text-slate-200">Select Image to Insert</h3>
                <button onClick={() => setShowGallery(false)} className="text-slate-400 hover:text-slate-800 dark:text-slate-100">Close</button>
              </div>
              {gallery.map(img => (
                <button 
                  key={img.id}
                  onClick={() => handleInsertImage(img.url)}
                  className="rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 hover:shadow-md transition-all aspect-video group relative"
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-medium text-sm">Insert</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Document Body */}
          <div className="flex-1 p-12 overflow-y-auto bg-slate-50 dark:bg-slate-900">
            <textarea
              className="w-full min-h-[200px] bg-transparent resize-none outline-none text-lg font-serif text-slate-800 dark:text-slate-100 leading-relaxed mb-8 placeholder:text-slate-300"
              placeholder="Once upon a time..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
            />
            
            <div className="flex flex-col gap-6 items-center">
              {images.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt="Story illustration" className="max-w-md rounded-xl shadow-md border-4 border-white" />
                  <button 
                    onClick={() => setImages(images.filter((_, index) => index !== i))}
                    className="absolute -top-3 -right-3 bg-slate-50 dark:bg-slate-900 text-rose-500 rounded-full p-1 shadow-md border border-slate-200 dark:border-slate-700 dark:border-slate-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold w-8 h-8 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            {images.length === 0 && story.length > 50 && (
              <div className="text-center text-slate-400 italic mt-12 animate-pulse">
                Click 'Insert Picture' to add an illustration to your story.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
