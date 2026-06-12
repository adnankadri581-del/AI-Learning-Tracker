'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LearningData, WorkData } from '@/types';
import { calculateProductivityScore } from '@/lib/calculations';
import { generateManagerSummary } from '@/lib/report-generator';
import { Briefcase, TrendingUp, Award, Zap, Sparkles, ChartBar as BarChart3, Target, ArrowUpRight, Activity } from 'lucide-react';

interface ManagerSummaryProps {
  learning: LearningData | undefined | null;
  work: WorkData | undefined | null;
  date: string;
}

export function ManagerSummary({ learning, work, date }: ManagerSummaryProps) {
  const productivityScore = calculateProductivityScore(learning, work);
  const summary = generateManagerSummary(learning, work, date, productivityScore);

  const aiToolsExplored = learning?.aiToolsExplored && Array.isArray(learning.aiToolsExplored)
    ? learning.aiToolsExplored
    : [];

  const learningHours = learning?.learningHours || 0;
  const tasksCount = work?.tasksCompleted?.split('\n').filter(Boolean).length || 0;

  const getScoreConfig = (score: number) => {
    if (score >= 80) return {
      label: 'Outstanding',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200/50 dark:border-emerald-800/50',
      progressFill: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      gradient: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    };
    if (score >= 60) return {
      label: 'On Track',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200/50 dark:border-blue-800/50',
      progressFill: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      gradient: 'from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20',
      iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    };
    if (score >= 40) return {
      label: 'Improving',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200/50 dark:border-amber-800/50',
      progressFill: 'bg-gradient-to-r from-amber-500 to-orange-500',
      gradient: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    };
    return {
      label: 'Focus Required',
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
      border: 'border-rose-200/50 dark:border-rose-800/50',
      progressFill: 'bg-gradient-to-r from-rose-500 to-pink-500',
      gradient: 'from-rose-500/10 to-pink-500/10 dark:from-rose-500/20 dark:to-pink-500/20',
      iconBg: 'bg-gradient-to-br from-rose-500 to-pink-600',
    };
  };

  const scoreConfig = getScoreConfig(productivityScore);

  const metrics = [
    {
      label: 'Score',
      value: `${productivityScore}%`,
      icon: Target,
      iconColor: 'text-blue-500',
      iconBg: 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10',
    },
    {
      label: 'Hours',
      value: learningHours,
      icon: Zap,
      iconColor: 'text-amber-500',
      iconBg: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10',
    },
    {
      label: 'Tasks',
      value: tasksCount,
      icon: Briefcase,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10',
    },
    {
      label: 'Tools',
      value: aiToolsExplored.length,
      icon: BarChart3,
      iconColor: 'text-slate-500',
      iconBg: 'bg-gradient-to-br from-slate-400/10 to-slate-500/10',
    },
  ];

  return (
    <Card className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500">
      {/* Decorative gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${scoreConfig.gradient} opacity-50`} />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/0 via-white/50 dark:via-slate-900/50 to-white/80 dark:to-slate-900/80 rounded-bl-full" />

      <CardHeader className="relative pb-0 pt-6 px-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${scoreConfig.iconBg} shadow-lg`}>
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Executive Summary
                </CardTitle>
                <div className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${scoreConfig.bg} ${scoreConfig.border} border`}>
                  <Award className={`h-3.5 w-3.5 ${scoreConfig.color}`} />
                  <span className={`text-xs font-semibold ${scoreConfig.color}`}>
                    {scoreConfig.label}
                  </span>
                </div>
              </div>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                Real-time performance insights for leadership visibility
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`lg:inline-flex items-center gap-2 rounded-xl px-4 py-2.5 ${scoreConfig.bg} ${scoreConfig.border} border`}>
              <Activity className={`h-5 w-5 ${scoreConfig.color}`} />
              <div className="text-right">
                <div className={`text-2xl font-bold ${scoreConfig.color}`}>{productivityScore}%</div>
                <div className={`text-xs font-medium ${scoreConfig.color} opacity-80`}>Productivity</div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative pt-6 pb-6 px-6 space-y-5">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="group/metric relative overflow-hidden rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-4 hover:border-slate-300/70 dark:hover:border-slate-600 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${metric.iconBg}`}>
                  <metric.icon className={`h-4 w-4 ${metric.iconColor}`} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">{metric.label}</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{metric.value}</div>
              <ArrowUpRight className="absolute bottom-3 right-3 h-4 w-4 text-slate-300 dark:text-slate-600 group-hover/metric:text-slate-400 dark:group-hover/metric:text-slate-500 transition-colors" />
            </div>
          ))}
        </div>

        {/* Progress Section */}
        <div className="rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Productivity Progress</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{productivityScore}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">/100</span>
            </div>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${scoreConfig.progressFill}`}
              style={{ width: `${productivityScore}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-400 dark:text-slate-500">
            <span>Low</span>
            <span>Target: 80%</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Summary Text */}
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 p-5">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {summary}
          </p>
        </div>

        {/* AI Tools Tags */}
        {aiToolsExplored.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {aiToolsExplored.slice(0, 5).map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                {tool}
              </span>
            ))}
            {aiToolsExplored.length > 5 && (
              <span className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                +{aiToolsExplored.length - 5} more
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
