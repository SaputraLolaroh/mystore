# MyStore — Aplikasi E-Commerce Next.js

Aplikasi e-commerce lengkap yang dibangun mengikuti materi kursus **Next.js** (Packt Publishing): App Router, Server Components, Server Actions, SQLite (better-sqlite3), autentikasi JWT dengan cookie + middleware, keranjang belanja, filter produk, dan API Routes.

## Fitur vs Materi Kursus

| Bab Kursus | Implementasi |
|---|---|
| 1. Next.js Dasar & App Router | Routing, layout global (`app/layout.js`), komponen server vs klien, alias `@/`, dynamic route `/products/[id]` |
| 2–3. SQLite + Next.js | `lib/db.js` (better-sqlite3), auto-migrasi tabel & seed, tampil/tambah/hapus produk |
| 4. Caching | `revalidatePath()` pada server actions setelah mutasi data |
| 6. Prisma ORM | Struktur kode siap dimigrasi ke Prisma (`lib/db.js` sebagai satu-satunya titik akses DB) |
| 7. MyStore Admin | Dashboard `/admin` CRUD produk dengan server actions |
| 8. MyStore Klien | Beranda + filter, detail produk, keranjang belanja (Context + localStorage) |
| 9. Otentikasi | Login/daftar dengan JWT (jose), cookie httpOnly, `middleware.js` melindungi `/admin` |
| 8/9. API Routes | `GET/POST /api/products` dengan filter query (bisa diuji via Postman) |
| 10. Stripe | Tombol checkout disiapkan — tinggal integrasikan Stripe Checkout |
| 12. Deployment | Siap dideploy ke Vercel (ganti SQLite ke MySQL/Postgres untuk production) |

## Cara Menjalankan

```bash
# 1. Install dependency
npm install

# 2. (Opsional) salin env
cp .env.example .env.local

# 3. Jalankan dev server — database SQLite dibuat & di-seed otomatis
npm run dev
```

Buka **http://localhost:3000**

- Akun admin demo: `admin@mystore.com` / `admin123` → otomatis diarahkan ke `/admin`
- Halaman admin diproteksi middleware — pengguna biasa di-redirect ke login
- API: `GET http://localhost:3000/api/products?q=kaos&category=Pakaian`

## Struktur Proyek

```
mystore/
├── app/
│   ├── layout.js            # Layout global + CartProvider
│   ├── page.js              # Beranda: daftar produk + filter
│   ├── globals.css          # Tailwind
│   ├── admin/page.js        # Dashboard admin (dilindungi middleware)
│   ├── cart/page.js         # Keranjang (client component)
│   ├── login/page.js        # Login & registrasi
│   ├── products/[id]/page.js# Detail produk (dynamic route)
│   └── api/products/route.js# REST API produk
├── components/
│   ├── Header.js            # Header + keranjang badge + logout
│   ├── CartProvider.js      # Context keranjang (client)
│   ├── ProductCard.js
│   └── AddToCartButton.js
├── lib/
│   ├── db.js                # Koneksi SQLite + seed (better-sqlite3)
│   ├── auth.js              # JWT sign/verify + cookie (jose)
│   └── actions.js           # Server actions: login, register, CRUD produk
├── middleware.js            # Proteksi rute /admin berbasis JWT
└── jsconfig.json            # Alias impor "@/*"
```

## Langkah Berikutnya (sesuai materi)

1. **Stripe**: ganti tombol checkout simulasi dengan Stripe Checkout Sessions (Bab 10)
2. **Prisma**: migrasikan `lib/db.js` ke Prisma schema + MySQL (Bab 6 & 12)
3. **CI/CD**: push ke GitHub → deploy otomatis ke Vercel (Bab 12)
4. **Laporan**: tambahkan grafik penjualan dengan Recharts (Bab 11)
