

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

  // Middleware now handles the primary redirection. 
  // This useEffect is a fallback and ensures client-side consistency.
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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

  return <>{children}</>;
}
