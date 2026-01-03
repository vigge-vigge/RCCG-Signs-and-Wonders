import type { Metadata } from 'next';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Providers from './providers';
import { usePathname } from 'next/navigation';

export const metadata: Metadata = {
  title: 'RCCG Signs and Wonders - Jönköping Sweden',
  description: 'The Redeemed Christian Church of God - Signs and Wonders Parish, Jönköping Sweden',
};

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
