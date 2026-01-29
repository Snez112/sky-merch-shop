import "./globals.css";
import Header from "@/components/layout/header/header";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import MainLayout from "@/components/layout/main-layout";

import { Be_Vietnam_Pro } from "next/font/google";

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

const beVietnamPro = Be_Vietnam_Pro({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-be-vietnam-pro",
    display: "swap",
    style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Sky Merch',
    default: 'Heart of the Game | Sky: Children of the Light Services',
  },
  description: 'The safest and fastest way to get hearts for Sky: Children of the Light. Join thousands of players enhancing their constellations.',
  keywords: ['sky merch', 'configs', 'software', 'digital', 'game configs', 'premium'],
  authors: [{ name: 'Sky Merch' }],
  creator: 'Sky Merch',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://skymerch.com',
    siteName: 'Sky Merch',
    title: 'Heart of the Game | Sky: Children of the Light Services',
    description: 'The safest and fastest way to get hearts for Sky: Children of the Light. Join thousands of players enhancing their constellations.',
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
    title: 'Heart of the Game | Sky: Children of the Light Services',
    description: 'The safest and fastest way to get hearts for Sky: Children of the Light. Join thousands of players enhancing their constellations.',
    images: ['/opengraph-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

import { ThemeProvider } from "@/components/theme-provider";

// ... (existing imports)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${beVietnamPro.variable} antialiased font-display bg-background-light dark:bg-background-dark text-[#1c0d0d] dark:text-white transition-colors duration-300`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <MainLayout>
              {children}
            </MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
