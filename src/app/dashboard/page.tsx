
"use client";

import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardContentClient } from './dashboard-content-client';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
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

  if (!user) {
    // This can happen briefly on logout or if session expires.
    // The middleware prevents unauthorized access, so we just show a message.
    return (
      <div className="text-center">
        <p>You need to be logged in to view this page.</p>
        <Button asChild className="mt-4">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-headline font-bold">Welcome, {user.displayName || 'User'}</h1>
        <Button asChild>
          <Link href="/dashboard/create">Create New Post</Link>
        </Button>
      </div>
      <h2 className="text-2xl font-headline font-bold mb-4">Your Posts</h2>
      <DashboardContentClient currentUser={{id: user.uid, name: user.displayName || 'User', avatarUrl: user.photoURL || ''}} />
    </div>
  );
}
