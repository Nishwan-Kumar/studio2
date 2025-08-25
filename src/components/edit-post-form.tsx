"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { Post } from '@/lib/types';

const postFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required.").max(200, "Description must be 200 characters or less."),
  content: z.string().min(1, "Content is required."),
});

type PostFormValues = z.infer<typeof postFormSchema>;

interface EditPostFormProps {
    post: Post;
}

export function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post.title,
      description: post.description,
      content: post.content,
    },
  });

  function onSubmit(data: PostFormValues) {
    console.log(data);
    // Here you would call an API to update the post
    toast({
      title: "Post Updated!",
      description: "Your post has been successfully updated.",
    });
    router.push('/dashboard');
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline text-3xl">Edit Post</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter post title" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter a short description" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Write your post content here..."
                        className="min-h-[300px]"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
