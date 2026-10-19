'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { getSession, setSessionCookie, clearSessionCookie } from '@/lib/auth';

export async function login(formData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const sql = await getDb();
  const rows = await sql`SELECT id, name, email, password, role FROM users WHERE email = ${email} LIMIT 1`;
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password))) redirect('/login?error=Email%20atau%20password%20salah');
  await setSessionCookie({ id: user.id, email: user.email, name: user.name, role: user.role });
  redirect(user.role === 'admin' ? '/admin' : '/');
}
export async function register(formData) {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) redirect('/login?error=Data%20tidak%20valid%20%28password%20minimal%208%20karakter%29');
  const sql = await getDb();
  const hash = await bcrypt.hash(password, 12);
  try {
    const rows = await sql`INSERT INTO users (name, email, password, role) VALUES (${name}, ${email}, ${hash}, 'customer') RETURNING id`;
    await setSessionCookie({ id: rows[0].id, email, name, role: 'customer' });
  } catch (error) {
    if (error.code === '23505') redirect('/login?error=Email%20sudah%20terdaftar');
    throw error;
  }
  redirect('/');
}
export async function logout() { await clearSessionCookie(); redirect('/'); }

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Akses ditolak: hanya admin yang boleh mengelola produk.');
}
export async function addProduct(formData) {
  await requireAdmin();
  const name = String(formData.get('name') || '').trim();
  const price = Number(formData.get('price'));
  const category = String(formData.get('category') || 'Lainnya').trim() || 'Lainnya';
  const stock = Number(formData.get('stock') || 0);
  const description = String(formData.get('description') || '').trim();
  const image = String(formData.get('image') || '').trim() || `https://picsum.photos/seed/${Date.now()}/600/400`;
  if (!name || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) throw new Error('Data produk tidak valid.');
  const sql = await getDb();
  await sql`INSERT INTO products (name, description, price, category, stock, image) VALUES (${name}, ${description}, ${price}, ${category}, ${stock}, ${image})`;
  revalidatePath('/'); revalidatePath('/admin');
}
export async function deleteProduct(formData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  if (!Number.isInteger(id) || id <= 0) return;
  const sql = await getDb();
  await sql`DELETE FROM products WHERE id = ${id}`;
  revalidatePath('/'); revalidatePath('/admin');
}
