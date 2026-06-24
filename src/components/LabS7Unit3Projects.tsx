import { BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS7Unit3Projects({ onExit }: LabProps) {
  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans">
      <LabHeader onExit={onExit} title="Unit 3: Immunity and Diseases Projects" />

      <div className="flex-1 p-8 flex flex-col items-center">
        <div className="bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-200 max-w-4xl w-full">
          <div className="flex items-center mb-8">
            <div className="bg-purple-100 p-3 rounded-xl mr-4"><BookOpen className="w-8 h-8 text-purple-600" /></div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Health Campaigns & Infographics</h2>
              <p className="text-slate-500">Project Work Submission Guide</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <h3>Project A: Disease Infographic Poster</h3>
            <p>Create an infographic poster about a disease you (or a family member) have suffered from. Divide the poster into four clear sections:</p>
            <ul>
              <li><strong>Cause:</strong> What pathogen causes it? (Virus, Bacteria, Fungi, etc.)</li>
              <li><strong>Symptoms:</strong> How does it make you feel?</li>
              <li><strong>Transmission:</strong> How does it spread from person to person?</li>
              <li><strong>Prevention:</strong> How can someone avoid catching it?</li>
            </ul>

            <hr className="my-8" />

            <h3>Project B: Immunity Booster Campaign</h3>
            <p>Create an awareness campaign to educate your school community on how to naturally boost the immune system. Design a poster titled <em>"How to boost your immune system"</em>.</p>
            
            <h4>Key Points to Include:</h4>
            <ul>
              <li>Eating a balanced diet rich in Vitamin C and antioxidants.</li>
              <li>Getting adequate, high-quality sleep (8-10 hours for students).</li>
              <li>Regular physical exercise.</li>
              <li>Proper hygiene practices like handwashing.</li>
            </ul>

            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200 mt-8">
              <h4 className="text-emerald-800 font-bold mt-0">Display</h4>
              <p className="text-emerald-700 mb-0">The best posters will be displayed in the school corridors to run a real awareness campaign for the student body.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
