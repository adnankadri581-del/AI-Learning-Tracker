'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LearningData, WorkData, GeneratedReport } from '@/types';
import { generateReport } from '@/lib/report-generator';
import { FileText, Loader as Loader2, Sparkles, BookOpen, Briefcase, TriangleAlert as AlertTriangle, Calendar, Lightbulb } from 'lucide-react';

interface ReportGeneratorProps {
  learning: LearningData | undefined | null;
  work: WorkData | undefined | null;
  date: string;
}

const sectionIcons: Record<string, React.ElementType> = {
  executiveSummary: Sparkles,
  aiLearningSummary: BookOpen,
  workAccomplishments: Briefcase,
  challenges: AlertTriangle,
  tomorrowPlan: Calendar,
  recommendations: Lightbulb,
};

const sectionColors: Record<string, string> = {
  executiveSummary: 'text-blue-600',
  aiLearningSummary: 'text-emerald-600',
  workAccomplishments: 'text-violet-600',
  challenges: 'text-amber-600',
  tomorrowPlan: 'text-cyan-600',
  recommendations: 'text-rose-600',
};

export function ReportGenerator({ learning, work, date }: ReportGeneratorProps) {
  const [report, setReport] = useState<GeneratedReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generatedReport = generateReport(learning, work, date);
      setReport(generatedReport);
      setIsGenerating(false);
    }, 500);
  };

  const sections = report ? [
    { key: 'executiveSummary', title: 'Executive Summary', content: report.executiveSummary },
    { key: 'aiLearningSummary', title: 'AI Learning Summary', content: report.aiLearningSummary },
    { key: 'workAccomplishments', title: 'Work Accomplishments', content: report.workAccomplishments },
    { key: 'challenges', title: 'Challenges', content: report.challenges },
    { key: 'tomorrowPlan', title: "Tomorrow's Plan", content: report.tomorrowPlan },
    { key: 'recommendations', title: 'Recommendations', content: report.recommendations },
  ] : [];

  return (
    <Card className="border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100">
            <FileText className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">
              AI Report Generator
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 mt-1">
              Generate a professional report from your daily activities
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="w-full h-12 text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-sm"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Report
            </>
          )}
        </Button>

        {report && (
          <ScrollArea className="h-[400px] sm:h-[500px] w-full rounded-xl border border-slate-200 bg-slate-50/50 mt-4">
            <div className="p-4 sm:p-5 space-y-5">
              {sections.map((section) => {
                const IconComponent = sectionIcons[section.key];
                const iconColor = sectionColors[section.key];
                return (
                  <section key={section.key} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`h-4 w-4 ${iconColor}`} />
                      <h3 className="text-sm font-semibold text-slate-900">
                        {section.title}
                      </h3>
                    </div>
                    <div className="rounded-lg bg-white border border-slate-200 p-3">
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {section.content}
                      </p>
                    </div>
                  </section>
                );
              })}

              <div className="pt-3 border-t border-slate-200">
                <p className="text-xs text-slate-400">
                  Generated on: {new Date(report.generatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
