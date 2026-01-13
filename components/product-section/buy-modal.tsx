"use client";

import { X, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

import { isValidGenerateCode } from "@/lib/verifycode";
import QRCodePayment from "@/components/qr-code-payment";

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    // Add other fields as necessary based on the API response structure
}

interface BuyModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

export default function BuyModal({ isOpen, onClose, product }: BuyModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [code, setCode] = useState("");
    const [codeError, setCodeError] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);
    const [showQR, setShowQR] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            setQuantity(1); // Reset quantity when opening
            setQuantity(1); // Reset quantity when opening
            setCode("");
            setCodeError("");
            setShowQR(false);
        } else {
            const timer = setTimeout(() => setIsAnimating(false), 300); // Match transition duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isAnimating && !isOpen) return null;

    const totalPrice = Number(product.price) * quantity;
    const totalTim = Math.floor((totalPrice / 1000) * 3);

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        setCode(value);
        if (codeError) setCodeError("");
    };

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isValidGenerateCode(code)) {
            setCodeError("Invalid code format. Code must be 12 uppercase characters (A-Z, 0-9).");
            return;
        }

        setShowQR(true);
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
                    <h3 className="text-lg font-semibold text-foreground flex-1 text-center pr-6">{showQR ? "Payment" : "Confirm Purchase"}</h3>
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
                        totalPrice={totalPrice} 
                        content={code} 
                        onClose={onClose} 
                    />
                ) : (
                <form onSubmit={handleConfirm} className="p-6 space-y-6">
                    {/* Product Info */}
                    <div className="flex bg-muted/50 rounded-lg p-3 gap-4">
                        <div className="h-16 w-16 bg-white rounded-md flex items-center justify-center flex-shrink-0 border">
                            {/* Placeholder for product image reuse or just generic */}
                            <img src={'/heart-sky.png'} alt={product.name} className="w-12 h-12 object-contain" />
                        </div>
                        <div>
                            <p className="font-medium text-foreground">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                            <p className="text-sm font-semibold text-primary mt-1">
                                {Number(product.price).toLocaleString('vi-VN')} VNĐ
                            </p>
                        </div>
                    </div>

                    {/* Quantity Input */}
                    <div className="space-y-2">
                        <label htmlFor="quantity" className="text-sm font-medium text-foreground">
                            Quantity
                        </label>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 flex items-center justify-center rounded-md border bg-background hover:bg-muted transition-colors"
                            >
                                -
                            </button>
                            <input
                                id="quantity"
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="flex-1 h-10 text-center border rounded-md bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setQuantity(quantity + 1)}
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
                        <span className="text-base font-medium text-foreground">Total</span>
                        <div className="text-right">
                            <div className="text-xl font-bold text-primary">
                                {totalPrice.toLocaleString('vi-VN')} VNĐ
                            </div>
                            {totalPrice >= 1000 && (
                                <div className="text-sm font-medium text-rose-500 flex items-center justify-end gap-1">
                                    <span>+{totalTim.toLocaleString()} Tim</span>
                                    <img src="/heart-sky.png" alt="Tim" className="w-4 h-4 object-contain" />
                                </div>
                            )}
                        </div>
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
