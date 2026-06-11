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
import { Clock, Wrench, CircleCheck as CheckCircle2, TrendingUp } from 'lucide-react';

const AnalyticsDashboard = dynamic(
  () => import('@/components/analytics-dashboard').then((mod) => mod.AnalyticsDashboard),
  {
    ssr: false,
    loading: () => (
      <Card className="border border-slate-200/60 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-lg" />
              ))}
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="h-[250px] bg-slate-100 animate-pulse rounded-lg" />
              <div className="h-[250px] bg-slate-100 animate-pulse rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>
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

  const safeLearningData: LearningData = learningData || defaultLearningData;
  const safeWorkData: WorkData = workData || defaultWorkData;
  const safeWeeklyData: WeeklyData[] = weeklyData || defaultWeeklyData;
  const productivityScore = calculateProductivityScore(safeLearningData, safeWorkData);

  const tasksCount = safeWorkData.tasksCompleted
    ? safeWorkData.tasksCompleted.split('\n').filter(Boolean).length
    : 0;

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

  const handleLearningChange = useCallback(
    (data: LearningData) => {
      setLearningData(data);
      saveData();
    },
    [setLearningData, saveData]
  );

  const handleWorkChange = useCallback(
    (data: WorkData) => {
      setWorkData(data);
      saveData();
    },
    [setWorkData, saveData]
  );

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
          <p className="text-sm text-slate-500">
            Loading your data...
          </p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Learning Hours',
      value: safeLearningData.learningHours,
      subtitle: 'Today',
      icon: Clock,
      gradient: 'from-blue-500 to-indigo-500',
      bgGradient: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-100',
    },
    {
      label: 'AI Tools',
      value: safeLearningData.aiToolsExplored.length,
      subtitle: 'Tools explored',
      icon: Wrench,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-green-50',
      borderColor: 'border-emerald-100',
    },
    {
      label: 'Tasks Completed',
      value: tasksCount,
      subtitle: 'Today',
      icon: CheckCircle2,
      gradient: 'from-violet-500 to-purple-500',
      bgGradient: 'from-violet-50 to-purple-50',
      borderColor: 'border-violet-100',
    },
    {
      label: 'Productivity Score',
      value: `${productivityScore}%`,
      subtitle: productivityScore >= 80 ? 'Excellent' : productivityScore >= 60 ? 'Good' : 'Needs focus',
      icon: TrendingUp,
      gradient: productivityScore >= 80 ? 'from-emerald-500 to-green-500' : productivityScore >= 60 ? 'from-amber-500 to-orange-500' : 'from-slate-400 to-slate-500',
      bgGradient: productivityScore >= 80 ? 'from-emerald-50 to-green-50' : productivityScore >= 60 ? 'from-amber-50 to-orange-50' : 'from-slate-50 to-gray-50',
      borderColor: productivityScore >= 80 ? 'border-emerald-100' : productivityScore >= 60 ? 'border-amber-100' : 'border-slate-200',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className="lg:pl-64">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex justify-end mb-4">
            <AutoSaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {statCards.map((stat) => (
              <Card
                key={stat.label}
                className={`relative overflow-hidden border ${stat.borderColor} bg-gradient-to-br ${stat.bgGradient} shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">
                        {stat.label}
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
                    </div>
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${stat.gradient} shadow-sm`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mb-6">
            <ManagerSummary learning={safeLearningData} work={safeWorkData} date={today} />
          </div>

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <DailyLearningTracker data={safeLearningData} onChange={handleLearningChange} />
            <DailyWorkStatus data={safeWorkData} onChange={handleWorkChange} />
          </div>

          <div className="mb-6">
            <AnalyticsDashboard
              learning={safeLearningData}
              work={safeWorkData}
              weeklyData={safeWeeklyData}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <ReportGenerator learning={safeLearningData} work={safeWorkData} date={today} />
            <EmailGenerator learning={safeLearningData} work={safeWorkData} date={today} />
          </div>

          <ExportFeatures learning={safeLearningData} work={safeWorkData} date={today} />
        </main>
      </div>

      <Toaster />
    </div>
  );
}
