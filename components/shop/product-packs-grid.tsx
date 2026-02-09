"use client";

import ProductPackCard from "./product-pack-card";
import { ShoppingCart } from "lucide-react";

export interface ProductPack {
  amount: number;
  price: number;
  originalPrice: number;
  badge: string;
  badgeColor: string;
  borderColor: string;
  image: string;
}

interface ProductPacksGridProps {
  packs: ProductPack[];
  onPackClick: (pack: ProductPack) => void;
  onCustomClick: () => void;
}

export default function ProductPacksGrid({
  packs,
  onPackClick,
  onCustomClick,
}: ProductPacksGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-4 lg:gap-3">
      {packs.map((pack) => (
        <ProductPackCard
          key={pack.amount}
          {...pack}
          onClick={() => onPackClick(pack)}
        />
      ))}

      {/* Custom Pack Card */}
      <div
        onClick={onCustomClick}
        className="group bg-primary/5 dark:bg-primary/5 p-6 rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary transition-all hover:-translate-y-2 flex flex-col items-center text-center cursor-pointer"
      >
        <div className="w-full aspect-square bg-primary/5 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
          <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <ShoppingCart className="w-10 h-10" />
          </div>
        </div>
        <h4 className="text-xl font-black mb-1">Gói Tùy Chỉnh</h4>
        <p className="text-sm opacity-60 mb-6 font-medium max-w-[200px]">
          Nhập số lượng cụ thể bạn cần và nhận báo giá ngay.
        </p>
        <button className="w-full py-4 bg-white dark:bg-transparent text-primary border-2 border-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all mt-auto">
          Mua Ngay
        </button>
      </div>
    </div>
  );
}
