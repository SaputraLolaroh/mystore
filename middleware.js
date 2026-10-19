import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'mystore-dev-secret-ganti-di-production'
);

// Melindungi rute /admin berdasarkan cookie JWT (lihat materi "Rute pribadi & publik menggunakan middleware")
export async function middleware(request) {
  const token = request.cookies.get('token')?.value;

  let session = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      session = payload;
    } catch {
      session = null;
    }
  }

  if (!session || session.role !== 'admin') {
    const url = new URL('/login', request.url);
    url.searchParams.set('error', 'Silakan login sebagai admin');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
