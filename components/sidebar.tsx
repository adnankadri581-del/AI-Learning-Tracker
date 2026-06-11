'use client';

import {
  LayoutDashboard,
  FileText,
  BarChart3,
  History,
  Target,
  Bot,
  Settings
} from 'lucide-react';

const items = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: FileText, label: 'Reports' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: History, label: 'History' },
  { icon: Target, label: 'Goals' },
  { icon: Bot, label: 'AI Tools' },
  { icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className="w-64 min-h-screen border-r border-slate-100 bg-white/90 backdrop-blur-xl shadow-[8px_0_40px_rgba(15,23,42,0.04)]">
      <div className="p-6">
        <div className="flex items-center gap-3 px-6 py-6">
 <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-violet-300">
  AI
</div>

  <div>
    <h2 className="font-bold">AI Learning Tracker</h2>
    <p className="text-xs text-muted-foreground">
      Productivity Dashboard
    </p>
  </div>
</div>
      </div>

      <nav className="px-3 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
<button
 className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
  item.label === "Dashboard"
    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-300"
    : "bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-600 border border-slate-100"
}`}
>
  <Icon className="h-5 w-5" />
  <span className="font-medium">{item.label}</span>
</button>
          );
        })}
      </nav>
    </aside>
  );
}