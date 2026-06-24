import { useState } from 'react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabDigitalMarketing({ onExit }: LabProps) {
  const [budget, setBudget] = useState({
    facebook: 0,
    instagram: 0,
    search: 0
  });

  const totalBudget = 10000;
  const spent = budget.facebook + budget.instagram + budget.search;
  const remaining = totalBudget - spent;

  const [incentive, setIncentive] = useState('none');
  const [isCampaignRunning, setIsCampaignRunning] = useState(false);
  const [results, setResults] = useState({ clicks: 0, conversions: 0, active: false });

  const runCampaign = () => {
    setIsCampaignRunning(true);
    setResults({ clicks: 0, conversions: 0, active: true });

    // Calculate CTR and Conversions based on budget allocation and incentive
    let ctrBase = 0;
    
    // Facebook is good for broad reach
    ctrBase += budget.facebook * 0.05;
    // Instagram is great for visual travel ads
    ctrBase += budget.instagram * 0.08;
    // Search is good for intent (people looking for flights)
    ctrBase += budget.search * 0.12;

    // Multipliers based on incentive offered
    let multiplier = 1.0;
    if (incentive === 'discount') multiplier = 1.5;
    if (incentive === 'lounge') multiplier = 1.2;
    if (incentive === 'miles') multiplier = 1.8; // High perceived value for frequent flyers

    const finalClicks = Math.floor(ctrBase * multiplier);
    const finalConvs = Math.floor(finalClicks * 0.1);

    // Simulate real-time ticking
    let currentClicks = 0;
    const interval = setInterval(() => {
      currentClicks += Math.floor(finalClicks / 20);
      
      if (currentClicks >= finalClicks) {
        clearInterval(interval);
        setResults({ clicks: finalClicks, conversions: finalConvs, active: false });
        setIsCampaignRunning(false);
      } else {
        setResults({ clicks: currentClicks, conversions: Math.floor(currentClicks * 0.1), active: true });
      }
    }, 100);
  };

  return (
    <div className="w-full h-screen bg-slate-100 flex flex-col font-sans">
      <header className="bg-emerald-800 text-white p-4 shadow-md flex justify-between items-center z-20">
        <LabHeader onExit={onExit} title="Act 6.2: Digital Marketing Strategy" />
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Strategy Panel */}
        <div className="w-1/2 bg-slate-50 p-12 overflow-y-auto border-r border-slate-300 shadow-[10px_0_20px_rgba(0,0,0,0.05)] z-10">
           
           <div className="flex justify-between items-end mb-8 border-b-2 border-emerald-100 pb-4">
             <div>
               <h2 className="text-3xl font-bold text-slate-800 uppercase tracking-widest">Campaign Manager</h2>
               <p className="text-slate-500 font-bold">Brand: PIA (Pakistan Airlines)</p>
             </div>
             <div className="text-right">
               <div className="text-sm font-bold text-slate-500 uppercase">Remaining Budget</div>
               <div className={`text-3xl font-mono font-bold ${remaining < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                 Rs. {remaining.toLocaleString()}
               </div>
             </div>
           </div>

           <div className="mb-12">
             <h3 className="text-xl font-bold text-slate-700 mb-4">1. Select Special Incentive</h3>
             <p className="text-sm text-slate-500 mb-4">What special offer are you promoting to attract valuable customers?</p>
             
             <div className="grid grid-cols-3 gap-4">
               <button 
                 onClick={() => setIncentive('discount')}
                 className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${incentive === 'discount' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}
               >
                 <span className="text-2xl">🎟️</span>
                 <span className="font-bold text-slate-700">20% Off Tickets</span>
               </button>
               <button 
                 onClick={() => setIncentive('lounge')}
                 className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${incentive === 'lounge' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}
               >
                 <span className="text-2xl">☕</span>
                 <span className="font-bold text-slate-700">Free VIP Lounge</span>
               </button>
               <button 
                 onClick={() => setIncentive('miles')}
                 className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${incentive === 'miles' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}
               >
                 <span className="text-2xl">✈️</span>
                 <span className="font-bold text-slate-700">Double Air Miles</span>
               </button>
             </div>
           </div>

           <div className="mb-12">
             <h3 className="text-xl font-bold text-slate-700 mb-4">2. Allocate Ad Budget</h3>
             <p className="text-sm text-slate-500 mb-6">Distribute your Rs. 10,000 budget across different platforms.</p>
             
             <div className="space-y-6">
                <div>
                   <div className="flex justify-between mb-2">
                     <label className="font-bold text-blue-600 flex items-center gap-2"><div className="w-3 h-3 bg-blue-600 rounded"></div> Facebook Ads</label>
                     <span className="font-mono text-slate-600">Rs. {budget.facebook.toLocaleString()}</span>
                   </div>
                   <input type="range" min="0" max="10000" step="500" value={budget.facebook} onChange={e=>setBudget({...budget, facebook: Number(e.target.value)})} className="w-full accent-blue-600" />
                </div>
                
                <div>
                   <div className="flex justify-between mb-2">
                     <label className="font-bold text-pink-600 flex items-center gap-2"><div className="w-3 h-3 bg-pink-600 rounded"></div> Instagram Stories</label>
                     <span className="font-mono text-slate-600">Rs. {budget.instagram.toLocaleString()}</span>
                   </div>
                   <input type="range" min="0" max="10000" step="500" value={budget.instagram} onChange={e=>setBudget({...budget, instagram: Number(e.target.value)})} className="w-full accent-pink-600" />
                </div>

                <div>
                   <div className="flex justify-between mb-2">
                     <label className="font-bold text-yellow-600 flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded"></div> Search Engine Ads</label>
                     <span className="font-mono text-slate-600">Rs. {budget.search.toLocaleString()}</span>
                   </div>
                   <input type="range" min="0" max="10000" step="500" value={budget.search} onChange={e=>setBudget({...budget, search: Number(e.target.value)})} className="w-full accent-yellow-500" />
                </div>
             </div>
           </div>

           <button 
             onClick={runCampaign}
             disabled={isCampaignRunning || incentive === 'none' || remaining < 0 || spent === 0}
             className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold text-xl rounded-xl shadow-lg transition-transform active:scale-95 uppercase tracking-widest flex justify-center items-center gap-2"
           >
             Launch Campaign
           </button>
           {remaining < 0 && <p className="text-red-500 text-sm text-center mt-2 font-bold">Error: Budget Exceeded!</p>}

        </div>

        {/* Live Results Panel */}
        <div className="w-1/2 bg-slate-900 text-white p-12 flex flex-col relative bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
           
           <h2 className="text-2xl font-bold text-slate-400 mb-8 border-b border-slate-700 pb-2">Live Campaign Analytics</h2>

           <div className="grid grid-cols-2 gap-8 mb-12">
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-center">
                 <span className="text-slate-400 font-bold uppercase tracking-widest mb-4">Ad Clicks</span>
                 <span className="text-6xl font-mono text-sky-400">{results.clicks.toLocaleString()}</span>
                 {results.active && <span className="text-sky-500 text-xs mt-4 animate-pulse">Gathering traffic...</span>}
              </div>
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-center">
                 <span className="text-slate-400 font-bold uppercase tracking-widest mb-4">Tickets Sold</span>
                 <span className="text-6xl font-mono text-emerald-400">{results.conversions.toLocaleString()}</span>
                 {results.active && <span className="text-emerald-500 text-xs mt-4 animate-pulse">Processing sales...</span>}
              </div>
           </div>

           {/* Ad Preview */}
           <div className="mt-auto">
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Ad Creative Preview</h3>
             <div className="bg-slate-50 rounded-xl overflow-hidden shadow-2xl max-w-sm mx-auto">
                <div className="h-32 bg-green-800 flex items-center justify-center relative">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                   <h2 className="text-3xl font-black text-white relative z-10 italic tracking-tighter">PIA</h2>
                </div>
                <div className="p-4 text-slate-800">
                   <p className="font-bold mb-2">Fly with Pakistan Airlines today!</p>
                   <p className="text-sm text-slate-600 mb-4">
                     {incentive === 'discount' && 'Enjoy a massive 20% discount on all domestic flights. Book now!'}
                     {incentive === 'lounge' && 'Experience luxury. Get free VIP lounge access with your next booking.'}
                     {incentive === 'miles' && 'Earn DOUBLE Air Miles on every flight this month. Rewards await.'}
                     {incentive === 'none' && 'Select an incentive to preview your ad copy.'}
                   </p>
                   <button className="w-full py-2 bg-blue-600 text-white font-bold rounded">Book Flight</button>
                </div>
             </div>
           </div>

        </div>

      </div>
    </div>
  );
}
