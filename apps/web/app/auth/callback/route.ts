import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const accessToken = requestUrl.searchParams.get('access_token');

  const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APPLICATION_URL}/dashboard`);

  if (accessToken) {
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.flowmail.in' : undefined,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

  }

  return response;
}
