'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun, User, Menu, Bot, Search, Bell, Settings, ChevronDown, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function Header() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [currentGreeting, setCurrentGreeting] = useState('');

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    const hour = now.getHours();

    setCurrentDate(
      now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      })
    );

    if (hour < 12) setCurrentGreeting('Good morning');
    else if (hour < 18) setCurrentGreeting('Good afternoon');
    else setCurrentGreeting('Good evening');
  }, []);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-100 animate-pulse" />
            <div className="h-5 w-40 bg-slate-100 animate-pulse rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-8 w-8 rounded-full bg-slate-100 animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile menu + Mobile brand */}
        <div className="flex items-center gap-3 lg:hidden">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100">
            <Menu className="h-5 w-5 text-slate-600" />
          </Button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/20">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold text-slate-900">AI Tracker</span>
              <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Pro</span>
            </div>
          </div>
        </div>

        {/* Left: Desktop greeting */}
        <div className="hidden lg:flex lg:items-center lg:gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">{currentGreeting}</p>
            <p className="text-xs text-slate-500">{currentDate}</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/50">
            <div className="relative">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <span className="text-xs font-medium text-emerald-700">All systems operational</span>
          </div>
        </div>

        {/* Center: Search bar (Desktop) */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:px-8">
          <button className="group flex items-center gap-3 w-full max-w-md px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all">
            <Search className="h-4 w-4 text-slate-400 group-hover:text-slate-500" />
            <span className="text-sm text-slate-400 group-hover:text-slate-500">Search anything...</span>
            <div className="ml-auto flex items-center gap-1.5">
              <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-slate-200 bg-slate-100 px-1.5 text-[10px] font-semibold text-slate-500">
                <span>⌘</span>
                <span>K</span>
              </kbd>
            </div>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status indicator - Mobile */}
          <div className="flex sm:hidden items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200/50">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-semibold text-emerald-700">Online</span>
          </div>

          {/* Date - Mobile */}
          <div className="hidden sm:flex lg:hidden items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/50">
            <span className="text-xs font-medium text-slate-600">{currentDate}</span>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="h-10 w-10 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-5 w-5 text-slate-600" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl hover:bg-slate-100 transition-colors">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white" />
          </Button>

          {/* User Menu */}
          <button className="group flex items-center gap-2 h-10 px-2 sm:px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/50 hover:border-slate-300 transition-all">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
              <User className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-700">User</p>
              <p className="text-[10px] text-slate-400">Pro Plan</p>
            </div>
            <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
}
