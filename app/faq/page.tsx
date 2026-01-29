"use strict";
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, HelpCircle, ShoppingBag, CreditCard, Clock, ShieldCheck, Mail } from "lucide-react";

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            category: "Mua Hàng & Thanh Toán",
            icon: <ShoppingBag className="w-5 h-5 text-primary" />,
            items: [
                {
                    q: "Làm thế nào để mua gói Heart/Season Pass?",
                    a: "Rất đơn giản! Bạn chỉ cần chọn gói vật phẩm mong muốn tại trang chủ, thêm vào giỏ hàng (hoặc Mua ngay), sau đó điền thông tin Friend Code và tiến hành thanh toán chuyển khoản theo mã QR."
                },
                {
                    q: "Tôi có thể thanh toán bằng phương thức nào?",
                    a: "Hiện tại chúng tôi hỗ trợ thanh toán chuyển khoản ngân hàng (VietQR). Hệ thống sẽ tự động xác nhận giao dịch khi bạn chuyển đúng nội dung yêu cầu."
                },
                {
                    q: "Tôi cần cung cấp thông tin gì để nạp?",
                    a: "Bạn chỉ cần cung cấp mã kết bạn (Invite Code/Friend Code) trong game Sky: Children of the Light. Chúng tôi KHÔNG bao giờ yêu cầu mật khẩu tài khoản của bạn."
                }
            ]
        },
        {
            category: "Vận Chuyển & Thời Gian",
            icon: <Clock className="w-5 h-5 text-orange-500" />,
            items: [
                {
                    q: "Sau bao lâu thì tôi nhận được vật phẩm?",
                    a: "Thông thường đơn hàng sẽ được xử lý ngay sau khi thanh toán thành công. Thời gian hoàn thành từ 5-15 phút. Trong một số trường hợp update game, có thể mất tối đa 24h."
                },
                {
                    q: "Làm sao để theo dõi tiến độ đơn hàng?",
                    a: "Sau khi đặt hàng, bạn sẽ nhận được một Mã Đơn Hàng. Bạn có thể nhập mã này tại trang 'Kiểm Tra Đơn Hàng' để xem tiến độ chi tiết theo thời gian thực."
                }
            ]
        },
        {
            category: "Bảo Mật & Hỗ Trợ",
            icon: <ShieldCheck className="w-5 h-5 text-green-500" />,
            items: [
                {
                    q: "Nạp qua Sky Merch Shop có an toàn không?",
                    a: "Tuyệt đối an toàn. Chúng tôi nạp chính ngạch và bảo hành trọn đời cho gói nạp của bạn. Không sợ ban acc hay refund."
                },
                {
                    q: "Tôi nhập sai mã Friend Code thì sao?",
                    a: "Đừng lo, hãy liên hệ ngay với đội ngũ hỗ trợ qua Facebook/Discord kèm theo Mã Đơn Hàng để được hỗ trợ sửa đổi thông tin kịp thời."
                }
            ]
        }
    ];

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-[#1c0d0d] dark:text-white transition-colors">
            {/* Header / Hero */}
            <div className="relative bg-white dark:bg-[#2d1616] border-b border-[#e9cfce] dark:border-[#3d2424] py-16 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-red-50 dark:bg-red-900/20 rounded-full mb-4">
                        <HelpCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#1c0d0d] dark:text-white tracking-tight">
                        Câu Hỏi Thường Gặp
                    </h1>
                    <p className="text-lg text-[#9d4a48] dark:text-gray-400 max-w-2xl mx-auto">
                        Giải đáp những thắc mắc phổ biến nhất về quy trình mua hàng, thanh toán và nhận vật phẩm tại Sky Merch Shop.
                    </p>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-3xl mx-auto py-12 px-4 space-y-12">
                {faqs.map((section, sIndex) => (
                    <div key={sIndex} className="space-y-6">
                        <div className="flex items-center gap-3 pb-2 border-b border-[#e9cfce] dark:border-[#3d2424]">
                            {section.icon}
                            <h2 className="text-xl font-bold text-[#1c0d0d] dark:text-white uppercase tracking-wider">
                                {section.category}
                            </h2>
                        </div>
                        
                        <div className="space-y-4">
                            {section.items.map((item, index) => {
                                const globalIndex = sIndex * 100 + index; // unique id
                                const isOpen = openIndex === globalIndex;

                                return (
                                    <div 
                                        key={index} 
                                        className={`bg-white dark:bg-[#2d1616] rounded-lg border transition-all duration-300 overflow-hidden ${
                                            isOpen ? 'border-primary ring-1 ring-primary/20 shadow-md' : 'border-[#e9cfce] dark:border-[#3d2424] hover:border-primary/50'
                                        }`}
                                    >
                                        <button
                                            onClick={() => toggle(globalIndex)}
                                            className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                                        >
                                            <span className="font-bold text-[#1c0d0d] dark:text-gray-100 pr-4">
                                                {item.q}
                                            </span>
                                            {isOpen ? (
                                                <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                            )}
                                        </button>
                                        
                                        <div 
                                            className={`transition-all duration-300 ease-in-out ${
                                                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                            }`}
                                        >
                                            <div className="p-5 pt-0 text-[#9d4a48] dark:text-gray-400 leading-relaxed border-t border-dashed border-[#e9cfce] dark:border-[#3d2424] mt-2">
                                                {item.a}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Contact CTA */}
                <div className="mt-16 bg-gradient-to-br from-red-50 to-white dark:from-[#3d2424] dark:to-[#2d1616] rounded-2xl p-8 text-center border border-[#e9cfce] dark:border-[#3d2424] shadow-sm">
                    <h3 className="text-2xl font-bold text-[#1c0d0d] dark:text-white mb-2">
                        Vẫn còn thắc mắc?
                    </h3>
                    <p className="text-[#9d4a48] dark:text-gray-400 mb-6">
                        Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp mọi câu hỏi của bạn 24/7.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#351a1a] border border-[#e9cfce] dark:border-[#4d2e2e] rounded-lg font-bold text-[#1c0d0d] dark:text-white hover:border-primary transition-colors">
                            <ShoppingBag className="w-5 h-5" />
                            Về Trang Chủ
                        </Link>
                        <a href="#" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 shadow-lg shadow-red-500/20 transition-all hover:-translate-y-0.5">
                            <Mail className="w-5 h-5" />
                            Liên Hệ Hỗ Trợ
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
