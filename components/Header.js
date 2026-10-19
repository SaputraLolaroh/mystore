'use client';

import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { logout } from '@/lib/actions';

export default function Header() {
  const { count } = useCart();

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          MyStore
        </Link>

        {/* Pencarian dikirim sebagai query string ke halaman beranda */}
        <form action="/" className="flex-1 hidden sm:block">
          <input
            type="text"
            name="q"
            placeholder="Cari produk…"
            className="w-full max-w-md border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </form>

        <nav className="flex items-center gap-3 text-sm">
          <Link href="/" className="hover:text-indigo-600">
            Beranda
          </Link>
          <Link href="/admin" className="hover:text-indigo-600">
            Admin
          </Link>
          <Link href="/cart" className="relative hover:text-indigo-600">
            Keranjang
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-xs rounded-full px-1.5 py-0.5">
                {count}
              </span>
            )}
          </Link>
          <form action={logout}>
            <button type="submit" className="text-gray-500 hover:text-red-600">
              Keluar
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
