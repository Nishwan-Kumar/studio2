
import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  const {token} = await request.json();

  if (!token) {
    return NextResponse.json({error: 'Token is required'}, {status: 400});
  }

  const response = new NextResponse(JSON.stringify({status: 'success'}), {
    status: 200,
    headers: {'Content-Type': 'application/json'},
  });

  // Set the token in an HTTPOnly cookie
  response.cookies.set({
    name: 'firebaseIdToken',
    value: token,
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60, // 1 hour
  });

  return response;
}
