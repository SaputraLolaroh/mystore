import { login, register } from '@/lib/actions';

export default function LoginPage({ searchParams }) {
  const inputCls = 'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="max-w-md mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-center">Masuk / Daftar</h1>

      {searchParams.error && (
        <p className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{searchParams.error}</p>
      )}

      <form action={login} className="bg-white border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">Masuk</h2>
        <input type="email" name="email" placeholder="Email" required className={inputCls} />
        <input type="password" name="password" placeholder="Password" required className={inputCls} />
        <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
          Masuk
        </button>
        <p className="text-xs text-gray-400 text-center">
          Akun demo admin: admin@mystore.com / admin123
        </p>
      </form>

      <form action={register} className="bg-white border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">Daftar Akun Baru</h2>
        <input type="text" name="name" placeholder="Nama lengkap" required className={inputCls} />
        <input type="email" name="email" placeholder="Email" required className={inputCls} />
        <input
          type="password"
          name="password"
          placeholder="Password (min. 6 karakter)"
          required
          minLength={6}
          className={inputCls}
        />
        <button className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-black">
          Daftar
        </button>
      </form>
    </div>
  );
}
