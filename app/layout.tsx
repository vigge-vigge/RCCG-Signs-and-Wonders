import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'RCCG Signs and Wonders - Jönköping Sweden',
  description: 'The Redeemed Christian Church of God - Signs and Wonders Parish, Jönköping Sweden',
};

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
