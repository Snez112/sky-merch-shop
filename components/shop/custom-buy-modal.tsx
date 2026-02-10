"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, X, QrCode, Tag } from "lucide-react";
import { formatFriendCode, isValidGenerateCode } from "@/lib/validation/code-validator";
import { formatCurrency } from "@/lib/utils/currency";
import { useFriendCodeValidation } from "@/lib/hooks/useFriendCodeValidation";
import { useCouponValidation } from "@/lib/hooks/useCouponValidation";
import { calculateBestPrice } from "@/lib/pricing-helpers";

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
  const [couponCode, setCouponCode] = useState("");

  // Use custom hooks for validation
  const { codeError, isValidating, isTyping } = useFriendCodeValidation(friendCode);
  const { 
    couponData, 
    couponError, 
    isValidating: isCouponValidating, 
    isTyping: isCouponTyping 
  } = useCouponValidation(couponCode);

  // Sync quantity with selectedPack when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(selectedPack?.amount || 30);
      setFriendCode("");
      setCouponCode("");
    }
  }, [isOpen, selectedPack]);

  const handleFriendCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatFriendCode(e.target.value);
    setFriendCode(formatted);
  };

  const handleCouponCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().trim();
    setCouponCode(value);
  };

  // Calculate base price (Tiered)
  const { price: basePrice, originalPrice: baseOriginalPrice } = selectedPack
    ? { price: selectedPack.price, originalPrice: selectedPack.originalPrice }
    : calculatePrice(quantity);

  // Calculate BEST price (Comparing Coupon vs Tier/Sheet)
  // We need to re-calculate using calculateBestPrice to compare correctly
  const { price: totalPrice, isCouponApplied } = calculateBestPrice(
      quantity,
      pricePerHeart,
      sheetAmount,
      couponData?.discount || 0
  );

  const totalOriginalPrice = baseOriginalPrice;

  const handleBuyNow = () => {
    // Check if code is being typed or validated
    if (isTyping || isValidating) {
      return;
    }

    // Check for validation errors
    if (codeError) {
      return;
    }

    if (!isValidGenerateCode(friendCode)) {
      // Error will be shown automatically via codeError computed value
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

    if (couponData) {
      params.append("coupon", couponCode);
      params.append("discount", couponData.discount.toString());
    }

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
                  className={`w-full pl-12 pr-4 py-4 rounded-full border-2 ${
                    codeError
                      ? "border-red-500 focus:border-red-500"
                      : "border-primary/10 focus:border-primary"
                  } transition-colors bg-transparent outline-none`}
                  placeholder="XXXX-XXXX-XXXX"
                  type="text"
                  maxLength={19}
                />
                {isValidating && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              {codeError && (
                <p className="text-xs text-red-500 font-medium mt-2 ml-2">{codeError}</p>
              )}
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

            <div>
              <label className="block text-sm font-bold mb-2 opacity-70 ml-1">
                Mã Giảm Giá (Tùy Chọn)
              </label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 w-5 h-5" />
                <input
                  value={couponCode}
                  onChange={handleCouponCodeChange}
                  className={`w-full pl-12 pr-4 py-4 rounded-full border-2 ${
                    couponError
                      ? "border-red-500 focus:border-red-500"
                      : couponData
                      ? "border-green-500 focus:border-green-500"
                      : "border-primary/10 focus:border-primary"
                  } transition-colors bg-transparent outline-none`}
                  placeholder="Nhập mã giảm giá"
                  type="text"
                />
                {isCouponValidating && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              {couponError && (
                <p className="text-xs text-red-500 font-medium mt-2 ml-2">{couponError}</p>
              )}
              {couponData && isCouponApplied && (
                <p className="text-xs text-green-500 font-medium mt-2 ml-2">
                  ✅ Mã "{couponData.code}" áp dụng thành công! (x{couponData.discount})
                </p>
              )}
              {couponData && !isCouponApplied && (
                <p className="text-xs text-yellow-500 font-medium mt-2 ml-2">
                  ⚠️ Mã "{couponData.code}" hợp lệ (x{couponData.discount}) nhưng thấp hơn ưu đãi hiện tại.
                </p>
              )}
            </div>
            <div className="p-5 bg-primary/5 rounded-2xl flex justify-between items-center border border-primary/10">
              <span className="font-bold opacity-70 text-sm italic">
                {isCouponApplied ? "Đã áp dụng mã giảm giá" : "Tỉ giá ưu đãi tốt nhất"}
              </span>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold opacity-50 tracking-widest">
                  Tổng Thanh Toán
                </p>
                <p className="text-3xl font-black text-primary">
                  {formatCurrency(totalPrice)}
                </p>
                {(couponData || totalOriginalPrice > totalPrice) && (
                  <p className="text-sm line-through opacity-40 mt-0.5">
                    {couponData ? formatCurrency(basePrice) : formatCurrency(totalOriginalPrice)}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleBuyNow}
              disabled={isTyping || isValidating || !!codeError || !friendCode}
              className={`w-full py-5 font-black rounded-full transition-all text-lg uppercase tracking-widest ${
                isTyping || isValidating || !!codeError || !friendCode
                  ? "bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed"
                  : "bg-primary text-white hover:shadow-xl hover:shadow-primary/30 active:scale-95"
              }`}
            >
              {isTyping || isValidating ? "Đang Xác Thực..." : "Xác Nhận Mua"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
