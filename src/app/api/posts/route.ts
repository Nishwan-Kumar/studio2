
import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { title, description, content, authorId } = await request.json();

    if (!title || !description || !content || !authorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const postsCollection = collection(db, 'posts');
    const newPostRef = await addDoc(postsCollection, {
      title,
      description,
      content,
      authorId,
      createdAt: serverTimestamp(),
      likes: 0,
      comments: [],
    });

    return NextResponse.json({ id: newPostRef.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
