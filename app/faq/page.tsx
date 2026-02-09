"use strict";
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, HelpCircle, ShoppingBag, CreditCard, Clock, ShieldCheck, Mail, AlertTriangle } from "lucide-react";

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            category: "Mua Hàng & Thanh Toán",
            icon: <ShoppingBag className="w-5 h-5 text-primary" />,
            items: [
                {
                    q: "Làm thế nào để mua gói tim?",
                    a: "Rất đơn giản! Bạn chỉ cần chọn gói tim mong muốn tại trang chủ, nhấn \"Mua ngay\", sau đó điền thông tin Friend Code và tiến hành thanh toán chuyển khoản theo mã QR."
                },
                {
                    q: "Tôi có thể thanh toán bằng phương thức nào?",
                    a: "Hiện tại chúng tôi hỗ trợ thanh toán qua Chuyển Khoản Ngân Hàng. Các ví điện tử như MoMo, ZaloPay và credit card đang được phát triển và sẽ sớm ra mắt."
                },
                {
                    q: "Tôi cần cung cấp thông tin gì để nạp tự động?",
                    a: "Bạn chỉ cần cung cấp Friend Code của mình. Đây là mã duy nhất giúp chúng tôi xác định tài khoản và gửi tim chính xác cho bạn."
                }
            ]
        },
        {
            category: "Vận Chuyển & Thời Gian",
            icon: <Clock className="w-5 h-5 text-orange-500" />,
            items: [
                {
                    q: "Sau bao lâu thì tôi nhận được tim?",
                    a: "Thông thường đơn hàng sẽ được xử lý ngay sau khi thanh toán thành công. Thời gian giao tim thường từ 5-15 phút. Trong một số trường hợp, có thể mất tối đa 24h."
                },
                {
                    q: "Làm sao để tôi biết khi nào đã nhận được tim?",
                    a: "Bạn có thể xem lịch sử thông báo của game (trong trường hợp bật thông báo) hoặc kiểm tra trực tiếp biểu tượng trái tim tại bục nhận nhiệm vụ ở Home. Hãy tham khảo Hướng Dẫn Nhận Tim để biết thêm chi tiết."
                }
            ]
        },
        {
            category: "Bảo Mật & Hỗ Trợ",
            icon: <ShieldCheck className="w-5 h-5 text-green-500" />,
            items: [
                {
                    q: "Nạp qua Sky Merch Shop có an toàn không?",
                    a: "Tuyệt đối an toàn. Chúng tôi sử dụng tài khoản thật để gửi tim và bảo hành theo điều khoản dịch vụ. Phương pháp gửi tim của chúng tôi hoàn toàn tuân thủ quy định của game, không gây rủi ro cho tài khoản."
                },
                {
                    q: "Tôi nhập sai mã Friend Code thì sao?",
                    a: "Nếu mã code nhập sai, đơn hàng sẽ không thể thực hiện hãy liên hệ ngay với đội ngũ hỗ trợ qua Facebook hoặc Telegram để được hỗ trợ sửa đổi thông tin. Nhưng nếu bạn nhập 1 mã code chính xác thì đơn hàng sẽ tự động giao và không thể hủy/hoàn tiền."
                }
            ]
        },
        {
            category: "Lỗi Đã Biết",
            icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
            items: [
                {
                    q: "Khi nhận tim tôi bị crash game phải làm sao?",
                    a: "Đừng lo lắng! Đây là lỗi của game từ tháng 6/2024 và vẫn chưa được fix. Khi bạn đăng nhập lại, số tim đã lên một mốc nhất định. Hãy lặp lại nếu bạn còn tim chưa nhận. Xin lỗi vì sự bất tiện, đây không phải lỗi do phía chúng tôi."
                },
                {
                    q: "Tôi đã ấn nhận tim ở tượng nhưng số tim không lên, còn tim ở tượng đã biến mất. Phải làm sao?",
                    a: "Đừng lo lắng! Chúng tôi luôn gửi dư chứ không bao giờ thiếu. Trong trường hợp này, bạn hãy thử thoát ra vào lại. Nếu vẫn chưa thấy số tim của mình, hãy thử mua một vật phẩm tiêu tốn tim bất kỳ nhưng đừng đồng ý thanh toán và thoát menu mua - số tim sẽ nhảy lên."
                },
                {
                    q: "Để không gặp tình trạng như trên phải làm sao?",
                    a: "Hãy đứng tại tượng nhận tim. Khi có thông báo được gửi tim, hãy nhận liền ngay từng ít một - như vậy sẽ không bị hai vấn đề nêu ở trên."
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
            <div className="relative bg-white dark:bg-card-dark border-b border-primary/5 dark:border-white/5 py-16 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/5 rounded-full mb-4">
                        <HelpCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#1c0d0d] dark:text-white tracking-tight">
                        Câu Hỏi Thường Gặp
                    </h1>
                    <p className="text-lg opacity-60 max-w-2xl mx-auto italic">
                        Giải đáp những thắc mắc phổ biến nhất về quy trình mua hàng, thanh toán và nhận vật phẩm tại Sky Merch Shop.
                    </p>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-3xl mx-auto py-12 px-4 space-y-12">
                {faqs.map((section, sIndex) => (
                    <div key={sIndex} className="space-y-6">
                        <div className="flex items-center gap-3 pb-2 border-b border-primary/10">
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
                                        className={`bg-white dark:bg-card-dark rounded-lg border transition-all duration-300 ${
                                            isOpen ? 'border-primary/50' : 'border-primary/5 hover:border-primary/50'
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
                                            <div className="p-5 pt-0 opacity-70 leading-relaxed border-t border-dashed border-primary/5 mt-2">
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
                <div className="mt-16 bg-gradient-to-br from-red-50 to-white dark:from-primary/5 dark:to-card-dark rounded-2xl p-8 text-center border border-primary/5 shadow-sm">
                    <h3 className="text-2xl font-bold text-[#1c0d0d] dark:text-white mb-2">
                        Vẫn còn thắc mắc?
                    </h3>
                    <p className="opacity-70 dark:opacity-60 mb-6 italic">
                        Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp mọi câu hỏi của bạn 24/7.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#351a1a] border border-primary/10 dark:border-white/10 rounded-lg font-bold text-[#1c0d0d] dark:text-white hover:border-primary transition-colors">
                            <ShoppingBag className="w-5 h-5" />
                            Về Trang Chủ
                        </Link>
                        <Link href="/support" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 shadow-lg shadow-red-500/20 transition-all hover:-translate-y-0.5">
                            <Mail className="w-5 h-5" />
                            Liên Hệ Hỗ Trợ
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
