"use client";

import { X, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import Image from 'next/image';
import { isValidGenerateCode } from "@/lib/validation";
import { securePost } from "@/lib/client/secure-fetch";
import QRCodePayment from "@/components/qr-code-payment";

interface CustomTimModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CustomTimModal({ isOpen, onClose }: CustomTimModalProps) {
    const [timAmount, setTimAmount] = useState(3);
    const [code, setCode] = useState("");
    const [codeError, setCodeError] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifyError, setVerifyError] = useState("");
    const [verifySuccess, setVerifySuccess] = useState(false);
    const [isCreatingDraft, setIsCreatingDraft] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            setTimAmount(3);
            setCode("");
            setCodeError("");
            setShowQR(false);
            setIsVerifying(false);
            setVerifyError("");
            setVerifySuccess(false);
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
            const result = await securePost('/api/createDraftOrder', {
                code,
                quantity: timAmount,
                productPrice: Math.ceil(1000 / 3), // Price per Tim
                productName: 'Custom Heart Pack'
            });

            if (result.success) {
                setShowQR(true);
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

    const handlePaymentConfirm = async () => {
        setIsVerifying(true);
        setVerifyError("");

        try {
            const result = await securePost('/api/verifyPayment', {
                code,
                amount: estimatedPrice
            });

            if (result.success) {
                setVerifySuccess(true);
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                setVerifyError(result.error || "Payment verification failed. Please try again.");
            }
        } catch (error: any) {
            console.error('Error verifying payment:', error);
            setVerifyError(error.message || "Failed to verify payment. Please check your connection and try again.");
        } finally {
            setIsVerifying(false);
        }
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
                    {showQR ? (
                        <button 
                            onClick={() => setShowQR(false)}
                            className="p-1 -ml-2 rounded-full hover:bg-muted transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                        </button>
                    ) : null}
                    <h3 className="text-lg font-semibold text-foreground flex-1 text-center pr-6">{showQR ? "Payment" : "Buy Custom Tim"}</h3>
                     {!showQR && (
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-muted transition-colors absolute right-4 top-4"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    )}
                    {showQR && (
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-muted transition-colors absolute right-4 top-4"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    )}
                </div>

                {/* Body */}
                {showQR ? (
                    <QRCodePayment 
                        totalPrice={estimatedPrice} 
                        content={code} 
                        onClose={onClose}
                        onPaymentConfirm={handlePaymentConfirm}
                        isVerifying={isVerifying}
                        verifyError={verifyError}
                        verifySuccess={verifySuccess}
                    />
                ) : (
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
                            className="w-full py-2.5 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm"
                        >
                            Confirm Buying
                        </button>
                    </div>
                </form>
                )}
            </div>
        </div>
    );
}
