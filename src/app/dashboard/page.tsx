
"use client";

import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardContentClient } from './dashboard-content-client';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  // The DashboardLayout handles the main loading and auth checks.
  // This page can assume that if it renders, the user is authenticated.
  if (loading || !user) {
    // This state is primarily handled by the layout, but as a fallback,
    // we can show a minimal skeleton.
     return (
      <div className="space-y-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-4xl font-headline font-bold">Welcome, {user.displayName || 'User'}</h1>
        <Button asChild>
          <Link href="/dashboard/create">Create New Post</Link>
        </Button>
      </div>
      <h2 className="text-2xl font-headline font-bold mb-4">Your Posts</h2>
      <DashboardContentClient currentUser={user} />
    </div>
  );
}
