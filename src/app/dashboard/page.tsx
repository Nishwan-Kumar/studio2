import Link from 'next/link';
import { getUserPosts, getCurrentUser, getPosts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  const allPosts = await getPosts();
  const userPosts = await getUserPosts(currentUser.id);

  const posts = currentUser.role === 'admin' ? allPosts : userPosts;
  const title = currentUser.role === 'admin' ? 'All Posts' : 'Your Posts';

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-headline font-bold">{title}</h1>
        <Button asChild>
          <Link href="/dashboard/create">Create New Post</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-headline">Title</TableHead>
                {currentUser.role === 'admin' && <TableHead className="font-headline hidden md:table-cell">Author</TableHead>}
                <TableHead className="font-headline hidden md:table-cell">Date</TableHead>
                <TableHead className="font-headline text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <Link href={`/posts/${post.id}`} className="hover:underline">
                        {post.title}
                      </Link>
                      {currentUser.id === post.author.id && currentUser.role !== 'admin' && (
                         <Badge variant="secondary" className="ml-2">Your Post</Badge>
                      )}
                    </TableCell>
                    {currentUser.role === 'admin' && (
                        <TableCell className="hidden md:table-cell">
                            {post.author.name}
                             {currentUser.id === post.author.id && <Badge variant="secondary" className="ml-2">You</Badge>}
                        </TableCell>
                    )}
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
                  <TableCell colSpan={currentUser.role === 'admin' ? 4 : 3} className="text-center h-24">
                    You haven't written any posts yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
