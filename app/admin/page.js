import { getDb } from '@/lib/db';
import { addProduct, deleteProduct } from '@/lib/actions';
const rupiah = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n));
const inputCls = 'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
export default async function AdminPage() {
  const sql = await getDb();
  const products = await sql`SELECT * FROM products ORDER BY id DESC`;
  return <div className="space-y-8">
    <h1 className="text-2xl font-bold">Dashboard Admin</h1>
    <form action={addProduct} className="bg-white border rounded-xl p-6 grid sm:grid-cols-2 gap-4">
      <h2 className="font-semibold sm:col-span-2">Tambah Produk Baru</h2>
      <input type="text" name="name" placeholder="Nama produk" required className={inputCls} />
      <input type="number" name="price" placeholder="Harga (Rp)" required min="0" step="0.01" className={inputCls} />
      <input type="text" name="category" placeholder="Kategori" required className={inputCls} />
      <input type="number" name="stock" placeholder="Stok" min="0" step="1" className={inputCls} />
      <input type="text" name="image" placeholder="URL gambar (opsional)" className={`${inputCls} sm:col-span-2`} />
      <textarea name="description" placeholder="Deskripsi" rows="2" className={`${inputCls} sm:col-span-2`} />
      <button className="sm:col-span-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Simpan Produk</button>
    </form>
    <div className="bg-white border rounded-xl overflow-hidden"><table className="w-full text-sm">
      <thead className="bg-gray-50 text-left"><tr><th className="px-4 py-3">Nama</th><th className="px-4 py-3">Kategori</th><th className="px-4 py-3">Harga</th><th className="px-4 py-3">Stok</th><th className="px-4 py-3"></th></tr></thead>
      <tbody>{products.map(p => <tr key={p.id} className="border-t">
        <td className="px-4 py-3 font-medium">{p.name}</td><td className="px-4 py-3">{p.category}</td><td className="px-4 py-3">{rupiah(p.price)}</td><td className="px-4 py-3">{p.stock}</td>
        <td className="px-4 py-3 text-right"><form action={deleteProduct}><input type="hidden" name="id" value={p.id} /><button className="text-red-500 hover:underline">Hapus</button></form></td>
      </tr>)}</tbody>
    </table></div>
  </div>;
}
