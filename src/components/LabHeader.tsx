import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

export type LabHeaderVariant = 'light' | 'dark' | 'emerald' | 'amber' | 'blue';

interface LabHeaderProps {
  onExit: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  rightContent?: ReactNode;
  variant?: LabHeaderVariant;
}

const variantStyles: Record<LabHeaderVariant, { container: string; button: string; title: string; subtitle: string }> = {
  light: {
    container: 'bg-slate-50 border-b border-slate-200',
    button: 'p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600',
    title: 'text-slate-800',
    subtitle: 'text-slate-500',
  },
  dark: {
    container: 'bg-slate-800 border-b border-slate-700 text-white',
    button: 'p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-300',
    title: 'text-white',
    subtitle: 'text-slate-300',
  },
  emerald: {
    container: 'bg-emerald-700 text-white',
    button: 'p-2 hover:bg-emerald-600 rounded-full transition-colors text-white/80',
    title: 'text-white',
    subtitle: 'text-emerald-100',
  },
  amber: {
    container: 'bg-amber-700 text-white',
    button: 'p-2 hover:bg-amber-600 rounded-full transition-colors text-white/80',
    title: 'text-white',
    subtitle: 'text-amber-100',
  },
  blue: {
    container: 'bg-blue-900 text-white',
    button: 'p-2 hover:bg-blue-800 rounded-full transition-colors text-white/80',
    title: 'text-white',
    subtitle: 'text-blue-200',
  },
};

export default function LabHeader({ onExit, title, subtitle, icon, rightContent, variant = 'light' }: LabHeaderProps) {
  const styles = variantStyles[variant];
  return (
    <div className={`${styles.container} px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm shrink-0`}>
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onExit}
          className={`${styles.button} shrink-0`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className={`text-xl font-bold ${styles.title} flex items-center gap-2 truncate`}>
            {icon}
            {title}
          </h1>
          {subtitle && (
            <p className={`text-sm ${styles.subtitle} truncate`}>{subtitle}</p>
          )}
        </div>
      </div>
      {rightContent && (
        <div className="shrink-0 ml-4">
          {rightContent}
        </div>
      )}
    </div>
  );
}
