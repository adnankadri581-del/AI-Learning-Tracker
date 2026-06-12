'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, ArrowLeft, Calendar, Clock, FileText, Bot } from 'lucide-react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';

const historyItems = [
  { id: '1', type: 'learning', title: 'Explored ChatGPT and Claude', description: 'Completed 2.5 hours of learning', date: '2026-06-12', time: '10:30 AM' },
  { id: '2', type: 'report', title: 'Generated Daily Report', description: 'Report for June 12, 2026', date: '2026-06-12', time: '11:45 AM' },
  { id: '3', type: 'email', title: 'Generated Status Email', description: 'Email sent to team', date: '2026-06-12', time: '2:15 PM' },
  { id: '4', type: 'learning', title: 'AI Fundamentals Course', description: 'Completed module 3', date: '2026-06-11', time: '3:00 PM' },
  { id: '5', type: 'export', title: 'Exported Report as PDF', description: 'daily-report-2026-06-11.pdf', date: '2026-06-11', time: '4:30 PM' },
];

function HistoryContent() {
  const getIcon = (type: string) => type === 'learning' ? Bot : FileText;
  const getIconColor = (type: string) => type === 'learning' ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500' : type === 'report' ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-500' : 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="lg:hidden">
        <div className="flex items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">History</h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="hidden lg:block mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <ArrowLeft className="h-4 w-4" />Back to Dashboard
          </Link>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
              <History className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">History</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Your recent activities and exports</p>
            </div>
          </div>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-slate-500" /><CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Activity</CardTitle></div>
              <CardDescription className="text-slate-500 dark:text-slate-400">Your learning and report history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {historyItems.map((item) => {
                  const Icon = getIcon(item.type);
                  return (
                    <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${getIconColor(item.type)}`}><Icon className="h-5 w-5" /></div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{item.date}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" />{item.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <AuthGuard>
      <HistoryContent />
    </AuthGuard>
  );
}
