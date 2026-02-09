import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trung Tâm Hỗ Trợ - Tim Siêu Nhanh",
  description: "Liên hệ đội ngũ hỗ trợ Tim Siêu Nhanh 24/7. Giải đáp thắc mắc về đơn hàng, thanh toán, Friend Code. Cam kết phản hồi trong 30 phút qua Facebook và Telegram.",
  keywords: ["hỗ trợ", "support", "liên hệ", "customer service", "tim siêu nhanh"],
  openGraph: {
    title: "Trung Tâm Hỗ Trợ - Tim Siêu Nhanh",
    description: "Đội ngũ hỗ trợ 24/7 sẵn sàng giải đáp mọi thắc mắc của bạn",
    type: "website",
  },
};

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1c0d0d] dark:text-white transition-colors duration-300">
            <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-12 md:py-20">
                {/* Hero Heading */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
                        <span className="material-symbols-outlined text-4xl text-primary">support_agent</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6">
                        Trung tâm <span className="text-primary">Hỗ Trợ</span>
                    </h1>
                    <p className="text-lg opacity-70 max-w-2xl mx-auto leading-relaxed">
                        Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn để đảm bảo trải nghiệm mua hàng tốt nhất.
                    </p>
                </div>

                {/* Support Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Info Cards */}
                    <div className="space-y-6">
                        {/* Working Hours */}
                        <div className="bg-white dark:bg-card-dark p-8 rounded-2xl border border-primary/5 shadow-xl shadow-primary/5">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="size-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                                    <span className="material-symbols-outlined">schedule</span>
                                </div>
                                <h3 className="text-xl font-bold">Thời gian làm việc</h3>
                            </div>
                            <p className="opacity-80 leading-relaxed">
                                Đội ngũ hỗ trợ của chúng tôi hoạt động liên tục trong khung giờ:
                                <br /><span className="text-primary font-black text-2xl mt-2 block">08:00 - 23:00</span>
                                <span className="text-sm opacity-60 italic">(Tất cả các ngày trong tuần bao gồm cả Lễ/Tết)</span>
                            </p>
                        </div>

                        {/* Response Commitment */}
                        <div className="bg-white dark:bg-card-dark p-8 rounded-2xl border border-primary/5 shadow-xl shadow-primary/5">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="size-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                                    <span className="material-symbols-outlined">bolt</span>
                                </div>
                                <h3 className="text-xl font-bold">Cam kết phản hồi</h3>
                            </div>
                            <p className="opacity-80 leading-relaxed">
                                Chúng tôi cam kết phản hồi mọi yêu cầu hỗ trợ trong vòng:
                                <br /><span className="text-primary font-black text-2xl mt-2 block">Tối đa 30 Phút</span>
                                <span className="text-sm opacity-60 italic">(Trong khung giờ làm việc chính thức)</span>
                            </p>
                        </div>

                        {/* Supported Issues */}
                        <div className="bg-white dark:bg-card-dark p-8 rounded-2xl border border-primary/5 shadow-xl shadow-primary/5">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="size-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500">
                                    <span className="material-symbols-outlined">verified</span>
                                </div>
                                <h3 className="text-xl font-bold">Vấn đề hỗ trợ</h3>
                            </div>
                            <ul className="space-y-3 opacity-80 decoration-primary">
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-primary">circle</span>
                                    Lỗi thanh toán hoặc xác nhận đơn hàng
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-primary">circle</span>
                                    Đơn hàng quá hạn giao hoặc giao thiếu
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-primary">circle</span>
                                    Tư vấn chọn gói và quy trình lấy Friend Code
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-primary">circle</span>
                                    Khôi phục thông tin đơn hàng đã mất
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Requirements & Contact */}
                    <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 sticky top-24">
                        <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">contact_support</span>
                            Liên Hệ Ngay
                        </h3>
                        <p className="opacity-70 mb-8 leading-relaxed">
                            Để được hỗ trợ nhanh nhất, vui lòng chuẩn bị sẵn các thông tin sau trước khi nhắn tin cho chúng tôi:
                        </p>

                        <div className="space-y-4 mb-10">
                            <div className="flex items-center gap-4 p-4 bg-white dark:bg-card-dark rounded-xl border border-primary/10">
                                <span className="material-symbols-outlined text-primary">qr_code_2</span>
                                <span className="font-bold text-sm">Friend Code của bạn</span>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-white dark:bg-card-dark rounded-xl border border-primary/10">
                                <span className="material-symbols-outlined text-primary">receipt_long</span>
                                <span className="font-bold text-sm">Mã đơn hàng (nếu có)</span>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-white dark:bg-card-dark rounded-xl border border-primary/10">
                                <span className="material-symbols-outlined text-primary">image</span>
                                <span className="font-bold text-sm">Ảnh chụp biên lai chuyển khoản</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <a 
                                href="https://facebook.com"
                                className="w-full py-4 bg-[#1877F2] text-white font-black rounded-full flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-blue-500/30 transition-all uppercase tracking-widest text-sm"
                            >
                                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Nhắn qua Facebook
                            </a>
                            <a 
                                href="https://t.me/yourusername"
                                className="w-full py-4 bg-[#26A5E4] text-white font-black rounded-full flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-sky-500/30 transition-all uppercase tracking-widest text-sm"
                            >
                                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.52-.46-.01-1.33-.26-1.98-.48-.8-.27-1.43-.42-1.37-.89.03-.25.38-.51 1.03-.78 4.04-1.76 6.74-2.92 8.09-3.48 3.85-1.6 4.64-1.88 5.17-1.89.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.13-.03.19z" />
                                </svg>
                                Kênh Telegram
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
