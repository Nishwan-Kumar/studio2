
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
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <Skeleton className="h-12 w-64" />
                <Skeleton className="h-10 w-40" />
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
    );
  }
  
  // If, after loading, there is no user, the middleware should have already
  // redirected. This is a fallback state.
  if (!user) {
    // A full page redirect to ensure middleware re-evaluates.
     useEffect(() => {
        router.push('/login');
    }, [router]);
    
    return (
        <div className="space-y-8">
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
