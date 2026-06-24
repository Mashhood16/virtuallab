import { useState } from 'react';
import { Calculator, Table, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC6FinanceSpreadsheet({ onExit }: LabProps) {
  const [sellingPrice, setSellingPrice] = useState('1500');
  const [costPrice, setCostPrice] = useState('800');
  const [activeCell, setActiveCell] = useState<string | null>('C2');
  const [formula, setFormula] = useState('=A2-B2');
  
  const parsedSelling = parseFloat(sellingPrice) || 0;
  const parsedCost = parseFloat(costPrice) || 0;
  
  // Calculate profit based on formula evaluation (simplified for this specific case)
  let calculatedProfit = '';
  if (formula.replace(/\s+/g, '').toUpperCase() === '=A2-B2') {
    calculatedProfit = (parsedSelling - parsedCost).toString();
  } else if (formula.startsWith('=')) {
    calculatedProfit = '#ERROR';
  }

  const isSuccess = calculatedProfit === (parsedSelling - parsedCost).toString() && calculatedProfit !== '#ERROR' && calculatedProfit !== '';

  return (
    <div className="flex h-screen font-sans bg-slate-50 text-slate-800">
      <div className="flex-1 p-8 flex flex-col overflow-y-auto">
        <LabHeader onExit={onExit} title="Startup Finances" />

        <h1 className="text-3xl font-bold mb-2">Startup Finances</h1>
        <p className="text-slate-600 mb-8">Use the spreadsheet application to calculate the profit of your product. Hint: Profit = Selling Price - Cost Price.</p>

        <div className="flex-1 flex flex-col">
          {/* Mock Excel App */}
          <div className="bg-slate-50 rounded-xl shadow-xl border border-slate-200 flex flex-col overflow-hidden max-w-5xl mx-auto w-full">
            
            {/* Ribbon */}
            <div className="bg-green-700 text-white p-2 flex items-center gap-3">
              <Table className="w-5 h-5" />
              <span className="font-medium text-sm">Spreadsheet Application - Startup Finances.xlsx</span>
            </div>
            
            <div className="bg-slate-100 border-b border-slate-300 p-2 flex items-center gap-4 text-sm shadow-inner">
              <div className="flex items-center gap-2 border-r border-slate-300 pr-4">
                <div className="bg-slate-50 border border-slate-300 px-2 py-1 w-16 text-center font-bold font-mono text-slate-600">
                  {activeCell || ''}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <span className="font-bold font-serif text-slate-400 italic flex-shrink-0">fx</span>
                <input 
                  type="text" 
                  value={activeCell === 'A2' ? sellingPrice : activeCell === 'B2' ? costPrice : activeCell === 'C2' ? formula : ''}
                  onChange={(e) => {
                    if (activeCell === 'A2') setSellingPrice(e.target.value);
                    if (activeCell === 'B2') setCostPrice(e.target.value);
                    if (activeCell === 'C2') setFormula(e.target.value);
                  }}
                  disabled={!activeCell || activeCell === 'A1' || activeCell === 'B1' || activeCell === 'C1'}
                  className="flex-1 bg-slate-50 border border-slate-300 px-3 py-1 font-mono outline-none focus:border-green-500"
                />
              </div>
            </div>

            {/* Grid */}
            <div className="overflow-auto bg-slate-50 relative select-none">
              <table className="w-full border-collapse font-sans text-sm" style={{ tableLayout: 'fixed' }}>
                <thead>
                  <tr>
                    <th className="w-12 bg-slate-200 border border-slate-300 p-1 font-normal text-slate-500"></th>
                    <th className="w-1/3 bg-slate-200 border border-slate-300 p-1 font-normal text-slate-500">A</th>
                    <th className="w-1/3 bg-slate-200 border border-slate-300 p-1 font-normal text-slate-500">B</th>
                    <th className="w-1/3 bg-slate-200 border border-slate-300 p-1 font-normal text-slate-500">C</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Row 1 - Headers */}
                  <tr>
                    <td className="bg-slate-200 border border-slate-300 text-center font-normal text-slate-500">1</td>
                    <td 
                      onClick={() => setActiveCell('A1')}
                      className={`border border-slate-300 p-2 font-bold bg-slate-100 ${activeCell === 'A1' ? 'ring-2 ring-green-500 ring-inset relative z-10' : ''}`}
                    >
                      Selling Price (Rs)
                    </td>
                    <td 
                      onClick={() => setActiveCell('B1')}
                      className={`border border-slate-300 p-2 font-bold bg-slate-100 ${activeCell === 'B1' ? 'ring-2 ring-green-500 ring-inset relative z-10' : ''}`}
                    >
                      Cost Price (Rs)
                    </td>
                    <td 
                      onClick={() => setActiveCell('C1')}
                      className={`border border-slate-300 p-2 font-bold bg-slate-100 text-green-800 ${activeCell === 'C1' ? 'ring-2 ring-green-500 ring-inset relative z-10' : ''}`}
                    >
                      Profit (Rs)
                    </td>
                  </tr>
                  {/* Row 2 - Data */}
                  <tr>
                    <td className="bg-slate-200 border border-slate-300 text-center font-normal text-slate-500">2</td>
                    <td 
                      onClick={() => setActiveCell('A2')}
                      className={`border border-slate-300 p-2 font-mono text-right ${activeCell === 'A2' ? 'ring-2 ring-green-500 ring-inset relative z-10 bg-slate-50' : 'bg-slate-50'}`}
                    >
                      {activeCell === 'A2' ? sellingPrice : parsedSelling.toString()}
                    </td>
                    <td 
                      onClick={() => setActiveCell('B2')}
                      className={`border border-slate-300 p-2 font-mono text-right ${activeCell === 'B2' ? 'ring-2 ring-green-500 ring-inset relative z-10 bg-slate-50' : 'bg-slate-50'}`}
                    >
                      {activeCell === 'B2' ? costPrice : parsedCost.toString()}
                    </td>
                    <td 
                      onClick={() => setActiveCell('C2')}
                      className={`border border-slate-300 p-2 font-mono text-right bg-green-50/50 ${activeCell === 'C2' ? 'ring-2 ring-green-500 ring-inset relative z-10' : ''} ${calculatedProfit === '#ERROR' ? 'text-red-500' : 'font-bold text-green-700'}`}
                    >
                      {activeCell === 'C2' && formula.startsWith('=') ? formula : calculatedProfit}
                    </td>
                  </tr>
                  {/* Empty Rows */}
                  {[3, 4, 5, 6].map(row => (
                    <tr key={row}>
                      <td className="bg-slate-200 border border-slate-300 text-center font-normal text-slate-500">{row}</td>
                      <td className="border border-slate-300 bg-slate-50"></td>
                      <td className="border border-slate-300 bg-slate-50"></td>
                      <td className="border border-slate-300 bg-slate-50"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-100 p-4 border-t border-slate-300 flex justify-between items-center">
               <div className="text-sm text-slate-500 flex items-center gap-2">
                 <Calculator className="w-4 h-4" /> Ready
               </div>
               
               {isSuccess && (
                 <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                   <CheckCircle className="w-5 h-5" /> Correct Formula Applied!
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
