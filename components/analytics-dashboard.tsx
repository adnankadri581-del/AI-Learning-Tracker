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
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LearningData, WorkData, WeeklyData } from '@/types';
import { calculateStatistics, calculateProductivityScore } from '@/lib/calculations';
import { Clock, Wrench, FileText, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AnalyticsDashboardProps {
  learning: LearningData | undefined | null;
  work: WorkData | undefined | null;
  weeklyData: WeeklyData[] | undefined | null;
}

// Default values
const DEFAULT_WEEKLY_DATA: WeeklyData[] = [
  { day: 'Mon', learningHours: 0, productivityScore: 0, date: '' },
  { day: 'Tue', learningHours: 0, productivityScore: 0, date: '' },
  { day: 'Wed', learningHours: 0, productivityScore: 0, date: '' },
  { day: 'Thu', learningHours: 0, productivityScore: 0, date: '' },
  { day: 'Fri', learningHours: 0, productivityScore: 0, date: '' },
  { day: 'Sat', learningHours: 0, productivityScore: 0, date: '' },
  { day: 'Sun', learningHours: 0, productivityScore: 0, date: '' },
];

// Helper to safely get learning data
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

// Helper to safely get work data
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
      title: 'Total Learning Hours',
      value: statistics.totalLearningHours || safeLearning.learningHours || 0,
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'AI Tools Learned',
      value: statistics.aiToolsLearned || aiToolsExplored.length || 0,
      icon: Wrench,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Reports Generated',
      value: statistics.reportsGenerated || 0,
      icon: FileText,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Productivity Score',
      value: `${currentProductivityScore}%`,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  // Prepare chart data
  const chartData = safeWeeklyData.length > 0
    ? safeWeeklyData
    : DEFAULT_WEEKLY_DATA;

  // Add current day data
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const currentChartData = chartData.map((d) =>
    d?.day === today
      ? { ...d, learningHours: safeLearning.learningHours || 0, productivityScore: currentProductivityScore }
      : d
  );

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="transition-all duration-200 hover:shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Learning Hours Chart */}
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Weekly Learning Hours</CardTitle>
            <CardDescription>Your learning activity this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar
                      dataKey="learningHours"
                      fill="hsl(var(--chart-1))"
                      radius={[4, 4, 0, 0]}
                      name="Hours"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full bg-muted animate-pulse rounded" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Learning Progress Trend Chart */}
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Learning Progress Trend</CardTitle>
            <CardDescription>Productivity score over the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="productivityScore"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Productivity Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full bg-muted animate-pulse rounded" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Progress */}
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Today's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Overall Productivity</span>
              <span className="text-sm font-medium">{currentProductivityScore}%</span>
            </div>
            <Progress value={currentProductivityScore} className="h-3" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
