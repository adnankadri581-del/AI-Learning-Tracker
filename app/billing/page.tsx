'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, ArrowLeft, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';

const plans = [
  { name: 'Free', price: '$0', description: 'Basic tracking features', features: ['Daily learning tracking', 'Basic reports', '5 AI tools tracking'], current: false },
  { name: 'Pro', price: '$9', period: '/month', description: 'Advanced features for power users', features: ['Unlimited tracking', 'Advanced analytics', 'PDF exports', 'Priority support'], current: true },
  { name: 'Enterprise', price: '$29', period: '/month', description: 'For teams and organizations', features: ['Everything in Pro', 'Team collaboration', 'API access', 'Custom reports', 'SSO'], current: false },
];

function BillingContent() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="lg:hidden">
        <div className="flex items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Billing</h1>
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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Billing & Plans</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage your subscription and billing</p>
            </div>
          </div>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Current Plan</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">You are on the Pro plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600"><Sparkles className="h-5 w-5 text-white" /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Pro Plan</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">$9/month - Renews July 12, 2026</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid sm:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 ${plan.current ? 'ring-2 ring-blue-500' : ''}`}>
                {plan.current && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Current</span></div>}
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{plan.name}</h3>
                    <div className="mt-2"><span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{plan.price}</span><span className="text-sm text-slate-500 dark:text-slate-400">{plan.period}</span></div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{plan.description}</p>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"><Check className="h-3 w-3 text-emerald-500" />{feature}</li>
                    ))}
                  </ul>
                  <Button className="w-full mt-4" variant={plan.current ? 'outline' : 'default'} disabled={plan.current}>{plan.current ? 'Current Plan' : 'Upgrade'}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function BillingPage() {
  return (
    <AuthGuard>
      <BillingContent />
    </AuthGuard>
  );
}
