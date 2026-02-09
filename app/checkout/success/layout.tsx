import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thanh Toán Thành Công - Tim Siêu Nhanh",
  description: "Đơn hàng của bạn đã được thanh toán thành công! Hearts sẽ được giao trong vòng 5-15 phút. Cảm ơn bạn đã tin tưởng Tim Siêu Nhanh.",
  keywords: ["thanh toán thành công", "payment success", "đơn hàng thành công", "tim siêu nhanh"],
  openGraph: {
    title: "Thanh Toán Thành Công - Tim Siêu Nhanh",
    description: "Đơn hàng của bạn đã được xác nhận thành công",
    type: "website",
  },
  robots: {
    index: false, // Không index trang success để tránh duplicate content
    follow: true,
  },
};

export default function CheckoutSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
