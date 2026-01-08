"use client";

import Link from "next/link";
import { useState } from "react";
import BuyModal from "./buy-modal";

interface ProductCardProps {
    product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Prevent link navigation when clicking specific elements if needed, 
    // but here we want the button to open modal and the rest to link.
    // We'll wrap the clickable card area in Link but make the button separate or 
    // stop propagation on the button.

    return (
        <>
            <div className="group relative">
                {/* Card Content wrapped in Link */}
                <Link href={`/product/${product.id}`} className="block">
                    <div className="cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg bg-muted mb-4 aspect-square flex items-center justify-center border border-transparent group-hover:border-primary/20 transition-all">
                            <div className="text-muted-foreground text-center p-4">
                                <img src={'/heart-sky.png'} alt='heart-sky' className="w-24 h-24 object-contain mx-auto mb-2" />
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />

                            {/* Floating badge for price or status if needed */}
                        </div>

                        <div className="space-y-1">
                            <h3 className="font-bold text-foreground text-lg leading-tight group-hover:text-primary transition-colors">
                                {product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                            <p className="text-lg font-bold text-primary">
                                {Number(product.price).toLocaleString('vi-VN')} VNĐ
                            </p>
                        </div>
                    </div>
                </Link>

                {/* Buy Button - positioned relative or specific placement */}
                <div className="mt-4">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation(); // Stop Link from activating
                            setIsModalOpen(true);
                        }}
                        className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
                    >
                        Buy Now
                    </button>
                </div>
            </div>

            <BuyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={product}
            />
        </>
    );
}
