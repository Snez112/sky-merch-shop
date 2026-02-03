"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { isValidGenerateCode } from "@/lib/validation";
import { securePost } from "@/lib/client/secure-fetch";
import FaqDialog from "@/components/faq-dialog";

interface CustomTimModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CustomTimModal({ isOpen, onClose }: CustomTimModalProps) {
    const router = useRouter();
    const [timAmount, setTimAmount] = useState(3);
    const [code, setCode] = useState("");
    const [codeError, setCodeError] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);
    const [showFaq, setShowFaq] = useState(false);
    const [isCreatingDraft, setIsCreatingDraft] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            setTimAmount(3);
            setCode("");
            setCodeError("");
            setShowFaq(false);
            setIsCreatingDraft(false);
        } else {
            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isAnimating && !isOpen) return null;

    // Price calculation: 3 Tim = 1000 VNĐ => 1 Tim = 1000/3 VNĐ
    const estimatedPrice = Math.ceil((timAmount * 1000) / 3);

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        setCode(value);
        if (codeError) setCodeError("");
    };

    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isValidGenerateCode(code)) {
            setCodeError("Invalid code format. Code must be 12 uppercase characters (A-Z, 0-9).");
            return;
        }

        // Create draft order for custom Tim
        setIsCreatingDraft(true);
        setCodeError("");

        try {
            // Skip direct API call, just show FAQ
            // The order will be created/finalized in checkout flow/payment verification
            // validation skipped or moved to checkout? 
            // User requested to remove "create draft order".
            
            // We still might want to check for duplicates? 
            // For now, assuming "bỏ tạo đơn draft" implies just moving to next step.
            
            setShowFaq(true);

        } catch (error: any) {
            console.error('Error info:', error);
            setCodeError(error.message || "Failed to proceed.");
        } finally {
            setIsCreatingDraft(false);
        }
    };

    const handleFaqAccept = () => {
        // Store payment data in session storage
        const checkoutData = {
            code,
            amount: estimatedPrice,
            quantity: timAmount,
            productName: 'Custom Heart Pack'
        };
        sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
        
        // Close modal and redirect to checkout
        onClose();
        router.push('/checkout');
    };



    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative w-full max-w-md bg-background border rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-foreground flex-1 text-center pr-6">Buy Custom Tim</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-muted transition-colors absolute right-4 top-4"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleConfirm} className="p-6 space-y-6">
                    {/* Info */}
                    <div className="flex bg-muted/50 rounded-lg p-3 gap-4">
                         <div className="h-16 w-16 bg-white rounded-md flex items-center justify-center flex-shrink-0 border">
                            <Image 
                                src='/heart-sky.png' 
                                alt="Tim" 
                                width={48} 
                                height={48} 
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <p className="font-medium text-foreground">Custom Heart Pack</p>
                            <p className="text-sm text-muted-foreground">Currency</p>
                            <p className="text-sm font-semibold text-primary mt-1">
                                Rate: 3 Tim / 1,000 VNĐ
                            </p>
                        </div>
                    </div>

                    {/* Tim Amount Input */}
                    <div className="space-y-2">
                        <label htmlFor="timAmount" className="text-sm font-medium text-foreground">
                            Amount of Tim
                        </label>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setTimAmount(Math.max(1, timAmount - 1))}
                                className="w-10 h-10 flex items-center justify-center rounded-md border bg-background hover:bg-muted transition-colors"
                            >
                                -
                            </button>
                            <input
                                id="timAmount"
                                type="number"
                                min="1"
                                value={timAmount}
                                onChange={(e) => setTimAmount(Math.max(1, parseInt(e.target.value) || 1))}
                                className="flex-1 h-10 text-center border rounded-md bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setTimAmount(timAmount + 1)}
                                className="w-10 h-10 flex items-center justify-center rounded-md border bg-background hover:bg-muted transition-colors"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Code Input */}
                    <div className="space-y-2">
                        <label htmlFor="code" className="text-sm font-medium text-foreground">
                            Code <span className="text-muted-foreground text-xs font-normal">(12 characters)</span>
                        </label>
                        <input
                            id="code"
                            type="text"
                            value={code}
                            onChange={handleCodeChange}
                            placeholder="XXXX-XXXX-XXXX"
                            className={`w-full h-10 px-3 border rounded-md bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-colors ${codeError ? 'border-red-500 focus:ring-red-200' : ''}`}
                        />
                        {codeError && (
                            <p className="text-xs text-red-500 font-medium">{codeError}</p>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-base font-medium text-foreground">Estimated Price</span>
                        <span className="text-xl font-bold text-primary">
                            {estimatedPrice.toLocaleString('vi-VN')} VNĐ
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-2.5 px-4 rounded-lg font-medium border hover:bg-muted transition-colors text-muted-foreground"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreatingDraft}
                            className="w-full py-2.5 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isCreatingDraft ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                'Confirm Buying'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* FAQ Dialog */}
            <FaqDialog
                isOpen={showFaq}
                onClose={() => setShowFaq(false)}
                onAccept={handleFaqAccept}
            />
        </div>
    );
}
