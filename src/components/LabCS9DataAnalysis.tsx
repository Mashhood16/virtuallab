import { useState, useMemo } from 'react';
import { ArrowLeft, BarChart3, PieChart, Plus, Trash2, Database, FileBarChart } from 'lucide-react';

interface DataRow {
  id: string;
  label: string;
  value: number;
}

interface LabProps {
  onExit?: () => void;
}

export default function LabCS9DataAnalysis({ onExit }: LabProps) {
  const [data, setData] = useState<DataRow[]>([
    { id: '1', label: 'Software', value: 45 },
    { id: '2', label: 'Hardware', value: 25 },
    { id: '3', label: 'Services', value: 30 },
  ]);

  const [activeTab, setActiveTab] = useState<'bar' | 'pie'>('bar');
  const [assessmentAnswer, setAssessmentAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const addRow = () => {
    setData([...data, { id: Math.random().toString(36).substring(2, 9), label: 'New Category', value: 10 }]);
  };

  const updateRow = (id: string, field: 'label' | 'value', val: string | number) => {
    setData(data.map(row => row.id === id ? { ...row, [field]: val } : row));
  };

  const deleteRow = (id: string) => {
    setData(data.filter(row => row.id !== id));
  };

  const totalValue = useMemo(() => data.reduce((sum, row) => sum + (row.value || 0), 0), [data]);
  const maxValue = useMemo(() => Math.max(...data.map(row => row.value || 0), 1), [data]);

  const checkAssessment = () => {
    if (data.length === 0) return;
    const highestRow = [...data].sort((a, b) => (b.value || 0) - (a.value || 0))[0];
    if (assessmentAnswer.toLowerCase().trim() === highestRow.label.toLowerCase().trim()) {
      setFeedback('Correct! You successfully analyzed the data.');
    } else {
      setFeedback(`Incorrect. Check which category has the largest value (${maxValue}).`);
    }
  };

  // SVG Pie Chart helper
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
  let cumulativePercent = 0;

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none text-slate-800">
      <div className="flex items-center justify-between bg-cyan-700 text-white p-4 shadow-md">
        <div className="flex items-center gap-3">
          {onExit && (
            <button onClick={onExit} className="p-2 hover:bg-cyan-800 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
          )}
          <h1 className="text-2xl font-bold">Data Visualization Dashboard</h1>
        </div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Theory */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-cyan-700">
            <FileBarChart size={24} /> Enterprise Survey Analysis
          </h2>
          <div className="prose prose-sm text-slate-700">
            <p>
              Data visualization helps in understanding complex data sets by representing them graphically.
            </p>
            <h3 className="font-bold text-lg mt-4 mb-1">Bar Charts</h3>
            <p>
              Useful for comparing different categories. The length of the bar is proportional to the value it represents.
            </p>
            <h3 className="font-bold text-lg mt-4 mb-1">Pie Charts</h3>
            <p>
              Useful for showing parts of a whole. The entire pie represents 100%, and each slice represents a percentage of the total.
            </p>
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mt-6">
              <h4 className="font-bold text-cyan-800 mb-2">Instructions:</h4>
              <ol className="list-decimal pl-5 space-y-2 text-cyan-900">
                <li>Enter the enterprise survey data into the table.</li>
                <li>Add or remove rows to see how the charts react dynamically.</li>
                <li>Switch between Bar and Pie chart views.</li>
                <li>Answer the assessment question based on your data.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Middle Column: Data Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-cyan-700">
            <Database size={24} /> Data Entry
          </h2>
          <div className="flex-1 overflow-y-auto pr-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-slate-200 p-2 text-slate-600">Category</th>
                  <th className="border-b-2 border-slate-200 p-2 text-slate-600">Value</th>
                  <th className="border-b-2 border-slate-200 p-2 text-slate-600 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id}>
                    <td className="p-2 border-b border-slate-100">
                      <input
                        type="text"
                        value={row.label}
                        onChange={(e) => updateRow(row.id, 'label', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-cyan-500"
                      />
                    </td>
                    <td className="p-2 border-b border-slate-100">
                      <input
                        type="number"
                        min="0"
                        value={row.value.toString()}
                        onChange={(e) => updateRow(row.id, 'value', Number(e.target.value) || 0)}
                        className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-cyan-500"
                      />
                    </td>
                    <td className="p-2 border-b border-slate-100 text-center">
                      <button onClick={() => deleteRow(row.id)} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={addRow}
              className="mt-4 flex items-center gap-2 text-cyan-600 hover:text-cyan-800 font-semibold p-2 transition-colors"
            >
              <Plus size={20} /> Add Category
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between font-bold text-slate-700">
            <span>Total Value:</span>
            <span>{totalValue}</span>
          </div>
        </div>

        {/* Right Column: Visualization & Assessment */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('bar')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-bold transition-colors ${activeTab === 'bar' ? 'bg-white shadow-sm text-cyan-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <BarChart3 size={20} /> Bar Chart
            </button>
            <button
              onClick={() => setActiveTab('pie')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-bold transition-colors ${activeTab === 'pie' ? 'bg-white shadow-sm text-cyan-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <PieChart size={20} /> Pie Chart
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50 min-h-[250px]">
            {data.length === 0 || totalValue === 0 ? (
              <p className="text-slate-400">No data to display</p>
            ) : activeTab === 'bar' ? (
              <svg viewBox="0 0 400 300" className="w-full h-full max-h-64">
                {/* Y Axis */}
                <line x1="40" y1="20" x2="40" y2="260" stroke="#cbd5e1" strokeWidth="2" />
                {/* X Axis */}
                <line x1="40" y1="260" x2="380" y2="260" stroke="#cbd5e1" strokeWidth="2" />
                
                {data.map((row, i) => {
                  const barWidth = 320 / data.length - 10;
                  const barHeight = (row.value / maxValue) * 220;
                  const x = 50 + i * (320 / data.length);
                  const y = 260 - barHeight;
                  return (
                    <g key={row.id}>
                      <rect x={x} y={y} width={barWidth} height={barHeight} fill={colors[i % colors.length]} rx="2" className="transition-all duration-500" />
                      <text x={x + barWidth / 2} y={275} fontSize="10" textAnchor="middle" fill="#475569" className="truncate max-w-[50px]">{row.label.substring(0, 8)}</text>
                      <text x={x + barWidth / 2} y={y - 5} fontSize="10" textAnchor="middle" fill="#475569" fontWeight="bold">{row.value}</text>
                    </g>
                  );
                })}
              </svg>
            ) : (
              <>
                <svg viewBox="-1 -1 2 2" className="w-full h-full max-h-48 transform -rotate-90 mb-4">
                  {data.map((row, i) => {
                    const percent = row.value / totalValue;
                    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
                    cumulativePercent += percent;
                    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
                    const largeArcFlag = percent > 0.5 ? 1 : 0;
                    const pathData = [
                      `M ${startX} ${startY}`,
                      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                      'L 0 0',
                    ].join(' ');

                    if (percent === 1) {
                      return <circle key={row.id} cx="0" cy="0" r="1" fill={colors[i % colors.length]} />;
                    }

                    return <path key={row.id} d={pathData} fill={colors[i % colors.length]} className="transition-all duration-500" />;
                  })}
                </svg>
                <div className="flex flex-wrap gap-3 justify-center mt-2">
                  {data.map((row, i) => (
                    <div key={row.id} className="flex items-center gap-1 text-xs text-slate-600 font-medium">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors[i % colors.length] }}></div>
                      <span>{row.label} ({Math.round((row.value / totalValue) * 100)}%)</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="mt-6 bg-cyan-50 p-4 rounded-xl border border-cyan-200">
            <h3 className="font-bold text-cyan-800 mb-2">Assessment</h3>
            <p className="text-sm text-cyan-900 mb-2">Based on the visualization, which category has the highest value?</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={assessmentAnswer}
                onChange={(e) => setAssessmentAnswer(e.target.value)}
                placeholder="Type category name..."
                className="flex-1 p-2 border border-cyan-300 rounded focus:outline-none focus:border-cyan-600"
              />
              <button
                onClick={checkAssessment}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded font-bold transition-colors"
              >
                Check
              </button>
            </div>
            {feedback && (
              <p className={`mt-2 text-sm font-bold ${feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'}`}>
                {feedback}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
