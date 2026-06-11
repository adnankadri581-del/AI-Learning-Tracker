'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun, Brain, User } from 'lucide-react';
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
      <header className="sticky top-0 z-50
bg-white/80
backdrop-blur-xl
border-b">
        <div className="max-w-[1400px] mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9" />
            <div className="h-6 w-40 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-[1400px] mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary text-primary-foreground">
            <Brain className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold tracking-tight">AI Learning Tracker</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">{currentDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground hidden md:block">{currentDate}</p>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <div className="flex items-center justify-center h-9 w-9 rounded-full bg-muted">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
