'use client';

import { useState } from 'react';
import { useCart } from '@/components/CartProvider';

export default function AddToCartButton({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      disabled={product.stock <= 0}
      className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 transition"
    >
      {product.stock <= 0 ? 'Stok Habis' : added ? '✓ Ditambahkan' : 'Tambah ke Keranjang'}
    </button>
  );
}
