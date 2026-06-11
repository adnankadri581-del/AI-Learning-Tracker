'use client';

import { useEffect, useState } from 'react';
import { Check, Loader as Loader2, Cloud, CloudOff } from 'lucide-react';

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
      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
        <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
        <span>Saving...</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
        <div className="flex items-center justify-center h-4 w-4 rounded-full bg-emerald-100">
          <Check className="h-2.5 w-2.5 text-emerald-600" />
        </div>
        <span>Auto-saved {timeAgo}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-400">
      <Cloud className="h-3 w-3" />
      <span>Ready</span>
    </div>
  );
}
