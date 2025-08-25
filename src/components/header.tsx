import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PenSquare } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-headline font-bold text-foreground hover:text-primary transition-colors">
            Echo Chamber
          </Link>
          <div className="flex items-center space-x-4">
            <Button asChild>
              <Link href="/dashboard/create">
                <PenSquare className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
            <Link href="/dashboard">
              <Avatar>
                <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="portrait person" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
