import { useState } from 'react';
import { Briefcase, Camera, Music, Code, Paintbrush, DollarSign, Calculator, LineChart } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC6HobbyMonetization({ onExit }: LabProps) {
  const [hobby, setHobby] = useState<string | null>(null);
  const [price, setPrice] = useState('500');
  const [cost, setCost] = useState('200');
  const [sales, setSales] = useState('10');

  const hobbies = [
    { id: 'photo', name: 'Photography', icon: Camera, desc: 'Selling prints or offering photoshoots.' },
    { id: 'music', name: 'Music Production', icon: Music, desc: 'Making beats or giving online lessons.' },
    { id: 'code', name: 'Web Development', icon: Code, desc: 'Building small websites for local shops.' },
    { id: 'art', name: 'Digital Art', icon: Paintbrush, desc: 'Taking commissions for custom avatars.' }
  ];

  const parsedPrice = parseFloat(price) || 0;
  const parsedCost = parseFloat(cost) || 0;
  const parsedSales = parseInt(sales) || 0;

  const profitPerItem = parsedPrice - parsedCost;
  const totalProfit = profitPerItem * parsedSales;

  return (
    <div className="flex h-screen font-sans bg-slate-50 text-slate-800">
      <div className="flex-1 p-8 flex flex-col overflow-y-auto">
        <LabHeader onExit={onExit} title="Hobby Monetization Business Plan" />

        <h1 className="text-3xl font-bold mb-2">Hobby Monetization Business Plan</h1>
        <p className="text-slate-600 mb-8">Choose a hobby, plan your startup idea, and calculate your potential profit.</p>

        <div className="flex gap-8 flex-1">
          {/* Section 1: Business Idea */}
          <div className="w-1/2 flex flex-col gap-6">
            <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-indigo-600" /> 1. Select Your Startup Idea
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {hobbies.map(h => {
                  const Icon = h.icon;
                  return (
                    <button
                      key={h.id}
                      onClick={() => setHobby(h.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        hobby === h.id ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-8 h-8 mb-3 ${hobby === h.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <div className="font-bold text-slate-800 mb-1">{h.name}</div>
                      <div className="text-xs text-slate-500">{h.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-indigo-600 text-white rounded-xl shadow-lg p-8 relative overflow-hidden flex-1 flex flex-col justify-center">
              <div className="absolute -right-8 -bottom-8 opacity-10">
                <LineChart className="w-64 h-64" />
              </div>
              <h3 className="text-2xl font-bold mb-2 relative z-10">Your Pitch</h3>
              {hobby ? (
                <p className="text-indigo-100 text-lg relative z-10 leading-relaxed">
                  "My startup transforms my passion for <strong className="text-white">{hobbies.find(h=>h.id===hobby)?.name}</strong> into a profitable business by <strong className="text-white border-b border-indigo-400 pb-0.5">{hobbies.find(h=>h.id===hobby)?.desc.toLowerCase()}</strong>"
                </p>
              ) : (
                <p className="text-indigo-300 italic relative z-10">Select a hobby above to generate your pitch.</p>
              )}
            </div>
          </div>

          {/* Section 2: Financials */}
          <div className="w-1/2 bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-emerald-600" /> 2. Calculate Profit
            </h2>

            <div className="flex flex-col gap-6 flex-1">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Selling Price per item/service (Rs)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="number" 
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Cost Price per item/service (Rs)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="number" 
                    value={cost}
                    onChange={e => setCost(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Estimated Sales (Quantity)</label>
                <input 
                  type="number" 
                  value={sales}
                  onChange={e => setSales(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-mono"
                />
              </div>

              <div className="mt-auto bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wider mb-4">Financial Summary</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600">Profit Per Item (Selling - Cost):</span>
                  <span className={`font-mono font-bold ${profitPerItem >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    Rs {profitPerItem}
                  </span>
                </div>
                <div className="w-full h-px bg-slate-200 my-4"></div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-800 font-bold text-lg">Total Estimated Profit:</span>
                  <span className={`font-mono font-black text-2xl ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    Rs {totalProfit}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
