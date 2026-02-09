import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Câu Hỏi Thường Gặp (FAQ) - Tim Siêu Nhanh",
  description: "Giải đáp các câu hỏi thường gặp về mua Heart Sky: Children of the Light. Hướng dẫn thanh toán, thời gian giao hàng, bảo mật tài khoản, xử lý lỗi game và nhiều thông tin hữu ích khác.",
  keywords: ["faq", "câu hỏi thường gặp", "hướng dẫn", "sky cotl", "tim siêu nhanh", "hỗ trợ"],
  openGraph: {
    title: "Câu Hỏi Thường Gặp - Tim Siêu Nhanh",
    description: "Tìm câu trả lời cho các thắc mắc về dịch vụ giao Heart",
    type: "website",
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
