'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/header';
import { DailyLearningTracker } from '@/components/daily-learning-tracker';
import { DailyWorkStatus } from '@/components/daily-work-status';
import { ReportGenerator } from '@/components/report-generator';
import { EmailGenerator } from '@/components/email-generator';
import { ManagerSummary } from '@/components/manager-summary';
import { ExportFeatures } from '@/components/export-features';
import { AutoSaveIndicator } from '@/components/auto-save-indicator';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { LearningData, WorkData, WeeklyData } from '@/types';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Card, CardContent } from '@/components/ui/card';
import { calculateProductivityScore } from '@/lib/calculations';
import { Sidebar } from '@/components/sidebar';
import { Target } from "lucide-react";
import {
  BookOpen,
  Bot,
  CheckSquare,
  TrendingUp
} from 'lucide-react';
// Dynamically import AnalyticsDashboard to avoid SSR issues with recharts
const AnalyticsDashboard = dynamic(
  () => import('@/components/analytics-dashboard').then((mod) => mod.AnalyticsDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-[350px] bg-muted animate-pulse rounded-lg" />
          <div className="h-[350px] bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    )
  }
);

const defaultLearningData: LearningData = {
  learningHours: 0,
  aiToolsExplored: [],
  learningResources: '',
  conceptsLearned: '',
  keyTakeaways: '',
};

const defaultWorkData: WorkData = {
  tasksCompleted: '',
  featuresDelivered: '',
  bugsFixed: '',
  tomorrowPlan: '',
  currentBlockers: '',
};

const defaultWeeklyData: WeeklyData[] = [
  { day: 'Mon', learningHours: 0, productivityScore: 0, date: '' },
  { day: 'Tue', learningHours: 0, productivityScore: 0, date: '' },
  { day: 'Wed', learningHours: 0, productivityScore: 0, date: '' },
  { day: 'Thu', learningHours: 0, productivityScore: 0, date: '' },
  { day: 'Fri', learningHours: 0, productivityScore: 0, date: '' },
  { day: 'Sat', learningHours: 0, productivityScore: 0, date: '' },
  { day: 'Sun', learningHours: 0, productivityScore: 0, date: '' },
];

export function DashboardContent() {
  const today = new Date().toISOString().split('T')[0];

  const {
    value: learningData,
    setValue: setLearningData,
    isLoading: learningLoading,
  } = useLocalStorage<LearningData>('ai-tracker-learning', defaultLearningData);

  const {
    value: workData,
    setValue: setWorkData,
    isLoading: workLoading,
  } = useLocalStorage<WorkData>('ai-tracker-work', defaultWorkData);

  const {
    value: weeklyData,
    setValue: setWeeklyData,
    isLoading: weeklyLoading,
  } = useLocalStorage<WeeklyData[]>('ai-tracker-weekly', defaultWeeklyData);

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Ensure we have valid data objects with defaults
  const safeLearningData: LearningData = learningData || defaultLearningData;
  const safeWorkData: WorkData = workData || defaultWorkData;
  const safeWeeklyData: WeeklyData[] = weeklyData || defaultWeeklyData;
  const productivityScore = calculateProductivityScore(
    safeLearningData,
    safeWorkData
  );

  const tasksCount = safeWorkData.tasksCompleted
    ? safeWorkData.tasksCompleted.split('\n').filter(Boolean).length
    : 0;
  // Initialize lastSaved from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ai-tracker-last-saved');
      if (stored) {
        setLastSaved(new Date(stored));
      }
    } catch {
      // Ignore errors
    }
  }, []);

  // Auto-save with debounce
  const saveData = useCallback(() => {
    setIsSaving(true);
    setTimeout(() => {
      try {
        const now = new Date();
        setLastSaved(now);
        localStorage.setItem('ai-tracker-last-saved', now.toISOString());
      } catch {
        // Ignore errors
      }
      setIsSaving(false);
    }, 300);
  }, []);

  // Handle learning data change
  const handleLearningChange = useCallback(
    (data: LearningData) => {
      setLearningData(data);
      saveData();
    },
    [setLearningData, saveData]
  );

  // Handle work data change
  const handleWorkChange = useCallback(
    (data: WorkData) => {
      setWorkData(data);
      saveData();
    },
    [setWorkData, saveData]
  );

  // Show welcome toast on first load
  useEffect(() => {
    try {
      const hasSeenWelcome = localStorage.getItem('ai-tracker-welcomed');

      if (!hasSeenWelcome && !learningLoading && !workLoading) {
        toast({
          title: 'Welcome to AI Learning Tracker',
          description:
            'Track your daily learning and work activities. All data is saved automatically.',
        });

        localStorage.setItem('ai-tracker-welcomed', 'true');
      }
    } catch {
      // Ignore errors
    }
  }, [learningLoading, workLoading]);

  if (learningLoading || workLoading || weeklyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            Loading your data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-violet-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="relative max-w-[1500px] mx-auto px-6 py-8">
          {/* Auto-save indicator */}
          <div className="flex justify-end mb-4 relative">
            <AutoSaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
          </div>
<div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

  <div className="absolute top-0 left-1/3 h-72 w-72 rounded-full bg-violet-500/5 blur-[120px]" />
  <div className="absolute top-20 right-20 h-72 w-72 rounded-full bg-indigo-500/5 blur-[120px]" />

  {/* Learning Hours */}
  <Card className="group rounded-[36px] bg-white/90 backdrop-blur-xl border border-white shadow-[0_15px_50px_rgba(15,23,42,0.06)] hover:shadow-[0_25px_60px_rgba(15,23,42,0.10)] hover:-translate-y-2 transition-all duration-300">
    <CardContent className="p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Learning Hours
          </p>

          <h2 className="text-5xl font-black tracking-tight mt-2">
            {safeLearningData.learningHours}
          </h2>

          <p className="text-xs text-green-600 mt-2">
            Today
          </p>
        </div>

<div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
  📖
</div>
      </div>
    </CardContent>
  </Card>

  {/* AI Tools */}
  <Card className="group rounded-[36px] bg-white/90 backdrop-blur-xl border border-white shadow-[0_15px_50px_rgba(15,23,42,0.06)] hover:shadow-[0_25px_60px_rgba(15,23,42,0.10)] hover:-translate-y-2 transition-all duration-300">
    <CardContent className="p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            AI Tools
          </p>

          <h2 className="text-5xl font-black tracking-tight mt-2">
            {safeLearningData.aiToolsExplored.length}
          </h2>

          <p className="text-xs text-green-600 mt-2">
            Tools explored
          </p>
        </div>

<div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-lg">
  🤖
</div>
      </div>
    </CardContent>
  </Card>

  {/* Tasks */}
  <Card className="group rounded-[36px] bg-white/90 backdrop-blur-xl border border-white shadow-[0_15px_50px_rgba(15,23,42,0.06)] hover:shadow-[0_25px_60px_rgba(15,23,42,0.10)] hover:-translate-y-2 transition-all duration-300">
    <CardContent className="p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Tasks Completed
          </p>

          <h2 className="text-5xl font-black tracking-tight mt-2">
            {tasksCount}
          </h2>

          <p className="text-xs text-blue-600 mt-2">
            Today
          </p>
        </div>

<div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-lg">
  ✅
</div>
      </div>
    </CardContent>
  </Card>

  {/* Productivity */}
  <Card className="group rounded-[36px] bg-white/90 backdrop-blur-xl border border-white shadow-[0_15px_50px_rgba(15,23,42,0.06)] hover:shadow-[0_25px_60px_rgba(15,23,42,0.10)] hover:-translate-y-2 transition-all duration-300">
    <CardContent className="p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Productivity Score
          </p>

          <h2 className="text-5xl font-black tracking-tight mt-2 text-amber-500">
            {productivityScore}%
          </h2>

          {productivityScore >= 80 ? (
            <p className="text-xs text-green-600 mt-2">Excellent</p>
          ) : productivityScore >= 60 ? (
            <p className="text-xs text-yellow-600 mt-2">Good Progress</p>
          ) : (
            <p className="text-xs text-red-600 mt-2">Needs Improvement</p>
          )}

          <div className="mt-4 w-40">
            <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                style={{ width: `${productivityScore}%` }}
              />
            </div>
          </div>
        </div>

<div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center shadow-lg">
  📈
</div>
      </div>
    </CardContent>
  </Card>

</div>

          {/* Manager Summary - Top highlight */}
          <div className="mb-6">
            <ManagerSummary learning={safeLearningData} work={safeWorkData} date={today} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Daily Learning Tracker */}
            <DailyLearningTracker data={safeLearningData} onChange={handleLearningChange} />

            {/* Daily Work Status */}
            <DailyWorkStatus data={safeWorkData} onChange={handleWorkChange} />
          </div>

          {/* Analytics Dashboard */}
          <div className="mb-6">
            <AnalyticsDashboard
              learning={safeLearningData}
              work={safeWorkData}
              weeklyData={safeWeeklyData}
            />
          </div>

          {/* Report and Email Generators */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <ReportGenerator learning={safeLearningData} work={safeWorkData} date={today} />
            <EmailGenerator learning={safeLearningData} work={safeWorkData} date={today} />
          </div>

          {/* Export Features */}
          <ExportFeatures learning={safeLearningData} work={safeWorkData} date={today} />
        </main>
      </div>

      <Toaster />
    </div>
  );
}
