'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Sun, Moon, Monitor, Bell, Trash2, Save, ArrowLeft, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

interface SettingsData {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    reports: boolean;
    emails: boolean;
    exports: boolean;
    reminders: boolean;
  };
  autoSave: boolean;
}

const DEFAULT_SETTINGS: SettingsData = {
  theme: 'light',
  notifications: {
    reports: true,
    emails: true,
    exports: true,
    reminders: true,
  },
  autoSave: true,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    try {
      const stored = localStorage.getItem('ai-tracker-settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch {
      // Use defaults if error
    }
  }, []);

  const updateSetting = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateNotification = (key: keyof SettingsData['notifications'], value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('ai-tracker-settings', JSON.stringify(settings));

      // Apply theme
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (settings.theme === 'light') {
        document.documentElement.classList.remove('dark');
      }

      setHasChanges(false);
      toast({
        title: 'Settings saved',
        description: 'Your preferences have been updated successfully.',
      });
    } catch {
      toast({
        title: 'Error saving settings',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
    setIsSaving(false);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      localStorage.clear();
      toast({
        title: 'Data reset',
        description: 'All local data has been cleared.',
      });
      window.location.reload();
    }
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun, description: 'Light theme' },
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Dark theme' },
    { value: 'system', label: 'System', icon: Monitor, description: 'Follow system preference' },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="lg:hidden">
        <div className="flex items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Settings</h1>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="hidden lg:block mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 shadow-lg">
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage your preferences and data</p>
            </div>
          </div>

          {/* Theme Selection */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Appearance</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">Choose your preferred theme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateSetting('theme', option.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      settings.theme === option.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      settings.theme === option.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      <option.icon className="h-5 w-5" />
                    </div>
                    <span className={`text-sm font-medium ${
                      settings.theme === option.value
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-slate-500" />
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Notifications</CardTitle>
              </div>
              <CardDescription className="text-slate-500 dark:text-slate-400">Configure when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">Report Generated</Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Notify when reports are created</p>
                </div>
                <Switch
                  checked={settings.notifications.reports}
                  onCheckedChange={(checked) => updateNotification('reports', checked)}
                />
              </div>
              <Separator className="bg-slate-200 dark:bg-slate-700" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">Email Generated</Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Notify when emails are created</p>
                </div>
                <Switch
                  checked={settings.notifications.emails}
                  onCheckedChange={(checked) => updateNotification('emails', checked)}
                />
              </div>
              <Separator className="bg-slate-200 dark:bg-slate-700" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">Export Completed</Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Notify when exports finish</p>
                </div>
                <Switch
                  checked={settings.notifications.exports}
                  onCheckedChange={(checked) => updateNotification('exports', checked)}
                />
              </div>
              <Separator className="bg-slate-200 dark:bg-slate-700" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">Daily Reminders</Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Remind to fill in daily data</p>
                </div>
                <Switch
                  checked={settings.notifications.reminders}
                  onCheckedChange={(checked) => updateNotification('reminders', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Data & Storage</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">Manage your local data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">Auto-save</Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Automatically save changes</p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                />
              </div>
              <Separator className="bg-slate-200 dark:bg-slate-700" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">Reset All Data</Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Clear all local storage and start fresh</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          {hasChanges && (
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="min-w-[120px]"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
