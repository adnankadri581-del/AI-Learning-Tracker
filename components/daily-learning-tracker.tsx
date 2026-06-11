'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, GraduationCap, Clock, Wrench, Lightbulb, BookOpen } from 'lucide-react';
import { LearningData, AI_TOOLS_OPTIONS } from '@/types';
import { calculateLearningScore } from '@/lib/calculations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DailyLearningTrackerProps {
  data: LearningData | undefined | null;
  onChange: (data: LearningData) => void;
}

const DEFAULT_LEARNING_DATA: LearningData = {
  learningHours: 0,
  aiToolsExplored: [],
  learningResources: '',
  conceptsLearned: '',
  keyTakeaways: '',
};

function safeData(data: LearningData | undefined | null): LearningData {
  if (!data) return DEFAULT_LEARNING_DATA;
  return {
    learningHours: typeof data.learningHours === 'number' ? data.learningHours : 0,
    aiToolsExplored: Array.isArray(data.aiToolsExplored) ? data.aiToolsExplored : [],
    learningResources: typeof data.learningResources === 'string' ? data.learningResources : '',
    conceptsLearned: typeof data.conceptsLearned === 'string' ? data.conceptsLearned : '',
    keyTakeaways: typeof data.keyTakeaways === 'string' ? data.keyTakeaways : '',
  };
}

export function DailyLearningTracker({ data, onChange }: DailyLearningTrackerProps) {
  const safeLearningData = safeData(data);
  const learningScore = calculateLearningScore(safeLearningData);

  const handleAddTool = (tool: string) => {
    const currentTools = safeLearningData.aiToolsExplored || [];
    if (!currentTools.includes(tool)) {
      onChange({
        ...safeLearningData,
        aiToolsExplored: [...currentTools, tool],
      });
    }
  };

  const handleRemoveTool = (tool: string) => {
    const currentTools = safeLearningData.aiToolsExplored || [];
    onChange({
      ...safeLearningData,
      aiToolsExplored: currentTools.filter((t) => t !== tool),
    });
  };

  const aiToolsExplored = safeLearningData.aiToolsExplored || [];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-emerald-400';
    if (score >= 60) return 'from-blue-500 to-blue-400';
    if (score >= 40) return 'from-amber-500 to-amber-400';
    return 'from-slate-400 to-slate-300';
  };

  return (
    <Card className="border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
              <GraduationCap className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Daily Learning Activity
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 mt-1">
                Track your AI learning progress for today
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <span className="text-xs font-medium text-slate-500">Learning Score</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-900">{learningScore}</span>
              <span className="text-sm text-slate-400">/100</span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${getScoreColor(learningScore)}`}
              style={{ width: `${learningScore}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="learningHours" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              Learning Hours
            </Label>
            <Input
              id="learningHours"
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={safeLearningData.learningHours || ''}
              onChange={(e) =>
                onChange({
                  ...safeLearningData,
                  learningHours: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="Enter hours spent learning"
              className="border-slate-200 bg-slate-50/50 focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Wrench className="h-3.5 w-3.5 text-slate-400" />
              AI Tools Explored
            </Label>
            <Select onValueChange={handleAddTool}>
              <SelectTrigger className="border-slate-200 bg-slate-50/50 focus:bg-white">
                <SelectValue placeholder="Select AI tools" />
              </SelectTrigger>
              <SelectContent>
                {AI_TOOLS_OPTIONS.filter((tool) => !aiToolsExplored.includes(tool)).map(
                  (tool) => (
                    <SelectItem key={tool} value={tool}>
                      {tool}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {aiToolsExplored.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {aiToolsExplored.map((tool) => (
              <Badge
                key={tool}
                variant="secondary"
                className="flex items-center gap-1.5 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border-0 transition-colors"
              >
                {tool}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() => handleRemoveTool(tool)}
                >
                  <X className="h-3 w-3 text-slate-500 hover:text-slate-700" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="learningResources" className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-slate-400" />
            Learning Resources Used
          </Label>
          <Textarea
            id="learningResources"
            value={safeLearningData.learningResources || ''}
            onChange={(e) => onChange({ ...safeLearningData, learningResources: e.target.value })}
            placeholder="List the learning resources you utilized (e.g., documentation, tutorials, courses...)"
            rows={3}
            className="border-slate-200 bg-slate-50/50 focus:bg-white resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="conceptsLearned" className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Lightbulb className="h-3.5 w-3.5 text-slate-400" />
            Concepts Learned
          </Label>
          <Textarea
            id="conceptsLearned"
            value={safeLearningData.conceptsLearned || ''}
            onChange={(e) => onChange({ ...safeLearningData, conceptsLearned: e.target.value })}
            placeholder="Describe the key concepts and knowledge gained today..."
            rows={5}
            className="border-slate-200 bg-slate-50/50 focus:bg-white resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="keyTakeaways" className="text-sm font-medium text-slate-700">
            Key Takeaways
          </Label>
          <Textarea
            id="keyTakeaways"
            value={safeLearningData.keyTakeaways || ''}
            onChange={(e) => onChange({ ...safeLearningData, keyTakeaways: e.target.value })}
            placeholder="What were your most important learnings and insights?"
            rows={4}
            className="border-slate-200 bg-slate-50/50 focus:bg-white resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}
