'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WorkData } from '@/types';
import { Briefcase, CircleCheck as CheckCircle2, Rocket, Bug, Calendar, CircleAlert as AlertCircle, Target, ListTodo, ArrowUpRight } from 'lucide-react';

interface DailyWorkStatusProps {
  data: WorkData | undefined | null;
  onChange: (data: WorkData) => void;
}

const DEFAULT_WORK_DATA: WorkData = {
  tasksCompleted: '',
  featuresDelivered: '',
  bugsFixed: '',
  tomorrowPlan: '',
  currentBlockers: '',
};

function safeData(data: WorkData | undefined | null): WorkData {
  if (!data) return DEFAULT_WORK_DATA;
  return {
    tasksCompleted: typeof data.tasksCompleted === 'string' ? data.tasksCompleted : '',
    featuresDelivered: typeof data.featuresDelivered === 'string' ? data.featuresDelivered : '',
    bugsFixed: typeof data.bugsFixed === 'string' ? data.bugsFixed : '',
    tomorrowPlan: typeof data.tomorrowPlan === 'string' ? data.tomorrowPlan : '',
    currentBlockers: typeof data.currentBlockers === 'string' ? data.currentBlockers : '',
  };
}

export function DailyWorkStatus({ data, onChange }: DailyWorkStatusProps) {
  const safeWorkData = safeData(data);

  const tasksCount = safeWorkData.tasksCompleted
    ? safeWorkData.tasksCompleted.split('\n').filter(Boolean).length
    : 0;

  const hasBlockers = safeWorkData.currentBlockers && safeWorkData.currentBlockers.trim().length > 0;

  return (
    <Card className="group relative overflow-hidden bg-white border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-50" />

      <CardHeader className="relative pb-4 pt-6 px-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg transition-transform duration-300 group-hover:scale-105">
            <Briefcase className="h-7 w-7 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
                Work Update
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 ${tasksCount > 0 ? 'bg-emerald-50 border border-emerald-200/50' : 'bg-slate-50 border border-slate-200/50'}`}>
                  <ListTodo className={`h-3.5 w-3.5 ${tasksCount > 0 ? 'text-emerald-500' : 'text-slate-400'}`} />
                  <span className={`text-xs font-semibold ${tasksCount > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {tasksCount} tasks
                  </span>
                </div>
              </div>
            </div>
            <CardDescription className="text-sm text-slate-500 mt-1">
              Document accomplishments and plan ahead
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative px-6 pb-6 space-y-5">
        {/* Tasks Completed - Featured */}
        <div className="space-y-2">
          <Label htmlFor="tasksCompleted" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            Tasks Completed Today
            {tasksCount > 0 && (
              <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="h-3 w-3" />
                {tasksCount} completed
              </span>
            )}
          </Label>
          <Textarea
            id="tasksCompleted"
            value={safeWorkData.tasksCompleted || ''}
            onChange={(e) => onChange({ ...safeWorkData, tasksCompleted: e.target.value })}
            placeholder="List tasks completed today (one per line for better readability)..."
            rows={4}
            className="border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 resize-none transition-all"
          />
        </div>

        {/* Features & Bugs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="featuresDelivered" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
                <Rocket className="h-3.5 w-3.5 text-blue-500" />
              </div>
              Features Delivered
            </Label>
            <Textarea
              id="featuresDelivered"
              value={safeWorkData.featuresDelivered || ''}
              onChange={(e) => onChange({ ...safeWorkData, featuresDelivered: e.target.value })}
              placeholder="Features completed today..."
              rows={3}
              className="border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 resize-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bugsFixed" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10">
                <Bug className="h-3.5 w-3.5 text-amber-500" />
              </div>
              Bugs Fixed
            </Label>
            <Textarea
              id="bugsFixed"
              value={safeWorkData.bugsFixed || ''}
              onChange={(e) => onChange({ ...safeWorkData, bugsFixed: e.target.value })}
              placeholder="Issues resolved today..."
              rows={3}
              className="border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 resize-none transition-all"
            />
          </div>
        </div>

        {/* Tomorrow's Plan */}
        <div className="space-y-2">
          <Label htmlFor="tomorrowPlan" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/10 to-blue-500/10">
              <Calendar className="h-3.5 w-3.5 text-indigo-500" />
            </div>
            Tomorrow's Plan
          </Label>
          <Textarea
            id="tomorrowPlan"
            value={safeWorkData.tomorrowPlan || ''}
            onChange={(e) => onChange({ ...safeWorkData, tomorrowPlan: e.target.value })}
            placeholder="Outline planned activities for tomorrow..."
            rows={4}
            className="border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 resize-none transition-all"
          />
        </div>

        {/* Current Blockers - highlighted for visibility */}
        <div className="space-y-2">
          <Label htmlFor="currentBlockers" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${hasBlockers ? 'bg-gradient-to-br from-rose-500/10 to-red-500/10' : 'bg-gradient-to-br from-slate-400/10 to-slate-500/10'}`}>
              <AlertCircle className={`h-3.5 w-3.5 ${hasBlockers ? 'text-rose-500' : 'text-slate-400'}`} />
            </div>
            Current Blockers
            {hasBlockers && (
              <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/50">
                Attention needed
              </span>
            )}
          </Label>
          <Textarea
            id="currentBlockers"
            value={safeWorkData.currentBlockers || ''}
            onChange={(e) => onChange({ ...safeWorkData, currentBlockers: e.target.value })}
            placeholder="Describe any obstacles or blockers you're facing..."
            rows={3}
            className={`border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 resize-none transition-all ${hasBlockers ? 'border-rose-200 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/20' : ''}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
