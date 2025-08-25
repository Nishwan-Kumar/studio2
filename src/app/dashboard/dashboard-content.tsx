import { getUserPosts } from '@/lib/data';
import type { Post, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface DashboardContentProps {
  currentUser: User;
}

export default async function DashboardContent({ currentUser }: DashboardContentProps) {
  const posts = await getUserPosts(currentUser.id);

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
                         <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                           <Trash2 className="h-4 w-4" />
                           <span className="sr-only">Delete</span>
                         </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">
                    You haven't written any posts yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
  );
}
