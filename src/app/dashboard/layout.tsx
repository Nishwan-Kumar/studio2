
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

  // The middleware protects this route. We use the client-side check to handle the loading state
  // and as a fallback.

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
  
  // If, after loading, there is no user, the middleware should have already redirected.
  // This client-side redirect is a final safety net.
  if (!user) {
    router.push('/login'); // Use router.push for client-side navigation
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

  // Once the user is confirmed, render the dashboard.
  return <>{children}</>;
}
