"use client";

import { useState, useEffect } from 'react';
import type { Post, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

interface DashboardContentClientProps {
  currentUser: User;
  initialPosts: Post[];
}

export default function DashboardContentClient({ currentUser, initialPosts }: DashboardContentClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async (postId: string) => {
    setIsDeleting(postId);
    setLoading(true);
    try {
      // Simulate API call for deletion
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPosts(posts.filter(post => post.id !== postId));
      
      toast({
        title: "Post Deleted",
        description: "Your post has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete the post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-headline">Title</TableHead>
              <TableHead className="font-headline hidden md:table-cell">Date</TableHead>
              <TableHead className="font-headline text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length > 0 ? (
              posts.map((post: Post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">
                    <Link href={`/posts/${post.id}`} className="hover:underline">
                      {post.title}
                    </Link>
                    <Badge variant="secondary" className="ml-2">Your Post</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(post.createdAt), 'PPP')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/edit/${post.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                            disabled={isDeleting === post.id}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your post
                              "{post.title}" and remove it from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(post.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {isDeleting === post.id ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="text-muted-foreground text-lg">
                      You haven't written any posts yet.
                    </div>
                    <Button asChild>
                      <Link href="/dashboard/create">
                        Create Your First Post
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
