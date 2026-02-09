"use client";

import { formatCurrency } from "@/lib/utils/currency";

interface ProductPackCardProps {
  amount: number;
  price: number;
  originalPrice: number;
  badge: string;
  badgeColor: string;
  borderColor: string;
  image: string;
  onClick: () => void;
}

export default function ProductPackCard({
  amount,
  price,
  originalPrice,
  badge,
  badgeColor,
  borderColor,
  image,
  onClick,
}: ProductPackCardProps) {
  return (
    <div
      onClick={onClick}
      className={`group bg-white dark:bg-card-dark p-6 rounded-2xl border ${borderColor} transition-all hover:-translate-y-2 relative shadow-lg flex flex-col cursor-pointer`}
    >
      <div
        className={`absolute -top-3 left-1/2 -translate-x-1/2 ${badgeColor} text-white text-[10px] font-bold px-4 py-1 rounded-full shadow-lg z-10`}
      >
        {badge}
      </div>
      <div className="w-full aspect-square bg-primary/5 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: `url('${image}')` }}
        />
      </div>
      <h4 className="text-xl font-black mb-1">{amount} ❤️</h4>
      <p className="text-3xl font-black text-primary mb-1">
        {formatCurrency(price)}
      </p>
      <p className="text-sm line-through opacity-40 mb-6 font-medium">
        {formatCurrency(originalPrice)}
      </p>
      <button className="w-full py-4 bg-white dark:bg-transparent text-primary border-2 border-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all mt-auto">
        Mua Ngay
      </button>
    </div>
  );
}
