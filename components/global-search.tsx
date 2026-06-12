'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, X, LayoutDashboard, FileText, ChartBar as BarChart3, Target, Bot, History, Settings, ArrowRight, Command } from 'lucide-react';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  section: string;
  keywords: string[];
}

const searchItems: SearchItem[] = [
  // Dashboard sections
  { id: 'dashboard', title: 'Dashboard', description: 'Main dashboard overview', icon: LayoutDashboard, section: 'dashboard', keywords: ['dashboard', 'home', 'overview', 'main'] },
  { id: 'manager-summary', title: 'Manager Summary', description: 'Executive summary for leadership review', icon: FileText, section: 'dashboard', keywords: ['manager', 'summary', 'executive', 'leadership', 'overview'] },
  { id: 'learning-activity', title: 'Learning Activity', description: 'Track AI learning progress', icon: Bot, section: 'dashboard', keywords: ['learning', 'education', 'ai', 'training', 'hours', 'tools'] },
  { id: 'work-update', title: 'Work Update', description: 'Daily work accomplishments', icon: FileText, section: 'dashboard', keywords: ['work', 'tasks', 'completed', 'bugs', 'features'] },
  { id: 'analytics', title: 'Analytics Dashboard', description: 'Learning metrics and trends', icon: BarChart3, section: 'dashboard', keywords: ['analytics', 'charts', 'metrics', 'statistics', 'trends', 'hours'] },

  // Features
  { id: 'report-generator', title: 'Generate Report', description: 'Create professional daily reports', icon: FileText, section: 'reports', keywords: ['report', 'generate', 'summary', 'professional', 'document'] },
  { id: 'email-generator', title: 'Generate Email', description: 'Create status update emails', icon: FileText, section: 'reports', keywords: ['email', 'status', 'update', 'send', 'mail'] },
  { id: 'export-pdf', title: 'Export PDF', description: 'Download report as PDF', icon: FileText, section: 'reports', keywords: ['export', 'pdf', 'download', 'document'] },
  { id: 'export-txt', title: 'Export TXT', description: 'Download report as text', icon: FileText, section: 'reports', keywords: ['export', 'txt', 'text', 'download'] },
  { id: 'print', title: 'Print Report', description: 'Print your daily report', icon: FileText, section: 'reports', keywords: ['print', 'report', 'paper'] },

  // Navigation items
  { id: 'reports', title: 'Reports Section', description: 'View all reports', icon: FileText, section: 'nav', keywords: ['reports', 'documents'] },
  { id: 'analytics-page', title: 'Analytics Section', description: 'Detailed analytics view', icon: BarChart3, section: 'nav', keywords: ['analytics', 'charts', 'graphs'] },
  { id: 'goals', title: 'Goals Section', description: 'Set and track your goals', icon: Target, section: 'nav', keywords: ['goals', 'targets', 'objectives'] },
  { id: 'ai-tools', title: 'AI Tools Section', description: 'Explore AI tools', icon: Bot, section: 'nav', keywords: ['ai', 'tools', 'artificial intelligence', 'machine learning'] },
  { id: 'history', title: 'History Section', description: 'View past activities', icon: History, section: 'nav', keywords: ['history', 'past', 'previous', 'archive'] },
  { id: 'settings', title: 'Settings', description: 'App preferences and settings', icon: Settings, section: 'nav', keywords: ['settings', 'preferences', 'config', 'theme', 'dark mode'] },
];

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (section: string) => void;
}

export function GlobalSearch({ open, onOpenChange, onNavigate }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter items based on query
  const filteredItems = query.trim()
    ? searchItems.filter((item) =>
        item.keywords.some((keyword) => keyword.includes(query.toLowerCase())) ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      )
    : searchItems;

  // Group items by section
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, SearchItem[]>);

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelectItem(filteredItems[selectedIndex]);
    } else if (e.key === 'Escape') {
      onOpenChange(false);
    }
  }, [filteredItems, selectedIndex, onOpenChange]);

  const handleSelectItem = (item: SearchItem) => {
    onNavigate(item.id);
    onOpenChange(false);
  };

  const getSectionLabel = (section: string) => {
    switch (section) {
      case 'dashboard': return 'Dashboard';
      case 'reports': return 'Reports & Exports';
      case 'nav': return 'Navigation';
      default: return section;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-200 dark:border-slate-700">
          <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search sections, reports, settings..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-7 px-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            Esc
          </Button>
        </div>

        {/* Results */}
        <ScrollArea className="max-h-[400px]">
          {filteredItems.length > 0 ? (
            <div className="py-2">
              {Object.entries(groupedItems).map(([section, items]) => (
                <div key={section}>
                  <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {getSectionLabel(section)}
                  </div>
                  {items.map((item) => {
                    const globalIndex = filteredItems.indexOf(item);
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectItem(item)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          globalIndex === selectedIndex
                            ? 'bg-slate-100 dark:bg-slate-800'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          globalIndex === selectedIndex
                            ? 'bg-blue-500/10 dark:bg-blue-500/20'
                            : 'bg-slate-100 dark:bg-slate-800'
                        }`}>
                          <Icon className={`h-4 w-4 ${
                            globalIndex === selectedIndex
                              ? 'text-blue-500 dark:text-blue-400'
                              : 'text-slate-500 dark:text-slate-400'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            globalIndex === selectedIndex
                              ? 'text-slate-900 dark:text-slate-100'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}>
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                        </div>
                        {globalIndex === selectedIndex && (
                          <ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
                <Search className="h-7 w-7 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No results found</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try a different search term</p>
            </div>
          )}
        </ScrollArea>

        {/* Footer hint */}
        <div className="flex items-center justify-between px-4 py-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-mono text-slate-600 dark:text-slate-300">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-mono text-slate-600 dark:text-slate-300">↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-mono text-slate-600 dark:text-slate-300">Enter</kbd>
              <span>Select</span>
            </span>
          </div>
          <span className="flex items-center gap-1.5">
            <Command className="h-3 w-3" />
            <span>K to toggle</span>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
