'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LearningData, WorkData, GeneratedEmail } from '@/types';
import { generateEmail } from '@/lib/report-generator';
import { Mail, Copy, Download, Loader2, Check } from 'lucide-react';
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
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Generator
        </CardTitle>
        <CardDescription>Create a professional status email from your entries</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleGenerateEmail}
          disabled={isGenerating}
          className="w-full"
          variant="secondary"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Generate Email
            </>
          )}
        </Button>

        {email && (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Subject Line</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopySubject}
                  className="h-8"
                >
                  {copiedSubject ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="ml-1">{copiedSubject ? 'Copied' : 'Copy'}</span>
                </Button>
              </div>
              <Input value={email.subject} readOnly className="font-medium" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Email Body</Label>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyEmail}
                    className="h-8"
                  >
                    {copiedEmail ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="ml-1">{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </Button>
                </div>
              </div>
              <Textarea
                value={email.body}
                readOnly
                rows={12}
                className="font-mono text-sm"
              />
            </div>

            <Button
              onClick={handleDownloadTxt}
              variant="outline"
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download TXT
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
