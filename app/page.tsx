'use client';

import dynamic from 'next/dynamic';

// Dynamically import the dashboard content to avoid SSR issues
const DashboardContent = dynamic(
  () => import('@/components/dashboard-content').then((mod) => mod.DashboardContent),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    )
  }
);

export default function Dashboard() {
  return <DashboardContent />;
}
