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
import { Clock, Wrench, CircleCheck as CheckCircle2, TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';

const AnalyticsDashboard = dynamic(
  () => import('@/components/analytics-dashboard').then((mod) => mod.AnalyticsDashboard),
  {
    ssr: false,
    loading: () => (
      <Card className="border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
              ))}
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="h-[250px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
              <div className="h-[250px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-blue-500" />
            <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-blue-500/20" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Loading your workspace</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Preparing your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Learning Hours',
      value: safeLearningData.learningHours,
      subtitle: 'Hours invested today',
      icon: Clock,
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
      iconBg: 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10',
      iconColor: 'text-blue-500',
      trend: safeLearningData.learningHours >= 2 ? 'up' : safeLearningData.learningHours >= 1 ? 'neutral' : 'down',
      trendValue: safeLearningData.learningHours >= 2 ? 'On track' : safeLearningData.learningHours >= 1 ? 'In progress' : 'Start learning',
    },
    {
      label: 'AI Tools Explored',
      value: safeLearningData.aiToolsExplored.length,
      subtitle: 'Tools discovered',
      icon: Wrench,
      gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      iconBg: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10',
      iconColor: 'text-emerald-500',
      trend: safeLearningData.aiToolsExplored.length >= 3 ? 'up' : safeLearningData.aiToolsExplored.length >= 1 ? 'neutral' : 'down',
      trendValue: safeLearningData.aiToolsExplored.length >= 3 ? 'Great progress' : safeLearningData.aiToolsExplored.length >= 1 ? 'Keep going' : 'Explore tools',
    },
    {
      label: 'Tasks Completed',
      value: tasksCount,
      subtitle: 'Tasks this session',
      icon: CheckCircle2,
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
      iconBg: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10',
      iconColor: 'text-amber-500',
      trend: tasksCount >= 5 ? 'up' : tasksCount >= 2 ? 'neutral' : 'down',
      trendValue: tasksCount >= 5 ? 'Excellent' : tasksCount >= 2 ? 'Good work' : 'Focus on tasks',
    },
    {
      label: 'Productivity Score',
      value: `${productivityScore}%`,
      subtitle: productivityScore >= 80 ? 'Outstanding' : productivityScore >= 60 ? 'Meeting goals' : productivityScore >= 40 ? 'Room to grow' : 'Needs attention',
      icon: productivityScore >= 80 ? Sparkles : TrendingUp,
      gradient: productivityScore >= 80
        ? 'bg-gradient-to-br from-emerald-500 to-green-600'
        : productivityScore >= 60
        ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
        : productivityScore >= 40
        ? 'bg-gradient-to-br from-amber-500 to-orange-600'
        : 'bg-gradient-to-br from-slate-400 to-slate-500',
      iconBg: productivityScore >= 80
        ? 'bg-gradient-to-br from-emerald-500/10 to-green-500/10'
        : productivityScore >= 60
        ? 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10'
        : productivityScore >= 40
        ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10'
        : 'bg-gradient-to-br from-slate-400/10 to-slate-500/10',
      iconColor: productivityScore >= 80
        ? 'text-emerald-500'
        : productivityScore >= 60
        ? 'text-blue-500'
        : productivityScore >= 40
        ? 'text-amber-500'
        : 'text-slate-400',
      trend: productivityScore >= 80 ? 'up' : productivityScore >= 60 ? 'neutral' : 'down',
      trendValue: productivityScore >= 80 ? 'Top performer' : productivityScore >= 60 ? 'On track' : 'Improve score',
      isScore: true,
      scoreValue: productivityScore,
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3" />;
      case 'down':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30';
      case 'down':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/80 to-blue-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className="lg:pl-64">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Status Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/50">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">All systems operational</span>
              </div>
            </div>
            <AutoSaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
          </div>

          {/* Premium KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
            {statCards.map((stat, index) => (
              <Card
                key={stat.label}
                className={`group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-slate-300/80 dark:hover:border-slate-700 transition-all duration-300 ${stat.isScore ? 'stat-glow' : ''}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg} transition-transform duration-300 group-hover:scale-105`}>
                      <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(stat.trend)}`}>
                      {getTrendIcon(stat.trend)}
                      <span className="hidden sm:inline">{stat.trendValue}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        {stat.value}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{stat.subtitle}</p>
                  </div>

                  {/* Score Progress Bar */}
                  {stat.isScore && (
                    <div className="mt-4 space-y-2">
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${stat.scoreValue}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Decorative gradient */}
                  <div className="absolute -bottom-4 -right-4 h-20 w-20 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Manager Summary - Featured Section */}
          <div className="mb-8">
            <ManagerSummary learning={safeLearningData} work={safeWorkData} date={today} />
          </div>

          {/* Learning & Work Trackers */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <DailyLearningTracker data={safeLearningData} onChange={handleLearningChange} />
            <DailyWorkStatus data={safeWorkData} onChange={handleWorkChange} />
          </div>

          {/* Analytics Dashboard */}
          <div className="mb-8">
            <AnalyticsDashboard
              learning={safeLearningData}
              work={safeWorkData}
              weeklyData={safeWeeklyData}
            />
          </div>

          {/* Report & Email Generation */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <ReportGenerator learning={safeLearningData} work={safeWorkData} date={today} />
            <EmailGenerator learning={safeLearningData} work={safeWorkData} date={today} />
          </div>

          {/* Export Features */}
          <ExportFeatures learning={safeLearningData} work={safeWorkData} date={today} />
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-6 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
              <p>AI Learning Tracker - Enterprise Dashboard</p>
              <p>Secure, real-time data synchronization</p>
            </div>
          </div>
        </footer>
      </div>

      <Toaster />
    </div>
  );
}
