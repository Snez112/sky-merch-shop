"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isValidGenerateCode, validateFriendCodeLimit, formatFriendCode } from "@/lib/validation/code-validator";
import { setCookie } from "@/lib/client/cookie-utils";
import { encryptData } from "@/lib/client/encryption";
import { calculateTieredPrice, applyDiscount } from "@/lib/pricing-helpers";
import { useFriendCodeValidation } from "@/lib/hooks/useFriendCodeValidation";
import { useCouponValidation } from "@/lib/hooks/useCouponValidation";

interface FastBuyCardClientProps {
    pricePerHeart: number;
    sheetAmount: number;
}

export default function FastBuyCardClient({ pricePerHeart, sheetAmount }: FastBuyCardClientProps) {
    const router = useRouter();
    const [quantity, setQuantity] = useState(30);
    const [code, setCode] = useState("");
    const [couponCode, setCouponCode] = useState("");

    // Use custom hook for validation
    const { codeError, isValidating, isTyping } = useFriendCodeValidation(code);
    const { 
        couponData, 
        couponError, 
        isValidating: isCouponValidating, 
        isTyping: isCouponTyping 
    } = useCouponValidation(couponCode);

    // Use tiered pricing
    const basePrice = calculateTieredPrice(quantity, pricePerHeart, sheetAmount);
    // Apply discount if coupon is valid
    const totalPrice = couponData ? applyDiscount(basePrice, couponData.discount) : basePrice;
    
    // Old price logic (fake original price for display)
    // If coupon applied, old price is the base price. 
    // Otherwise it's the fake "original" price (approx 3x markup)
    const oldPrice = couponData 
        ? basePrice 
        : Math.ceil(((quantity * pricePerHeart) / 3) / 100) * 100;
    
    const formattedPrice = totalPrice.toLocaleString("vi-VN");
    const formattedOldPrice = oldPrice.toLocaleString("vi-VN");
    const formattedPricePerHeart = pricePerHeart.toLocaleString("vi-VN");

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        
        // Check limit using shared logic (max 12 alphanumeric)
        if (!validateFriendCodeLimit(value)) return;

        // Auto-format (Uppercase, Trim)
        const formatted = formatFriendCode(value);
        
        setCode(formatted);
    };

    const handleCouponCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase().trim();
        setCouponCode(value);
    };

    const handlePurchase = () => {
        // Check if code is being typed or validated
        if (isTyping || isValidating) {
            return;
        }

        // Check for validation errors
        if (codeError) {
            return;
        }

        if (!isValidGenerateCode(code)) {
            // Error will be shown automatically via codeError
            return;
        }

        // Save only code and quantity - price will be fetched from server
        // Encrypt data before saving to cookie
        const encryptedData = encryptData({
            code: code,
            quantity: quantity,
            coupon: couponCode,
            discount: couponData?.discount
        });

        setCookie('checkoutData', encryptedData, { path: '/', expires: 60 });
        router.push('/checkout');
    };

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl shadow-2xl p-6 sm:p-8 border border-primary/5 relative overflow-hidden text-foreground">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16"></div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">shopping_cart_checkout</span>
                Mua Nhanh
            </h3>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold mb-2 opacity-70">Friend Code</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/50">qr_code_2</span>
                        <input 
                            id="code"
                            maxLength={12}
                            className={`w-full pl-12 pr-4 py-4 rounded-full border-2 ${
                                codeError
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-primary/10 focus:border-primary'
                            } transition-colors bg-transparent outline-none`}
                            placeholder="XXXX-XXXX-XXXX" 
                            type="text" 
                            value={code}
                            onChange={handleCodeChange}
                        />
                        {isValidating && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>
                    {codeError && (
                        <p className="text-xs text-red-500 font-medium mt-1 ml-2">{codeError}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2 opacity-70">Số lượng (Tim)</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/50">favorite</span>
                        <input 
                            id="quantity"
                            className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-primary/10 focus:border-primary outline-none bg-transparent" 
                            min="30" 
                            placeholder="Nhập số lượng heart" 
                            type="number" 
                            value={quantity}
                            onChange={(e) => {
                                const val = e.target.value;
                                // Allow empty input or any number while typing
                                if (val === '') {
                                    setQuantity('' as any);
                                } else {
                                    const num = parseInt(val);
                                    setQuantity(isNaN(num) ? 30 : num);
                                }
                            }}
                            onBlur={(e) => {
                                const val = e.target.value;
                                const num = parseInt(val);
                                // On blur, enforce minimum 30
                                if (val === '' || isNaN(num) || num < 30) {
                                    setQuantity(30);
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="p-4 bg-primary/5 rounded-xl flex justify-between items-center">
                    <span className="font-bold opacity-70 text-sm italic">
                        {couponData ? "GIÁ SAU GIẢM" : `Giá: ${formattedPricePerHeart}đ / ${sheetAmount < 4 ? 3 : sheetAmount} heart`}
                    </span>
                    <div className="text-right">
                        <p className="text-xs uppercase font-bold opacity-50">TỔNG</p>
                        <p className="text-2xl font-black text-primary">{formattedPrice}đ</p>
                        <p className="text-sm opacity-50 line-through">{formattedOldPrice}đ</p>
                    </div>
                </div>
                <button 
                    onClick={handlePurchase}
                    disabled={isTyping || isValidating || !!codeError || !code}
                    className={`w-full py-4 sm:py-5 font-black rounded-full transition-all text-sm sm:text-lg uppercase tracking-widest ${
                        isTyping || isValidating || !!codeError || !code
                            ? "bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed"
                            : "bg-primary text-white hover:shadow-lg hover:shadow-primary/30 active:scale-95"
                    }`}
                >
                    {isTyping || isValidating ? "Đang Xác Thực..." : "Mua Ngay"}
                </button>
            </div>
        </div>
    );
}
