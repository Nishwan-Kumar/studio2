"use client";

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { getUserPosts } from '@/lib/data';
import { useEffect, useState } from 'react';
import DashboardContentClient from './dashboard-content-client';
import type { Post, User } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

function DashboardSkeleton() {
  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>
      
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [appUser, setAppUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const { toast } = useToast();
  const title = 'Your Posts';

  const handleNameEdit = async () => {
    if (newName.trim() && appUser && firebaseUser) {
      try {
        // Update in Firestore
        const response = await fetch(`/api/user/${firebaseUser.uid}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newName.trim() }),
        });

        if (response.ok) {
          setAppUser({ ...appUser, name: newName.trim() });
          setIsEditingName(false);
          toast({
            title: "Name Updated",
            description: "Your display name has been updated in the database.",
          });
        } else {
          throw new Error('Failed to update name');
        }
      } catch (error) {
        console.error('Error updating name:', error);
        toast({
          title: "Update Failed",
          description: "Failed to update your name. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    if (isEditingName && appUser) {
      setNewName(appUser.name);
    }
  }, [isEditingName, appUser]);

  useEffect(() => {
    if (firebaseUser && !authLoading) {
      const fetchUserDataAndPosts = async () => {
        try {
          // Fetch user data from Firestore
          const userResponse = await fetch(`/api/user/${firebaseUser.uid}`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setAppUser({
              id: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || 'User',
              avatarUrl: userData.avatarUrl || firebaseUser.photoURL || 'https://placehold.co/100x100.png'
            });
          } else {
            // Fallback to Firebase auth data
            setAppUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              avatarUrl: firebaseUser.photoURL || 'https://placehold.co/100x100.png'
            });
          }

          // Fetch posts for this user
          const userPosts = await getUserPosts(firebaseUser.uid);
          setPosts(userPosts);
        } catch (error) {
          console.error('Error fetching user data or posts:', error);
          // Fallback to Firebase auth data
          setAppUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            avatarUrl: firebaseUser.photoURL || 'https://placehold.co/100x100.png'
          });
        } finally {
          setLoading(false);
        }
      };

      fetchUserDataAndPosts();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [firebaseUser, authLoading]);

  if (authLoading || loading) {
    return <DashboardSkeleton />;
  }

  if (!firebaseUser || !appUser) {
    return (
      <div className="fade-in text-center py-12">
        <h1 className="text-4xl font-headline font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">Please log in to access your dashboard.</p>
        <Button asChild>
          <Link href="/login">Log In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-headline font-bold">{title}</h1>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">Welcome back, {appUser.name}!</p>
            <Dialog open={isEditingName} onOpenChange={setIsEditingName}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  Edit Name
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Display Name</DialogTitle>
                  <DialogDescription>
                    Update your display name that will be shown on your posts and profile.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter your name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleNameEdit()}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditingName(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleNameEdit} disabled={!newName.trim()}>
                      Save
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Button asChild>
          <Link href="/dashboard/create">Create New Post</Link>
        </Button>
      </div>

      <DashboardContentClient currentUser={appUser} initialPosts={posts} />
    </div>
  );
}
