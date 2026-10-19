import postgres from 'postgres';
import bcrypt from 'bcryptjs';

const globalForDb = globalThis;
const SEED_PRODUCTS = [
  ['Kaos Polos Premium', 'Kaos katun combed 30s, nyaman dan adem.', 89000, 'Pakaian', 25, 'https://picsum.photos/seed/kaos/600/400'],
  ['Kemeja Flanel', 'Kemeja flanel pria/wanita motif kotak.', 159000, 'Pakaian', 15, 'https://picsum.photos/seed/kemeja/600/400'],
  ['Celana Chino', 'Celana chino stretch warna khaki.', 199000, 'Pakaian', 20, 'https://picsum.photos/seed/celana/600/400'],
  ['Sepatu Sneakers', 'Sneakers kasual ringan untuk harian.', 349000, 'Sepatu', 10, 'https://picsum.photos/seed/sepatu/600/400'],
  ['Tas Ransel Laptop', 'Ransel waterproof muat laptop 15.6 inci.', 279000, 'Aksesoris', 12, 'https://picsum.photos/seed/tas/600/400'],
  ['Jam Tangan Digital', 'Jam tangan digital water resistant.', 129000, 'Aksesoris', 30, 'https://picsum.photos/seed/jam/600/400'],
  ['Topi Baseball', 'Topi baseball polos adjustable.', 59000, 'Aksesoris', 40, 'https://picsum.photos/seed/topi/600/400'],
  ['Hoodie Oversize', 'Hoodie fleece tebal unisex.', 219000, 'Pakaian', 18, 'https://picsum.photos/seed/hoodie/600/400'],
];

function createClient() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL belum diatur. Tambahkan connection string Neon.');
  return postgres(process.env.DATABASE_URL, { ssl: 'require', max: 1, prepare: false, idle_timeout: 20, connect_timeout: 15 });
}

const sql = globalForDb.mystoreSql || createClient();
if (process.env.NODE_ENV !== 'production') globalForDb.mystoreSql = sql;

async function initializeDatabase() {
  await sql`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    category TEXT NOT NULL DEFAULT 'Lainnya', stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image TEXT NOT NULL DEFAULT '', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS app_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`;
  const seeded = await sql`INSERT INTO app_settings (key, value) VALUES ('products_seeded', 'true') ON CONFLICT (key) DO NOTHING RETURNING key`;
  if (seeded.length) {
    for (const p of SEED_PRODUCTS) await sql`INSERT INTO products (name, description, price, category, stock, image) VALUES (${p[0]}, ${p[1]}, ${p[2]}, ${p[3]}, ${p[4]}, ${p[5]})`;
  }
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const existing = await sql`SELECT id FROM users WHERE email = ${adminEmail} LIMIT 1`;
    if (!existing.length) {
      const hash = await bcrypt.hash(adminPassword, 12);
      await sql`INSERT INTO users (name, email, password, role) VALUES ('Administrator', ${adminEmail}, ${hash}, 'admin') ON CONFLICT (email) DO NOTHING`;
    }
  }
}
let initialization = globalForDb.mystoreDbInitialization;
if (!initialization) {
  initialization = initializeDatabase();
  if (process.env.NODE_ENV !== 'production') globalForDb.mystoreDbInitialization = initialization;
}
export async function getDb() { await initialization; return sql; }
