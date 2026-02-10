import HeroSection from "@/components/home/hero-section";
import HowItWorks from "@/components/home/how-it-works";
import HeartPacks from "@/components/shop/heart-packs";
import FAQSection from "@/components/common/faq-section";
import SupportSection from "@/components/common/support-section";
import type { Metadata } from "next";

// Force dynamic rendering to prevent static generation warnings
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Tim Siêu Nhanh - Mua Heart Sky: Children of the Light Uy Tín, Nhanh Chóng",
  description: "Dịch vụ giao Heart cho Sky: Children of the Light an toàn, nhanh chóng chỉ từ 5-15 phút. Giá tốt nhất thị trường, thanh toán đa dạng, hỗ trợ 24/7. Cam kết bảo hành tài khoản 100%.",
  keywords: ["sky children of the light", "mua heart sky", "nạp heart sky", "sky cotl", "tim siêu nhanh", "heart pack", "sky game", "thatgamecompany"],
  authors: [{ name: "Tim Siêu Nhanh" }],
  openGraph: {
    title: "Tim Siêu Nhanh - Mua Heart Sky: Children of the Light",
    description: "Giao Heart nhanh chóng 5-15 phút. An toàn 100%. Giá tốt nhất. Hỗ trợ 24/7.",
    type: "website",
    locale: "vi_VN",
    siteName: "Tim Siêu Nhanh",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tim Siêu Nhanh - Mua Heart Sky: Children of the Light",
    description: "Giao Heart nhanh chóng 5-15 phút. An toàn 100%. Giá tốt nhất.",
  },
};

export default function Home() {
  return (
    <main className="max-w-[1200px] mx-auto px-6 lg:px-10 font-display">
      <HeroSection />
      <HeartPacks />
      <HowItWorks />
      <FAQSection />
      <SupportSection />
    </main>
  );
}
