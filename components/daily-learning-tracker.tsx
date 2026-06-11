'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { LearningData, AI_TOOLS_OPTIONS } from '@/types';
import { calculateLearningScore } from '@/lib/calculations';
import { Progress } from '@/components/ui/progress';
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

// Default learning data
const DEFAULT_LEARNING_DATA: LearningData = {
  learningHours: 0,
  aiToolsExplored: [],
  learningResources: '',
  conceptsLearned: '',
  keyTakeaways: '',
};

// Helper to safely get data with defaults
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

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">Daily Learning Activity</CardTitle>
            <CardDescription>Track your AI learning progress for today</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm font-medium text-muted-foreground">Learning Score</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{learningScore}</span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
          </div>
        </div>
        <Progress value={learningScore} className="h-2 mt-3" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Learning Hours */}
        <div className="space-y-2">
          <Label htmlFor="learningHours">Learning Hours</Label>
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
          />
        </div>

        {/* AI Tools Explored */}
        <div className="space-y-2">
          <Label>AI Tools Explored</Label>
          <Select onValueChange={handleAddTool}>
            <SelectTrigger>
              <SelectValue placeholder="Select AI tools explored" />
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
          {aiToolsExplored.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {aiToolsExplored.map((tool) => (
                <Badge
                  key={tool}
                  variant="secondary"
                  className="flex items-center gap-1 py-1.5 px-3"
                >
                  {tool}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => handleRemoveTool(tool)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Learning Resources Used */}
        <div className="space-y-2">
          <Label htmlFor="learningResources">Learning Resources Used</Label>
          <Textarea
            id="learningResources"
            value={safeLearningData.learningResources || ''}
            onChange={(e) => onChange({ ...safeLearningData, learningResources: e.target.value })}
            placeholder="List the learning resources you utilized (e.g., documentation, tutorials, courses...)"
            rows={3}
          />
        </div>

        {/* Concepts Learned */}
        <div className="space-y-2">
          <Label htmlFor="conceptsLearned">Concepts Learned</Label>
          <Textarea
            id="conceptsLearned"
            value={safeLearningData.conceptsLearned || ''}
            onChange={(e) => onChange({ ...safeLearningData, conceptsLearned: e.target.value })}
            placeholder="Describe the key concepts and knowledge gained today..."
            rows={5}
          />
        </div>

        {/* Key Takeaways */}
        <div className="space-y-2">
          <Label htmlFor="keyTakeaways">Key Takeaways</Label>
          <Textarea
            id="keyTakeaways"
            value={safeLearningData.keyTakeaways || ''}
            onChange={(e) => onChange({ ...safeLearningData, keyTakeaways: e.target.value })}
            placeholder="What were your most important learnings and insights?"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
}
