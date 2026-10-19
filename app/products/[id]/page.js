import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import AddToCartButton from '@/components/AddToCartButton';

const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

// Rute dinamis: /products/[id] — parameter rute diambil dari props params
export default function ProductDetail({ params }) {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(params.id);
  if (!product) notFound();

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={product.image} alt={product.name} className="w-full rounded-xl object-cover border" />
      <div>
        <p className="text-sm text-indigo-600 font-medium uppercase">{product.category}</p>
        <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
        <p className="text-2xl font-bold mt-4">{rupiah(product.price)}</p>
        <p className="text-gray-600 mt-4">{product.description}</p>
        <p className="text-sm text-gray-400 mt-2">Stok tersedia: {product.stock}</p>
        <div className="mt-6">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
