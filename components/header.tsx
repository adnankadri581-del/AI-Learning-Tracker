'use client';

import { useTheme } from 'next-themes';
import { Menu, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useCallback } from 'react';
import { GlobalSearch } from '@/components/global-search';
import { NotificationsDropdown } from '@/components/notifications-dropdown';
import { UserDropdown } from '@/components/user-dropdown';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onNavigate?: (section: string) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [currentGreeting, setCurrentGreeting] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

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

  // Global keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = useCallback(
    (section: string) => {
      switch (section) {
        case 'dashboard':
          router.push('/');
          break;
        case 'settings':
          router.push('/settings');
          break;
        case 'help':
        case 'help-support':
          router.push('/help');
          break;
        default:
          if (onNavigate) {
            onNavigate(section);
          } else {
            router.push('/');
          }
      }
    },
    [onNavigate, router]
  );

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            <div className="h-5 w-40 bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Mobile menu + Mobile brand */}
          <div className="flex items-center gap-3 lg:hidden">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
              <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </Button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/20">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">AI Tracker</span>
                <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">Pro</span>
              </div>
            </div>
          </div>

          {/* Left: Desktop greeting */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{currentGreeting}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{currentDate}</p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/50">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">All systems operational</span>
            </div>
          </div>

          {/* Center: Search bar (Desktop) */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:px-8">
            <button
              onClick={() => setSearchOpen(true)}
              className="group flex items-center gap-3 w-full max-w-md px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
            >
              <Search className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400" />
              <span className="text-sm text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400">Search anything...</span>
              <div className="ml-auto flex items-center gap-1.5">
                <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 px-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  <span>⌘</span>
                  <span>K</span>
                </kbd>
              </div>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Status indicator - Mobile */}
            <div className="flex sm:hidden items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/50">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">Online</span>
            </div>

            {/* Date - Mobile */}
            <div className="hidden sm:flex lg:hidden items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{currentDate}</span>
            </div>

            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="lg:hidden h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Search className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Notifications */}
            <NotificationsDropdown onNavigate={handleNavigate} />

            {/* User Menu */}
            <UserDropdown onNavigate={handleNavigate} />
          </div>
        </div>
      </header>

      {/* Global Search Dialog */}
      <GlobalSearch
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onNavigate={handleNavigate}
      />
    </>
  );
}
