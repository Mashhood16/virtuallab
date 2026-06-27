import { useState } from 'react';

import { Square, Circle, Triangle, Play, MousePointer2 } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC7PowerPointGeometry({ onExit }: LabProps) {
  const [shapes, setShapes] = useState<{id: string, type: string, x: number, y: number, anim: string}[]>([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [transition, setTransition] = useState('none');
  const [isPlaying, setIsPlaying] = useState(false);

  const addShape = (type: string) => {
    setShapes([...shapes, { id: Math.random().toString(), type, x: 100 + Math.random() * 200, y: 100 + Math.random() * 100, anim: 'none' }]);
  };

  const setAnimation = (anim: string) => {
    if (selectedShape) {
      setShapes(shapes.map(s => s.id === selectedShape ? { ...s, anim } : s));
    }
  };

  const handlePlay = () => {
    if (shapes.length === 0) return;
    setIsPlaying(true);
  };

  const handleExitPlay = () => {
    setIsPlaying(false);
  };

  if (isPlaying) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center" onClick={handleExitPlay}>
        <div className="w-full max-w-5xl aspect-[16/9] bg-white relative overflow-hidden shadow-2xl">
          {shapes.map(shape => {
            let animStyle = '';
            if (shape.anim === 'spin') animStyle = 'animate-spin';
            if (shape.anim === 'pulse') animStyle = 'animate-pulse';
            if (shape.anim === 'bounce') animStyle = 'animate-bounce';
            return (
              <div key={shape.id} className={`absolute ${animStyle}`} style={{ left: shape.x, top: shape.y }}>
                {shape.type === 'square' && <div className="w-24 h-24 bg-blue-600" />}
                {shape.type === 'circle' && <div className="w-24 h-24 bg-rose-600 rounded-full" />}
                {shape.type === 'triangle' && (
                  <div className="w-0 h-0 border-l-[48px] border-l-transparent border-r-[48px] border-r-transparent border-b-[84px] border-b-emerald-600" />
                )}
                {shape.type === 'parallelogram' && <div className="w-32 h-20 bg-purple-600 skew-x-[-20deg]" />}
              </div>
            );
          })}
        </div>
        <div className="absolute top-8 right-8 text-white/50 text-sm">Click anywhere to exit</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Geometry Presentation" />
      <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto">

        <p className="text-slate-600 dark:text-slate-300 mb-6">Insert geometrical figures onto the slide, apply animations to them, and set a slide transition.</p>

        {/* Ribbon Toolbar */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-t-xl border border-slate-300 dark:border-slate-700 dark:border-slate-500 p-2 flex gap-6 w-full max-w-4xl mx-auto shadow-sm">
          {/* Insert Shapes */}
          <div className="flex flex-col border-r border-slate-200 dark:border-slate-700 dark:border-slate-500 pr-6">
            <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Insert Shapes</span>
            <div className="flex gap-2">
              <button onClick={() => addShape('square')} className="p-2 hover:bg-slate-100 dark:bg-slate-800 rounded border border-transparent hover:border-slate-300 dark:border-slate-700 dark:border-slate-500"><Square className="w-5 h-5 text-blue-600" fill="currentColor"/></button>
              <button onClick={() => addShape('circle')} className="p-2 hover:bg-slate-100 dark:bg-slate-800 rounded border border-transparent hover:border-slate-300 dark:border-slate-700 dark:border-slate-500"><Circle className="w-5 h-5 text-rose-600" fill="currentColor"/></button>
              <button onClick={() => addShape('triangle')} className="p-2 hover:bg-slate-100 dark:bg-slate-800 rounded border border-transparent hover:border-slate-300 dark:border-slate-700 dark:border-slate-500"><Triangle className="w-5 h-5 text-emerald-600" fill="currentColor"/></button>
              <button onClick={() => addShape('parallelogram')} className="p-2 hover:bg-slate-100 dark:bg-slate-800 rounded border border-transparent hover:border-slate-300 dark:border-slate-700 dark:border-slate-500">
                <div className="w-5 h-5 bg-purple-600 skew-x-[-20deg]" />
              </button>
            </div>
          </div>

          {/* Transitions */}
          <div className="flex flex-col border-r border-slate-200 dark:border-slate-700 dark:border-slate-500 pr-6">
            <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Slide Transition</span>
            <select value={transition} onChange={e => setTransition(e.target.value)} className="p-1 text-sm border border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded outline-none">
              <option value="none">None</option>
              <option value="fade">Fade</option>
              <option value="slide">Slide</option>
            </select>
          </div>

          {/* Animations (Requires Selection) */}
          <div className="flex flex-col pr-6">
            <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Object Animation</span>
            <select 
              disabled={!selectedShape} 
              onChange={e => setAnimation(e.target.value)} 
              value={selectedShape ? shapes.find(s=>s.id === selectedShape)?.anim : 'none'}
              className="p-1 text-sm border border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded outline-none disabled:opacity-50"
            >
              <option value="none">None</option>
              <option value="spin">Spin</option>
              <option value="pulse">Pulse</option>
              <option value="bounce">Bounce</option>
            </select>
          </div>

          <button 
            onClick={handlePlay}
            className="ml-auto bg-orange-500 hover:bg-orange-600 text-white px-6 rounded-lg font-bold flex items-center transition-colors"
          >
            <Play className="w-4 h-4 mr-2" />
            Slide Show
          </button>
        </div>

        {/* Slide Canvas */}
        <div className="w-full max-w-4xl mx-auto flex-1 flex items-center justify-center relative p-8">
          <div className="w-full aspect-[16/9] bg-slate-50 dark:bg-slate-900 shadow-2xl border-4 border-slate-200 dark:border-slate-700 dark:border-slate-500 relative overflow-hidden">
            
            {/* Shapes */}
            {shapes.map(shape => {
              const isSelected = selectedShape === shape.id;
              
              let animClass = '';
              if (isPlaying && shape.anim === 'spin') animClass = 'animate-spin';
              if (isPlaying && shape.anim === 'pulse') animClass = 'animate-pulse';
              if (isPlaying && shape.anim === 'bounce') animClass = 'animate-bounce';

              return (
                <div 
                  key={shape.id}
                  onClick={() => setSelectedShape(shape.id)}
                  className={`absolute cursor-pointer transition-all ${isSelected && !isPlaying ? 'ring-4 ring-blue-400 ring-offset-4' : ''} ${animClass}`}
                  style={{ left: shape.x, top: shape.y }}
                >
                  {shape.type === 'square' && <div className="w-24 h-24 bg-blue-600" />}
                  {shape.type === 'circle' && <div className="w-24 h-24 bg-rose-600 rounded-full" />}
                  {shape.type === 'triangle' && (
                    <div className="w-0 h-0 border-l-[48px] border-l-transparent border-r-[48px] border-r-transparent border-b-[84px] border-b-emerald-600" />
                  )}
                  {shape.type === 'parallelogram' && <div className="w-32 h-20 bg-purple-600 skew-x-[-20deg]" />}
                </div>
              )
            })}

            {shapes.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                <MousePointer2 className="w-12 h-12 mb-4" />
                <p className="text-xl font-medium">Use toolbar to insert geometry</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
