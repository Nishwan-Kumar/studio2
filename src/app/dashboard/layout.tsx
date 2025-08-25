
"use client";

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // The middleware protects this route. We no longer need a client-side redirect.
  // We just need to handle the loading state.

  // While the auth state is being confirmed, display a skeleton loader.
  if (loading) {
    return (
        <div className="space-y-8 p-8">
            <div className="flex justify-between items-center">
                <Skeleton className="h-12 w-64" />
                <Skeleton className="h-10 w-40" />
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
    );
  }
  
  // If, after loading, there is no user, the middleware will handle the redirect.
  // This is a fallback case and should ideally not be reached if middleware is working.
  // We previously had a redirect here which was causing the bug. It has been removed.
  if (!user) {
    // A full page redirect is a final safety net if the middleware somehow fails.
     useEffect(() => {
        window.location.href = '/login';
    }, []);
    
    return (
        <div className="space-y-8 p-8">
            <div className="flex justify-between items-center">
                <Skeleton className="h-12 w-64" />
                <Skeleton className="h-10 w-40" />
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
    );
  }

  // Once the user is confirmed, render the children.
  return <>{children}</>;
}
