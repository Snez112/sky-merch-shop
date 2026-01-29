"use client";

import { X, AlertCircle, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface FaqDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
}

export default function FaqDialog({ isOpen, onClose, onAccept }: FaqDialogProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
        } else {
            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isAnimating && !isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog Content */}
            <div className={`relative w-full max-w-lg bg-background border rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-primary/5">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">Payment Instructions</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-muted transition-colors"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-foreground">Scan QR Code</p>
                                <p className="text-sm text-muted-foreground">Use your banking app to scan the QR code and complete the payment.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-foreground">Include Payment Code</p>
                                <p className="text-sm text-muted-foreground">Make sure the payment content includes your unique code. Do not modify it.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-foreground">Auto-Verification</p>
                                <p className="text-sm text-muted-foreground">Payment will be automatically verified every 30 seconds. Please wait up to 15 minutes.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-foreground">Exact Amount</p>
                                <p className="text-sm text-muted-foreground">Transfer the exact amount shown. Incorrect amounts may delay verification.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <p className="text-sm text-yellow-900 dark:text-yellow-100">
                            <span className="font-semibold">Important:</span> Do not close the payment page until verification is complete. You will be notified when your payment is confirmed.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg font-medium border hover:bg-muted transition-colors text-muted-foreground"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onAccept}
                        className="px-6 py-2 rounded-lg font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm"
                    >
                        I Understand, Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
