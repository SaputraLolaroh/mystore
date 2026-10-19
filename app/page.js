import { getDb } from '@/lib/db';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }) {
  const q = (searchParams?.q || '').toLowerCase();
  const category = searchParams?.category || '';
  const sql = await getDb();
  const products = await sql`SELECT * FROM products
    WHERE (${q} = '' OR LOWER(name) LIKE ${'%' + q + '%'} OR LOWER(description) LIKE ${'%' + q + '%'})
      AND (${category} = '' OR category = ${category})
    ORDER BY id DESC`;
  const categories = await sql`SELECT DISTINCT category FROM products ORDER BY category`;
  return <div>
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <h1 className="text-2xl font-bold">Semua Produk</h1>
      <form action="/" className="flex gap-2">
        <input type="text" name="q" defaultValue={searchParams?.q || ''} placeholder="Cari…" className="border rounded-lg px-3 py-2 text-sm" />
        <select name="category" defaultValue={category} className="border rounded-lg px-3 py-2 text-sm">
          <option value="">Semua Kategori</option>
          {categories.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}
        </select>
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm">Filter</button>
      </form>
    </div>
    {products.length === 0 ? <p className="text-gray-500">Tidak ada produk yang cocok.</p> :
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map(p => <ProductCard key={p.id} product={{ ...p, price: Number(p.price) }} />)}
      </div>}
  </div>;
}
