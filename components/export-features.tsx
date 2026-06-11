'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LearningData, WorkData } from '@/types';
import { generateReport } from '@/lib/report-generator';
import { FileDown, Printer, FileText, Loader as Loader2, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface ExportFeaturesProps {
  learning: LearningData | undefined | null;
  work: WorkData | undefined | null;
  date: string;
}

export function ExportFeatures({ learning, work, date }: ExportFeaturesProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null);

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
      gradient: 'from-rose-500 to-pink-500',
      onClick: handleExportPdf,
    },
    {
      id: 'txt',
      label: 'Export TXT',
      description: 'Plain text format',
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-500',
      onClick: handleExportTxt,
    },
    {
      id: 'print',
      label: 'Print Report',
      description: 'Open print dialog',
      icon: Printer,
      gradient: 'from-emerald-500 to-teal-500',
      onClick: handlePrint,
    },
  ];

  return (
    <Card className="border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-gray-100 border border-slate-200">
            <Download className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Export Features
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 mt-1">
              Download or print your daily report
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {exportOptions.map((option) => {
            const Icon = option.icon;
            const isLoading = isExporting === option.id;
            const isDisabled = isExporting !== null;

            return (
              <button
                key={option.id}
                onClick={option.onClick}
                disabled={isDisabled}
                className="group relative flex flex-col items-start p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-left w-full"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${option.gradient} shadow-sm mb-3`}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4 text-white" />
                  )}
                </div>
                <span className="text-sm font-medium text-slate-900">{option.label}</span>
                <span className="text-xs text-slate-500 mt-0.5">{option.description}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
