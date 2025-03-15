import { serverAuthApi } from '@/lib/server-api-client';
import { NextResponse, type NextRequest } from 'next/server'

async function checkAuthStatus(accessToken: string | undefined) {
  if (!accessToken) return false;

  try {
    const response = await serverAuthApi.checkAuth();
    return response;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
}

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request,
  })

  const accessToken = request.cookies.get('access_token')?.value
  const isAuthenticated = await checkAuthStatus(accessToken)

  // Redirect to dashboard if user is logged in and trying to access the home page
  if (isAuthenticated && request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Redirect to home if user is not logged in and trying to access protected routes
  if (
    !isAuthenticated &&
    request.nextUrl.pathname.startsWith('/dashboard')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return response
}