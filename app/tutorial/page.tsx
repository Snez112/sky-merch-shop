"use client";

import Link from "next/link";
import { useState } from "react";
import SupportSection from "@/components/common/support-section";
import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Hướng Dẫn Nhận Tim Sky Chi Tiết | Tim Siêu Nhanh",
//   description:
//     "Hướng dẫn chi tiết các bước để nhận tim (heart) trong Sky: Children of the Light qua mã kết bạn và note nến. Đơn giản, an toàn và hiệu quả.",
//   keywords: [
//     "hướng dẫn nạp tim sky",
//     "cách nhận tim sky",
//     "sky children of the light tutorial",
//     "mã kết bạn sky",
//   ],
// };

export default function TutorialPage() {
    const [zoomedSrc, setZoomedSrc] = useState<string | null>(null);

    const openZoom = (src: string) => setZoomedSrc(src);
    const closeZoom = () => setZoomedSrc(null);

    const TutorialImg = ({
        src,
        alt,
        className,
    }: {
        src: string;
        alt: string;
        className?: string;
    }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt}
            onClick={() => openZoom(src)}
            className={`cursor-zoom-in ${className ?? ""}`}
            loading="lazy"
            decoding="async"
        />
    );

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1c0d0d] dark:text-white transition-colors duration-300">
            <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-12 md:py-20">
                {/* Hero Heading */}
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6">
                        Hướng dẫn <span className="text-primary">nhận Tim</span> chi tiết
                    </h1>
                    <p className="text-lg opacity-70 max-w-2xl mx-auto leading-relaxed">
                        Vui lòng thực hiện chính xác các bước dưới đây để đảm bảo đơn hàng được
                        hoàn thành nhanh nhất và an toàn cho tài khoản của bạn.
                    </p>
                </div>

                <div className="space-y-32">
                    {/* Section 1: Friend Code */}
                    <section id="how-to-create-add-friend-code">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="size-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-3xl">qr_code_2</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-primary">
                                Làm sao để tạo mã kết bạn (Add Friend Code)
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Step 1 */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 font-bold text-primary">
                                    <span className="size-8 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
                                        1
                                    </span>
                                    <h3>Mở Menu Setting</h3>
                                </div>
                                <TutorialImg
                                    src="/tutorial/step-1.png"
                                    alt="Mở menu setting game"
                                    className="rounded-xl shadow-lg border border-primary/10 w-full aspect-video object-cover"
                                />
                                <p className="text-sm opacity-70">B1: Mở menu cài đặt trong game Sky.</p>
                            </div>

                            {/* Step 2 */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 font-bold text-primary">
                                    <span className="size-8 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
                                        2
                                    </span>
                                    <h3>Chọn Mục Bạn Bè</h3>
                                </div>
                                <TutorialImg
                                    src="/tutorial/step-2.png"
                                    alt="Chọn mục bạn bè"
                                    className="rounded-xl shadow-lg border border-primary/10 w-full aspect-video object-cover"
                                />
                                <p className="text-sm opacity-70">B2: Nhấn vào biểu tượng Bạn Bè (Friends).</p>
                            </div>

                            {/* Step 3 */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 font-bold text-primary">
                                    <span className="size-8 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
                                        3
                                    </span>
                                    <h3>Tạo &amp; Sao Chép Mã</h3>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <TutorialImg
                                        src="/tutorial/step-2-1.png"
                                        alt="Bước 2.1"
                                        className="rounded-lg shadow border border-primary/5"
                                    />
                                    <TutorialImg
                                        src="/tutorial/step-2-2.png"
                                        alt="Bước 2.2"
                                        className="rounded-lg shadow border border-primary/5"
                                    />
                                    <TutorialImg
                                        src="/tutorial/step-2-3.png"
                                        alt="Bước 2.3"
                                        className="rounded-lg shadow border border-primary/5"
                                    />
                                </div>
                                <p className="text-sm opacity-70">
                                    B3: Chọn lời mời bạn bè dùng 1 lần, nhập tên tùy ý. Khi menu code hiện ra,
                                    hãy copy code và đừng quên nhấn xác nhận.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Message Candles */}
                    <section id="how-to-place-candle-note">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="size-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-3xl">candle</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-primary">
                                Làm sao để đặt note nến (Message Candles)
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Step 1 */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 font-bold text-primary">
                                    <span className="size-8 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
                                        1
                                    </span>
                                    <h3>Đến Kho Tri Thức</h3>
                                </div>
                                <TutorialImg
                                    src="/tutorial/step-3.png"
                                    alt="Map 6 Kho tri thức"
                                    className="rounded-xl shadow-lg border border-primary/10 w-full aspect-video object-cover"
                                />
                                <p className="text-sm opacity-70">
                                    B1: Di chuyển đến map 6 hay còn gọi là Kho Tri Thức (Vault of Knowledge).
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 font-bold text-primary">
                                    <span className="size-8 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
                                        2
                                    </span>
                                    <h3>Vị Trí Điện Thờ</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <TutorialImg
                                        src="/tutorial/step-4-1.png"
                                        alt="Điện thờ lời nhắn 1"
                                        className="rounded-lg shadow border border-primary/5"
                                    />
                                    <TutorialImg
                                        src="/tutorial/step-4-2.png"
                                        alt="Điện thờ lời nhắn 2"
                                        className="rounded-lg shadow border border-primary/5"
                                    />
                                </div>
                                <p className="text-sm opacity-70">
                                    B2: Đến vị trí của điện thờ lời nhắn (Message Shrines) ngay đầu map.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 font-bold text-primary">
                                    <span className="size-8 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
                                        3
                                    </span>
                                    <h3>Viết Nội Dung</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <TutorialImg
                                        src="/tutorial/step-4-3.png"
                                        alt="Đặt note nến 1"
                                        className="rounded-lg shadow border border-primary/5"
                                    />
                                    <TutorialImg
                                        src="/tutorial/step-4-4.png"
                                        alt="Đặt note nến 2"
                                        className="rounded-lg shadow border border-primary/5"
                                    />
                                </div>
                                <p className="text-sm opacity-70">
                                    B3: Sử dụng 1 nến của bản thân để đặt 1 note nến mới và ghi nội dung bất kỳ.
                                </p>
                            </div>
                        </div>

                        {/* Warning Box */}
                        <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-2xl flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-shrink-0">
                                <TutorialImg
                                    src="/tutorial/step-5.png"
                                    alt="Ví dụ chữ đỏ"
                                    className="w-48 rounded-lg shadow-md"
                                />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined">warning</span>
                                    Lưu ý quan trọng
                                </h4>
                                <p className="opacity-80 leading-relaxed">
                                    Nội dung lời nhắn phải tuân thủ nguyên tắc cộng đồng của game. Lời nhắn{" "}
                                    <strong>phải hiển thị với mọi người</strong> và không được hiện chữ đỏ (như
                                    hình ví dụ). Nếu hiện chữ đỏ, note nến của bạn sẽ không thể nhận tim.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Receive Hearts */}
                    <section id="how-to-received-heart">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="size-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-primary">
                                Làm sao để nhận tim
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <p className="text-lg leading-relaxed opacity-80">
                                    1. Tim được gửi qua note nến sẽ về thẳng tượng nhận nhiệm vụ tại nhà (Home)
                                    của bạn. Bạn chỉ việc nhấn nhận khi thấy biểu tượng trái tim.
                                </p>
                                <p className="text-lg leading-relaxed opacity-80">
                                    2. Sau khi xong đơn, bạn có thể{" "}
                                    <strong>xoá hoặc block</strong> các nick đã add để gửi tim. Việc này giúp
                                    tránh chiếm dụng vị trí trong chòm sao và danh sách bạn bè của bạn.
                                </p>
                                <div className="p-4 bg-primary/5 rounded-xl border-l-4 border-primary italic text-sm">
                                    &ldquo;Chúng tôi khuyên bạn nên dọn dẹp danh sách bạn bè thường xuyên để
                                    trải nghiệm game tốt nhất.&rdquo;
                                </div>
                            </div>
                            <div className="relative">
                                <TutorialImg
                                    src="/tutorial/step-6.png"
                                    alt="Nhận tim tại nhà"
                                    className="rounded-2xl shadow-2xl border border-primary/10 w-full"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Decorative Divider */}
                <div className="flex items-center justify-center py-20 opacity-20">
                    <div className="h-px bg-primary flex-1 max-w-[100px]" />
                    <div className="px-6 flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-sm">filter_vintage</span>
                        <span className="material-symbols-outlined text-xl">stat_3</span>
                        <span className="material-symbols-outlined text-sm">filter_vintage</span>
                    </div>
                    <div className="h-px bg-primary flex-1 max-w-[100px]" />
                </div>

                {/* Community Support */}
                <SupportSection />
            </main>

            {/* Image Zoom Overlay */}
            {zoomedSrc && (
                <div
                    onClick={closeZoom}
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
                >
                    <button
                        onClick={closeZoom}
                        className="absolute top-6 right-6 text-white hover:text-primary transition-colors active:scale-95"
                    >
                        <span className="material-symbols-outlined text-4xl">close</span>
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={zoomedSrc}
                        alt="Phóng to"
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-full max-h-full rounded-lg shadow-2xl"
                    />
                </div>
            )}
        </div>
    );
}
