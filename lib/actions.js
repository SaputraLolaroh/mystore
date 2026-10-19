'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { setSessionCookie, clearSessionCookie } from '@/lib/auth';

/* ---------------- AUTH ---------------- */

export async function login(formData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    redirect('/login?error=Email atau password salah');
  }

  await setSessionCookie({ id: user.id, email: user.email, name: user.name, role: user.role });
  redirect(user.role === 'admin' ? '/admin' : '/');
}

export async function register(formData) {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!name || !email || password.length < 6) {
    redirect('/login?error=Data tidak valid (password min. 6 karakter)');
  }
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (exists) redirect('/login?error=Email sudah terdaftar');

  const result = db
    .prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'customer')")
    .run(name, email, bcrypt.hashSync(password, 10));

  await setSessionCookie({ id: result.lastInsertRowid, email, name, role: 'customer' });
  redirect('/');
}

export async function logout() {
  await clearSessionCookie();
  redirect('/');
}

/* ---------------- PRODUK (ADMIN) ---------------- */

export async function addProduct(formData) {
  const name = String(formData.get('name') || '').trim();
  const price = Number(formData.get('price'));
  const category = String(formData.get('category') || 'Lainnya').trim();
  const stock = Number(formData.get('stock')) || 0;
  const description = String(formData.get('description') || '');
  const image =
    String(formData.get('image') || '').trim() || `https://picsum.photos/seed/${Date.now()}/600/400`;

  if (!name || !price) return;

  db.prepare(
    'INSERT INTO products (name, description, price, category, stock, image) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, description, price, category, stock, image);

  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteProduct(formData) {
  const id = Number(formData.get('id'));
  if (!id) return;
  db.prepare('DELETE FROM products WHERE id = ?').run(id);
  revalidatePath('/');
  revalidatePath('/admin');
}
