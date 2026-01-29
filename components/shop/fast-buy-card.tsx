"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { isValidGenerateCode } from "@/lib/validation";
import { securePost } from "@/lib/client/secure-fetch";
import { setCookie } from "@/lib/client/cookie-utils";
import FaqDialog from "@/components/faq-dialog";

export default function FastBuyCard() {
    const router = useRouter();
    const [quantity, setQuantity] = useState(10);
    const [code, setCode] = useState("");
    const [codeError, setCodeError] = useState("");
    const [isCreatingDraft, setIsCreatingDraft] = useState(false);
    const [showFaq, setShowFaq] = useState(false);

    const pricePerHeart = 3000;
    const totalPrice = quantity * pricePerHeart;
    const formattedPrice = totalPrice.toLocaleString("vi-VN");

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCode(value);
        if (codeError) setCodeError("");
    };

    const handlePurchase = async () => {
        if (!isValidGenerateCode(code)) {
            setCodeError("Invalid code format. Code must be 12 characters (a-Z, 0-9, -).");
            return;
        }

        setIsCreatingDraft(true);
        setCodeError("");

        try {
            const result = await securePost('/api/createDraftOrder', {
                code,
                quantity,
                productPrice: pricePerHeart,
                productName: "Fast Buy Heart Pack"
            });

            if (result.success) {
                setShowFaq(true);
            } else {
                setCodeError(result.error || "Failed to create order. Please try again.");
            }
        } catch (error: any) {
            console.error('Error creating draft order:', error);
            setCodeError(error.message || "Failed to create order. Please check your connection and try again.");
        } finally {
            setIsCreatingDraft(false);
        }
    };

    const handleFaqAccept = () => {
        const checkoutData = {
            code,
            amount: totalPrice,
            quantity,
            productName: "Fast Buy Heart Pack"
        };
        
        sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
        setCookie('checkoutData', checkoutData, { expires: 20 });
        
        setShowFaq(false);
        router.push(`/checkout/${encodeURIComponent(code)}`);
    };

    return (
        <>
            <div className="bg-white dark:bg-[#2d1818] rounded-xl shadow-2xl p-8 border border-primary/5 relative overflow-hidden text-foreground">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16"></div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">shopping_cart_checkout</span>
                    Fast Buy
                </h3>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2 opacity-70">Friend Code</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/50">qr_code_2</span>
                            <input 
                                className={`w-full pl-12 pr-4 py-4 rounded-full border-2 ${codeError ? 'border-red-500 focus:border-red-500' : 'border-primary/10 focus:border-primary'} focus:ring-0 bg-transparent outline-none transition-colors`}
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
                        <label className="block text-sm font-bold mb-2 opacity-70">Quantity (Hearts)</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/50">favorite</span>
                            <input 
                                className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-primary/10 focus:border-primary focus:ring-0 bg-transparent outline-none" 
                                min="1" 
                                placeholder="Enter number of hearts" 
                                type="number" 
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            />
                        </div>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-xl flex justify-between items-center">
                        <span className="font-bold opacity-70 text-sm italic">Price per heart: 3,000đ</span>
                        <div className="text-right">
                            <p className="text-xs uppercase font-bold opacity-50">Total</p>
                            <p className="text-2xl font-black text-primary">{formattedPrice}đ</p>
                        </div>
                    </div>
                    <button 
                        onClick={handlePurchase}
                        disabled={isCreatingDraft}
                        className="w-full py-5 bg-secondary text-primary font-black rounded-full hover:shadow-lg hover:shadow-secondary/30 transition-all text-lg uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isCreatingDraft ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                PROCESSING...
                            </>
                        ) : (
                            "PURCHASE NOW"
                        )}
                    </button>
                </div>
            </div>

            <FaqDialog
                isOpen={showFaq}
                onClose={() => setShowFaq(false)}
                onAccept={handleFaqAccept}
            />
        </>
    );
}
