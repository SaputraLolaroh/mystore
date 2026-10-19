import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

function getSecret() {
  const value = process.env.AUTH_SECRET;
  if (!value && process.env.NODE_ENV === 'production') throw new Error('AUTH_SECRET wajib diatur di environment variables production.');
  return new TextEncoder().encode(value || 'mystore-local-development-secret-only');
}
export async function signToken(payload) {
  return new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(getSecret());
}
export async function verifyToken(token) {
  try { const { payload } = await jwtVerify(token, getSecret()); return payload; } catch { return null; }
}
export async function getSession() {
  const token = cookies().get('token')?.value;
  return token ? verifyToken(token) : null;
}
export async function setSessionCookie(payload) {
  const token = await signToken(payload);
  cookies().set('token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 });
}
export async function clearSessionCookie() {
  cookies().set('token', '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 });
}
