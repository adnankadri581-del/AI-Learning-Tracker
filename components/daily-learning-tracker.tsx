'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, GraduationCap, Clock, Wrench, Lightbulb, BookOpen, Target, Zap, TrendingUp } from 'lucide-react';
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

  const getScoreConfig = (score: number) => {
    if (score >= 80) return {
      label: 'Excellent',
      color: 'text-emerald-600 dark:text-emerald-400',
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    };
    if (score >= 60) return {
      label: 'Good',
      color: 'text-blue-600 dark:text-blue-400',
      gradient: 'from-blue-500 to-indigo-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    };
    if (score >= 40) return {
      label: 'Progressing',
      color: 'text-amber-600 dark:text-amber-400',
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    };
    return {
      label: 'Starting',
      color: 'text-slate-500 dark:text-slate-400',
      gradient: 'from-slate-400 to-slate-500',
      bg: 'bg-slate-50 dark:bg-slate-800',
      iconBg: 'bg-gradient-to-br from-slate-400 to-slate-500',
    };
  };

  const scoreConfig = getScoreConfig(learningScore);

  return (
    <Card className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4 pt-6 px-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${scoreConfig.iconBg} shadow-lg transition-transform duration-300 group-hover:scale-105`}>
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Learning Activity
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Track your AI exploration and knowledge growth
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="flex items-center gap-2">
              <Target className={`h-4 w-4 ${scoreConfig.color}`} />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Learning Score</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-bold ${scoreConfig.color}`}>{learningScore}</span>
              <span className="text-sm text-slate-400 dark:text-slate-500">/100</span>
            </div>
            <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 ${scoreConfig.bg}`}>
              <TrendingUp className={`h-3 w-3 ${scoreConfig.color}`} />
              <span className={`text-xs font-medium ${scoreConfig.color}`}>{scoreConfig.label}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out ${scoreConfig.gradient}`}
              style={{ width: `${learningScore}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="learningHours" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20">
                <Clock className="h-3.5 w-3.5 text-blue-500" />
              </div>
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
              placeholder="0"
              className="h-11 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500">Hours spent on AI learning today</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20">
                <Wrench className="h-3.5 w-3.5 text-emerald-500" />
              </div>
              AI Tools Explored
            </Label>
            <Select onValueChange={handleAddTool}>
              <SelectTrigger className="h-11 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 transition-all">
                <SelectValue placeholder="Select AI tools to explore" />
              </SelectTrigger>
              <SelectContent className="border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-900">
                {AI_TOOLS_OPTIONS.filter((tool) => !aiToolsExplored.includes(tool)).map(
                  (tool) => (
                    <SelectItem key={tool} value={tool} className="hover:bg-slate-50 dark:hover:bg-slate-800">
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
                className="flex items-center gap-2 py-2 px-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 hover:from-blue-100 dark:hover:from-blue-900/50 hover:to-indigo-100 dark:hover:to-indigo-900/50 text-slate-700 dark:text-slate-300 border border-blue-200/50 dark:border-blue-800/50 shadow-sm transition-all"
              >
                <Zap className="h-3 w-3 text-blue-500" />
                <span className="font-medium">{tool}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() => handleRemoveTool(tool)}
                >
                  <X className="h-3 w-3 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="learningResources" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20">
              <BookOpen className="h-3.5 w-3.5 text-amber-500" />
            </div>
            Learning Resources
          </Label>
          <Textarea
            id="learningResources"
            value={safeLearningData.learningResources || ''}
            onChange={(e) => onChange({ ...safeLearningData, learningResources: e.target.value })}
            placeholder="Documentation, tutorials, courses, articles, videos..."
            rows={3}
            className="border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-blue-500/20 resize-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="conceptsLearned" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20">
              <Lightbulb className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            Concepts Learned
          </Label>
          <Textarea
            id="conceptsLearned"
            value={safeLearningData.conceptsLearned || ''}
            onChange={(e) => onChange({ ...safeLearningData, conceptsLearned: e.target.value })}
            placeholder="Key concepts, techniques, and knowledge gained today..."
            rows={5}
            className="border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-blue-500/20 resize-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="keyTakeaways" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Target className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            Key Takeaways
          </Label>
          <Textarea
            id="keyTakeaways"
            value={safeLearningData.keyTakeaways || ''}
            onChange={(e) => onChange({ ...safeLearningData, keyTakeaways: e.target.value })}
            placeholder="Most important insights and learnings..."
            rows={4}
            className="border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-blue-500/20 resize-none transition-all"
          />
        </div>
      </CardContent>
    </Card>
  );
}
