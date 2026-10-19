'use client';

import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function CartPage() {
  const { items, total, setQty, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Keranjang Anda masih kosong.</p>
        <Link href="/" className="text-indigo-600 font-medium">
          ← Kembali belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Keranjang Belanja</h1>

      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="bg-white border rounded-xl p-4 flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">{rupiah(item.price)}</p>
            </div>
            <input
              type="number"
              min="1"
              value={item.qty}
              onChange={(e) => setQty(item.id, Number(e.target.value))}
              className="w-16 border rounded-lg px-2 py-1 text-center"
            />
            <p className="w-28 text-right font-medium">{rupiah(item.price * item.qty)}</p>
            <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm">
              Hapus
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 bg-white border rounded-xl p-4 flex items-center justify-between">
        <p className="text-lg font-bold">Total: {rupiah(total)}</p>
        <div className="flex gap-3">
          <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-600">
            Kosongkan
          </button>
          {/* Integrasi Stripe (embedded checkout) dapat ditambahkan di sini sesuai materi Bab 10 */}
          <button
            onClick={() => alert('Checkout berhasil (simulasi). Integrasikan Stripe di langkah berikutnya!')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
