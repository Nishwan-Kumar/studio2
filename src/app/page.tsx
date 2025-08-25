
"use client";

import Link from 'next/link';
import { getPosts } from '@/lib/data';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { LikeButton } from '@/components/like-button';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    async function loadPosts() {
        setLoading(true);
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
        setLoading(false);
    }
    loadPosts();
  }, []);

  if (loading) {
    return (
        <div className="fade-in">
            <h1 className="text-4xl font-headline font-bold mb-8 text-center md:text-left">Latest Posts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="h-full flex flex-col">
                        <CardHeader>
                            <Skeleton className="h-7 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full" />
                        </CardHeader>
                        <CardContent className="flex-grow"></CardContent>
                        <CardFooter>
                           <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <Skeleton className="h-8 w-8 mr-3 rounded-full" />
                                    <div>
                                        <Skeleton className="h-4 w-24 mb-1" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                                <Skeleton className="h-8 w-12" />
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
  }

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
                        <p className="text-xs text-muted-foreground">{isClient ? format(new Date(post.createdAt), 'PPP') : <Skeleton className="h-3 w-20" />}</p>
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
