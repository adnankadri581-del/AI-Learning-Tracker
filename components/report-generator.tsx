'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LearningData, WorkData, GeneratedReport } from '@/types';
import { generateReport } from '@/lib/report-generator';
import { FileText, Loader2 } from 'lucide-react';

interface ReportGeneratorProps {
  learning: LearningData | undefined | null;
  work: WorkData | undefined | null;
  date: string;
}

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

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <FileText className="h-5 w-5" />
          AI Report Generator
        </CardTitle>
        <CardDescription>
          Generate a professional report from your daily activities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="w-full h-14 text-base font-semibold"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-5 w-5" />
              Generate Report
            </>
          )}
        </Button>

        {report && (
          <ScrollArea className="h-[500px] w-full rounded-lg border p-4 mt-4">
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-2 text-primary">
                  Executive Summary
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {report.executiveSummary}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2 text-primary">
                  AI Learning Summary
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {report.aiLearningSummary}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2 text-primary">
                  Work Accomplishments
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {report.workAccomplishments}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2 text-primary">
                  Challenges
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {report.challenges}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2 text-primary">
                  Tomorrow's Plan
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {report.tomorrowPlan}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2 text-primary">
                  Recommendations
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {report.recommendations}
                </p>
              </section>

              <div className="text-xs text-muted-foreground pt-4 border-t">
                Generated on: {new Date(report.generatedAt).toLocaleString()}
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
