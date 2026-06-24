import { useState } from 'react';
import { ArrowLeft, Play, Image as ImageIcon } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC7Cybercrime({ onExit }: LabProps) {
  const [slides, setSlides] = useState([
    { title: '', movie: '', content: '' }
  ]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const movies = [
    { id: 'wargames', name: 'WarGames (1983) - Hacking & Security', img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400' },
    { id: 'social', name: 'The Social Dilemma - Data & Privacy', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400' },
    { id: 'catch', name: 'Catch Me If You Can - Identity Theft', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=400' }
  ];

  const addSlide = () => {
    setSlides([...slides, { title: '', movie: '', content: '' }]);
    setActiveSlide(slides.length);
  };

  const updateSlide = (field: string, value: string) => {
    const newSlides = [...slides];
    newSlides[activeSlide] = { ...newSlides[activeSlide], [field]: value };
    setSlides(newSlides);
  };

  if (isPlaying) {
    const current = slides[activeSlide];
    const movieData = movies.find(m => m.id === current.movie);

    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center font-sans text-white" onClick={() => setIsPlaying(false)}>
        <div className="max-w-6xl w-full h-[80vh] flex flex-col items-center justify-center relative px-12">
          {movieData && (
            <img src={movieData.img} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm" />
          )}
          <div className="relative z-10 text-center w-full">
            <h1 className="text-6xl font-black mb-12 drop-shadow-lg">{current.title || 'Untitled Slide'}</h1>
            {movieData && (
              <div className="mb-12 inline-block bg-slate-50/10 p-6 rounded-2xl backdrop-blur-md border border-white/20">
                <img src={movieData.img} alt={movieData.name} className="w-96 aspect-video object-cover rounded-lg shadow-2xl mb-4" />
                <p className="text-2xl font-bold">{movieData.name}</p>
              </div>
            )}
            <p className="text-3xl leading-relaxed max-w-4xl mx-auto drop-shadow-md">{current.content || 'No content added.'}</p>
          </div>
          
          <div className="absolute bottom-10 left-0 right-0 flex justify-between px-12 z-20">
            <button 
              onClick={(e) => { e.stopPropagation(); if(activeSlide > 0) setActiveSlide(activeSlide - 1); }}
              className={`text-white/50 hover:text-white ${activeSlide === 0 ? 'invisible' : ''}`}
            >
              &larr; Previous
            </button>
            <span className="text-white/50">Slide {activeSlide + 1} of {slides.length}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); if(activeSlide < slides.length - 1) setActiveSlide(activeSlide + 1); else setIsPlaying(false); }}
              className="text-white/50 hover:text-white"
            >
              {activeSlide < slides.length - 1 ? 'Next &rarr;' : 'End Show'}
            </button>
          </div>
          <div className="absolute top-10 right-10 text-white/30 text-sm">Click anywhere to exit</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen font-sans bg-slate-100 text-slate-800">
      <div className="flex-1 p-8 flex flex-col overflow-y-auto">
        <button onClick={onExit} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors w-fit">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-2">Cybercrime Presentation</h1>
        <p className="text-slate-600 mb-8">Prepare a presentation based on a movie or story about cybercrime.</p>

        <div className="flex gap-8 max-w-6xl w-full h-[600px]">
          {/* Slides List */}
          <div className="w-64 bg-slate-50 rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-700 flex justify-between items-center">
              Slides
              <button onClick={addSlide} className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 font-black text-xl">+</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {slides.map((s, i) => (
                <div 
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`aspect-video rounded-lg border-2 flex items-center justify-center p-2 text-center text-xs font-bold cursor-pointer transition-colors ${activeSlide === i ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
                >
                  {s.title || `Slide ${i+1}`}
                </div>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 bg-slate-50 rounded-xl shadow-lg border border-slate-200 flex flex-col overflow-hidden">
            <LabHeader onExit={onExit} title="Lab" />

            <div className="flex-1 p-12 overflow-y-auto flex flex-col gap-6 max-w-3xl mx-auto w-full">
              <input 
                type="text" 
                placeholder="Click to add title..."
                className="w-full text-4xl font-bold outline-none border-b border-transparent hover:border-slate-200 focus:border-blue-500 pb-2 text-center"
                value={slides[activeSlide].title}
                onChange={(e) => updateSlide('title', e.target.value)}
              />

              <div className="mt-8 border-2 border-dashed border-slate-300 rounded-xl p-8 bg-slate-50">
                <h3 className="font-bold text-slate-600 mb-4 flex items-center justify-center"><ImageIcon className="w-5 h-5 mr-2"/> Select Movie Reference</h3>
                <div className="grid grid-cols-3 gap-4">
                  {movies.map(m => (
                    <div 
                      key={m.id}
                      onClick={() => updateSlide('movie', m.id)}
                      className={`cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${slides[activeSlide].movie === m.id ? 'border-blue-500 ring-2 ring-blue-200 scale-105 shadow-md' : 'border-transparent hover:border-slate-300'}`}
                    >
                      <img src={m.img} alt={m.name} className="w-full aspect-video object-cover" />
                      <div className="p-2 text-xs font-bold text-center bg-slate-50">{m.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <textarea 
                placeholder="Click to add summary points, ethical takeaways, or story details..."
                className="w-full flex-1 min-h-[150px] outline-none border-b border-transparent hover:border-slate-200 focus:border-blue-500 text-lg text-slate-600 resize-none mt-4 p-4"
                value={slides[activeSlide].content}
                onChange={(e) => updateSlide('content', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
