import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

// Mencegah pembuatan ulang koneksi saat hot-reload di development
const globalForDb = globalThis;
const DB_PATH = path.join(process.cwd(), 'mystore.db');

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

function createDb() {
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      image TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Seed produk contoh (hanya jika tabel kosong)
  const count = db.prepare('SELECT COUNT(*) AS c FROM products').get();
  if (count.c === 0) {
    const insert = db.prepare(
      'INSERT INTO products (name, description, price, category, stock, image) VALUES (?, ?, ?, ?, ?, ?)'
    );
    for (const p of SEED_PRODUCTS) insert.run(...p);
  }

  // Seed akun admin (email: admin@mystore.com, password: admin123)
  const admin = db.prepare("SELECT id FROM users WHERE email = 'admin@mystore.com'").get();
  if (!admin) {
    db.prepare(
      "INSERT INTO users (name, email, password, role) VALUES ('Administrator', 'admin@mystore.com', ?, 'admin')"
    ).run(bcrypt.hashSync('admin123', 10));
  }

  return db;
}

export const db = globalForDb.db ?? createDb();
if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
