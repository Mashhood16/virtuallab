import { useState } from 'react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabCricketSpreadsheet({ onExit }: LabProps) {
  // We mock a spreadsheet state
  const [f5, setF5] = useState('');
  const [f7, setF7] = useState('');
  const [g7, setG7] = useState('');
  const [d10, setD10] = useState('');
  const [e11, setE11] = useState('');

  const [showChart, setShowChart] = useState(false);

  // Exact formulas required by the textbook
  const reqF5 = '=B5+C5+D5+E5'; // or =SUM(B5:E5)
  const reqF7 = '=SUM(B7:E7)';
  const reqG7 = '=AVERAGE(B7:E7)';
  const reqD10 = '=MAX(D5:D9)';
  const reqE11 = '=MIN(E5:E9)';

  const isF5Correct = f5.toUpperCase().replace(/\s/g,'') === reqF5 || f5.toUpperCase().replace(/\s/g,'') === '=SUM(B5:E5)';
  const isF7Correct = f7.toUpperCase().replace(/\s/g,'') === reqF7;
  const isG7Correct = g7.toUpperCase().replace(/\s/g,'') === reqG7;
  const isD10Correct = d10.toUpperCase().replace(/\s/g,'') === reqD10;
  const isE11Correct = e11.toUpperCase().replace(/\s/g,'') === reqE11;

  const allCorrect = isF5Correct && isF7Correct && isG7Correct && isD10Correct && isE11Correct;

  return (
    <div className="w-full h-screen bg-[#1d6f42] text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      <LabHeader onExit={onExit} title="Act 2.1: Cricket Score Calculations" subtitle="Use Excel functions to calculate scores for the Pak vs NZ series." variant="emerald" />

      <div className="flex-1 flex overflow-hidden">
        
        {/* Lab Area - The Spreadsheet */}
        <div className="flex-1 bg-slate-50 dark:bg-slate-900 p-6 flex flex-col relative overflow-hidden">
          
          {/* Mock Excel Ribbon */}
          <div className="w-full h-16 bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 dark:border-slate-500 flex items-center px-4 gap-4 mb-4">
            <div className="font-bold text-green-700 font-mono text-xl flex items-center gap-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h6v6h6v10H6z"/></svg>
              Excel Virtual
            </div>
            <div className="w-px h-8 bg-slate-300 dark:bg-slate-800"></div>
            <span className="font-mono bg-slate-50 dark:bg-slate-900 px-2 py-1 border border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded text-sm text-slate-500 dark:text-slate-400">fx</span>
          </div>

          <div className="flex-1 overflow-auto border border-slate-300 dark:border-slate-700 dark:border-slate-500 shadow-sm rounded relative">
             <table className="w-full text-sm font-mono border-collapse bg-slate-50 dark:bg-slate-900">
                <thead>
                  <tr className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b border-slate-300 dark:border-slate-700 dark:border-slate-500">
                    <th className="w-10 border-r border-slate-300 dark:border-slate-700 dark:border-slate-500"></th>
                    <th className="border-r border-slate-300 dark:border-slate-700 dark:border-slate-500 py-1 font-normal w-40">A</th>
                    <th className="border-r border-slate-300 dark:border-slate-700 dark:border-slate-500 py-1 font-normal w-24">B</th>
                    <th className="border-r border-slate-300 dark:border-slate-700 dark:border-slate-500 py-1 font-normal w-24">C</th>
                    <th className="border-r border-slate-300 dark:border-slate-700 dark:border-slate-500 py-1 font-normal w-24">D</th>
                    <th className="border-r border-slate-300 dark:border-slate-700 dark:border-slate-500 py-1 font-normal w-24">E</th>
                    <th className="border-r border-slate-300 dark:border-slate-700 dark:border-slate-500 py-1 font-normal w-48">F</th>
                    <th className="border-r border-slate-300 dark:border-slate-700 dark:border-slate-500 py-1 font-normal w-48">G</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['', '', '', '', '', '', ''],
                    ['Player Name', 'Match 1', 'Match 2', 'Match 3', 'Match 4', 'Total Score', 'Average Score'],
                    ['Fakhar Zaman', '14', '88', '117', '61', '280', '70'],
                    ['Imam-ul-Haq', '16', '12', '12', '4', '44', '11'],
                    ['Babar Azam', '9', '46', '33', '101', 'F5', '47.25'],
                    ['Haris Sohail', '34', '12', '60', '1', '107', '26.75'],
                    ['M. Hafeez', '12', '76', '22', '0', 'F7', 'G7'],
                    ['', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', ''],
                    ['Max Match 2', '', '', 'D10', '', '', ''],
                    ['Min Match 3', '', '', '', 'E11', '', ''],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-slate-200 dark:border-slate-700 dark:border-slate-500">
                      <td className="bg-slate-100 dark:bg-slate-800 border-r border-slate-300 dark:border-slate-700 dark:border-slate-500 text-center text-slate-500 dark:text-slate-400 py-1 select-none">{i + 1}</td>
                      {row.map((cell, j) => {
                         // Interactive cells
                         if (cell === 'F5') return <td key={j} className="border-r border-slate-200 dark:border-slate-700 dark:border-slate-500 p-0"><input value={f5} onChange={e=>setF5(e.target.value)} className={`w-full h-full px-2 outline-none font-bold ${isF5Correct ? 'bg-green-100 text-green-800' : 'bg-yellow-50 text-yellow-800'}`} placeholder="=..." /></td>
                         if (cell === 'F7') return <td key={j} className="border-r border-slate-200 dark:border-slate-700 dark:border-slate-500 p-0"><input value={f7} onChange={e=>setF7(e.target.value)} className={`w-full h-full px-2 outline-none font-bold ${isF7Correct ? 'bg-green-100 text-green-800' : 'bg-yellow-50 text-yellow-800'}`} placeholder="=..." /></td>
                         if (cell === 'G7') return <td key={j} className="border-r border-slate-200 dark:border-slate-700 dark:border-slate-500 p-0"><input value={g7} onChange={e=>setG7(e.target.value)} className={`w-full h-full px-2 outline-none font-bold ${isG7Correct ? 'bg-green-100 text-green-800' : 'bg-yellow-50 text-yellow-800'}`} placeholder="=..." /></td>
                         if (cell === 'D10') return <td key={j} className="border-r border-slate-200 dark:border-slate-700 dark:border-slate-500 p-0"><input value={d10} onChange={e=>setD10(e.target.value)} className={`w-full h-full px-2 outline-none font-bold ${isD10Correct ? 'bg-green-100 text-green-800' : 'bg-yellow-50 text-yellow-800'}`} placeholder="=..." /></td>
                         if (cell === 'E11') return <td key={j} className="border-r border-slate-200 dark:border-slate-700 dark:border-slate-500 p-0"><input value={e11} onChange={e=>setE11(e.target.value)} className={`w-full h-full px-2 outline-none font-bold ${isE11Correct ? 'bg-green-100 text-green-800' : 'bg-yellow-50 text-yellow-800'}`} placeholder="=..." /></td>
                         
                         // Static cells
                         return <td key={j} className={`border-r border-slate-200 dark:border-slate-700 dark:border-slate-500 px-2 py-1 ${i===1||j===0?'font-bold bg-slate-50 dark:bg-slate-900':''}`}>{cell}</td>
                      })}
                    </tr>
                  ))}
                </tbody>
             </table>

             {/* Bar Chart Overlay */}
             {showChart && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 dark:border-slate-500 shadow-2xl p-6 flex flex-col rounded z-10 animate-fade-in">
                   <h3 className="text-center font-bold text-slate-700 dark:text-slate-200 mb-4">Average Scores</h3>
                   <div className="flex-1 border-l-2 border-b-2 border-slate-400 dark:border-slate-500 flex items-end justify-around pb-0 pt-4 px-2">
                      <div className="w-12 bg-blue-500 rounded-t flex items-end justify-center text-xs text-white pb-1" style={{height: '70%'}}>70</div>
                      <div className="w-12 bg-blue-500 rounded-t flex items-end justify-center text-xs text-white pb-1" style={{height: '11%'}}>11</div>
                      <div className="w-12 bg-blue-500 rounded-t flex items-end justify-center text-xs text-white pb-1" style={{height: '47%'}}>47.25</div>
                      <div className="w-12 bg-blue-500 rounded-t flex items-end justify-center text-xs text-white pb-1" style={{height: '26%'}}>26.75</div>
                      <div className="w-12 bg-blue-500 rounded-t flex items-end justify-center text-xs text-white pb-1" style={{height: '27%'}}>27.5</div>
                   </div>
                   <div className="flex justify-around text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-bold rotate-[-15deg]">
                      <span>Fakhar</span>
                      <span>Imam</span>
                      <span>Babar</span>
                      <span>Haris</span>
                      <span>Hafeez</span>
                   </div>
                   <button onClick={() => setShowChart(false)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                   </button>
                </div>
             )}
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-96 bg-slate-50 dark:bg-slate-900 p-8 flex flex-col shadow-[-10px_0_20px_rgba(0,0,0,0.1)] z-10 overflow-y-auto">
          <h2 className="text-2xl font-bold text-green-800 mb-6 border-b-2 border-green-100 pb-2">Formula Tasks</h2>
          
          <div className="space-y-4 mb-8">
            <div className={`p-4 rounded border ${isF5Correct ? 'bg-green-50 border-green-500' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:border-slate-500'}`}>
               <p className="text-sm text-slate-600 dark:text-slate-300"><strong>F5:</strong> Write formula for Total Score of Babar Azam.</p>
               {isF5Correct && <span className="text-green-600 font-bold text-xs">✓ Correct ({f5})</span>}
            </div>
            <div className={`p-4 rounded border ${isF7Correct ? 'bg-green-50 border-green-500' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:border-slate-500'}`}>
               <p className="text-sm text-slate-600 dark:text-slate-300"><strong>F7:</strong> Write SUM function for Total Score of M. Hafeez.</p>
               {isF7Correct && <span className="text-green-600 font-bold text-xs">✓ Correct</span>}
            </div>
            <div className={`p-4 rounded border ${isG7Correct ? 'bg-green-50 border-green-500' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:border-slate-500'}`}>
               <p className="text-sm text-slate-600 dark:text-slate-300"><strong>G7:</strong> Write AVERAGE function for M. Hafeez.</p>
               {isG7Correct && <span className="text-green-600 font-bold text-xs">✓ Correct</span>}
            </div>
            <div className={`p-4 rounded border ${isD10Correct ? 'bg-green-50 border-green-500' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:border-slate-500'}`}>
               <p className="text-sm text-slate-600 dark:text-slate-300"><strong>D10:</strong> Write MAX function for Match 2 column.</p>
               {isD10Correct && <span className="text-green-600 font-bold text-xs">✓ Correct</span>}
            </div>
            <div className={`p-4 rounded border ${isE11Correct ? 'bg-green-50 border-green-500' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:border-slate-500'}`}>
               <p className="text-sm text-slate-600 dark:text-slate-300"><strong>E11:</strong> Write MIN function for Match 3 column.</p>
               {isE11Correct && <span className="text-green-600 font-bold text-xs">✓ Correct</span>}
            </div>
          </div>

          <button 
            onClick={() => setShowChart(true)}
            disabled={!allCorrect}
            className={`py-4 font-bold rounded-xl transition-all shadow-md ${allCorrect ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}`}
          >
            Draw Bar Chart
          </button>
          {!allCorrect && <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">Complete all formulas to unlock charts.</p>}

        </div>
      </div>
    </div>
  );
}
