'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun, User, Menu, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function Header() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setMounted(true);
    setCurrentDate(
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }, []);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-5 w-32 bg-slate-100 animate-pulse rounded" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 lg:hidden">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900 hidden sm:block">AI Tracker</span>
          </div>
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-slate-600">All systems operational</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">{currentDate}</p>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="h-8 w-8 hover:bg-slate-100"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-4 w-4 text-slate-600" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <button className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
            <User className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
