'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LearningData, WorkData, GeneratedEmail } from '@/types';
import { generateEmail } from '@/lib/report-generator';
import { Mail, Copy, Loader as Loader2, Check, Send, FileText, ArrowRight, Sparkles, Clock, CircleCheck as CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EmailGeneratorProps {
  learning: LearningData | undefined | null;
  work: WorkData | undefined | null;
  date: string;
}

export function EmailGenerator({ learning, work, date }: EmailGeneratorProps) {
  const [email, setEmail] = useState<GeneratedEmail | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleGenerateEmail = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generatedEmail = generateEmail(learning, work, date);
      setEmail(generatedEmail);
      setIsGenerating(false);
    }, 300);
  };

  const handleCopySubject = async () => {
    if (email) {
      await navigator.clipboard.writeText(email.subject);
      setCopiedSubject(true);
      toast({ title: 'Subject copied to clipboard' });
      setTimeout(() => setCopiedSubject(false), 2000);
    }
  };

  const handleCopyEmail = async () => {
    if (email) {
      await navigator.clipboard.writeText(email.body);
      setCopiedEmail(true);
      toast({ title: 'Email copied to clipboard' });
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    if (email) {
      const content = `Subject: ${email.subject}\n\n${email.body}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `daily-status-${date}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: 'Email downloaded successfully' });
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-white border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/3 via-transparent to-blue-500/5" />

      <CardHeader className="relative pb-4 pt-6 px-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 transition-transform duration-300 group-hover:scale-105">
              <Mail className="h-7 w-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
              <Send className="h-2 w-2 text-white" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
              Email Generator
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 mt-1">
              Professional status email from your daily entries
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative px-6 pb-6 space-y-4">
        <Button
          onClick={handleGenerateEmail}
          disabled={isGenerating}
          className="group/btn w-full h-12 text-sm font-semibold bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 hover:from-cyan-600 hover:via-blue-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 rounded-xl"
          size="lg"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating email...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Generate Email</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
            </span>
          )}
        </Button>

        {email && (
          <div className="space-y-4">
            {/* Generated indicator */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-cyan-600 bg-cyan-50 px-3 py-1.5 rounded-full">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-semibold">Email Ready</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Subject Line */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                  Subject Line
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopySubject}
                  className="h-8 text-xs gap-1.5 hover:bg-slate-100"
                >
                  {copiedSubject ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
              <Input
                value={email.subject}
                readOnly
                className="h-11 font-semibold text-slate-800 border-slate-200 bg-slate-50/50 focus:bg-white"
              />
            </div>

            {/* Email Body */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Email Body
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyEmail}
                  className="h-8 text-xs gap-1.5 hover:bg-slate-100"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                value={email.body}
                readOnly
                rows={10}
                className="font-mono text-sm border-slate-200 bg-slate-50/50 focus:bg-white resize-none"
              />
            </div>

            {/* Download Button */}
            <Button
              onClick={handleDownloadTxt}
              variant="outline"
              className="w-full h-11 text-sm font-medium border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <FileText className="mr-2 h-4 w-4" />
              Download as TXT
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!email && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 mb-4">
              <Mail className="h-7 w-7 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-700">No email generated yet</p>
            <p className="text-xs text-slate-500 mt-1">Click the button above to create your status email</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
