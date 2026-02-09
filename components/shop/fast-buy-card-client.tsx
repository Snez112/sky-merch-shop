"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isValidGenerateCode, validateFriendCodeLimit, formatFriendCode } from "@/lib/validation/code-validator";
import { setCookie } from "@/lib/client/cookie-utils";
import { encryptData } from "@/lib/client/encryption";
import { calculateTieredPrice } from "@/lib/pricing-helpers";

interface FastBuyCardClientProps {
    pricePerHeart: number;
    sheetAmount: number;
}

export default function FastBuyCardClient({ pricePerHeart, sheetAmount }: FastBuyCardClientProps) {
    const router = useRouter();
    const [quantity, setQuantity] = useState(10);
    const [code, setCode] = useState("");
    const [codeError, setCodeError] = useState("");

    // Use tiered pricing
    const totalPrice = calculateTieredPrice(quantity, pricePerHeart, sheetAmount);
    const oldPrice = Math.ceil(((quantity * pricePerHeart) / 3) / 100) * 100;
    
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
        if (codeError) setCodeError("");
    };

    const handlePurchase = () => {
        if (!isValidGenerateCode(code)) {
            setCodeError("Invalid code format. Code must be 12 characters (a-Z, 0-9, -).");
            return;
        }

        // Save only code and quantity - price will be fetched from server
        // Encrypt data before saving to cookie
        const encryptedData = encryptData({
            code: code,
            quantity: quantity
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
                            className={`w-full pl-12 pr-4 py-4 rounded-full border-2 ${codeError ? 'border-red-500 focus:border-red-500' : 'border-primary/10 focus:border-primary'} transition-colors bg-transparent outline-none`}
                            placeholder="XXXX-XXXX-XXXX" 
                            type="text" 
                            value={code}
                            onChange={handleCodeChange}
                        />
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
                            className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-primary/10 focus:border-primary focus:ring-0 bg-transparent" 
                            min="1" 
                            placeholder="Nhập số lượng heart" 
                            type="number" 
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                    </div>
                </div>
                <div className="p-4 bg-primary/5 rounded-xl flex justify-between items-center">
                    <span className="font-bold opacity-70 text-sm italic">Giá: {formattedPricePerHeart}đ / {sheetAmount < 4 ? 3 : sheetAmount} heart</span>
                    <div className="text-right">
                        <p className="text-xs uppercase font-bold opacity-50">TỔNG</p>
                        <p className="text-2xl font-black text-primary">{formattedPrice}đ</p>
                        <p className="text-sm opacity-50 line-through">{formattedOldPrice}đ</p>
                    </div>
                </div>
                <button 
                    onClick={handlePurchase}
                    className="w-full py-4 sm:py-5 bg-primary text-white font-black rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all text-sm sm:text-lg uppercase tracking-widest active:scale-95"
                >
                    Mua Ngay
                </button>
            </div>
        </div>
    );
}
