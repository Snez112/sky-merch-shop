"use client";

import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from 'swr';

import { PAYMENT_CONFIG } from "@/lib/payment-config";
import { fetcher } from "@/lib/fetcher";

interface QRCodePaymentProps {
    totalPrice: number;
    content: string;
    onClose: () => void;
    onPaymentConfirm?: (isAutoCheck?: boolean) => Promise<void>;
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

    // SWR for bank data - only fetch when triggered
    const { data: bankData, mutate } = useSWR(
        '/api/checkBank',
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnMount: false, // Don't fetch on mount
            revalidateOnReconnect: false,
            dedupingInterval: 2000, // Prevent duplicate requests within 2s
        }
    );

    // Auto-check state
    const [countdown, setCountdown] = useState(10);
    const [attemptCount, setAttemptCount] = useState(0);
    const MAX_ATTEMPTS = 10;
    const CHECK_INTERVAL = 30; // seconds

    // Auto-check effect
    useEffect(() => {
        if (verifySuccess || attemptCount >= MAX_ATTEMPTS) {
            return; // Stop if verified or max attempts reached
        }

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    // Trigger check
                    if (onPaymentConfirm && !isVerifying) {
                        mutate();
                        onPaymentConfirm(true); // isAutoCheck = true
                        setAttemptCount(count => count + 1);
                    }
                    return CHECK_INTERVAL; // Reset countdown
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [verifySuccess, attemptCount, isVerifying, onPaymentConfirm, mutate]);

    // Manual check handler - triggers SWR revalidation
    const handleManualCheck = () => {
        if (onPaymentConfirm && !isVerifying) {
            mutate(); // Trigger SWR to fetch fresh data
            onPaymentConfirm();
            setAttemptCount(count => count + 1);
            setCountdown(CHECK_INTERVAL); // Reset countdown
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

            {/* Auto-check countdown */}
            {!verifySuccess && attemptCount < MAX_ATTEMPTS && (
                <div className="w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
                        <span className="text-sm text-blue-900 dark:text-blue-100">
                            Auto-checking in <span className="font-bold">{countdown}s</span>
                        </span>
                    </div>
                    <span className="text-xs text-blue-700 dark:text-blue-300">
                        Attempt {attemptCount + 1}/{MAX_ATTEMPTS}
                    </span>
                </div>
            )}

            {attemptCount >= MAX_ATTEMPTS && !verifySuccess && (
                <div className="w-full bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                    <p className="text-sm text-orange-900 dark:text-orange-100">
                        Auto-check limit reached. Please check manually or contact support.
                    </p>
                </div>
            )}

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

            {verifyError && !verifySuccess && (
                <div className="w-full bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Payment Not Found</p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                {verifyError}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="w-full pt-2 space-y-2">
                {verifySuccess ? (
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
