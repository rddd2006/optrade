// src/app/layout.tsx
import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers'; // Import your new providers component

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}