'use client';

import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, Settings, Moon, Sun, LogOut, CreditCard, CircleHelp as HelpCircle, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { toast } from '@/hooks/use-toast';

interface UserDropdownProps {
  onNavigate?: (section: string) => void;
}

export function UserDropdown({ onNavigate }: UserDropdownProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" className="h-10 px-2 sm:px-3 rounded-xl">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
          <User className="h-3.5 w-3.5 text-slate-400" />
        </div>
        <div className="hidden sm:block ml-2">
          <div className="h-3 w-12 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
        </div>
      </Button>
    );
  }

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out successfully',
      description: 'You have been signed out of your account.',
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex items-center gap-2 h-10 px-2 sm:px-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
            <User className="h-3.5 w-3.5 text-white" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Pro Plan</p>
          </div>
          <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 p-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />

        <DropdownMenuItem
          onClick={() => {
            if (onNavigate) {
              onNavigate('dashboard');
            } else {
              router.push('/');
            }
          }}
          className="gap-3 cursor-pointer text-slate-700 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-slate-800"
        >
          <LayoutDashboard className="h-4 w-4 text-slate-400" />
          <span>Dashboard</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push('/settings')}
          className="gap-3 cursor-pointer text-slate-700 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-slate-800"
        >
          <Settings className="h-4 w-4 text-slate-400" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push('/help')}
          className="gap-3 cursor-pointer text-slate-700 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-slate-800"
        >
          <HelpCircle className="h-4 w-4 text-slate-400" />
          <span>Help & Support</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push('/billing')}
          className="gap-3 cursor-pointer text-slate-700 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-slate-800"
        >
          <CreditCard className="h-4 w-4 text-slate-400" />
          <span>Billing</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />

        <DropdownMenuItem
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="gap-3 cursor-pointer text-slate-700 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-slate-800"
        >
          {resolvedTheme === 'dark' ? (
            <>
              <Sun className="h-4 w-4 text-slate-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 text-slate-400" />
              <span>Dark Mode</span>
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="gap-3 cursor-pointer text-rose-600 dark:text-rose-400 focus:bg-rose-50 dark:focus:bg-rose-900/20"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
