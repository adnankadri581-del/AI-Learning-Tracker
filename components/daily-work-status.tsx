'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WorkData } from '@/types';

interface DailyWorkStatusProps {
  data: WorkData | undefined | null;
  onChange: (data: WorkData) => void;
}

// Default work data
const DEFAULT_WORK_DATA: WorkData = {
  tasksCompleted: '',
  featuresDelivered: '',
  bugsFixed: '',
  tomorrowPlan: '',
  currentBlockers: '',
};

// Helper to safely get data with defaults
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
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Daily Work Update</CardTitle>
        <CardDescription>Document your work accomplishments and plans</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tasks Completed Today */}
        <div className="space-y-2">
          <Label htmlFor="tasksCompleted">Tasks Completed Today</Label>
          <Textarea
            id="tasksCompleted"
            value={safeWorkData.tasksCompleted || ''}
            onChange={(e) => onChange({ ...safeWorkData, tasksCompleted: e.target.value })}
            placeholder="List the tasks you completed today (one per line for better formatting)..."
            rows={4}
          />
        </div>

        {/* Features Delivered */}
        <div className="space-y-2">
          <Label htmlFor="featuresDelivered">Features Delivered</Label>
          <Textarea
            id="featuresDelivered"
            value={safeWorkData.featuresDelivered || ''}
            onChange={(e) => onChange({ ...safeWorkData, featuresDelivered: e.target.value })}
            placeholder="Describe any features or deliverables completed today..."
            rows={3}
          />
        </div>

        {/* Bugs Fixed */}
        <div className="space-y-2">
          <Label htmlFor="bugsFixed">Bugs Fixed</Label>
          <Textarea
            id="bugsFixed"
            value={safeWorkData.bugsFixed || ''}
            onChange={(e) => onChange({ ...safeWorkData, bugsFixed: e.target.value })}
            placeholder="List any bugs or issues you resolved today..."
            rows={3}
          />
        </div>

        {/* Tomorrow's Plan */}
        <div className="space-y-2">
          <Label htmlFor="tomorrowPlan">Tomorrow's Plan</Label>
          <Textarea
            id="tomorrowPlan"
            value={safeWorkData.tomorrowPlan || ''}
            onChange={(e) => onChange({ ...safeWorkData, tomorrowPlan: e.target.value })}
            placeholder="Outline your planned activities for tomorrow..."
            rows={4}
          />
        </div>

        {/* Current Blockers */}
        <div className="space-y-2">
          <Label htmlFor="currentBlockers">Current Blockers</Label>
          <Textarea
            id="currentBlockers"
            value={safeWorkData.currentBlockers || ''}
            onChange={(e) => onChange({ ...safeWorkData, currentBlockers: e.target.value })}
            placeholder="Describe any obstacles or blockers you're facing..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
