"use client";

import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";

import { PAYMENT_CONFIG } from "@/lib/payment-config";
import { cachedReq } from "@/lib/utils";

interface QRCodePaymentProps {
    totalPrice: number;
    content: string;
    onClose: () => void;
    onPaymentConfirm?: () => Promise<void>;
    isVerifying?: boolean;
    verifyError?: string;
    verifySuccess?: boolean;
    bankConfig?: {
        BANK_ACC_NUM: string;
        BANK_NAME: string;
    };
}


export default function QRCodePayment({ 
    totalPrice, 
    content, 
    onClose, 
    onPaymentConfirm,
    isVerifying = false,
    verifyError = "",
    verifySuccess = false,
    bankConfig 
}: QRCodePaymentProps) {
    const config = {
        ...PAYMENT_CONFIG,
        ...bankConfig
    };
    
    const qrUrl = `https://qr.sepay.vn/img?acc=${config.BANK_ACC_NUM}&bank=${config.BANK_NAME}&amount=${totalPrice}&des=${encodeURIComponent(content)}&template=${config.TEMPLATE}`;

    // Countdown timer: 15 minutes = 900 seconds
    const [timeLeft, setTimeLeft] = useState(900);
    const [hasAutoVerified, setHasAutoVerified] = useState(false);
    const [autoCheckCount, setAutoCheckCount] = useState(0);

    // Countdown timer effect
    useEffect(() => {
        if (isVerifying || verifySuccess || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isVerifying, verifySuccess, timeLeft]);

    // Auto-check every 30 seconds (for early detection)
    useEffect(() => {
        if (isVerifying || verifySuccess || hasAutoVerified) return;

        // Check every 30 seconds, max 30 times (15 minutes total)
        const autoCheckInterval = setInterval(() => {
            if (autoCheckCount < 30 && onPaymentConfirm) {
                console.log(`Auto-checking payment (${autoCheckCount + 1}/30)...`);
                setAutoCheckCount(prev => prev + 1);
                onPaymentConfirm();
            }
        }, 30000); // 30 seconds

        return () => clearInterval(autoCheckInterval);
    }, [isVerifying, verifySuccess, hasAutoVerified, autoCheckCount, onPaymentConfirm]);

    // Final auto-verify when countdown reaches 0 (fallback)
    useEffect(() => {
        if (timeLeft === 0 && !hasAutoVerified && !isVerifying && !verifySuccess && onPaymentConfirm) {
            console.log('Countdown finished, final verification...');
            setHasAutoVerified(true);
            onPaymentConfirm();
        }
    }, [timeLeft, hasAutoVerified, isVerifying, verifySuccess, onPaymentConfirm]);

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Manual check handler
    const handleManualCheck = () => {
        if (onPaymentConfirm && !isVerifying) {
            onPaymentConfirm();
        }
    };

    

    return (
        <div className="p-6 flex flex-col items-center space-y-4">
            <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Scan QR Code to pay</p>
                <div className="text-xl font-bold text-primary">{totalPrice.toLocaleString('vi-VN')} VNĐ</div>
            </div>

            <div className="border-4 border-white shadow-sm rounded-lg overflow-hidden">
                <img
                    src={qrUrl}
                    alt="Payment QR Code"
                    className="w-full max-w-[250px] h-auto object-contain"
                />
            </div>

            <div className="text-center w-full space-y-2 bg-muted/30 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Content:</span>
                    <span className="font-mono font-medium">{content}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Account:</span>
                    <span className="font-medium">{config.BANK_ACC_NUM}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bank:</span>
                    <span className="font-medium">{config.BANK_NAME}</span>
                </div>
            </div>

            {/* Countdown Timer & Status */}
            {!verifySuccess && !verifyError && (
                <div className="w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Payment Window</p>
                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                                {isVerifying 
                                    ? "Checking for payment..." 
                                    : `Auto-checking every 30s • Time left: ${formatTime(timeLeft)}`}
                            </p>
                        </div>
                        {!isVerifying && timeLeft > 0 && (
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                                {formatTime(timeLeft)}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Verification Status Messages */}
            {verifySuccess && (
                <div className="w-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">Payment Verified!</p>
                        <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">Your order has been confirmed.</p>
                    </div>
                </div>
            )}

            {verifyError && (
                <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-900 dark:text-red-100">Verification Failed</p>
                            <p className="text-xs text-red-700 dark:text-red-300 mt-1">{verifyError}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="w-full pt-2 space-y-2">
                {verifyError ? (
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onClose}
                            className="py-2.5 px-4 rounded-lg font-medium border hover:bg-muted transition-colors text-muted-foreground"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                setTimeLeft(900);
                                setHasAutoVerified(false);
                                setAutoCheckCount(0);
                                if (onPaymentConfirm) onPaymentConfirm();
                            }}
                            disabled={isVerifying}
                            className="py-2.5 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Retry Verification
                        </button>
                    </div>
                ) : verifySuccess ? (
                    <div className="w-full py-2.5 px-4 rounded-lg font-medium bg-green-600 text-white flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Payment Verified!</span>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={handleManualCheck}
                            disabled={isVerifying}
                            className="w-full py-2.5 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isVerifying ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Checking...</span>
                                </>
                            ) : (
                                "Check Payment Now"
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-2.5 px-4 rounded-lg font-medium border hover:bg-muted transition-colors text-muted-foreground text-sm"
                        >
                            Close
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
