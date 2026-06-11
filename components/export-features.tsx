'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LearningData, WorkData } from '@/types';
import { generateReport } from '@/lib/report-generator';
import { FileDown, Printer, FileText, Loader as Loader2, Download, ArrowRight, Check, Share2, FileCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface ExportFeaturesProps {
  learning: LearningData | undefined | null;
  work: WorkData | undefined | null;
  date: string;
}

export function ExportFeatures({ learning, work, date }: ExportFeaturesProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [exportedType, setExportedType] = useState<string | null>(null);

  const report = generateReport(learning, work, date);

  const generatePdfContent = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let y = 20;

    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('Daily Status Report', margin, y);
    y += 10;

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }), margin, y);
    y += 15;

    const sections = [
      { title: 'Executive Summary', content: report.executiveSummary },
      { title: 'AI Learning Summary', content: report.aiLearningSummary },
      { title: 'Work Accomplishments', content: report.workAccomplishments },
      { title: 'Challenges', content: report.challenges },
      { title: "Tomorrow's Plan", content: report.tomorrowPlan },
      { title: 'Recommendations', content: report.recommendations },
    ];

    sections.forEach((section) => {
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(section.title, margin, y);
      y += 8;
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      const lines = doc.splitTextToSize(section.content, maxWidth);
      if (y + lines.length * 5 > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(lines, margin, y);
      y += lines.length * 5 + 10;
    });

    return doc;
  };

  const handleExportPdf = async () => {
    setIsExporting('pdf');
    try {
      const doc = generatePdfContent();
      doc.save(`daily-report-${date}.pdf`);
      setExportedType('pdf');
      toast({ title: 'PDF exported successfully' });
    } catch (error) {
      toast({ title: 'Failed to export PDF', variant: 'destructive' });
    }
    setIsExporting(null);
  };

  const handleExportTxt = () => {
    setIsExporting('txt');
    try {
      const content = `DAILY STATUS REPORT
==================
Date: ${new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}

EXECUTIVE SUMMARY
-----------------
${report.executiveSummary}

AI LEARNING SUMMARY
-------------------
${report.aiLearningSummary}

WORK ACCOMPLISHMENTS
--------------------
${report.workAccomplishments}

CHALLENGES
----------
${report.challenges}

TOMORROW'S PLAN
---------------
${report.tomorrowPlan}

RECOMMENDATIONS
---------------
${report.recommendations}

Generated on: ${new Date().toLocaleString()}
`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `daily-report-${date}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportedType('txt');
      toast({ title: 'TXT exported successfully' });
    } catch (error) {
      toast({ title: 'Failed to export TXT', variant: 'destructive' });
    }
    setIsExporting(null);
  };

  const handlePrint = () => {
    setIsExporting('print');
    try {
      const printContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Daily Status Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      color: #333;
      line-height: 1.6;
    }
    h1 { font-size: 28px; margin-bottom: 10px; }
    .date { color: #666; margin-bottom: 30px; }
    h2 { font-size: 18px; margin-top: 25px; color: #111; border-bottom: 2px solid #eee; padding-bottom: 8px; }
    p { white-space: pre-wrap; }
    .footer { margin-top: 40px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
  </style>
</head>
<body>
  <h1>Daily Status Report</h1>
  <div class="date">${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>

  <h2>Executive Summary</h2>
  <p>${report.executiveSummary}</p>

  <h2>AI Learning Summary</h2>
  <p>${report.aiLearningSummary}</p>

  <h2>Work Accomplishments</h2>
  <p>${report.workAccomplishments}</p>

  <h2>Challenges</h2>
  <p>${report.challenges}</p>

  <h2>Tomorrow's Plan</h2>
  <p>${report.tomorrowPlan}</p>

  <h2>Recommendations</h2>
  <p>${report.recommendations}</p>

  <div class="footer">Generated on: ${new Date().toLocaleString()}</div>
</body>
</html>`;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
      setExportedType('print');
      toast({ title: 'Print dialog opened' });
    } catch (error) {
      toast({ title: 'Failed to open print dialog', variant: 'destructive' });
    }
    setIsExporting(null);
  };

  const exportOptions = [
    {
      id: 'pdf',
      label: 'Export PDF',
      description: 'Professional document format',
      icon: FileDown,
      gradient: 'from-rose-500 to-pink-600',
      bg: 'bg-gradient-to-br from-rose-500/10 to-pink-500/10',
      onClick: handleExportPdf,
    },
    {
      id: 'txt',
      label: 'Export TXT',
      description: 'Plain text format',
      icon: FileText,
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10',
      onClick: handleExportTxt,
    },
    {
      id: 'print',
      label: 'Print Report',
      description: 'Open print dialog',
      icon: Printer,
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10',
      onClick: handlePrint,
    },
  ];

  return (
    <Card className="group relative overflow-hidden bg-white border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-500/3 via-transparent to-slate-600/5" />

      <CardHeader className="relative pb-4 pt-6 px-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 shadow-lg shadow-slate-500/25 transition-transform duration-300 group-hover:scale-105">
              <Share2 className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
              Export & Share
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 mt-1">
              Download or print your daily report in multiple formats
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative px-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {exportOptions.map((option) => {
            const Icon = option.icon;
            const isLoading = isExporting === option.id;
            const isDisabled = isExporting !== null;
            const isCompleted = exportedType === option.id;

            return (
              <button
                key={option.id}
                onClick={option.onClick}
                disabled={isDisabled}
                className={`group/export relative flex flex-col items-start p-5 rounded-xl border transition-all duration-200 text-left w-full ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-md'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {/* Completion Badge */}
                {isCompleted && (
                  <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}

                {/* Icon */}
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${option.bg} mb-4`}>
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 text-slate-600 animate-spin" />
                  ) : (
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${option.gradient} shadow-sm transition-transform group-hover/export:scale-105`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <span className="text-sm font-semibold text-slate-900">{option.label}</span>
                <span className="text-xs text-slate-500 mt-0.5">{option.description}</span>

                {/* Arrow indicator */}
                <div className="flex items-center gap-1 text-slate-400 mt-3 text-xs">
                  <span>Export now</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover/export:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Recent Export Status */}
        {exportedType && (
          <div className="mt-4 flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200/50">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">
                {exportedType === 'pdf' && 'PDF exported successfully'}
                {exportedType === 'txt' && 'TXT file downloaded'}
                {exportedType === 'print' && 'Print dialog opened'}
              </span>
            </div>
            <button
              onClick={() => setExportedType(null)}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Clear
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
