"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface OrderExpiredDialogProps {
    isOpen: boolean;
    message?: string;
}

export default function OrderExpiredDialog({ isOpen, message = "Your order has expired. Please create a new order." }: OrderExpiredDialogProps) {
    const router = useRouter();

    if (!isOpen) return null;

    const handleGoHome = () => {
        router.push('/');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Dialog Content */}
            <div className="relative w-full max-w-md bg-gradient-to-br from-[#1a1a2e] to-[#0D0D1A] border border-red-500/30 rounded-2xl shadow-2xl shadow-red-500/20 overflow-hidden">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur opacity-50"></div>
                
                <div className="relative">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-500/20">
                                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white">Order Expired</h3>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-6">
                        <p className="text-white/80 leading-relaxed">
                            {message}
                        </p>
                        <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                            <p className="text-sm text-red-300">
                                💡 <strong>Tip:</strong> Orders are valid for 20 minutes. Please complete your payment within this time.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-white/10 bg-white/5">
                        <button
                            onClick={handleGoHome}
                            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/30"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
