import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/products?q=...&category=...
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').toLowerCase();
  const category = searchParams.get('category') || '';

  let products = db.prepare('SELECT * FROM products ORDER BY id DESC').all();
  products = products.filter(
    (p) =>
      (!q || p.name.toLowerCase().includes(q)) &&
      (!category || p.category === category)
  );

  return NextResponse.json({ data: products, total: products.length });
}

// POST /api/products  (untuk integrasi eksternal / Postman, sesuai materi Bab 8-9)
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description = '', price, category = 'Lainnya', stock = 0, image = '' } = body;

    if (!name || !price) {
      return NextResponse.json({ error: 'name dan price wajib diisi' }, { status: 400 });
    }

    const result = db
      .prepare(
        'INSERT INTO products (name, description, price, category, stock, image) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .run(name, description, price, category, stock, image);

    return NextResponse.json({ data: { id: result.lastInsertRowid } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
