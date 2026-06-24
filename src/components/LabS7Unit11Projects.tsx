import { BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS7Unit11Projects({ onExit }: LabProps) {
  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans">
      <LabHeader onExit={onExit} title="Unit 11: Technology in Everyday Life Projects" />

      <div className="flex-1 p-8 flex flex-col items-center">
        <div className="bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-200 max-w-4xl w-full">
          <div className="flex items-center mb-8">
            <div className="bg-sky-100 p-3 rounded-xl mr-4"><BookOpen className="w-8 h-8 text-sky-600" /></div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Water Footprint Tracker</h2>
              <p className="text-slate-500">Project Work Submission Guide</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <h3>Objective</h3>
            <p>Calculate your direct water usage over a five-day period and lead a water conservation drive in your school.</p>
            
            <h3>Part 1: The 5-Day Audit</h3>
            <p>Keep a notebook and estimate how many liters of water you use daily for the following activities:</p>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-slate-300 mb-4">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="border border-slate-300 p-2 text-left">Activity</th>
                    <th className="border border-slate-300 p-2 text-left">Estimated Liters per Use</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-slate-300 p-2">Flushing Toilet</td><td className="border border-slate-300 p-2">~6 to 9 Liters</td></tr>
                  <tr><td className="border border-slate-300 p-2">Brushing Teeth (Tap running)</td><td className="border border-slate-300 p-2">~5 Liters per min</td></tr>
                  <tr><td className="border border-slate-300 p-2">Shower</td><td className="border border-slate-300 p-2">~10 Liters per min</td></tr>
                  <tr><td className="border border-slate-300 p-2">Drinking</td><td className="border border-slate-300 p-2">~0.25 Liters per glass</td></tr>
                </tbody>
              </table>
            </div>

            <h3>Part 2: The Conservation Drive</h3>
            <p>Compare your total 5-day usage with your classmates. Then, design posters suggesting ways to save water (e.g., turning off the tap while brushing, taking shorter showers). Distribute these posters around your school's bathrooms and cafeteria.</p>

          </div>
        </div>
      </div>
    </div>
  );
}
