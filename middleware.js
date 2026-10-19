import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  let session = null;
  if (token && (process.env.AUTH_SECRET || process.env.NODE_ENV !== 'production')) {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'mystore-local-development-secret-only');
    try { const { payload } = await jwtVerify(token, secret); session = payload; } catch { session = null; }
  }
  if (!session || session.role !== 'admin') {
    const url = new URL('/login', request.url);
    url.searchParams.set('error', 'Silakan login sebagai admin');
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ['/admin/:path*'] };
