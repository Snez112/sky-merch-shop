"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, X, QrCode } from "lucide-react";
import { formatFriendCode, isValidGenerateCode } from "@/lib/validation/code-validator";
import { formatCurrency } from "@/lib/utils/currency";

interface CustomBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPack?: {
    amount: number;
    price: number;
    originalPrice: number;
  } | null;
  pricePerHeart: number;
  sheetAmount: number;
  calculatePrice: (qty: number) => { price: number; originalPrice: number };
}

export default function CustomBuyModal({
  isOpen,
  onClose,
  selectedPack,
  pricePerHeart,
  sheetAmount,
  calculatePrice,
}: CustomBuyModalProps) {
  const router = useRouter();
  const [friendCode, setFriendCode] = useState("");
  const [quantity, setQuantity] = useState(30);

  // Sync quantity with selectedPack when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(selectedPack?.amount || 30);
    }
  }, [isOpen, selectedPack]);

  const handleFriendCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatFriendCode(e.target.value);
    setFriendCode(formatted);
  };

  const { price: totalPrice, originalPrice: totalOriginalPrice } = selectedPack
    ? { price: selectedPack.price, originalPrice: selectedPack.originalPrice }
    : calculatePrice(quantity);

  const handleBuyNow = () => {
    if (!isValidGenerateCode(friendCode)) {
      alert("Vui lòng nhập Friend Code hợp lệ (12 ký tự)");
      return;
    }

    if (quantity < 30) {
      alert("Số lượng tối thiểu là 30 hearts");
      return;
    }

    // Navigate to checkout with params
    const params = new URLSearchParams({
      code: friendCode,
      quantity: quantity.toString(),
      price: totalPrice.toString(),
    });
    router.push(`/checkout?${params.toString()}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0a1628]/90 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 size-10 flex items-center justify-center rounded-full bg-white dark:bg-card-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="bg-white dark:bg-card-dark rounded-2xl shadow-2xl overflow-hidden border border-primary/10 p-8">
          <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-primary" />
            {selectedPack ? `Mua ${selectedPack.amount} Hearts` : "Tùy Chỉnh Đơn Hàng"}
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 opacity-70 ml-1">
                Friend Code
              </label>
              <div className="relative">
                <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 w-5 h-5" />
                <input
                  value={friendCode}
                  onChange={handleFriendCodeChange}
                  className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-primary/10 transition-colors bg-transparent outline-none focus:border-primary"
                  placeholder="XXXX-XXXX-XXXX"
                  type="text"
                  maxLength={14}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 opacity-70 ml-1">
                Số lượng (Tim)
              </label>
              <div className="relative">
                <Heart className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 w-5 h-5" />
                <input
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-primary/10 focus:border-primary focus:ring-0 bg-transparent outline-none"
                  min="30"
                  placeholder="Số lượng heart (tối thiểu 30)"
                  type="number"
                  disabled={!!selectedPack}
                />
              </div>
            </div>
            <div className="p-5 bg-primary/5 rounded-2xl flex justify-between items-center border border-primary/10">
              <span className="font-bold opacity-70 text-sm italic">
                Tỉ giá ưu đãi tốt nhất
              </span>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold opacity-50 tracking-widest">
                  Tổng Thanh Toán
                </p>
                <p className="text-3xl font-black text-primary">
                  {formatCurrency(totalPrice)}
                </p>
                <p className="text-sm line-through opacity-40 mt-0.5">
                  {formatCurrency(totalOriginalPrice)}
                </p>
              </div>
            </div>
            <button
              onClick={handleBuyNow}
              className="w-full py-5 bg-primary text-white font-black rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all text-lg uppercase tracking-widest active:scale-95"
            >
              Xác Nhận Mua
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
