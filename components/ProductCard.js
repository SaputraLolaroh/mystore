import Link from 'next/link';

const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="block bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <p className="text-xs text-indigo-600 font-medium uppercase">{product.category}</p>
        <h3 className="font-semibold mt-1 truncate">{product.name}</h3>
        <p className="text-gray-900 font-bold mt-2">{rupiah(product.price)}</p>
        <p className="text-xs text-gray-400 mt-1">Stok: {product.stock}</p>
      </div>
    </Link>
  );
}
