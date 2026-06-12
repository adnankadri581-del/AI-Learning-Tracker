'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  ChartBar as BarChart3,
  History,
  Target,
  Bot,
  Settings,
  Sparkles,
  CircleHelp as HelpCircle,
  Keyboard,
} from 'lucide-react';

const items = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/', badge: null },
  { icon: FileText, label: 'Reports', href: '/reports', badge: '3' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics', badge: null },
  { icon: Target, label: 'Goals', href: '/goals', badge: null },
  { icon: Bot, label: 'AI Tools', href: '/ai-tools', badge: 'New' },
  { icon: History, label: 'History', href: '/history', badge: null },
];

const bottomItems = [
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: HelpCircle, label: 'Help & Support', href: '/help' },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200/60 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
      <div className="flex h-full flex-col">
        {/* Brand Header */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-3 p-5 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        >
          <div className="relative">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 shadow-lg shadow-blue-500/25">
              <Sparkles className="h-5.5 w-5.5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500" />
          </div>
          <div className="min-w-0 text-left">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">AI Learning Tracker</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">Pro</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">Enterprise</span>
            </div>
          </div>
        </button>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2">Main Menu</div>
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {/* Active indicator */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full" />
                )}

                <div className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                  active
                    ? 'bg-blue-500/10 dark:bg-blue-500/20'
                    : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
                }`}>
                  <Icon className={`h-4 w-4 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                </div>
                <span className="flex-1 text-left">{item.label}</span>

                {/* Badge */}
                {item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                    item.badge === 'New'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="px-4 py-3 mx-3 mb-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
            <Keyboard className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Quick Actions</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-1.5 rounded-md border border-slate-200/80 dark:border-slate-600/80">
              <span className="font-mono font-medium text-slate-600 dark:text-slate-300">⌘K</span>
              <span className="ml-1">Search</span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-1.5 rounded-md border border-slate-200/80 dark:border-slate-600/80">
              <span className="font-mono font-medium text-slate-600 dark:text-slate-300">⌘N</span>
              <span className="ml-1">New</span>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* AI Assistant Panel */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="h-4 w-4" />
              <span className="text-xs font-semibold">AI Assistant</span>
            </div>
            <p className="text-[11px] text-blue-100 leading-relaxed">
              Get instant help with learning goals and productivity tips
            </p>
            <button className="mt-3 w-full py-2 text-xs font-semibold bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
              Ask AI
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
