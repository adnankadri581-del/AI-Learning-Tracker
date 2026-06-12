'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';

const aiTools = [
  { name: 'ChatGPT', description: 'Advanced conversational AI assistant by OpenAI', category: 'Conversational AI', url: 'https://chat.openai.com', status: 'popular' },
  { name: 'Claude', description: 'Helpful, harmless, and honest AI assistant by Anthropic', category: 'Conversational AI', url: 'https://claude.ai', status: 'new' },
  { name: 'GitHub Copilot', description: 'AI pair programmer for code completion and generation', category: 'Code Assistant', url: 'https://github.com/features/copilot', status: 'popular' },
  { name: 'Midjourney', description: 'AI-powered image generation tool', category: 'Image Generation', url: 'https://midjourney.com', status: 'popular' },
  { name: 'Perplexity AI', description: 'AI-powered search engine with cited sources', category: 'Search', url: 'https://perplexity.ai', status: 'new' },
  { name: 'Hugging Face', description: 'Platform for ML models and datasets', category: 'ML Platform', url: 'https://huggingface.co', status: 'popular' },
];

function AIToolsContent() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="lg:hidden">
        <div className="flex items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI Tools</h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="hidden lg:block mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <ArrowLeft className="h-4 w-4" />Back to Dashboard
          </Link>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">AI Tools</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Explore and learn with popular AI tools</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {aiTools.map((tool) => (
              <Card key={tool.name} className="group bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20">
                        <Sparkles className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{tool.name}</h3>
                          {tool.status === 'new' && <Badge className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0">New</Badge>}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{tool.description}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{tool.category}</p>
                      </div>
                    </div>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AIToolsPage() {
  return (
    <AuthGuard>
      <AIToolsContent />
    </AuthGuard>
  );
}
