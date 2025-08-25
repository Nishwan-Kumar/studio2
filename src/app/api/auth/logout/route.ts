
import {NextResponse} from 'next/server';

export async function POST() {
  const response = new NextResponse(JSON.stringify({status: 'success'}), {
    status: 200,
    headers: {'Content-Type': 'application/json'},
  });

  // Expire the cookie
  response.cookies.set({
    name: 'firebaseIdToken',
    value: '',
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1, 
  });

  return response;
}
