'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, ArrowLeft, Plus, CircleCheck as CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';

export default function GoalsPage() {
  const goals = [
    { id: '1', title: 'Complete AI Fundamentals Course', description: 'Finish the comprehensive AI fundamentals certification', completed: false, target: 'June 30, 2026' },
    { id: '2', title: 'Explore 10 AI Tools', description: 'Try out at least 10 different AI tools this month', completed: false, target: 'June 30, 2026' },
    { id: '3', title: 'Daily Learning Streak', description: 'Maintain a 30-day learning streak', completed: true, target: 'June 15, 2026' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="lg:hidden">
        <div className="flex items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Goals</h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="hidden lg:block mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <ArrowLeft className="h-4 w-4" />Back to Dashboard
          </Link>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Goals</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Track your learning objectives</p>
              </div>
            </div>
            <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Goal</Button>
          </div>

          <div className="space-y-4">
            {goals.map((goal) => (
              <Card key={goal.id} className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md transition-all ${goal.completed ? 'opacity-70' : ''}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <button className="mt-0.5">
                      {goal.completed ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600" />}
                    </button>
                    <div className="flex-1">
                      <h3 className={`text-sm font-semibold ${goal.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>{goal.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{goal.description}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Target: {goal.target}</p>
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
