import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thanh Toán - Tim Siêu Nhanh",
  description: "Hoàn tất thanh toán cho đơn hàng Heart Sky: Children of the Light. Thanh toán nhanh chóng qua chuyển khoản ngân hàng, an toàn và bảo mật 100%.",
  keywords: ["thanh toán", "checkout", "payment", "mua heart", "tim siêu nhanh"],
  openGraph: {
    title: "Thanh Toán - Tim Siêu Nhanh",
    description: "Hoàn tất thanh toán đơn hàng Heart của bạn",
    type: "website",
  },
};

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
