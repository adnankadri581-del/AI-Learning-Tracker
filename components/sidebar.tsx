'use client';

import { LayoutDashboard, FileText, ChartBar as BarChart3, History, Target, Bot, Settings } from 'lucide-react';

const items = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: FileText, label: 'Reports' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: History, label: 'History' },
  { icon: Target, label: 'Goals' },
  { icon: Bot, label: 'AI Tools' },
  { icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 p-6 border-b border-slate-100">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-900 truncate">AI Learning Tracker</h2>
            <p className="text-xs text-slate-500 truncate">
              Productivity Dashboard
            </p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === 'Dashboard';

            return (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-600">Need help?</p>
            <p className="text-xs text-slate-500 mt-1">Check out our documentation</p>
            <button className="mt-3 w-full text-xs font-medium text-blue-600 hover:text-blue-700">
              View Docs
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
