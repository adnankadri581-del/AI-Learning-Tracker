'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, CheckCheck, X, FileText, Mail, Download, Calendar, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'report' | 'email' | 'export' | 'reminder' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const defaultNotifications: Notification[] = [
  {
    id: '1',
    type: 'report',
    title: 'Report Generated',
    message: 'Your daily report for June 12, 2026 has been created successfully.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
  },
  {
    id: '2',
    type: 'email',
    title: 'Email Draft Saved',
    message: 'Status update email has been saved to your drafts.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
  },
  {
    id: '3',
    type: 'export',
    title: 'Export Complete',
    message: 'Your report has been exported as PDF.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    read: true,
  },
  {
    id: '4',
    type: 'reminder',
    title: 'Daily Reminder',
    message: 'Don\'t forget to log your learning activities for today.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
  },
  {
    id: '5',
    type: 'system',
    title: 'Welcome to AI Learning Tracker',
    message: 'Start tracking your AI learning journey today.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
  },
];

interface NotificationsDropdownProps {
  onNavigate?: (section: string) => void;
}

export function NotificationsDropdown({ onNavigate }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'report':
        return FileText;
      case 'email':
        return Mail;
      case 'export':
        return Download;
      case 'reminder':
        return Calendar;
      default:
        return Settings;
    }
  };

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'report':
        return 'bg-blue-500/10 text-blue-500';
      case 'email':
        return 'bg-emerald-500/10 text-emerald-500';
      case 'export':
        return 'bg-amber-500/10 text-amber-500';
      case 'reminder':
        return 'bg-indigo-500/10 text-indigo-500';
      default:
        return 'bg-slate-500/10 text-slate-500';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast({
      title: 'All notifications marked as read',
    });
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    toast({
      title: 'All notifications cleared',
    });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-blue-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">View notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-96 p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                {unreadCount} new
              </span>
            )}
          </div>
          {notifications.length > 0 && unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <ScrollArea className="h-[320px]">
            <div className="py-2">
              {notifications.map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`group relative flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                      !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    {/* Unread indicator */}
                    {!notification.read && (
                      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-blue-500" />
                    )}

                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${getIconColor(notification.type)}`}>
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0 pl-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-tight">
                          {notification.title}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(notification.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-opacity"
                        >
                          <X className="h-3 w-3 text-slate-400" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="flex items-center gap-1 text-[10px] font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700"
                          >
                            <Check className="h-3 w-3" />
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
              <Bell className="h-7 w-7 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No notifications</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">You&apos;re all caught up!</p>
          </div>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <button
              onClick={() => {
                if (onNavigate) onNavigate('settings');
                setIsOpen(false);
              }}
              className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            >
              Notification settings
            </button>
            <button
              onClick={clearAll}
              className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300"
            >
              Clear all
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
