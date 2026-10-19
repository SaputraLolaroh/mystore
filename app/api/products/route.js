import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim().toLowerCase();
    const category = (searchParams.get('category') || '').trim();
    const sql = await getDb();
    const rows = await sql`SELECT * FROM products
      WHERE (${q} = '' OR LOWER(name) LIKE ${'%' + q + '%'} OR LOWER(description) LIKE ${'%' + q + '%'})
        AND (${category} = '' OR category = ${category}) ORDER BY id DESC`;
    const data = rows.map(p => ({ ...p, price: Number(p.price) }));
    return NextResponse.json({ data, total: data.length });
  } catch (error) {
    console.error('GET /api/products failed:', error);
    return NextResponse.json({ error: 'Gagal mengambil data produk.' }, { status: 500 });
  }
}
export async function POST(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Tidak diizinkan.' }, { status: 401 });
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const category = typeof body.category === 'string' && body.category.trim() ? body.category.trim() : 'Lainnya';
    const price = Number(body.price);
    const stock = body.stock === undefined ? 0 : Number(body.stock);
    const image = typeof body.image === 'string' ? body.image.trim() : '';
    if (!name || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0)
      return NextResponse.json({ error: 'Nama, harga, atau stok tidak valid.' }, { status: 400 });
    const sql = await getDb();
    const rows = await sql`INSERT INTO products (name, description, price, category, stock, image)
      VALUES (${name}, ${description}, ${price}, ${category}, ${stock}, ${image}) RETURNING id`;
    return NextResponse.json({ data: { id: rows[0].id } }, { status: 201 });
  } catch (error) {
    console.error('POST /api/products failed:', error);
    return NextResponse.json({ error: 'Gagal menyimpan produk.' }, { status: 500 });
  }
}
