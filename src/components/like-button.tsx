"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  initialLikes: number;
}

export function LikeButton({ initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  return (
    <Button variant="ghost" onClick={handleLike} className="flex items-center gap-2">
      <Heart className={cn("h-5 w-5", liked && "text-red-500 fill-red-500")} />
      <span className="font-medium">{likes}</span>
      <span className="sr-only">Likes</span>
    </Button>
  );
}
