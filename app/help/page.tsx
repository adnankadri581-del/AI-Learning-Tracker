'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CircleHelp as HelpCircle, BookOpen, MessageCircle, Mail, ChevronRight, Search, ExternalLink, FileText, Keyboard, Zap, ArrowLeft, Send, CircleCheck as CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';
import { AuthGuard } from '@/components/auth-guard';

const faqItems = [
  {
    question: 'How do I track my daily AI learning?',
    answer: 'Use the Daily Learning Tracker on the dashboard to log your learning hours, AI tools explored, and key takeaways. Your data is automatically saved to local storage.',
  },
  {
    question: 'How do I generate a professional report?',
    answer: 'Complete your learning and work data, then click "Generate Report" in the Report Generator card. The system will create a comprehensive professional report with all your daily activities.',
  },
  {
    question: 'Can I export my data?',
    answer: 'Yes! You can export your reports as PDF, TXT, or JSON files. Navigate to the Export section at the bottom of the dashboard to choose your preferred format.',
  },
  {
    question: 'How does the productivity score work?',
    answer: 'The productivity score is calculated based on your learning hours, AI tools explored, and tasks completed. Higher engagement leads to a better score.',
  },
  {
    question: 'Is my data saved automatically?',
    answer: 'Yes, all your data is automatically saved to your browser\'s local storage. You can also manually save using the auto-save indicator in the header.',
  },
  {
    question: 'How do I switch between dark and light mode?',
    answer: 'Click the theme toggle button in the header (sun/moon icon) or go to Settings to choose your preferred theme. You can also set it to follow your system preference.',
  },
  {
    question: 'What keyboard shortcuts are available?',
    answer: 'Press Cmd+K (Mac) or Ctrl+K (Windows) to open the global search. This lets you quickly navigate to any section or feature.',
  },
  {
    question: 'How do I reset my data?',
    answer: 'Go to Settings and click "Reset All Data" in the Data & Storage section. This will clear all your local data and cannot be undone.',
  },
];

const helpCategories = [
  {
    icon: BookOpen,
    title: 'Documentation',
    description: 'Detailed guides and tutorials',
    href: '#',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: MessageCircle,
    title: 'Community Forum',
    description: 'Connect with other users',
    href: '#',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Zap,
    title: 'Quick Start',
    description: 'Get started in minutes',
    href: '#',
    color: 'from-amber-500 to-orange-600',
  },
];

const keyboardShortcuts = [
  { keys: 'Cmd+K', action: 'Open global search' },
  { keys: 'Cmd+N', action: 'New entry' },
  { keys: 'Esc', action: 'Close modal/dialog' },
  { keys: '↑/↓', action: 'Navigate items' },
  { keys: 'Enter', action: 'Select item' },
];

function HelpContent() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
    toast({
      title: 'Message sent',
      description: 'We\'ll get back to you within 24 hours.',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="lg:hidden">
        <div className="flex items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Help & Support</h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="hidden lg:block mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Help & Support</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Find answers and get assistance</p>
            </div>
          </div>

          {/* Search */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search help articles..."
                  className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid sm:grid-cols-3 gap-4">
            {helpCategories.map((category) => (
              <Card
                key={category.title}
                className="group bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all cursor-pointer"
              >
                <CardContent className="p-5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} shadow-sm mb-3`}>
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {category.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{category.description}</p>
                  <div className="flex items-center text-xs font-medium text-blue-600 dark:text-blue-400">
                    <span>Learn more</span>
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQs */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-500" />
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Frequently Asked Questions
                </CardTitle>
              </div>
              <CardDescription className="text-slate-500 dark:text-slate-400">
                Quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-b border-slate-200 dark:border-slate-700 last:border-0"
                  >
                    <AccordionTrigger className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 py-4">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-slate-600 dark:text-slate-400 pb-4">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Keyboard Shortcuts */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Keyboard className="h-5 w-5 text-slate-500" />
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Keyboard Shortcuts
                </CardTitle>
              </div>
              <CardDescription className="text-slate-500 dark:text-slate-400">
                Navigate faster with keyboard shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {keyboardShortcuts.map((shortcut) => (
                  <div
                    key={shortcut.keys}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <span className="text-sm text-slate-600 dark:text-slate-300">{shortcut.action}</span>
                    <kbd className="px-2 py-1 text-xs font-mono font-medium bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-slate-500" />
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Contact Support
                </CardTitle>
              </div>
              <CardDescription className="text-slate-500 dark:text-slate-400">
                Can&apos;t find what you&apos;re looking for? Send us a message.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                    <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Message sent successfully</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">We&apos;ll respond within 24 hours</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setSubmitted(false);
                      setSubject('');
                      setMessage('');
                    }}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-slate-700 dark:text-slate-300">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-700 dark:text-slate-300">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your issue or question in detail..."
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function HelpPage() {
  return (
    <AuthGuard>
      <HelpContent />
    </AuthGuard>
  );
}
