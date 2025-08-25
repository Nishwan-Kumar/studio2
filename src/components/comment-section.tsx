
"use client";

import type { Comment } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

interface CommentSectionProps {
  comments: Comment[];
}

export function CommentSection({ comments: initialComments }: CommentSectionProps) {
  const { toast } = useToast();
  const [comments, setComments] = useState(initialComments);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Here you would handle form submission, e.g., send to an API
    toast({
        title: "Comment Posted",
        description: "Your comment has been successfully posted."
    });
    // For now, just reset the form
    event.currentTarget.reset();
  };

  return (
    <section>
      <h2 className="font-headline text-3xl font-bold mb-6">Comments ({comments.length})</h2>
      <Card className="mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Textarea
              placeholder="Write a comment..."
              className="min-h-[100px]"
              required
            />
            <div className="flex justify-end">
              <Button type="submit">Post Comment</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start space-x-4">
            <Avatar>
              <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} data-ai-hint="portrait person" />
              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 bg-accent/30 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{comment.author.name}</p>
                <p className="text-xs text-muted-foreground">
                  {isClient ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : ''}
                </p>
              </div>
              <p className="text-foreground/80 mt-1">{comment.text}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-muted-foreground text-center py-4">Be the first to comment.</p>
        )}
      </div>
    </section>
  );
}
