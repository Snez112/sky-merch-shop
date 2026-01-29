"use strict";
"use client";

import Link from "next/link";
import { Mail, Send, MessageCircle, MessageSquare, MapPin, Phone, Clock } from "lucide-react";

export default function SupportPage() {
    const contactMethods = [
        {
            icon: <MessageCircle className="w-8 h-8 text-blue-600" />,
            title: "Facebook Messenger",
            desc: "Phản hồi nhanh nhất. Hỗ trợ 24/7.",
            action: "Chat Ngay",
            href: "#",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            border: "border-blue-200 dark:border-blue-800"
        },
        {
            icon: <MessageSquare className="w-8 h-8 text-[#5865F2]" />,
            title: "Discord Community",
            desc: "Tham gia cộng đồng và tạo ticket hỗ trợ.",
            action: "Tham Gia",
            href: "#",
            bg: "bg-indigo-50 dark:bg-indigo-900/20",
            border: "border-indigo-200 dark:border-indigo-800"
        },
        {
            icon: <Send className="w-8 h-8 text-[#26A5E4]" />,
            title: "Telegram Support",
            desc: "Kênh hỗ trợ bảo mật và riêng tư.",
            action: "Nhắn Tin",
            href: "#",
            bg: "bg-sky-50 dark:bg-sky-900/20",
            border: "border-sky-200 dark:border-sky-800"
        },
        {
            icon: <Mail className="w-8 h-8 text-red-500" />,
            title: "Email Support",
            desc: "Cho các vấn đề về hợp tác hoặc khiếu nại.",
            action: "Gửi Email",
            href: "mailto:support@skymerch.com",
            bg: "bg-red-50 dark:bg-red-900/20",
            border: "border-red-200 dark:border-red-800"
        }
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-[#1c0d0d] dark:text-white transition-colors">
            {/* Header / Hero */}
            <div className="relative bg-white dark:bg-[#2d1616] border-b border-[#e9cfce] dark:border-[#3d2424] py-16 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                        <Phone className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#1c0d0d] dark:text-white tracking-tight">
                        Trung Tâm Hỗ Trợ
                    </h1>
                    <p className="text-lg text-[#9d4a48] dark:text-gray-400 max-w-2xl mx-auto">
                        Chúng tôi luôn ở đây để giúp bạn. Hãy chọn kênh liên lạc phù hợp nhất với bạn.
                    </p>
                </div>
            </div>

            {/* Contact Grid */}
            <main className="max-w-6xl mx-auto py-12 px-4 space-y-16">
                
                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contactMethods.map((method, index) => (
                        <a 
                            key={index}
                            href={method.href}
                            className={`flex flex-col items-center text-center p-8 rounded-2xl border ${method.border} ${method.bg} hover:scale-105 transition-transform duration-300 cursor-pointer group`}
                        >
                            <div className="mb-4 bg-white dark:bg-[#351a1a] p-4 rounded-full shadow-sm group-hover:shadow-md transition-shadow">
                                {method.icon}
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-[#1c0d0d] dark:text-white">
                                {method.title}
                            </h3>
                            <p className="text-sm text-[#9d4a48] dark:text-gray-400 mb-6 flex-1">
                                {method.desc}
                            </p>
                            <span className="inline-flex items-center gap-2 font-bold text-primary group-hover:underline underline-offset-4">
                                {method.action}
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </span>
                        </a>
                    ))}
                </div>

                {/* Additional Info */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Working Hours */}
                    <div className="bg-white dark:bg-[#2d1616] p-8 rounded-xl border border-[#e9cfce] dark:border-[#3d2424] flex gap-6 items-start">
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg shrink-0">
                            <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl mb-3 text-[#1c0d0d] dark:text-white">Giờ Làm Việc</h3>
                            <ul className="space-y-2 text-[#9d4a48] dark:text-gray-400">
                                <li className="flex justify-between w-full max-w-xs">
                                    <span>Thứ 2 - Thứ 6:</span>
                                    <span className="font-medium text-[#1c0d0d] dark:text-gray-200">08:00 - 22:00</span>
                                </li>
                                <li className="flex justify-between w-full max-w-xs">
                                    <span>Thứ 7 - CN:</span>
                                    <span className="font-medium text-[#1c0d0d] dark:text-gray-200">09:00 - 23:00</span>
                                </li>
                                <li className="mt-4 text-sm italic opacity-80">
                                    *Hỗ trợ sự cố khẩn cấp hoạt động 24/7
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* FAQ Quick Link */}
                    <div className="bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 p-8 rounded-xl border border-[#e9cfce] dark:border-[#3d2424] flex gap-6 items-start relative overflow-hidden">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg shrink-0 relative z-10">
                            <MessageCircle className="w-6 h-6 text-primary" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="font-bold text-xl mb-3 text-[#1c0d0d] dark:text-white">Câu Hỏi Thường Gặp</h3>
                            <p className="text-[#9d4a48] dark:text-gray-400 mb-6">
                                Bạn có thắc mắc về thanh toán hay giao hàng? Hãy kiểm tra trang FAQ trước nhé.
                            </p>
                            <Link href="/faq" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#351a1a] border border-[#e9cfce] dark:border-[#4d2e2e] rounded-lg font-bold text-[#1c0d0d] dark:text-white hover:border-primary transition-colors text-sm">
                                Xem FAQ
                            </Link>
                        </div>
                        
                        {/* Decor */}
                        <div className="absolute right-0 bottom-0 opacity-5 dark:opacity-10 pointer-events-none">
                            <MessageCircle className="w-40 h-40 transform translate-x-10 translate-y-10 text-primary" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
