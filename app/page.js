import { db } from '@/lib/db';
import ProductCard from '@/components/ProductCard';

// Halaman ini dirender di server (Server Component) — data diambil langsung dari SQLite
export default function Home({ searchParams }) {
  const q = (searchParams.q || '').toLowerCase();
  const category = searchParams.category || '';

  const all = db.prepare('SELECT * FROM products ORDER BY id DESC').all();
  const categories = db.prepare('SELECT DISTINCT category FROM products ORDER BY category').all();

  const products = all.filter(
    (p) =>
      (!q || p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)) &&
      (!category || p.category === category)
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Semua Produk</h1>

        {/* Filter: pencarian & kategori dikirim ke query string (URL) */}
        <form action="/" className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={searchParams.q}
            placeholder="Cari…"
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <select name="category" defaultValue={category} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.category} value={c.category}>
                {c.category}
              </option>
            ))}
          </select>
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm">Filter</button>
        </form>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">Tidak ada produk yang cocok.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
