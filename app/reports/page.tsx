'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft, Calendar, Download, Eye } from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
  const reports = [
    { id: '1', date: '2026-06-12', title: 'Daily Report - June 12, 2026', preview: 'Completed AI learning activities...' },
    { id: '2', date: '2026-06-11', title: 'Daily Report - June 11, 2026', preview: 'Focused on ML fundamentals...' },
    { id: '3', date: '2026-06-10', title: 'Daily Report - June 10, 2026', preview: 'Explored new AI tools...' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="lg:hidden">
        <div className="flex items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Reports</h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="hidden lg:block mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reports</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Your generated daily reports</p>
            </div>
          </div>

          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                        <FileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{report.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{report.preview}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-slate-400 dark:text-slate-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(report.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8"><Eye className="h-4 w-4 mr-1" />View</Button>
                      <Button variant="ghost" size="sm" className="h-8"><Download className="h-4 w-4 mr-1" />Export</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
