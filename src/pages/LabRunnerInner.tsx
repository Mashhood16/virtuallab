import { useRef, useCallback } from 'react';
import { getLabComponent } from '../routes/labRoutes';
import { LAB_MODULES } from '../data/labModules';
import { historyDB } from '../services/dbService';
import { useAuth } from '../store';
import { getAnonymousId } from '../utils/sessionId';
import Layout from '../components/Layout';

interface LabRunnerInnerProps {
  moduleId: string | undefined;
  onExit: () => void;
}

export default function LabRunnerInner({ moduleId, onExit }: LabRunnerInnerProps) {
  const LabComponent = moduleId ? getLabComponent(moduleId) : null;
  const { user } = useAuth();
  const startTime = useRef(Date.now());
  const exiting = useRef(false);

  const handleExit = useCallback(() => {
    if (exiting.current) return;
    exiting.current = true;

    // Save history to IndexedDB (fire-and-forget — don't block navigation)
    if (moduleId) {
      const mod = LAB_MODULES.find(m => m.id === moduleId);
      if (mod) {
        const userId = user?.id || getAnonymousId();
        const elapsed = Math.round((Date.now() - startTime.current) / 1000);
        historyDB.addRecord(userId, {
          labId: mod.id,
          title: mod.title,
          subject: mod.subject,
          score: 0,
          maxScore: 100,
          timeSpentSeconds: elapsed,
        }).catch((err) => console.error('Failed to save lab history', err));
      }
    }

    onExit();
  }, [moduleId, user, onExit]);

  if (!LabComponent || !moduleId) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-50 rounded-2xl border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Module Not Found</h2>
          <p className="text-slate-500 mb-6">The module "{moduleId}" does not exist or is still under construction.</p>
          <button onClick={handleExit} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
            Return to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <div className="text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <LabComponent onExit={handleExit} />
    </div>
  );
}
