'use client';

import { LayoutDashboard, FileText, ChartBar as BarChart3, History, Target, Bot, Settings, Sparkles, CircleHelp as HelpCircle, Keyboard } from 'lucide-react';

const items = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true, badge: null },
  { icon: FileText, label: 'Reports', badge: '3' },
  { icon: BarChart3, label: 'Analytics', badge: null },
  { icon: Target, label: 'Goals', badge: null },
  { icon: Bot, label: 'AI Tools', badge: 'New' },
  { icon: History, label: 'History', badge: null },
];

const bottomItems = [
  { icon: Settings, label: 'Settings' },
  { icon: HelpCircle, label: 'Help & Support' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200/60 bg-white/95 backdrop-blur-xl">
      <div className="flex h-full flex-col">
        {/* Brand Header */}
        <div className="flex items-center gap-3 p-5 border-b border-slate-100">
          <div className="relative">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 shadow-lg shadow-blue-500/25">
              <Sparkles className="h-5.5 w-5.5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">AI Learning Tracker</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Pro</span>
              <span className="text-[10px] text-slate-400">Enterprise</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">Main Menu</div>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;

            return (
              <button
                key={item.label}
                className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full" />
                )}

                <div className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-500/10'
                    : 'group-hover:bg-slate-100'
                }`}>
                  <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                </div>
                <span className="flex-1 text-left">{item.label}</span>

                {/* Badge */}
                {item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                    item.badge === 'New'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="px-4 py-3 mx-3 mb-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/50">
          <div className="flex items-center gap-2 text-slate-600 mb-2">
            <Keyboard className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Quick Actions</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="text-[10px] text-slate-500 bg-white px-2 py-1.5 rounded-md border border-slate-200/80">
              <span className="font-mono font-medium text-slate-600">⌘K</span>
              <span className="ml-1">Search</span>
            </div>
            <div className="text-[10px] text-slate-500 bg-white px-2 py-1.5 rounded-md border border-slate-200/80">
              <span className="font-mono font-medium text-slate-600">⌘N</span>
              <span className="ml-1">New</span>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="p-3 border-t border-slate-100">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* User / Help Section */}
        <div className="p-3 border-t border-slate-100">
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
