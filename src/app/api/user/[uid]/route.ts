import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const resolvedParams = await params;
    const userDoc = doc(db, 'users', resolvedParams.uid);
    const userSnapshot = await getDoc(userDoc);
    
    if (!userSnapshot.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userSnapshot.data());
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const resolvedParams = await params;
    const { name } = await request.json();
    
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const userDoc = doc(db, 'users', resolvedParams.uid);
    await updateDoc(userDoc, { name });
    
    return NextResponse.json({ success: true, name });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
