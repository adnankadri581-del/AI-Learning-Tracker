'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LearningData, WorkData, GeneratedReport } from '@/types';
import { generateReport } from '@/lib/report-generator';
import { FileDown, Printer, FileText, Loader2 } from 'lucide-react';
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

    // Title
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('Daily Status Report', margin, y);
    y += 10;

    // Date
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }), margin, y);
    y += 15;

    // Executive Summary
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Executive Summary', margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const execLines = doc.splitTextToSize(report.executiveSummary, maxWidth);
    doc.text(execLines, margin, y);
    y += execLines.length * 5 + 10;

    // AI Learning Summary
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('AI Learning Summary', margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const learningLines = doc.splitTextToSize(report.aiLearningSummary, maxWidth);
    if (y + learningLines.length * 5 > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(learningLines, margin, y);
    y += learningLines.length * 5 + 10;

    // Work Accomplishments
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Work Accomplishments', margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const workLines = doc.splitTextToSize(report.workAccomplishments, maxWidth);
    if (y + workLines.length * 5 > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(workLines, margin, y);
    y += workLines.length * 5 + 10;

    // Challenges
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Challenges', margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const challengeLines = doc.splitTextToSize(report.challenges, maxWidth);
    if (y + challengeLines.length * 5 > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(challengeLines, margin, y);
    y += challengeLines.length * 5 + 10;

    // Tomorrow's Plan
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Tomorrow's Plan", margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const planLines = doc.splitTextToSize(report.tomorrowPlan, maxWidth);
    if (y + planLines.length * 5 > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(planLines, margin, y);
    y += planLines.length * 5 + 10;

    // Recommendations
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Recommendations', margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const recLines = doc.splitTextToSize(report.recommendations, maxWidth);
    if (y + recLines.length * 5 > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(recLines, margin, y);

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

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <FileDown className="h-5 w-5" />
          Export Features
        </CardTitle>
        <CardDescription>Download or print your daily report</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-3 gap-3">
          <Button
            onClick={handleExportPdf}
            disabled={isExporting !== null}
            variant="default"
            className="h-12"
          >
            {isExporting === 'pdf' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="mr-2 h-4 w-4" />
            )}
            Export PDF
          </Button>

          <Button
            onClick={handleExportTxt}
            disabled={isExporting !== null}
            variant="secondary"
            className="h-12"
          >
            {isExporting === 'txt' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            Export TXT
          </Button>

          <Button
            onClick={handlePrint}
            disabled={isExporting !== null}
            variant="outline"
            className="h-12"
          >
            {isExporting === 'print' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Printer className="mr-2 h-4 w-4" />
            )}
            Print Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
