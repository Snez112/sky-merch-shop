import "./globals.css";
import Header from "@/components/layout/header/header";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import MainLayout from "@/components/layout/main-layout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    template: '%s | Sky Merch',
    default: 'Sky Merch - Journey In Sky',
  },
  description: 'The best marketplace for premium configs, software, and digital services via automatic delivery.',
  keywords: ['sky merch', 'configs', 'software', 'digital', 'game configs', 'premium'],
  authors: [{ name: 'Sky Merch' }],
  creator: 'Sky Merch',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://skymerch.com',
    siteName: 'Sky Merch',
    title: 'Sky Merch - Journey In Sky',
    description: 'The best marketplace for premium configs, software, and digital services via automatic delivery.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Sky Merch',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sky Merch - Journey In Sky',
    description: 'The best marketplace for premium configs, software, and digital services via automatic delivery.',
    images: ['/opengraph-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
