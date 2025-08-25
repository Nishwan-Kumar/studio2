import { getPost } from '@/lib/data';
import { notFound } from 'next/navigation';
import { EditPostForm } from '@/components/edit-post-form';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto fade-in">
        <EditPostForm post={post} />
    </div>
  );
}
