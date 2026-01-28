import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - Payment",
  description: "Complete your payment",
};

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
