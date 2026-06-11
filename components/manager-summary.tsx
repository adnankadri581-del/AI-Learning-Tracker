'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LearningData, WorkData } from '@/types';
import { calculateProductivityScore } from '@/lib/calculations';
import { generateManagerSummary } from '@/lib/report-generator';
import { Briefcase } from 'lucide-react';
import { Target } from 'lucide-react';

interface ManagerSummaryProps {
  learning: LearningData | undefined | null;
  work: WorkData | undefined | null;
  date: string;
}

export function ManagerSummary({ learning, work, date }: ManagerSummaryProps) {
  const productivityScore = calculateProductivityScore(learning, work);
  const summary = generateManagerSummary(learning, work, date, productivityScore);

  // Safely access aiToolsExplored with fallback
  const aiToolsExplored = learning?.aiToolsExplored && Array.isArray(learning.aiToolsExplored)
    ? learning.aiToolsExplored
    : [];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

return (
  <Card className="relative overflow-hidden rounded-[32px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 shadow-[0_10px_40px_rgba(139,92,246,0.10)] hover:shadow-[0_20px_60px_rgba(139,92,246,0.15)] transition-all duration-300">

    {/* Background Effects */}
    <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
    <div className="absolute right-10 top-10 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl" />

    <CardHeader className="relative z-10 pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>

          <div>
            <CardTitle className="text-5xl font-extrabold tracking-tight">
              Manager Summary
            </CardTitle>

            <CardDescription className="text-base mt-2">
              Quick overview for leadership review
            </CardDescription>
          </div>
        </div>

<div className="text-right">
  <div className="inline-flex items-center rounded-2xl bg-white px-5 py-3 shadow-md border border-slate-100">
    <div>
      <p className="text-xs text-muted-foreground">
        Performance
      </p>

<span
  className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${
    productivityScore >= 80
      ? "bg-green-100 text-green-700"
      : productivityScore >= 60
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700"
  }`}
>
  {productivityScore >= 80
  ? 'Excellent'
  : productivityScore >= 60
  ? 'Good'
  : productivityScore >= 40
  ? 'Average'
  : 'Needs Attention'
    }
</span>
    </div>
  </div>
</div>
      </div>
    </CardHeader>

    <CardContent className="relative z-10 space-y-5">

      <div className="absolute right-6 top-0 opacity-10">
        <Target className="h-32 w-32 text-violet-600" />
      </div>

<div className="h-4 w-full overflow-hidden rounded-full bg-red-100">
  <div
    className="h-full rounded-full bg-red-500 transition-all"
    style={{ width: `${productivityScore}%` }}
  />
</div>

      <div className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur-sm p-5">
        <p className="text-sm leading-7 text-slate-700">
          {summary}
        </p>
      </div>

      {aiToolsExplored.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
        {aiToolsExplored.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {aiToolsExplored.slice(0, 3).map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center rounded-full bg-violet-100 text-violet-700 px-3 py-1 text-xs font-medium"
              >
                {tool}
              </span>
            ))}
          </div>
        )}

          {aiToolsExplored.length > 3 && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              +{aiToolsExplored.length - 3} more
            </span>
          )}
        </div>
      )}

    </CardContent>
  </Card>
);
}
