import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, TrendingUp, DollarSign, LineChart } from 'lucide-react';

interface Props {
  onExit?: () => void;
}

export default function LabCS10Financials({ onExit }: Props) {
  // Financial Inputs
  const [pricePerUnit, setPricePerUnit] = useState<number>(50);
  const [unitsSoldPerMonth, setUnitsSoldPerMonth] = useState<number>(100);
  const [fixedCosts, setFixedCosts] = useState<number>(2000);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState<number>(20);

  // Computed values
  const monthlyRevenue = pricePerUnit * unitsSoldPerMonth;
  const monthlyVariableCosts = variableCostPerUnit * unitsSoldPerMonth;
  const totalMonthlyCosts = fixedCosts + monthlyVariableCosts;
  const monthlyProfit = monthlyRevenue - totalMonthlyCosts;
  const breakEvenUnits = pricePerUnit - variableCostPerUnit > 0 
    ? Math.ceil(fixedCosts / (pricePerUnit - variableCostPerUnit)) 
    : 0;

  // Chart Generation (12 months projection)
  const projectionData = Array.from({ length: 12 }).map((_, i) => {
    // Add a little realistic growth/noise if we wanted, but let's keep it simple fixed for 1st year
    // Actually, let's make units grow by 5% each month for more realism
    const monthUnits = Math.round(unitsSoldPerMonth * Math.pow(1.05, i));
    const rev = pricePerUnit * monthUnits;
    const cost = fixedCosts + (variableCostPerUnit * monthUnits);
    const prof = rev - cost;
    return { month: i + 1, rev, cost, prof, units: monthUnits };
  });

  const maxVal = Math.max(...projectionData.map(d => Math.max(d.rev, d.cost))) * 1.1 || 1;
  const minVal = Math.min(0, ...projectionData.map(d => d.prof));
  const graphRange = maxVal - minVal;

  // Data Logging
  const [logs, setLogs] = useState<{ id: number; price: number; units: number; fixed: number; vc: number; profit: number }[]>([]);

  // Assessment
  const [assessmentScenario, setAssessmentScenario] = useState({ fc: 5000, p: 100, vc: 50 });
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [assessmentFeedback, setAssessmentFeedback] = useState<string | null>(null);

  useEffect(() => {
    setAssessmentScenario({
      fc: (Math.floor(Math.random() * 50) + 10) * 100,
      p: Math.floor(Math.random() * 50) + 50,
      vc: Math.floor(Math.random() * 30) + 10
    });
  }, []);

  const handleRecordData = () => {
    const totalYear1Profit = projectionData.reduce((acc, curr) => acc + curr.prof, 0);
    setLogs(prev => [...prev, {
      id: prev.length + 1,
      price: pricePerUnit,
      units: unitsSoldPerMonth,
      fixed: fixedCosts,
      vc: variableCostPerUnit,
      profit: totalYear1Profit
    }]);
  };

  const checkAnswer = () => {
    const correctBreakEven = Math.ceil(assessmentScenario.fc / (assessmentScenario.p - assessmentScenario.vc));
    if (parseInt(userAnswer) === correctBreakEven) {
      setAssessmentFeedback('Correct! You calculated the break-even point perfectly.');
    } else {
      setAssessmentFeedback(`Incorrect. The correct break-even point is ${correctBreakEven} units.`);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <header className="bg-emerald-600 text-white p-4 shadow-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button onClick={onExit} className="p-2 hover:bg-emerald-700 rounded-full transition-colors" title="Exit Lab">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Lab: Financial Projections</h1>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp size={20} />
          <span className="font-semibold">Grade 10 Computer Science</span>
        </div>
      </header>

      <main className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Theory */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
            <DollarSign className="text-emerald-600" /> Financial Concepts
          </h2>
          
          <div className="prose prose-sm text-slate-600 space-y-4">
            <div>
              <h3 className="text-md font-semibold text-slate-700">Revenue & Expenses</h3>
              <p><strong>Revenue</strong> is the total amount of money brought in by sales. <strong>Expenses</strong> are the costs required to operate.</p>
              <div className="bg-emerald-50 p-2 rounded-md text-emerald-800 font-mono text-xs mt-1">
                Profit = Revenue - Total Expenses
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-semibold text-slate-700">Fixed vs Variable Costs</h3>
              <p><strong>Fixed Costs</strong> (e.g., rent, salaries) don't change based on how many items you sell. <strong>Variable Costs</strong> (e.g., raw materials) increase with each unit sold.</p>
            </div>

            <div>
              <h3 className="text-md font-semibold text-slate-700">Break-even Point</h3>
              <p>The point where total revenue equals total costs. You are neither making a profit nor a loss.</p>
              <div className="bg-emerald-50 p-2 rounded-md text-emerald-800 font-mono text-xs mt-1">
                Break-even Units = Fixed Costs / (Price - Variable Cost)
              </div>
            </div>
          </div>
        </section>

        {/* Column 2: Simulation */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-6">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
            <LineChart className="text-emerald-600" /> Interactive Spreadsheet
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Price per Unit ($)</label>
              <input type="number" min="0" value={pricePerUnit} onChange={(e) => setPricePerUnit(Number(e.target.value) || 0)} className="w-full px-2 py-1 border rounded" />
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Variable Cost/Unit ($)</label>
              <input type="number" min="0" value={variableCostPerUnit} onChange={(e) => setVariableCostPerUnit(Number(e.target.value) || 0)} className="w-full px-2 py-1 border rounded" />
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Fixed Costs/Month ($)</label>
              <input type="number" min="0" step="100" value={fixedCosts} onChange={(e) => setFixedCosts(Number(e.target.value) || 0)} className="w-full px-2 py-1 border rounded" />
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Start Units Sold/Month</label>
              <input type="number" min="0" value={unitsSoldPerMonth} onChange={(e) => setUnitsSoldPerMonth(Number(e.target.value) || 0)} className="w-full px-2 py-1 border rounded" />
            </div>
          </div>

          <div className="flex justify-between bg-emerald-100 p-3 rounded-lg border border-emerald-200">
            <div className="text-center">
              <div className="text-xs text-emerald-800 uppercase font-bold">Monthly Profit</div>
              <div className={`text-lg font-black ${monthlyProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>${monthlyProfit.toFixed(0)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-emerald-800 uppercase font-bold">Break-even Units</div>
              <div className="text-lg font-black text-emerald-700">{breakEvenUnits}</div>
            </div>
          </div>

          <div className="flex-1 bg-slate-50 rounded-lg border border-slate-200 p-2 relative">
            <h3 className="text-xs font-bold text-center text-slate-500 mb-2">12-Month Projection (5% Monthly Growth)</h3>
            <svg width="100%" height="100%" viewBox="0 0 120 100" preserveAspectRatio="none" className="overflow-visible px-2">
              {/* Zero line */}
              <line x1="0" y1={(maxVal / graphRange) * 100} x2="120" y2={(maxVal / graphRange) * 100} stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2" />
              
              {projectionData.map((d, i) => {
                const barWidth = 6;
                const x = i * 10 + 2;
                
                // Revenue Bar
                const revHeight = (d.rev / graphRange) * 100;
                const revY = ((maxVal - d.rev) / graphRange) * 100;
                
                // Cost Bar
                const costHeight = (d.cost / graphRange) * 100;
                const costY = ((maxVal - d.cost) / graphRange) * 100;

                return (
                  <g key={i}>
                    {/* Revenue (Green) */}
                    <rect x={x} y={revY} width={barWidth / 2} height={revHeight} fill="#34d399" />
                    {/* Cost (Red) */}
                    <rect x={x + barWidth / 2} y={costY} width={barWidth / 2} height={costHeight} fill="#f87171" />
                    <text x={x + barWidth/2} y="98" fontSize="4" textAnchor="middle" fill="#64748b">M{d.month}</text>
                  </g>
                );
              })}
            </svg>
          </div>
          <button onClick={handleRecordData} className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm font-semibold">
            Log Projection
          </button>
        </section>

        {/* Column 3: Analysis */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-6">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
            <CheckCircle className="text-emerald-600" /> Data Logs & Assessment
          </h2>

          <div className="flex-1 overflow-auto">
            <h3 className="font-semibold text-slate-700 mb-2 text-sm">Saved Scenarios</h3>
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="bg-slate-100 text-slate-700 uppercase">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Units</th>
                  <th className="p-2">VC</th>
                  <th className="p-2">FC</th>
                  <th className="p-2">Y1 Profit</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={6} className="p-2 text-center text-slate-400">No projections logged.</td></tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-100">
                      <td className="p-2">{log.id}</td>
                      <td className="p-2">${log.price}</td>
                      <td className="p-2">{log.units}</td>
                      <td className="p-2">${log.vc}</td>
                      <td className="p-2">${log.fixed}</td>
                      <td className={`p-2 font-bold ${log.profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>${log.profit.toFixed(0)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-700 mb-2">Break-Even Challenge</h3>
            <p className="text-sm text-slate-600 mb-4">
              Your fixed costs are <strong>${assessmentScenario.fc}</strong>. You sell a product for <strong>${assessmentScenario.p}</strong>, and the variable cost per unit is <strong>${assessmentScenario.vc}</strong>. How many units do you need to sell to break even?
            </p>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                placeholder="Units..."
              />
              <button 
                onClick={checkAnswer}
                className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm font-semibold"
              >
                Check
              </button>
            </div>
            {assessmentFeedback && (
              <div className={`mt-3 p-2 rounded-md text-sm ${assessmentFeedback.startsWith('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {assessmentFeedback}
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
