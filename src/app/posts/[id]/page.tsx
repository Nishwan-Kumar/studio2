import { getPost } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { CommentSection } from '@/components/comment-section';

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto fade-in bg-card p-6 sm:p-8 rounded-lg shadow-md">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
        <div className="flex justify-center items-center space-x-4 text-muted-foreground">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={post.author.avatarUrl} alt={post.author.name} data-ai-hint="portrait person" />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="text-sm font-medium text-foreground">{post.author.name}</p>
                <time dateTime={post.createdAt} className="text-sm">
                {format(new Date(post.createdAt), 'PPP')}
                </time>
            </div>
          </div>
        </div>
      </div>
      <Separator className="mb-8" />
      <div className="text-lg leading-relaxed space-y-6">
        {post.content.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <Separator className="my-12" />
      <CommentSection comments={post.comments} />
    </article>
  );
}
