import { useState } from 'react';
import { Circle, Smile, Minus, Brush, Undo, Trash2 } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

type Shape = {
  id: string;
  type: 'head' | 'eye' | 'mouth' | 'eyebrow';
  x: number;
  y: number;
  scale?: number;
};

export default function LabC6Paint3DFace({ onExit }: LabProps) {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedTool, setSelectedTool] = useState<'head' | 'eye' | 'mouth' | 'eyebrow' | null>(null);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedTool) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setShapes([...shapes, {
      id: Date.now().toString(),
      type: selectedTool,
      x,
      y,
      scale: selectedTool === 'head' ? 1.5 : 1
    }]);

    setSelectedTool(null); // Auto-deselect after placing one
  };

  const undo = () => {
    setShapes(shapes.slice(0, -1));
  };

  const clear = () => {
    setShapes([]);
  };

  const tools = [
    { id: 'head', icon: Circle, label: '3D Sphere (Head)' },
    { id: 'eye', icon: Circle, label: 'Small Sphere (Eye)' },
    { id: 'eyebrow', icon: Minus, label: '4-Point Curve (Eyebrow)' },
    { id: 'mouth', icon: Smile, label: '5-Point Curve (Mouth)' }
  ] as const;

  const renderShape = (shape: Shape) => {
    switch (shape.type) {
      case 'head':
        return (
          <div 
            key={shape.id} 
            className="absolute rounded-full"
            style={{ 
              left: shape.x - 100, top: shape.y - 100, width: 200, height: 200,
              background: 'radial-gradient(circle at 30% 30%, #fde0c3, #e3a97a, #a66a3d)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }} 
          />
        );
      case 'eye':
        return (
          <div 
            key={shape.id} 
            className="absolute rounded-full"
            style={{ 
              left: shape.x - 15, top: shape.y - 15, width: 30, height: 30,
              background: 'radial-gradient(circle at 30% 30%, #fff, #ddd, #333)',
              boxShadow: 'inset -2px -2px 10px rgba(0,0,0,0.5)'
            }} 
          />
        );
      case 'eyebrow':
        return (
          <svg key={shape.id} className="absolute overflow-visible" style={{ left: shape.x - 25, top: shape.y - 10, width: 50, height: 20 }}>
            {/* Mock 4-point bezier curve */}
            <path d="M 0 10 C 15 -5, 35 -5, 50 10" fill="transparent" stroke="#4a3018" strokeWidth="6" strokeLinecap="round" />
            {/* Control points visualization */}
            <circle cx="0" cy="10" r="2" fill="blue" />
            <circle cx="15" cy="-5" r="2" fill="blue" />
            <circle cx="35" cy="-5" r="2" fill="blue" />
            <circle cx="50" cy="10" r="2" fill="blue" />
          </svg>
        );
      case 'mouth':
        return (
          <svg key={shape.id} className="absolute overflow-visible" style={{ left: shape.x - 40, top: shape.y - 20, width: 80, height: 40 }}>
            {/* Mock 5-point curve (path with multiple segments) */}
            <path d="M 0 10 Q 20 40, 40 40 T 80 10" fill="transparent" stroke="#b04040" strokeWidth="8" strokeLinecap="round" />
            <circle cx="0" cy="10" r="2" fill="green" />
            <circle cx="20" cy="40" r="2" fill="green" />
            <circle cx="40" cy="40" r="2" fill="green" />
            <circle cx="60" cy="40" r="2" fill="green" />
            <circle cx="80" cy="10" r="2" fill="green" />
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Paint 3D Face Design" />
      <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto">
        

        <p className="text-slate-600 dark:text-slate-300 mb-8">Select a 3D or Curve tool from the toolbar and click on the canvas to place it to design a face.</p>

        <div className="flex gap-6 flex-1 h-[600px]">
          {/* Toolbar */}
          <div className="w-64 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-4 flex flex-col gap-6">
            <div>
              <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider mb-3">3D Tools</h3>
              <div className="flex flex-col gap-2">
                {tools.map(tool => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left font-bold text-sm transition-colors ${
                        selectedTool === tool.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 dark:border-slate-700 dark:border-slate-500 hover:border-slate-300 dark:border-slate-700 dark:border-slate-500 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tool.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-auto flex gap-2">
              <button 
                onClick={undo}
                disabled={shapes.length === 0}
                className="flex-1 flex flex-col items-center justify-center p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 dark:border-slate-500 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-900 disabled:opacity-50"
              >
                <Undo className="w-5 h-5 mb-1" />
                <span className="text-xs font-bold">Undo</span>
              </button>
              <button 
                onClick={clear}
                disabled={shapes.length === 0}
                className="flex-1 flex flex-col items-center justify-center p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 dark:border-slate-500 text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5 mb-1" />
                <span className="text-xs font-bold">Clear</span>
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div 
            onClick={handleCanvasClick}
            className={`flex-1 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-inner border-2 border-slate-200 dark:border-slate-700 dark:border-slate-500 relative overflow-hidden ${selectedTool ? 'cursor-crosshair border-blue-400' : 'cursor-default'}`}
            style={{ 
              backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          >
            {shapes.length === 0 && !selectedTool && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-slate-400 flex flex-col items-center gap-4 bg-slate-50 dark:bg-slate-900/80 p-8 rounded-2xl">
                  <Brush className="w-12 h-12" />
                  <p className="font-bold">Select a tool to start drawing</p>
                </div>
              </div>
            )}
            
            {shapes.map(renderShape)}
          </div>
        </div>
      </div>
    </div>
  );
}
