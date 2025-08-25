
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, PenSquare } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const clearAuthCookie = async () => {
  await fetch('/api/auth/logout', {
    method: 'POST',
  });
};


export function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    await clearAuthCookie();
    // Full page reload to ensure the server knows the user is logged out.
    window.location.href = '/';
  };

  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-headline font-bold text-foreground hover:text-primary transition-colors">
            Blog Page
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button asChild>
                  <Link href="/dashboard/create">
                    <PenSquare className="mr-2 h-4 w-4" />
                    New Post
                  </Link>
                </Button>
                <Link href="/dashboard" passHref>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user.photoURL || 'https://placehold.co/100x100.png'} alt={user.displayName || 'User Avatar'} data-ai-hint="portrait person" />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-5 w-5"/>
                    <span className="sr-only">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
