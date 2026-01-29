import HeroSection from "@/components/home/hero-section";
import HowItWorks from "@/components/home/how-it-works";
import HeartPacks from "@/components/shop/heart-packs";
import FAQSection from "@/components/common/faq-section";
import SupportSection from "@/components/common/support-section";

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
