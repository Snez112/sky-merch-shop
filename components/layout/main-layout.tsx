"use client";

import Header from "@/components/layout/header/header";
import Footer from "@/components/layout/footer/footer";
import SimpleFooter from "@/components/layout/footer/simple-footer";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Check if we are on a checkout page
  const isCheckoutPage = pathname?.startsWith('/checkout');
  const isHomePage = pathname === '/';

  return (
    <>
      {!isCheckoutPage && <Header />}
      {children}
      {!isCheckoutPage && (isHomePage ? <Footer /> : <SimpleFooter />)}
    </>
  );
}
