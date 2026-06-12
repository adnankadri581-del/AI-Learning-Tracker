'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartBar as BarChart3, ArrowLeft, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="lg:hidden">
        <div className="flex items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Analytics</h1>
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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Analytics</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Detailed learning metrics and insights</p>
            </div>
          </div>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-slate-500" /><CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Learning Trends</CardTitle></div>
              <CardDescription className="text-slate-500 dark:text-slate-400">Your progress over time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50"><p className="text-xs text-slate-500 dark:text-slate-400">Total Hours</p><p className="text-2xl font-bold text-slate-900 dark:text-slate-100">24.5</p></div>
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/50"><p className="text-xs text-slate-500 dark:text-slate-400">AI Tools</p><p className="text-2xl font-bold text-slate-900 dark:text-slate-100">8</p></div>
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/50"><p className="text-xs text-slate-500 dark:text-slate-400">Reports</p><p className="text-2xl font-bold text-slate-900 dark:text-slate-100">12</p></div>
                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200/50 dark:border-indigo-800/50"><p className="text-xs text-slate-500 dark:text-slate-400">Avg Score</p><p className="text-2xl font-bold text-slate-900 dark:text-slate-100">76%</p></div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">View detailed charts on the <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">main dashboard</Link></p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-slate-500" /><CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Weekly Summary</CardTitle></div>
              <CardDescription className="text-slate-500 dark:text-slate-400">This week&apos;s learning activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-10">{day}</span>
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${Math.random() * 80 + 20}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
