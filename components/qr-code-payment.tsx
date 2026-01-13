"use client";

import { useEffect } from "react";

import { PAYMENT_CONFIG } from "@/lib/payment-config";
import { cachedReq } from "@/lib/ultil";

interface QRCodePaymentProps {
    totalPrice: number;
    content: string; // The code or description
    onClose: () => void;
    bankConfig?: {
        BANK_ACC_NUM: string;
        BANK_NAME: string;
    };
}

export default function QRCodePayment({ totalPrice, content, onClose, bankConfig }: QRCodePaymentProps) {
    const config = {
        ...PAYMENT_CONFIG,
        ...bankConfig
    };
    
    const qrUrl = `https://qr.sepay.vn/img?acc=${config.BANK_ACC_NUM}&bank=${config.BANK_NAME}&amount=${totalPrice}&des=${encodeURIComponent(content)}&template=${config.TEMPLATE}`;

    useEffect(() => {
        const checkPayment = async () => {
             try {
                
                const res = await cachedReq("/api/checkBank");
                const data = res.data;
                    const latestItem = Array.isArray(data) && data.length > 0 
        ? [...data].sort((a: any, b: any) => new Date(b['Ngày giao dịch']).getTime() - new Date(a['Ngày giao dịch']).getTime())[0]
        : null;
        
        const bankConfig = latestItem ? {
            CODE:latestItem['Nội dung thanh toán'].split('/')[1]
        } : null;
        console.log("Parsed Bank Config:", bankConfig?.CODE||'');
                     // Check if any transaction matches
                    const isPaid = Array.isArray(latestItem) && latestItem.some((t: any) => 
                         t['Số tiền'] === totalPrice && 
                         t['Nội dung thanh toán']?.includes(content)
                    );

                    if (isPaid) {
                        onClose();
                        alert("Thanh toán thành công! Cảm ơn bạn.");
                    }
            } catch (error) {
                console.error("Error checking payment:", error);
            }
        };

        const intervalId = setInterval(checkPayment, 5000);

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, [totalPrice, content, onClose]);

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

            <div className="w-full pt-2">
                <button
                    onClick={onClose}
                    className="w-full py-2.5 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm"
                >
                    I have paid
                </button>
            </div>
        </div>
    );
}
