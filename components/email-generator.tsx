'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LearningData, WorkData, GeneratedEmail } from '@/types';
import { generateEmail } from '@/lib/report-generator';
import { Mail, Copy, Loader as Loader2, Check, Send, FileText } from 'lucide-react';
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
    <Card className="border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100">
            <Mail className="h-5 w-5 text-cyan-600" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Email Generator
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 mt-1">
              Create a professional status email from your entries
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button
          onClick={handleGenerateEmail}
          disabled={isGenerating}
          className="w-full h-12 text-sm font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-sm"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Generate Email
            </>
          )}
        </Button>

        {email && (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-slate-700">Subject Line</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopySubject}
                  className="h-7 text-xs"
                >
                  {copiedSubject ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500 mr-1.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  {copiedSubject ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <Input
                value={email.subject}
                readOnly
                className="font-medium border-slate-200 bg-slate-50/50"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-slate-700">Email Body</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyEmail}
                  className="h-7 text-xs"
                >
                  {copiedEmail ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500 mr-1.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  {copiedEmail ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <Textarea
                value={email.body}
                readOnly
                rows={12}
                className="font-mono text-sm border-slate-200 bg-slate-50/50 resize-none"
              />
            </div>

            <Button
              onClick={handleDownloadTxt}
              variant="outline"
              className="w-full h-10 text-sm border-slate-200 hover:bg-slate-50"
            >
              <FileText className="mr-2 h-4 w-4" />
              Download TXT
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
