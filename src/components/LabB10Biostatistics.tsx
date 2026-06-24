import { useState } from 'react';
import { BarChart3, CheckCircle, RotateCcw, ListOrdered, BookOpen, Activity } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabB10Biostatistics({ onExit }: { onExit: () => void }) {
  const initialData = [15, 30, 10, 25, 20];
  const cropYields = [
    { plot: 'A', yield: 15 },
    { plot: 'B', yield: 30 },
    { plot: 'C', yield: 10 },
    { plot: 'D', yield: 25 },
    { plot: 'E', yield: 20 }
  ];

  const [sortData, setSortData] = useState<number[]>([...initialData]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [bars, setBars] = useState<Record<string, number>>({ A: 0, B: 0, C: 0, D: 0, E: 0 });

  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSortClick = (idx: number) => {
    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else {
      const newData = [...sortData];
      const temp = newData[selectedIdx];
      newData[selectedIdx] = newData[idx];
      newData[idx] = temp;
      setSortData(newData);
      setSelectedIdx(null);
    }
  };

  const handleReset = () => {
    setSortData([...initialData]);
    setBars({ A: 0, B: 0, C: 0, D: 0, E: 0 });
    setSelectedIdx(null);
    setFeedback('');
    setQ1('');
    setQ2('');
  };

  const handleCheckAnswers = () => {
    const isSorted = sortData.join(',') === '10,15,20,25,30';
    const isMedianCorrect = q1.trim() === '20';
    const isMeanCorrect = q2.trim() === '20';
    const isChartCorrect =
      bars.A === 15 && bars.B === 30 && bars.C === 10 && bars.D === 25 && bars.E === 20;

    if (!isSorted) {
      setFeedback('Your data cards are not sorted in ascending order correctly.');
      return;
    }
    if (!isChartCorrect) {
      setFeedback('Your bar chart does not match the raw data correctly.');
      return;
    }
    if (!isMedianCorrect) {
      setFeedback('Your median calculation is incorrect. Find the middle value of the sorted data.');
      return;
    }
    if (!isMeanCorrect) {
      setFeedback('Your mean calculation is incorrect. Sum all values and divide by 5.');
      return;
    }

    setFeedback('Excellent! All tasks completed correctly. You have successfully sorted data, calculated summary statistics, and plotted a bar chart.');
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Virtual Lab: Biostatistics" />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Theory Context */}
        <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Biostatistics Basics</h2>
          </div>

          <div className="space-y-4 text-slate-600">
            <p>
              Biostatistics involves applying statistical methods to biological data. In this lab, we analyze <strong>Crop Yield</strong> across 5 experimental plots (A - E).
            </p>

            <div className="p-4 bg-indigo-50 rounded-lg text-indigo-900 text-sm">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <ListOrdered className="w-4 h-4" /> Median
              </h3>
              <p>
                The median is the middle value of a dataset when ordered from least to greatest. If there is an even number of values, the median is the average of the two middle values.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg text-blue-900 text-sm">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Mean (Average)
              </h3>
              <p>
                The mean is calculated by adding all the values and dividing by the total number of values.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg text-green-900 text-sm">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Bar Charts
              </h3>
              <p>
                Bar charts use rectangular bars to represent categorical data. The height of each bar is proportional to the value it represents.
              </p>
            </div>
          </div>
        </div>

        {/* Middle Column: Interactive Visualizer */}
        <div className="lg:col-span-1 bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Interactive Data Tasks</h2>
            <button
              onClick={handleReset}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              title="Reset All"
            >
              <RotateCcw className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-8">
            {/* Task 1: Sorting */}
            <div>
              <h3 className="font-bold text-slate-700 mb-2">1. Sort the Data (Ascending)</h3>
              <p className="text-sm text-slate-500 mb-4">Click two cards to swap their positions.</p>
              <div className="flex gap-2 justify-center">
                {sortData.map((val, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSortClick(idx)}
                    className={`w-14 h-14 text-xl font-bold rounded-lg transition-all ${
                      selectedIdx === idx
                        ? 'bg-indigo-500 text-white scale-110 shadow-lg'
                        : 'bg-slate-100 text-slate-800 hover:bg-indigo-100 border border-slate-200'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Task 2: Charting */}
            <div>
              <h3 className="font-bold text-slate-700 mb-2">2. Plot the Raw Data</h3>
              <p className="text-sm text-slate-500 mb-4">
                Click inside the grid columns to set the bar height for each plot.
              </p>
              <div className="flex justify-center mb-4 text-sm font-semibold text-slate-700">
                Raw Data: A=15, B=30, C=10, D=25, E=20
              </div>
              <div className="relative border-l-2 border-b-2 border-slate-800 w-full max-w-sm mx-auto h-64 flex mt-8">
                <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-600 font-medium">
                  {[30, 25, 20, 15, 10, 5, 0].map((v) => (
                    <span key={v}>{v}</span>
                  ))}
                </div>

                <div className="flex flex-1 justify-around h-full items-end relative">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[30, 25, 20, 15, 10, 5, 0].map((v) => (
                      <div key={v} className="w-full border-t border-slate-200 h-0" />
                    ))}
                  </div>

                  {cropYields.map((c) => (
                    <div
                      key={c.plot}
                      className="w-12 h-full flex flex-col justify-end group relative z-10 border-x border-transparent hover:border-slate-300 transition-colors"
                    >
                      <div className="absolute inset-0 flex flex-col">
                        {[30, 25, 20, 15, 10, 5].map((v) => (
                          <div
                            key={v}
                            onClick={() => setBars({ ...bars, [c.plot]: v })}
                            className="flex-1 hover:bg-indigo-500/20 cursor-pointer z-20 transition-colors"
                          ></div>
                        ))}
                      </div>

                      <div
                        className="w-full bg-indigo-500 pointer-events-none transition-all duration-300 z-10 shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)] rounded-t-sm"
                        style={{ height: `${(bars[c.plot] / 30) * 100}%` }}
                      ></div>
                      <div className="absolute -bottom-6 w-full text-center text-sm font-bold text-slate-700">
                        {c.plot}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Assessment */}
        <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" /> Analysis & Assessment
          </h2>

          <div className="flex flex-col gap-6 flex-1">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                1. Sort the raw data cards in the interactive panel. Are they correctly sorted ascending?
              </label>
              <div
                className={`p-3 rounded text-sm font-semibold flex items-center justify-between ${
                  sortData.join(',') === '10,15,20,25,30'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {sortData.join(',') === '10,15,20,25,30' ? 'Data is sorted! ✓' : 'Not sorted yet...'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                2. Plot the bar chart in the interactive panel. Is it accurate?
              </label>
              <div
                className={`p-3 rounded text-sm font-semibold flex items-center justify-between ${
                  bars.A === 15 && bars.B === 30 && bars.C === 10 && bars.D === 25 && bars.E === 20
                    ? 'bg-green-100 text-green-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {bars.A === 15 && bars.B === 30 && bars.C === 10 && bars.D === 25 && bars.E === 20
                  ? 'Chart is correct! ✓'
                  : 'Chart is incomplete/incorrect...'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                3. What is the Median crop yield (kg)?
              </label>
              <input
                type="text"
                placeholder="Enter median..."
                value={q1}
                onChange={(e) => setQ1(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                4. What is the Mean crop yield (kg)?
              </label>
              <input
                type="text"
                placeholder="Enter mean..."
                value={q2}
                onChange={(e) => setQ2(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="mt-auto">
              <button
                onClick={handleCheckAnswers}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              >
                Verify All Answers
              </button>
              {feedback && (
                <div
                  className={`mt-4 p-4 rounded-lg text-sm font-semibold border ${
                    feedback.includes('Excellent')
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  {feedback}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
