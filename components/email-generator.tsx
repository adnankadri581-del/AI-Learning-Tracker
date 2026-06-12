'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LearningData, WorkData, GeneratedEmail } from '@/types';
import { generateEmail } from '@/lib/report-generator';
import { Mail, Copy, Loader as Loader2, Check, Send, FileText, ArrowRight, Sparkles, Clock, CircleCheck as CheckCircle2, CircleAlert as AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EmailGeneratorProps {
  learning: LearningData | undefined | null;
  work: WorkData | undefined | null;
  date: string;
}

interface ValidationErrors {
  tasksCompleted?: string;
  workContent?: string;
}

export function EmailGenerator({ learning, work, date }: EmailGeneratorProps) {
  const [email, setEmail] = useState<GeneratedEmail | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [hasInteracted, setHasInteracted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Validate inputs
  const validateInputs = (): boolean => {
    const errors: ValidationErrors = {};

    const tasksCompleted = work?.tasksCompleted?.trim() || '';
    const hasWorkContent =
      tasksCompleted ||
      work?.featuresDelivered?.trim() ||
      work?.bugsFixed?.trim() ||
      work?.tomorrowPlan?.trim();

    if (!tasksCompleted) {
      errors.tasksCompleted = 'Please enter completed tasks.';
    }

    if (!hasWorkContent) {
      errors.workContent = 'Please complete at least one work update field.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Check if form is valid for button state
  const isValid = (): boolean => {
    const tasksCompleted = work?.tasksCompleted?.trim() || '';
    const hasWorkContent =
      tasksCompleted ||
      work?.featuresDelivered?.trim() ||
      work?.bugsFixed?.trim() ||
      work?.tomorrowPlan?.trim();

    return !!tasksCompleted && !!hasWorkContent;
  };

  const handleGenerateEmail = () => {
    setHasInteracted(true);

    if (!validateInputs()) {
      toast({
        title: 'Validation Error',
        description: 'Please complete all required fields before generating an email.',
        variant: 'destructive',
      });

      // Focus the button for accessibility
      buttonRef.current?.focus();
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      try {
        const generatedEmail = generateEmail(learning, work, date);
        setEmail(generatedEmail);
        setValidationErrors({});
        toast({
          title: 'Email Generated',
          description: 'Your status email has been generated successfully.',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to generate email. Please try again.',
          variant: 'destructive',
        });
      }
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

  const hasErrors = Object.keys(validationErrors).length > 0;

  return (
    <Card className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/3 via-transparent to-blue-500/5 dark:from-cyan-500/5 dark:to-blue-500/10" />

      <CardHeader className="relative pb-4 pt-6 px-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 transition-transform duration-300 group-hover:scale-105">
              <Mail className="h-7 w-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
              <Send className="h-2 w-2 text-white" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Email Generator
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Professional status email from your daily entries
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative px-6 pb-6 space-y-4">
        {/* Validation Errors */}
        {hasInteracted && hasErrors && (
          <div className="rounded-xl border border-rose-200/50 dark:border-rose-800/50 bg-rose-50/50 dark:bg-rose-900/20 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <p className="text-sm font-medium text-rose-700 dark:text-rose-400">Please fix the following issues:</p>
                <ul className="space-y-1.5">
                  {validationErrors.tasksCompleted && (
                    <li className="text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-rose-400" />
                      {validationErrors.tasksCompleted}
                    </li>
                  )}
                  {validationErrors.workContent && (
                    <li className="text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-rose-400" />
                      {validationErrors.workContent}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        <Button
          ref={buttonRef}
          onClick={handleGenerateEmail}
          disabled={isGenerating || !isValid()}
          className="group/btn w-full h-12 text-sm font-semibold bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 hover:from-cyan-600 hover:via-blue-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
          aria-describedby={hasErrors ? 'email-validation-errors' : undefined}
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

        {/* Requirements hint when not valid */}
        {!isValid() && !hasInteracted && (
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Complete tasks and work updates to generate an email
          </div>
        )}

        {email && (
          <div className="space-y-4">
            {/* Generated indicator */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 px-3 py-1.5 rounded-full">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-semibold">Email Ready</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3" />
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Subject Line */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                  Subject Line
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopySubject}
                  className="h-8 text-xs gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {copiedSubject ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
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
                className="h-11 font-semibold text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800"
              />
            </div>

            {/* Email Body */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Email Body
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyEmail}
                  className="h-8 text-xs gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
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
                className="font-mono text-sm border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 resize-none"
              />
            </div>

            {/* Download Button */}
            <Button
              onClick={handleDownloadTxt}
              variant="outline"
              className="w-full h-11 text-sm font-medium border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              <FileText className="mr-2 h-4 w-4" />
              Download as TXT
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!email && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
              <Mail className="h-7 w-7 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No email generated yet</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Complete the required fields and click generate</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
