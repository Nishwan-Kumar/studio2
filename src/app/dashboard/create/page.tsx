
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
import { useAuth } from '@/context/auth-context';

const postFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required.").max(200, "Description must be 200 characters or less."),
  content: z.string().min(1, "Content is required."),
});

type PostFormValues = z.infer<typeof postFormSchema>;

export default function CreatePostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
    },
  });

  async function onSubmit(data: PostFormValues) {
    if (!user) {
        toast({
            title: "Authentication Error",
            description: "You must be logged in to create a post.",
            variant: "destructive"
        });
        return;
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, authorId: user.uid }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      toast({
        title: "Post Created!",
        description: "Your new post has been successfully created.",
      });
      router.push('/dashboard');
      router.refresh(); // Refresh server components
    } catch (error) {
       toast({
        title: "Error",
        description: "There was an error creating your post. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="max-w-4xl mx-auto fade-in">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Create New Post</CardTitle>
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
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Creating...' : 'Create Post'}
                        </Button>
                    </div>
                </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
