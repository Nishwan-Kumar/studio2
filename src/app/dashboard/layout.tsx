

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

  // The middleware is the primary gatekeeper. This check is a client-side
  // fallback for consistency and to handle cases where the user's session
  // expires while they are on the site. We no longer redirect from here if loading.
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // While the auth state is loading, or if the user is not yet available,
  // display a skeleton loader. This prevents the redirect loop.
  if (loading || !user) {
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
