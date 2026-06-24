import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC7BouncingBall({ onExit }: LabProps) {
  const [blocks, setBlocks] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [ballX, setBallX] = useState(50);
  const [ballY, setBallY] = useState(50);
  const [dirX, setDirX] = useState(1);
  const [dirY, setDirY] = useState(1);

  const availableBlocks = [
    { id: 'forever', name: 'forever', type: 'loop' },
    { id: 'move', name: 'move 10 steps', type: 'motion' },
    { id: 'bounce', name: 'if on edge, bounce', type: 'motion' },
    { id: 'turn', name: 'turn 15 degrees', type: 'motion' }
  ];

  const handleAddBlock = (id: string) => {
    if (!blocks.includes(id)) {
      setBlocks([...blocks, id]);
    }
  };

  const handleRemoveBlock = (id: string) => {
    setBlocks(blocks.filter(b => b !== id));
  };

  // Check if correct configuration: forever containing move and bounce
  const isCorrect = blocks.includes('forever') && blocks.includes('move') && blocks.includes('bounce') && !blocks.includes('turn');

  useEffect(() => {
    if (isCorrect) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      setBallX(50);
      setBallY(50);
    }
  }, [isCorrect]);

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setBallX(x => {
          let nx = x + dirX * 2;
          if (nx >= 90) setDirX(-1);
          if (nx <= 0) setDirX(1);
          return nx;
        });
        setBallY(y => {
          let ny = y + dirY * 2;
          if (ny >= 90) setDirY(-1);
          if (ny <= 0) setDirY(1);
          return ny;
        });
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isPlaying, dirX, dirY]);

  return (
    <div className="flex h-screen font-sans bg-slate-50 text-slate-800">
      <div className="flex-1 p-8 flex flex-col overflow-y-auto">
        <LabHeader onExit={onExit} title="Bouncing Ball Project" />

        <h1 className="text-3xl font-bold mb-2">Bouncing Ball Project</h1>
        <p className="text-slate-600 mb-8">Assemble the correct Scratch blocks to make the ball continuously bounce off the stage edges.</p>

        {isCorrect && (
          <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl mb-6 flex items-center border border-emerald-300 shadow-sm w-fit">
            <CheckCircle className="w-6 h-6 mr-3" />
            <span className="font-bold">Correct Code!</span> The ball is now bouncing forever.
          </div>
        )}

        <div className="flex gap-8 max-w-5xl mx-auto w-full">
          {/* Block Palette */}
          <div className="w-72 bg-slate-50 p-6 rounded-xl shadow border border-slate-200">
            <h2 className="font-bold text-slate-700 mb-4 uppercase tracking-wider text-sm">Palette</h2>
            <div className="flex flex-col gap-3">
              {availableBlocks.map(block => (
                <button
                  key={block.id}
                  onClick={() => handleAddBlock(block.id)}
                  className={`p-3 text-left font-bold text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity ${block.type === 'loop' ? 'bg-orange-500' : 'bg-blue-500'}`}
                >
                  {block.name}
                </button>
              ))}
            </div>
          </div>

          {/* Workspace */}
          <div className="w-80 bg-slate-100 p-6 rounded-xl shadow-inner border-2 border-slate-200 relative">
             <h2 className="font-bold text-slate-700 mb-4 uppercase tracking-wider text-sm">Script</h2>
             
             <div className="flex items-center text-yellow-600 font-bold mb-2 bg-yellow-100 px-3 py-2 rounded-t-lg w-fit shadow-sm">
                When 🏁 clicked
             </div>

             {blocks.includes('forever') ? (
               <div className="bg-orange-500 text-white p-4 rounded-lg rounded-tl-none font-bold shadow-sm relative cursor-pointer" onClick={() => handleRemoveBlock('forever')}>
                 <span className="mb-2 block text-sm">forever</span>
                 <div className="bg-orange-400 p-4 rounded min-h-[100px] flex flex-col gap-2">
                    {blocks.filter(b => b !== 'forever').map(b => (
                      <div key={b} onClick={(e) => { e.stopPropagation(); handleRemoveBlock(b); }} className="bg-blue-500 text-white p-2 rounded text-sm shadow-sm hover:bg-blue-600 cursor-pointer">
                        {availableBlocks.find(x => x.id === b)?.name}
                      </div>
                    ))}
                    {blocks.length === 1 && (
                      <div className="border-2 border-dashed border-orange-300 p-4 rounded text-orange-200 text-sm text-center">Add motion blocks inside</div>
                    )}
                 </div>
               </div>
             ) : (
               <div className="bg-slate-50 border-2 border-dashed border-slate-300 p-6 rounded min-h-[150px] text-slate-400 text-sm text-center flex items-center justify-center">
                 Click blocks from palette to add them to your script.
                 {blocks.length > 0 && <br/>}
                 {blocks.filter(b => b !== 'forever').map(b => (
                   <div key={b} onClick={(e) => { e.stopPropagation(); handleRemoveBlock(b); }} className="mt-2 bg-blue-500 text-white p-2 rounded text-sm shadow-sm hover:bg-blue-600 cursor-pointer text-left w-fit mx-auto">
                     {availableBlocks.find(x => x.id === b)?.name}
                   </div>
                 ))}
               </div>
             )}
          </div>

          {/* Stage */}
          <div className="flex-1 bg-slate-50 p-4 rounded-xl shadow-xl border-4 border-slate-300 relative flex items-center justify-center">
            <div className="w-full h-full border-2 border-slate-100 relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] overflow-hidden">
               <div 
                 className="absolute w-12 h-12 rounded-full bg-rose-500 shadow-lg border-2 border-white"
                 style={{
                   left: `${ballX}%`,
                   top: `${ballY}%`,
                   transition: isPlaying ? 'left 30ms linear, top 30ms linear' : 'none'
                 }}
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
