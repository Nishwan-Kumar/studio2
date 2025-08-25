
"use client";

import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  // The server-side middleware already protects this route.
  // We only need to handle the initial loading state while the Firebase SDK
  // confirms the user's session on the client.
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
  
  // If loading is complete, we can assume the middleware has done its job.
  // If there's no user, it's either because they just logged out or the 
  // session is invalid, but we should not perform a client-side redirect here
  // as it causes loops. The user can navigate away manually or refresh.
  // We render the children once the user object is confirmed or loading is done.
  return <>{children}</>;
}
