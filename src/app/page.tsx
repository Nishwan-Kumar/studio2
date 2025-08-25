import Link from 'next/link';
import { getPosts } from '@/lib/data';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Heart } from 'lucide-react';
import { LikeButton } from '@/components/like-button';

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="fade-in">
      <h1 className="text-4xl font-headline font-bold mb-8 text-center md:text-left">Latest Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: Post) => (
          <Card key={post.id} className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 ease-out">
            <Link href={`/posts/${post.id}`} className="block group flex-grow">
              <CardHeader>
                <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
                <CardDescription className="pt-2">{post.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow"></CardContent>
            </Link>
            <CardFooter>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={post.author.avatarUrl} alt={post.author.name} data-ai-hint="portrait person" />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium">{post.author.name}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(post.createdAt), 'PPP')}</p>
                    </div>
                </div>
                <LikeButton initialLikes={post.likes} />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
