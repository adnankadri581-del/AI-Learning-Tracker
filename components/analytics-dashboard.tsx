'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LearningData, WorkData, WeeklyData } from '@/types';
import { calculateStatistics, calculateProductivityScore } from '@/lib/calculations';
import { Clock, Wrench, FileText, TrendingUp, ChartBar as BarChart3, Activity, Sparkles, Target, ArrowUpRight, Zap } from 'lucide-react';

interface AnalyticsDashboardProps {
  learning: LearningData | undefined | null;
  work: WorkData | undefined | null;
  weeklyData: WeeklyData[] | undefined | null;
}

const DEFAULT_WEEKLY_DATA: WeeklyData[] = [
  { day: 'Mon', learningHours: 0, productivityScore: 0, date: '' },
  { day: 'Tue', learningHours: 0, productivityScore: 0, date: '' },
  { day: 'Wed', learningHours: 0, productivityScore: 0, date: '' },
  { day: 'Thu', learningHours: 0, productivityScore: 0, date: '' },
  { day: 'Fri', learningHours: 0, productivityScore: 0, date: '' },
  { day: 'Sat', learningHours: 0, productivityScore: 0, date: '' },
  { day: 'Sun', learningHours: 0, productivityScore: 0, date: '' },
];

function safeLearningData(learning: LearningData | undefined | null): LearningData {
  if (!learning) {
    return {
      learningHours: 0,
      aiToolsExplored: [],
      learningResources: '',
      conceptsLearned: '',
      keyTakeaways: '',
    };
  }
  return {
    learningHours: typeof learning.learningHours === 'number' ? learning.learningHours : 0,
    aiToolsExplored: Array.isArray(learning.aiToolsExplored) ? learning.aiToolsExplored : [],
    learningResources: typeof learning.learningResources === 'string' ? learning.learningResources : '',
    conceptsLearned: typeof learning.conceptsLearned === 'string' ? learning.conceptsLearned : '',
    keyTakeaways: typeof learning.keyTakeaways === 'string' ? learning.keyTakeaways : '',
  };
}

function safeWorkData(work: WorkData | undefined | null): WorkData {
  if (!work) {
    return {
      tasksCompleted: '',
      featuresDelivered: '',
      bugsFixed: '',
      tomorrowPlan: '',
      currentBlockers: '',
    };
  }
  return {
    tasksCompleted: typeof work.tasksCompleted === 'string' ? work.tasksCompleted : '',
    featuresDelivered: typeof work.featuresDelivered === 'string' ? work.featuresDelivered : '',
    bugsFixed: typeof work.bugsFixed === 'string' ? work.bugsFixed : '',
    tomorrowPlan: typeof work.tomorrowPlan === 'string' ? work.tomorrowPlan : '',
    currentBlockers: typeof work.currentBlockers === 'string' ? work.currentBlockers : '',
  };
}

export function AnalyticsDashboard({ learning, work, weeklyData }: AnalyticsDashboardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeLearning = safeLearningData(learning);
  const safeWork = safeWorkData(work);

  const currentProductivityScore = calculateProductivityScore(safeLearning, safeWork);

  const safeWeeklyData = Array.isArray(weeklyData) && weeklyData.length > 0
    ? weeklyData
    : DEFAULT_WEEKLY_DATA;

  const statistics = calculateStatistics([
    { learning: safeLearning, work: safeWork },
    ...safeWeeklyData.map((d) => ({
      learning: { learningHours: d?.learningHours || 0 } as LearningData,
      work: {} as WorkData,
    })),
  ]);

  const aiToolsExplored = safeLearning.aiToolsExplored || [];

  const stats = [
    {
      title: 'Learning Hours',
      value: statistics.totalLearningHours || safeLearning.learningHours || 0,
      subtitle: 'Total invested',
      icon: Clock,
      gradient: 'from-blue-500 to-indigo-600',
      iconBg: 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10',
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-200/50',
    },
    {
      title: 'AI Tools',
      value: statistics.aiToolsLearned || aiToolsExplored.length || 0,
      subtitle: 'Tools explored',
      icon: Wrench,
      gradient: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10',
      iconColor: 'text-emerald-500',
      borderColor: 'border-emerald-200/50',
    },
    {
      title: 'Reports',
      value: statistics.reportsGenerated || 0,
      subtitle: 'Generated',
      icon: FileText,
      gradient: 'from-amber-500 to-orange-600',
      iconBg: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10',
      iconColor: 'text-amber-500',
      borderColor: 'border-amber-200/50',
    },
    {
      title: 'Productivity',
      value: `${currentProductivityScore}%`,
      subtitle: 'Current score',
      icon: currentProductivityScore >= 80 ? Sparkles : Target,
      gradient: currentProductivityScore >= 80
        ? 'from-emerald-500 to-green-600'
        : currentProductivityScore >= 60
        ? 'from-blue-500 to-indigo-600'
        : 'from-slate-400 to-slate-500',
      iconBg: currentProductivityScore >= 80
        ? 'bg-gradient-to-br from-emerald-500/10 to-green-500/10'
        : currentProductivityScore >= 60
        ? 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10'
        : 'bg-gradient-to-br from-slate-400/10 to-slate-500/10',
      iconColor: currentProductivityScore >= 80
        ? 'text-emerald-500'
        : currentProductivityScore >= 60
        ? 'text-blue-500'
        : 'text-slate-400',
      borderColor: currentProductivityScore >= 80
        ? 'border-emerald-200/50'
        : currentProductivityScore >= 60
        ? 'border-blue-200/50'
        : 'border-slate-200/50',
    },
  ];

  const chartData = safeWeeklyData.length > 0 ? safeWeeklyData : DEFAULT_WEEKLY_DATA;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const currentChartData = chartData.map((d) =>
    d?.day === today
      ? { ...d, learningHours: safeLearning.learningHours || 0, productivityScore: currentProductivityScore }
      : d
  );

  const getScoreConfig = (score: number) => {
    if (score >= 80) return {
      label: 'Excellent',
      gradient: 'from-emerald-500 to-teal-500',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    };
    if (score >= 60) return {
      label: 'Good',
      gradient: 'from-blue-500 to-indigo-500',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    };
    if (score >= 40) return {
      label: 'Progressing',
      gradient: 'from-amber-500 to-orange-500',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    };
    return {
      label: 'Focus Area',
      gradient: 'from-slate-400 to-slate-500',
      color: 'text-slate-500',
      bg: 'bg-slate-50',
    };
  };

  const scoreConfig = getScoreConfig(currentProductivityScore);

  return (
    <Card className="group relative overflow-hidden bg-white border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-transparent to-indigo-500/3" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-3xl" />

      <CardHeader className="relative pb-4 pt-6 px-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg transition-transform duration-300 group-hover:scale-105">
            <BarChart3 className="h-7 w-7 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
                Analytics Dashboard
              </CardTitle>
              <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 ${scoreConfig.bg}`}>
                <TrendingUp className={`h-3.5 w-3.5 ${scoreConfig.color}`} />
                <span className={`text-xs font-semibold ${scoreConfig.color}`}>{scoreConfig.label}</span>
              </div>
            </div>
            <CardDescription className="text-sm text-slate-500 mt-1">
              Track your learning metrics and productivity trends
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative px-6 pb-6 space-y-6">
        {/* Compact Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className={`group/stat relative overflow-hidden rounded-xl border ${stat.borderColor} bg-white p-4 hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover/stat:text-slate-400 transition-colors" />
              </div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
              <div className="text-sm font-medium text-slate-700 mt-0.5">{stat.title}</div>
              <div className="text-xs text-slate-500">{stat.subtitle}</div>
            </div>
          ))}
        </div>

        {/* Premium Charts */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Weekly Learning Hours Chart */}
          <Card className="border border-slate-200/60 bg-slate-50/30 hover:bg-slate-50/50 transition-colors">
            <CardHeader className="pb-3 pt-5 px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                  </div>
                  <CardTitle className="text-base font-semibold text-slate-900">
                    Weekly Learning Hours
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>This week</span>
                </div>
              </div>
              <CardDescription className="text-sm text-slate-500 mt-1 pl-10">
                Your learning activity throughout the week
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-5 px-5">
              <div className="h-[220px]">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                          padding: '12px 16px',
                        }}
                        labelStyle={{ fontWeight: 600, color: '#1e293b', marginBottom: 4 }}
                      />
                      <Bar
                        dataKey="learningHours"
                        fill="url(#barGradient)"
                        radius={[6, 6, 0, 0]}
                        name="Hours"
                        maxBarSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full bg-slate-100 animate-pulse rounded-lg" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Productivity Trend Chart */}
          <Card className="border border-slate-200/60 bg-slate-50/30 hover:bg-slate-50/50 transition-colors">
            <CardHeader className="pb-3 pt-5 px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                    <Activity className="h-4 w-4 text-emerald-500" />
                  </div>
                  <CardTitle className="text-base font-semibold text-slate-900">
                    Productivity Trend
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <TrendingUp className="h-3 w-3" />
                  <span>Score trend</span>
                </div>
              </div>
              <CardDescription className="text-sm text-slate-500 mt-1 pl-10">
                Your productivity score progression
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-5 px-5">
              <div className="h-[220px]">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                          padding: '12px 16px',
                        }}
                        labelStyle={{ fontWeight: 600, color: '#1e293b', marginBottom: 4 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="productivityScore"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fill="url(#areaGradient)"
                        name="Score"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full bg-slate-100 animate-pulse rounded-lg" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Progress Summary */}
        <div className="rounded-xl border border-slate-200/80 bg-gradient-to-r from-slate-50 to-slate-100/50 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${scoreConfig.gradient} shadow-md`}>
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-700">Today's Progress</span>
                <p className="text-xs text-slate-500">
                  {currentProductivityScore >= 80
                    ? 'Outstanding performance!'
                    : currentProductivityScore >= 60
                    ? 'Great progress, maintain the momentum'
                    : currentProductivityScore >= 40
                    ? 'Making strides, keep pushing forward'
                    : 'Focus on completing more learning activities'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 sm:w-48">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out ${scoreConfig.gradient}`}
                    style={{ width: `${currentProductivityScore}%` }}
                  />
                </div>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-bold text-slate-900">{currentProductivityScore}</span>
                <span className="text-sm text-slate-500">%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
