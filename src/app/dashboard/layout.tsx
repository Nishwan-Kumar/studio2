
"use client";

import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // The middleware protects routes on the server. This handles the client-side,
    // where after a logout, the user object might become null.
    // In that case, we redirect to the homepage.
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);


  // While Firebase is initializing and checking the auth state, show a loading skeleton.
  // This prevents content flashing or incorrect redirects.
  if (loading) {
    return (
        <div className="space-y-8 p-4 md:p-8">
            <div className="flex justify-between items-center">
                <Skeleton className="h-12 w-64" />
                <Skeleton className="h-10 w-40" />
            </div>
            <Skeleton className="h-[400px] w-full" />
        </div>
    );
  }
  
  // If we are done loading and we have a user, render the children.
  // The useEffect hook above will handle the case where there is no user.
  if (user) {
      return <div className="p-4 md:p-8">{children}</div>;
  }

  // Render nothing while the redirect is in-flight.
  return null;
}
