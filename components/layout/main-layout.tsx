"use client";

import Header from "@/components/layout/header/header";
import Footer from "@/components/layout/footer/footer";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Check if we are on a checkout page
  const isCheckoutPage = pathname?.startsWith('/checkout');

  return (
    <>
      {!isCheckoutPage && <Header />}
      {children}
      {!isCheckoutPage && <Footer />}
    </>
  );
}
