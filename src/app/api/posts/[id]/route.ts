
import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { title, description, content } = await request.json();

    if (!title || !description || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const postDoc = doc(db, 'posts', id);
    await updateDoc(postDoc, {
      title,
      description,
      content,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const postDoc = doc(db, 'posts', id);
    await deleteDoc(postDoc);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
