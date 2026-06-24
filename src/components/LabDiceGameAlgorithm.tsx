import { useState, useEffect } from 'react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabDiceGameAlgorithm({ onExit }: LabProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [turn, setTurn] = useState(0); // Max 10 turns
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [logs, setLogs] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'p1' | 'p2'>('p1');
  const [currentDice, setCurrentDice] = useState<number | null>(null);

  // The logic is: Loop 10 times. Player 1 rolls. Add score. If 6, roll again. Player 2 rolls. Add score. If 6, roll again.

  useEffect(() => {
    let timer: number;
    if (isRunning && turn < 10) {
      timer = window.setTimeout(() => {
        const roll = Math.floor(Math.random() * 6) + 1;
        setCurrentDice(roll);
        
        setLogs(prev => [...prev, `Turn ${turn + 1}: Player ${currentPlayer === 'p1' ? '1' : '2'} rolls a ${roll}.`]);
        
        setScores(prev => ({
          ...prev,
          [currentPlayer]: prev[currentPlayer] + roll
        }));

        if (roll === 6) {
          setLogs(prev => [...prev, `> Player ${currentPlayer === 'p1' ? '1' : '2'} gets to roll again!`]);
          // keep same player, don't increment turn if p2 rolled (because turn increments after p2 finishes completely)
        } else {
          // switch player
          if (currentPlayer === 'p1') {
            setCurrentPlayer('p2');
          } else {
            setCurrentPlayer('p1');
            setTurn(t => t + 1);
          }
        }
      }, 1000);
    } else if (isRunning && turn >= 10) {
      setIsRunning(false);
      const winner = scores.p1 > scores.p2 ? 'Player 1 Wins!' : scores.p2 > scores.p1 ? 'Player 2 Wins!' : 'It\'s a Draw!';
      setLogs(prev => [...prev, `GAME OVER! Final Score - P1: ${scores.p1}, P2: ${scores.p2}. ${winner}`]);
    }
    return () => clearTimeout(timer);
  }, [isRunning, turn, currentPlayer, scores]);

  const startGame = () => {
    setScores({ p1: 0, p2: 0 });
    setTurn(0);
    setCurrentPlayer('p1');
    setLogs(['> Initializing Game Loop...', '> FOR turn = 1 TO 10']);
    setIsRunning(true);
  };

  return (
    <div className="w-full h-screen bg-slate-900 flex flex-col font-sans">
      <header className="bg-slate-800 text-white p-4 shadow-md flex justify-between items-center z-20 border-b border-slate-700">
        <LabHeader onExit={onExit} title="Act 3.2: Dice Game Algorithm" />
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Algorithm Visualization */}
        <div className="w-[500px] bg-[#1e1e1e] border-r border-slate-700 flex flex-col z-10">
           
           <div className="h-10 bg-[#2d2d2d] flex items-center px-4 border-b border-black">
              <span className="text-slate-400 font-mono text-sm">dice_game.pseudo</span>
           </div>

           <div className="flex-1 p-6 overflow-y-auto font-mono text-slate-300 text-sm leading-relaxed">
              <div className="text-emerald-400">SET player1_score = 0</div>
              <div className="text-emerald-400">SET player2_score = 0</div>
              <br />
              <div className="text-pink-400 font-bold bg-slate-800/50 p-1 rounded">FOR turn = 1 TO 10</div>
              <div className="ml-4 border-l-2 border-slate-700 pl-4 py-2">
                 <div className="text-blue-300">// Player 1's Turn</div>
                 <div className="text-orange-300">DO</div>
                 <div className="ml-4">
                   roll = Random(1, 6)<br/>
                   player1_score = player1_score + roll
                 </div>
                 <div className="text-orange-300">WHILE roll == 6</div>
                 <br />
                 <div className="text-blue-300">// Player 2's Turn</div>
                 <div className="text-orange-300">DO</div>
                 <div className="ml-4">
                   roll = Random(1, 6)<br/>
                   player2_score = player2_score + roll
                 </div>
                 <div className="text-orange-300">WHILE roll == 6</div>
              </div>
              <div className="text-pink-400 font-bold bg-slate-800/50 p-1 rounded">NEXT turn</div>
              <br />
              <div className="text-emerald-400">IF player1_score {'>'} player2_score THEN</div>
              <div className="ml-4 text-white">OUTPUT "Player 1 Wins"</div>
              <div className="text-emerald-400">ELSE IF player2_score {'>'} player1_score THEN</div>
              <div className="ml-4 text-white">OUTPUT "Player 2 Wins"</div>
              <div className="text-emerald-400">ELSE</div>
              <div className="ml-4 text-white">OUTPUT "Draw"</div>
              <div className="text-emerald-400">END IF</div>
           </div>
        </div>

        {/* Right Panel: Execution / Game Board */}
        <div className="flex-1 bg-slate-800 flex flex-col relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
           
           {/* Scores */}
           <div className="flex justify-around p-8 bg-slate-900 border-b border-slate-700 shadow-lg">
              <div className={`flex flex-col items-center p-4 rounded-xl border-2 transition-colors ${currentPlayer === 'p1' ? 'bg-indigo-900 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'bg-slate-800 border-slate-700'}`}>
                 <span className="text-slate-400 font-bold tracking-widest text-sm uppercase">Player 1</span>
                 <span className="text-5xl font-mono text-white mt-2">{scores.p1}</span>
              </div>

              <div className="flex flex-col items-center justify-center">
                 <span className="text-slate-500 font-bold tracking-widest uppercase mb-2">Round</span>
                 <span className="text-3xl font-mono text-emerald-500 bg-black px-6 py-2 rounded-full border border-emerald-900">{Math.min(turn + 1, 10)} / 10</span>
              </div>

              <div className={`flex flex-col items-center p-4 rounded-xl border-2 transition-colors ${currentPlayer === 'p2' ? 'bg-rose-900 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]' : 'bg-slate-800 border-slate-700'}`}>
                 <span className="text-slate-400 font-bold tracking-widest text-sm uppercase">Player 2</span>
                 <span className="text-5xl font-mono text-white mt-2">{scores.p2}</span>
              </div>
           </div>

           {/* The Dice */}
           <div className="flex-1 flex flex-col items-center justify-center">
              {currentDice ? (
                 <div className="w-32 h-32 bg-slate-50 rounded-2xl shadow-2xl flex flex-wrap p-4 gap-2 justify-between animate-bounce">
                    {/* Render dots based on dice value */}
                    {[...Array(currentDice)].map((_, i) => (
                      <div key={i} className="w-6 h-6 bg-slate-900 rounded-full"></div>
                    ))}
                 </div>
              ) : (
                 <div className="w-32 h-32 bg-slate-700 rounded-2xl border-4 border-slate-600 border-dashed opacity-50"></div>
              )}

              {!isRunning && turn === 0 && (
                <button 
                  onClick={startGame}
                  className="mt-12 px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-black font-bold font-sans uppercase tracking-widest text-xl rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all active:scale-95"
                >
                  Execute Program
                </button>
              )}
           </div>

           {/* Execution Logs */}
           <div className="h-64 bg-black border-t border-slate-700 p-4 font-mono text-sm overflow-y-auto flex flex-col">
              {logs.map((log, i) => (
                <div key={i} className={`mb-1 ${log.includes('Wins') || log.includes('OVER') ? 'text-yellow-400 font-bold text-base' : log.includes('roll again') ? 'text-pink-400' : 'text-slate-400'}`}>
                  {log}
                </div>
              ))}
              {/* Auto scroll dummy element would go here in a real app */}
           </div>

        </div>

      </div>
    </div>
  );
}
