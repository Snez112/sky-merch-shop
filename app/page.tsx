import Image from "next/image";
import ProductSection from "@/components/product-section/productsection";
import ExperienceQuality from "@/components/why-choose-section/experience-quality";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">

        <ProductSection />
      </main>
    </div>
  );
}
