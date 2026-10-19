import './globals.css';
import Header from '@/components/Header';
import CartProvider from '@/components/CartProvider';

export const metadata = {
  title: 'MyStore',
  description: 'Belanja online dengan Next.js App Router',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">{children}</main>
          <footer className="border-t bg-white py-4 text-center text-sm text-gray-500">
            MyStore — dibuat dengan Next.js App Router, SQLite, dan JWT
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
