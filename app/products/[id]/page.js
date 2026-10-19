import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import AddToCartButton from '@/components/AddToCartButton';

export const dynamic = 'force-dynamic';
const rupiah = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
export default async function ProductDetail({ params }) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const sql = await getDb();
  const rows = await sql`SELECT * FROM products WHERE id = ${id} LIMIT 1`;
  const product = rows[0];
  if (!product) notFound();
  const p = { ...product, price: Number(product.price) };
  return <div className="grid md:grid-cols-2 gap-8">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={p.image} alt={p.name} className="w-full rounded-xl object-cover border" />
    <div><p className="text-sm text-indigo-600 font-medium uppercase">{p.category}</p>
      <h1 className="text-3xl font-bold mt-1">{p.name}</h1><p className="text-2xl font-bold mt-4">{rupiah(p.price)}</p>
      <p className="text-gray-600 mt-4">{p.description}</p><p className="text-sm text-gray-400 mt-2">Stok tersedia: {p.stock}</p>
      <div className="mt-6"><AddToCartButton product={p} /></div>
    </div>
  </div>;
}
