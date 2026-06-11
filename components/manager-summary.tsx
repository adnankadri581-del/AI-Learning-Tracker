'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LearningData, WorkData } from '@/types';
import { calculateProductivityScore } from '@/lib/calculations';
import { generateManagerSummary } from '@/lib/report-generator';
import { Briefcase, TrendingUp, Award, Zap } from 'lucide-react';

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
      label: 'Excellent',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      progressBg: 'bg-emerald-100',
      progressFill: 'bg-gradient-to-r from-emerald-500 to-emerald-400'
    };
    if (score >= 60) return {
      label: 'Good',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      progressBg: 'bg-amber-100',
      progressFill: 'bg-gradient-to-r from-amber-500 to-amber-400'
    };
    if (score >= 40) return {
      label: 'Average',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      progressBg: 'bg-orange-100',
      progressFill: 'bg-gradient-to-r from-orange-500 to-orange-400'
    };
    return {
      label: 'Needs Focus',
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      progressBg: 'bg-rose-100',
      progressFill: 'bg-gradient-to-r from-rose-500 to-rose-400'
    };
  };

  const scoreConfig = getScoreConfig(productivityScore);

  return (
    <Card className="relative overflow-hidden border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Manager Summary
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 mt-1">
                Quick overview for leadership review
              </CardDescription>
            </div>
          </div>

          <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 ${scoreConfig.bg} ${scoreConfig.border} border`}>
            <Award className={`h-4 w-4 ${scoreConfig.color}`} />
            <span className={`text-sm font-medium ${scoreConfig.color}`}>
              {scoreConfig.label}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Score</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{productivityScore}%</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Zap className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Hours</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{learningHours}</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Briefcase className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Tasks</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{tasksCount}</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Award className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Tools</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{aiToolsExplored.length}</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Productivity Progress</span>
            <span className="font-medium text-slate-900">{productivityScore}%</span>
          </div>
          <div className={`h-2 w-full overflow-hidden rounded-full ${scoreConfig.progressBg}`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${scoreConfig.progressFill}`}
              style={{ width: `${productivityScore}%` }}
            />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
          <p className="text-sm leading-relaxed text-slate-600">
            {summary}
          </p>
        </div>

        {aiToolsExplored.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {aiToolsExplored.slice(0, 4).map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center rounded-full bg-white border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700"
              >
                {tool}
              </span>
            ))}
            {aiToolsExplored.length > 4 && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                +{aiToolsExplored.length - 4} more
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
