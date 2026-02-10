import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tra Cứu Đơn Hàng - Tim Siêu Nhanh",
  description: "Tra cứu và theo dõi trạng thái đơn hàng Heart cho Sky: Children of the Light. Kiểm tra tiến độ giao hàng, thông tin thanh toán và thời gian hoàn thành.",
  keywords: ["tra cứu đơn hàng", "order tracking", "theo dõi đơn hàng", "tim siêu nhanh", "sky cotl"],
  openGraph: {
    title: "Tra Cứu Đơn Hàng - Tim Siêu Nhanh",
    description: "Theo dõi trạng thái đơn hàng Heart của bạn",
    type: "website",
  },
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
