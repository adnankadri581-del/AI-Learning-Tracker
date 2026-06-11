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
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LearningData, WorkData, WeeklyData } from '@/types';
import { calculateStatistics, calculateProductivityScore } from '@/lib/calculations';
import { Clock, Wrench, FileText, TrendingUp, ChartBar as BarChart3, Activity } from 'lucide-react';

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
      subtitle: 'Total time invested',
      icon: Clock,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-100',
    },
    {
      title: 'AI Tools',
      value: statistics.aiToolsLearned || aiToolsExplored.length || 0,
      subtitle: 'Tools explored',
      icon: Wrench,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-green-50',
      borderColor: 'border-emerald-100',
    },
    {
      title: 'Reports',
      value: statistics.reportsGenerated || 0,
      subtitle: 'Generated reports',
      icon: FileText,
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-yellow-50',
      borderColor: 'border-amber-100',
    },
    {
      title: 'Productivity',
      value: `${currentProductivityScore}%`,
      subtitle: 'Current score',
      icon: TrendingUp,
      gradient: 'from-violet-500 to-purple-500',
      bgGradient: 'from-violet-50 to-purple-50',
      borderColor: 'border-violet-100',
    },
  ];

  const chartData = safeWeeklyData.length > 0 ? safeWeeklyData : DEFAULT_WEEKLY_DATA;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const currentChartData = chartData.map((d) =>
    d?.day === today
      ? { ...d, learningHours: safeLearning.learningHours || 0, productivityScore: currentProductivityScore }
      : d
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-emerald-400';
    if (score >= 60) return 'from-blue-500 to-blue-400';
    if (score >= 40) return 'from-amber-500 to-amber-400';
    return 'from-slate-400 to-slate-300';
  };

  return (
    <Card className="border border-slate-200/60 bg-white shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100">
            <BarChart3 className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Analytics Dashboard
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 mt-1">
              Track your learning metrics and productivity trends
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className={`relative overflow-hidden rounded-xl border ${stat.borderColor} bg-gradient-to-br ${stat.bgGradient} p-4`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-sm`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm font-medium text-slate-700 mt-1">{stat.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="border border-slate-200/60 bg-slate-50/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <CardTitle className="text-base font-semibold text-slate-900">
                  Weekly Learning Hours
                </CardTitle>
              </div>
              <CardDescription className="text-sm text-slate-500">
                Your learning activity this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[220px] sm:h-[250px]">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      <Bar
                        dataKey="learningHours"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        name="Hours"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full bg-slate-100 animate-pulse rounded" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/60 bg-slate-50/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-500" />
                <CardTitle className="text-base font-semibold text-slate-900">
                  Learning Progress Trend
                </CardTitle>
              </div>
              <CardDescription className="text-sm text-slate-500">
                Productivity score over the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[220px] sm:h-[250px]">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="productivityScore"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#10b981' }}
                        activeDot={{ r: 6, fill: '#10b981' }}
                        name="Productivity Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full bg-slate-100 animate-pulse rounded" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">Today's Progress</span>
            </div>
            <span className="text-sm font-bold text-slate-900">{currentProductivityScore}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${getScoreColor(currentProductivityScore)}`}
              style={{ width: `${currentProductivityScore}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {currentProductivityScore >= 80
              ? 'Excellent progress today!'
              : currentProductivityScore >= 60
              ? 'Good progress, keep going!'
              : currentProductivityScore >= 40
              ? 'Making progress, room to improve'
              : 'Focus on completing more tasks'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
