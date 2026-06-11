'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LearningData, WorkData, GeneratedReport } from '@/types';
import { generateReport } from '@/lib/report-generator';
import { FileText, Loader as Loader2, Sparkles, BookOpen, Briefcase, TriangleAlert as AlertTriangle, Calendar, Lightbulb, Zap, ArrowRight, Clock, FileCheck } from 'lucide-react';

interface ReportGeneratorProps {
  learning: LearningData | undefined | null;
  work: WorkData | undefined | null;
  date: string;
}

const sectionConfig = [
  { key: 'executiveSummary', title: 'Executive Summary', icon: Sparkles, gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-500/10', border: 'border-blue-200/50' },
  { key: 'aiLearningSummary', title: 'AI Learning Summary', icon: BookOpen, gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-500/10', border: 'border-emerald-200/50' },
  { key: 'workAccomplishments', title: 'Work Accomplishments', icon: Briefcase, gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-500/10', border: 'border-blue-200/50' },
  { key: 'challenges', title: 'Challenges & Blockers', icon: AlertTriangle, gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-500/10', border: 'border-amber-200/50' },
  { key: 'tomorrowPlan', title: "Tomorrow's Plan", icon: Calendar, gradient: 'from-indigo-500 to-blue-600', bg: 'bg-indigo-500/10', border: 'border-indigo-200/50' },
  { key: 'recommendations', title: 'Recommendations', icon: Lightbulb, gradient: 'from-rose-500 to-pink-600', bg: 'bg-rose-500/10', border: 'border-rose-200/50' },
];

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

  const sections = report ? sectionConfig.map((config) => ({
    ...config,
    content: report[config.key as keyof GeneratedReport] as string,
  })) : [];

  return (
    <Card className="group relative overflow-hidden bg-white border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-transparent to-indigo-500/5" />

      <CardHeader className="relative pb-4 pt-6 px-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 transition-transform duration-300 group-hover:scale-105">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center">
              <Zap className="h-2 w-2 text-white" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
              AI Report Generator
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 mt-1">
              Generate comprehensive professional reports instantly
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative px-6 pb-6 space-y-4">
        {/* Generate Button */}
        <Button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="group/btn w-full h-12 text-sm font-semibold bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 hover:from-blue-600 hover:via-indigo-600 hover:to-blue-700 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 rounded-xl"
          size="lg"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating intelligent report...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Generate Report</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
            </span>
          )}
        </Button>

        {/* Report Preview */}
        {report && (
          <div className="space-y-4">
            {/* Generated badge */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                <FileCheck className="h-4 w-4" />
                <span className="text-xs font-semibold">Report Generated</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                <span>{new Date(report.generatedAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Report Content */}
            <ScrollArea className="h-[380px] sm:h-[450px] w-full rounded-xl border border-slate-200/80 bg-slate-50/50">
              <div className="p-5 space-y-4">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <section
                      key={section.key}
                      className="group/section rounded-xl bg-white border border-slate-200/60 overflow-hidden hover:shadow-md transition-all"
                    >
                      {/* Section Header */}
                      <div className={`flex items-center gap-2 px-4 py-3 border-b ${section.border} ${section.bg}`}>
                        <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${section.gradient} shadow-sm`}>
                          <Icon className="h-3.5 w-3.5 text-white" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-800">
                          {section.title}
                        </h3>
                      </div>

                      {/* Section Content */}
                      <div className="p-4">
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                          {section.content}
                        </p>
                      </div>
                    </section>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Empty State */}
        {!report && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 mb-4">
              <FileText className="h-7 w-7 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-700">No report generated yet</p>
            <p className="text-xs text-slate-500 mt-1">Click the button above to generate your daily report</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
