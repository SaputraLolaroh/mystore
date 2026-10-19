import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'mystore-dev-secret-ganti-di-production'
);

export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const token = cookies().get('token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSessionCookie(payload) {
  const token = await signToken(payload);
  cookies().set('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });
}

export async function clearSessionCookie() {
  cookies().set('token', '', { httpOnly: true, path: '/', maxAge: 0 });
}
