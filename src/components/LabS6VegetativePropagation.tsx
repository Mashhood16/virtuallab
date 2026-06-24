import { useState } from 'react';
import { Edit2, CheckCircle, Leaf } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS6VegetativePropagation({ onExit }: LabProps) {
  const [data, setData] = useState({
    seeds: { plants: '', leaves: '', flowers: '', color: '', smell: '', total: '' },
    cuttings: { plants: '', leaves: '', flowers: '', color: '', smell: '', total: '' }
  });

  const [submitted, setSubmitted] = useState(false);

  const isComplete = () => {
    return Object.values(data.seeds).every(v => v !== '') && Object.values(data.cuttings).every(v => v !== '');
  };

  return (
    <div className="flex flex-col h-screen bg-emerald-50 font-sans">
      <LabHeader onExit={onExit} title="Unit 2: Vegetative Propagation Experiment" />

      <div className="flex-1 flex flex-col p-8 items-center overflow-y-auto">
        <div className="w-full max-w-5xl bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-8">
          
          <div className="flex items-start gap-4 mb-8 bg-emerald-50 border border-emerald-200 p-6 rounded-xl">
            <Leaf className="w-8 h-8 text-emerald-600 shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-emerald-800 mb-2">Long-term Observation Project</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                In winter, take seeds and stem cuttings from the same rose plant. Plant them in separate pots with identical soil, water, light, and temperature conditions. Observe them over three months. After three months, record your findings in the observation table below to compare the benefits of vegetative propagation (cuttings) versus sexual reproduction (seeds).
              </p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Edit2 className="w-5 h-5" /> Data Collection Table</h3>
          
          <div className="overflow-x-auto border border-slate-200 rounded-xl mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="p-4 border-b border-slate-200 font-bold w-1/3">Observation Parameter</th>
                  <th className="p-4 border-b border-slate-200 border-l font-bold w-1/3">Group 1 (Grown from Seeds)</th>
                  <th className="p-4 border-b border-slate-200 border-l font-bold w-1/3">Group 2 (Grown from Cuttings)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  { key: 'plants', label: 'Number of small plants grown' },
                  { key: 'leaves', label: 'Number of leaves on a plant' },
                  { key: 'flowers', label: 'Number of flowers on a plant' },
                  { key: 'color', label: 'Color of flowers' },
                  { key: 'smell', label: 'Smell of flowers' },
                  { key: 'total', label: 'Total production of flowers' },
                ].map((row) => (
                  <tr key={row.key} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm font-medium text-slate-700">{row.label}</td>
                    <td className="p-2 border-l border-slate-200">
                      <input 
                        type="text" 
                        value={data.seeds[row.key as keyof typeof data.seeds]}
                        onChange={(e) => setData({ ...data, seeds: { ...data.seeds, [row.key]: e.target.value } })}
                        placeholder="Enter observation..."
                        disabled={submitted}
                        className="w-full p-2 border border-slate-300 rounded focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none disabled:bg-slate-50 disabled:text-slate-500"
                      />
                    </td>
                    <td className="p-2 border-l border-slate-200">
                      <input 
                        type="text" 
                        value={data.cuttings[row.key as keyof typeof data.cuttings]}
                        onChange={(e) => setData({ ...data, cuttings: { ...data.cuttings, [row.key]: e.target.value } })}
                        placeholder="Enter observation..."
                        disabled={submitted}
                        className="w-full p-2 border border-slate-300 rounded focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none disabled:bg-slate-50 disabled:text-slate-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!submitted ? (
            <button 
              onClick={() => setSubmitted(true)}
              disabled={!isComplete()}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Submit Observation Report
            </button>
          ) : (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-start gap-4">
               <CheckCircle className="w-8 h-8 shrink-0 text-emerald-600" />
               <div>
                 <h4 className="font-bold text-lg mb-2">Report Submitted Successfully</h4>
                 <p className="text-sm">Based on typical scientific results, you should notice that the plants grown from cuttings (vegetative propagation) grew much faster, produced flowers sooner, and the flowers were identical in color and smell to the parent plant. Plants grown from seeds take much longer and may show genetic variation.</p>
                 <button onClick={() => setSubmitted(false)} className="mt-4 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded hover:bg-emerald-700">Edit Data</button>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
