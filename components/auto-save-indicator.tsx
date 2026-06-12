'use client';

import { useEffect, useState } from 'react';
import { Check, Loader as Loader2, Cloud, ShieldCheck } from 'lucide-react';

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
}

export function AutoSaveIndicator({ isSaving, lastSaved }: AutoSaveIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (!lastSaved) {
      setTimeAgo('');
      return;
    }

    const updateTimeAgo = () => {
      const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
      if (seconds < 60) {
        setTimeAgo('just now');
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        setTimeAgo(`${minutes} min ago`);
      } else {
        const hours = Math.floor(seconds / 3600);
        setTimeAgo(`${hours}h ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000);
    return () => clearInterval(interval);
  }, [lastSaved]);

  if (isSaving) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
        <span className="text-xs font-medium text-blue-700 dark:text-blue-400">Saving...</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/50">
        <div className="flex items-center justify-center h-4 w-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500">
          <Check className="h-2.5 w-2.5 text-white" />
        </div>
        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Saved {timeAgo}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700">
      <ShieldCheck className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Auto-save ready</span>
    </div>
  );
}
