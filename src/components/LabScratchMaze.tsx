import { useState } from 'react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabScratchMaze({ onExit }: LabProps) {
 // Sprite grid coordinates (0 to 4 in X, 0 to 4 in Y)
 const [sprite, setSprite] = useState({ x: 0, y: 4, direction: 'right' }); 
 const [blocks, setBlocks] = useState<string[]>([]);
 const [isExecuting, setIsExecuting] = useState(false);
 const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'drowned'>('idle');

 // The maze grid:
 // (0,0) (1,0) (2,0) (3,0) (4,0) FINISH
 // (0,1) WATER WATER WATER (4,1)
 // (0,2) STONE WATER STONE (4,2)
 // (0,3) WATER WATER WATER (4,3)
 // (0,4) (1,4) (2,4) (3,4) (4,4) START

 // Water locations
 const waterTiles = [
 {x:1, y:1}, {x:2, y:1}, {x:3, y:1},
 {x:1, y:2}, {x:2, y:2}, {x:3, y:2}, // Note: 1,2 and 3,2 will be stones
 {x:1, y:3}, {x:2, y:3}, {x:3, y:3},
 ];

 const stoneTiles = [
 {x:1, y:2}, {x:3, y:2}
 ];

 const checkTile = (x: number, y: number) => {
 if (x === 4 && y === 0) return 'finish';
 if (stoneTiles.some(t => t.x === x && t.y === y)) return 'stone';
 if (waterTiles.some(t => t.x === x && t.y === y)) return 'water';
 if (x < 0 || x > 4 || y < 0 || y > 4) return 'wall';
 return 'ground';
 };

 const executeBlocks = async () => {
 setIsExecuting(true);
 setStatus('running');
 
 let curX = 0;
 let curY = 4;
 let dir = 'up'; // Start facing up
 
 setSprite({ x: curX, y: curY, direction: dir });

 for (const block of blocks) {
  await new Promise(r => setTimeout(r, 600)); // Delay between steps
  
  if (block === 'TURN_RIGHT') {
  dir = dir === 'up' ? 'right' : dir === 'right' ? 'down' : dir === 'down' ? 'left' : 'up';
  } else if (block === 'TURN_LEFT') {
  dir = dir === 'up' ? 'left' : dir === 'left' ? 'down' : dir === 'down' ? 'right' : 'up';
  } else if (block === 'MOVE_FORWARD' || block === 'JUMP') {
  // Jump moves 2 spaces, Move moves 1
  const dist = block === 'JUMP' ? 2 : 1;
  if (dir === 'up') curY -= dist;
  if (dir === 'down') curY += dist;
  if (dir === 'left') curX -= dist;
  if (dir === 'right') curX += dist;
  }

  setSprite({ x: curX, y: curY, direction: dir });

  const tile = checkTile(curX, curY);
  if (tile === 'water' || tile === 'wall') {
  setStatus('drowned');
  setIsExecuting(false);
  return;
  }
  if (tile === 'finish') {
  setStatus('success');
  setIsExecuting(false);
  return;
  }
 }
 
 // If blocks end and not at finish
 setStatus('idle');
 setIsExecuting(false);
 };

 const reset = () => {
 setSprite({ x: 0, y: 4, direction: 'up' });
 setStatus('idle');
 };

 return (
 <div className="w-full h-screen bg-slate-100 dark:!bg-[#000000] flex flex-col font-sans">
  <LabHeader onExit={onExit} title="Act 4.1: Scratch Maze Navigation" variant="amber" />

  <div className="flex-1 flex lg:overflow-hidden">
  
  {/* Left Panel: Block Palette */}
  <div className="w-80 bg-slate-200 dark:bg-[#121212] border-r border-slate-300 dark:border-[#1c1b1b] flex flex-col p-4 z-10 lg:overflow-y-auto">
   <h3 className="text-xs font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-widest mb-4">Motion Blocks</h3>
   
   <div className="flex flex-col gap-2">
    <button 
    onClick={() => setBlocks([...blocks, 'MOVE_FORWARD'])}
    disabled={isExecuting}
    className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-3 rounded-lg text-left shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
    <div className="w-4 h-4 bg-slate-50 dark:bg-[#121212]/30 rounded-full"></div>
    Move Forward 1 Step
    </button>
    <button 
    onClick={() => setBlocks([...blocks, 'JUMP'])}
    disabled={isExecuting}
    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold p-3 rounded-lg text-left shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
    <div className="w-4 h-4 bg-slate-50 dark:bg-[#121212]/30 rounded-full"></div>
    Jump Forward 2 Steps
    </button>
    <button 
    onClick={() => setBlocks([...blocks, 'TURN_RIGHT'])}
    disabled={isExecuting}
    className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-3 rounded-lg text-left shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
    Turn Right 90°
    </button>
    <button 
    onClick={() => setBlocks([...blocks, 'TURN_LEFT'])}
    disabled={isExecuting}
    className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-3 rounded-lg text-left shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
    <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
    Turn Left 90°
    </button>
   </div>
  </div>

  {/* Center Panel: Code Area */}
  <div className="flex-1 bg-slate-50 dark:bg-[#121212] flex flex-col relative border-r border-slate-300 dark:border-[#1c1b1b]">
   
   <div className="h-12 bg-slate-100 dark:bg-[#121212] flex items-center px-4 justify-between border-b border-slate-200 dark:border-[#1c1b1b]">
    <span className="text-slate-600 dark:text-[#a1a1aa] font-bold flex items-center gap-2">
    <div className="w-3 h-3 bg-green-500 rounded-full dark:bg-[#121212] dark:border-[#1c1b1b]"></div>
    When Flag Clicked
    </span>
    <button onClick={() => {setBlocks([]); reset();}} disabled={isExecuting} className="text-sm text-slate-500 dark:text-[#71717a] hover:text-red-500 disabled:opacity-50">Clear Script</button>
   </div>

   <div className="flex-1 px-8 pb-8 lg:overflow-y-auto flex flex-col items-start bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]">
    
    <div className="bg-yellow-400 text-yellow-900 font-bold px-6 py-3 rounded-t-xl rounded-br-xl shadow-md mb-1 relative z-10 dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-yellow-500/40">
    when 🟢 clicked
    </div>

    {blocks.map((block, i) => (
    <div 
     key={i} 
     className={`font-bold px-6 py-3 shadow-md mb-1 relative w-64 -mt-1 rounded-r-xl rounded-bl-xl border-t border-white/30 ${block === 'JUMP' ? 'bg-indigo-500 text-white' : 'bg-blue-500 text-white'}`}
    >
     {block === 'MOVE_FORWARD' && 'move 1 step'}
     {block === 'JUMP' && 'jump 2 steps'}
     {block === 'TURN_RIGHT' && 'turn ↻ 90 degrees'}
     {block === 'TURN_LEFT' && 'turn ↺ 90 degrees'}
     
     <button 
     onClick={() => setBlocks(blocks.filter((_, index) => index !== i))}
     disabled={isExecuting}
     className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
     >✕</button>
    </div>
    ))}

    <button 
    onClick={executeBlocks}
    disabled={isExecuting || blocks.length === 0}
    className="mt-8 px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 text-white font-bold rounded-full shadow-lg transition-transform active:scale-95 text-lg flex items-center gap-2 dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"
    >
    <div className="w-4 h-4 bg-slate-50 dark:bg-[#121212] rounded-full"></div>
    Run Program
    </button>
   </div>

  </div>

  {/* Right Panel: The Stage */}
  <div className="w-[500px] bg-slate-50 dark:bg-[#121212] flex flex-col z-10">
   
   <div className="h-12 bg-slate-200 dark:bg-[#121212] flex items-center px-4 justify-between border-b border-slate-300 dark:border-[#1c1b1b]">
    <span className="text-slate-600 dark:text-[#a1a1aa] font-bold">Stage</span>
    <button onClick={reset} disabled={isExecuting} className="text-sm text-slate-500 dark:text-[#71717a] hover:text-blue-500">Reset Sprite</button>
   </div>

   <div className="flex-1 p-4 flex items-center justify-center">
    
    {/* The Grid Map 5x5 */}
    <div className="w-[400px] h-[400px] bg-green-100 border-4 border-green-300 rounded-xl relative overflow-hidden shadow-inner grid grid-cols-5 grid-rows-5">
     
     {/* Render Grid Tiles */}
     {[...Array(25)].map((_, i) => {
     const x = i % 5;
     const y = Math.floor(i / 5);
     const tile = checkTile(x, y);
     
     return (
      <div key={i} className={`border border-green-200/50 flex items-center justify-center relative ${tile === 'water' ? 'bg-blue-400' : ''} ${tile === 'finish' ? 'bg-yellow-300' : ''}`}>
      {tile === 'stone' && <div className="w-12 h-12 bg-slate-400 dark:bg-[#121212] rounded-full border-b-4 border-slate-500 dark:border-[#1c1b1b]"></div>}
      {tile === 'water' && <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/water.png')] opacity-50 mix-blend-overlay"></div>}
      {x === 0 && y === 4 && <div className="text-green-800 font-bold text-xs uppercase opacity-50 dark:text-[#ffffff]">START</div>}
      {x === 4 && y === 0 && <div className="text-yellow-800 font-bold text-xs uppercase">FINISH</div>}
      </div>
     );
     })}

     {/* The Sprite (Cat) */}
     <div 
     className="absolute w-[80px] h-[80px] transition-all duration-500 ease-in-out flex items-center justify-center z-20"
     style={{ 
      left: `${sprite.x * 80}px`, 
      top: `${sprite.y * 80}px` 
     }}
     >
     <div 
      className="w-10 h-10 bg-orange-500 rounded-full border-2 border-orange-700 shadow-md relative"
      style={{
      transform: `rotate(${sprite.direction === 'up' ? 0 : sprite.direction === 'right' ? 90 : sprite.direction === 'down' ? 180 : -90}deg)`
      }}
     >
      {/* Cat ears */}
      <div className="absolute -top-2 left-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-orange-500"></div>
      <div className="absolute -top-2 right-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-orange-500"></div>
      {/* Cat eyes */}
      <div className="absolute top-2 left-2 w-2 h-2 bg-slate-50 dark:bg-[#121212] rounded-full"><div className="w-1 h-1 bg-black rounded-full mt-0.5 ml-0.5"></div></div>
      <div className="absolute top-2 right-2 w-2 h-2 bg-slate-50 dark:bg-[#121212] rounded-full"><div className="w-1 h-1 bg-black rounded-full mt-0.5 ml-0.5"></div></div>
     </div>
     </div>

    </div>

   </div>

   {/* Status Overlay */}
   {status === 'success' && (
    <div className="m-4 bg-green-100 border border-green-400 p-4 rounded-xl text-center animate-fade-in">
    <h3 className="font-bold text-green-800 text-xl dark:text-[#ffffff]">Level Complete!</h3>
    <p className="text-green-600 text-sm">The sprite successfully navigated the maze.</p>
    </div>
   )}
   {status === 'drowned' && (
    <div className="m-4 bg-red-100 border border-red-400 p-4 rounded-xl text-center animate-fade-in">
    <h3 className="font-bold text-red-800 text-xl">Oh no!</h3>
    <p className="text-red-600 text-sm">The sprite fell into the water or hit a wall. Reset and try again.</p>
    </div>
   )}

  </div>

  </div>
 </div>
 );
}
