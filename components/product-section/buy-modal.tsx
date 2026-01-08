"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";

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
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            setQuantity(1); // Reset quantity when opening
        } else {
            const timer = setTimeout(() => setIsAnimating(false), 300); // Match transition duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isAnimating && !isOpen) return null;

    const totalPrice = Number(product.price) * quantity;

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the order to the backend
        alert(`Confirmed purchase: ${product.name} x ${quantity} = ${totalPrice.toLocaleString('vi-VN')} VNĐ`);
        onClose();
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
                    <h3 className="text-lg font-semibold text-foreground">Confirm Purchase</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-muted transition-colors"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Body */}
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

                    {/* Summary */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-base font-medium text-foreground">Total</span>
                        <span className="text-xl font-bold text-primary">
                            {totalPrice.toLocaleString('vi-VN')} VNĐ
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
            </div>
        </div>
    );
}
