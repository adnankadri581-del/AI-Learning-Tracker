'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WorkData } from '@/types';
import { Briefcase, CircleCheck as CheckCircle2, Rocket, Bug, Calendar, CircleAlert as AlertCircle } from 'lucide-react';

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

  return (
    <Card className="border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
            <Briefcase className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Daily Work Update
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 mt-1">
              Document your work accomplishments and plans
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="tasksCompleted" className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
            Tasks Completed Today
          </Label>
          <Textarea
            id="tasksCompleted"
            value={safeWorkData.tasksCompleted || ''}
            onChange={(e) => onChange({ ...safeWorkData, tasksCompleted: e.target.value })}
            placeholder="List the tasks you completed today (one per line for better formatting)..."
            rows={4}
            className="border-slate-200 bg-slate-50/50 focus:bg-white resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="featuresDelivered" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Rocket className="h-3.5 w-3.5 text-slate-400" />
              Features Delivered
            </Label>
            <Textarea
              id="featuresDelivered"
              value={safeWorkData.featuresDelivered || ''}
              onChange={(e) => onChange({ ...safeWorkData, featuresDelivered: e.target.value })}
              placeholder="Describe features completed..."
              rows={3}
              className="border-slate-200 bg-slate-50/50 focus:bg-white resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bugsFixed" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Bug className="h-3.5 w-3.5 text-slate-400" />
              Bugs Fixed
            </Label>
            <Textarea
              id="bugsFixed"
              value={safeWorkData.bugsFixed || ''}
              onChange={(e) => onChange({ ...safeWorkData, bugsFixed: e.target.value })}
              placeholder="List bugs resolved today..."
              rows={3}
              className="border-slate-200 bg-slate-50/50 focus:bg-white resize-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tomorrowPlan" className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            Tomorrow's Plan
          </Label>
          <Textarea
            id="tomorrowPlan"
            value={safeWorkData.tomorrowPlan || ''}
            onChange={(e) => onChange({ ...safeWorkData, tomorrowPlan: e.target.value })}
            placeholder="Outline your planned activities for tomorrow..."
            rows={4}
            className="border-slate-200 bg-slate-50/50 focus:bg-white resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentBlockers" className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-slate-400" />
            Current Blockers
          </Label>
          <Textarea
            id="currentBlockers"
            value={safeWorkData.currentBlockers || ''}
            onChange={(e) => onChange({ ...safeWorkData, currentBlockers: e.target.value })}
            placeholder="Describe any obstacles or blockers you're facing..."
            rows={3}
            className="border-slate-200 bg-slate-50/50 focus:bg-white resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}
