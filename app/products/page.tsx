"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { calculateTieredPrice } from "@/lib/pricing-helpers";
import ProductPacksGrid, { ProductPack } from "@/components/shop/product-packs-grid";
import CustomBuyModal from "@/components/shop/custom-buy-modal";
import ProductsSkeleton from "@/components/skeletons/products-skeleton";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<ProductPack | null>(null);

  // Fetch pricing from server using SWR
  // We use a fixed quantity fetch just to get the base configuration (pricePerHeart, sheetAmount)
  const { data: pricingData, isLoading } = useSWR(
    "/api/pricing?quantity=30", 
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const pricePerHeart = pricingData?.pricePerHeart || 300;
  const sheetAmount = pricingData?.sheetAmount || 3;

  // Generate product packs with dynamic pricing
  const PRODUCT_PACKS = useMemo<ProductPack[]>(() => {
    // If loading, we could return empty or handled by SWR isLoading
    const getPrice = (qty: number) => calculateTieredPrice(qty, pricePerHeart, sheetAmount);
    const getOldPrice = (qty: number) => Math.ceil(((qty * pricePerHeart) / 3) / 100) * 100;

    return [
      {
        amount: 30,
        price: getPrice(30),
        originalPrice: getOldPrice(30),
        badge: "STARTER",
        badgeColor: "bg-blue-500",
        borderColor: "border-blue-500/10 hover:border-blue-500",
        image: "pack-30.png",
      },
      {
        amount: 100,
        price: getPrice(100),
        originalPrice: getOldPrice(100),
        badge: "POPULAR",
        badgeColor: "bg-primary",
        borderColor: "border-primary/10 hover:border-primary",
        image: "pack-100.png",
      },
      {
        amount: 170,
        price: getPrice(170),
        originalPrice: getOldPrice(170),
        badge: "BEST SELLER",
        badgeColor: "bg-purple-500",
        borderColor: "border-purple-500/10 hover:border-purple-500",
        image: "pack-170.png",
      },
      {
        amount: 360,
        price: getPrice(360),
        originalPrice: getOldPrice(360),
        badge: "BEST VALUE",
        badgeColor: "bg-yellow-400 text-[#1c0d0d]",
        borderColor: "border-2 border-yellow-400",
        image: "pack-360.png",
      },
    ];
  }, [pricePerHeart, sheetAmount]);

  const calculatePrice = (qty: number) => {
    const price = calculateTieredPrice(qty, pricePerHeart, sheetAmount);
    const originalPrice = Math.ceil(((qty * pricePerHeart) / 3) / 100) * 100;
    return { price, originalPrice };
  };

  const handlePackClick = (pack: ProductPack) => {
    setSelectedPack(pack);
    setIsModalOpen(true);
  };

  const handleCustomClick = () => {
    setSelectedPack(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <ProductsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1c0d0d] dark:text-white transition-colors duration-300">
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-12 md:py-20">
        {/* Hero Heading */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6">
            Các gói <span className="text-primary">Tim (Heart)</span>
          </h1>
          <p className="text-lg opacity-70 max-w-2xl mx-auto leading-relaxed">
            Chọn gói phù hợp với nhu cầu của bạn. Giao hàng nhanh chóng, an toàn tuyệt đối cho tài khoản Sky của bạn.
          </p>
        </div>  

        {/* Products Grid */}
        <ProductPacksGrid
          packs={PRODUCT_PACKS}
          onPackClick={handlePackClick}
          onCustomClick={handleCustomClick}
        />
      </main>

      {/* Custom Buy Modal */}
      <CustomBuyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPack={selectedPack}
        pricePerHeart={pricePerHeart}
        sheetAmount={sheetAmount}
        calculatePrice={calculatePrice}
      />
    </div>
  );
}
