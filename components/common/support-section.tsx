import Link from "next/link";

export default function SupportSection() {
    return (
        <section className="py-12 sm:py-16 md:py-20 mb-8 sm:mb-10" id="support">
            <div className="bg-secondary/20 rounded-xl p-8 sm:p-10 flex flex-col items-center text-center">
                <h2 className="text-2xl sm:text-3xl font-black mb-4">Tham Gia Vào Cộng Đồng</h2>
                <p className="max-w-xl text-sm sm:text-base opacity-70 mb-8">Có câu hỏi? Tham gia các kênh mạng xã hội chính thức để cập nhật, nhận quà và được hỗ trợ 24/7.</p>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
                    <Link href="https://www.facebook.com/sky.fastheart" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-card-dark rounded-full font-bold shadow-sm hover:shadow-md transition-all">
                        <span className="material-symbols-outlined text-[#1877F2]">social_leaderboard</span>
                        Facebook
                    </Link>
                    <Link href="https://t.me/skyfastheart" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-card-dark rounded-full font-bold shadow-sm hover:shadow-md transition-all">
                        <span className="material-symbols-outlined text-[#26A5E4]">send</span>
                        Telegram
                    </Link>
                    <Link href="mailto:support@timsieunhanh.com" className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-card-dark rounded-full font-bold shadow-sm hover:shadow-md transition-all">
                        <span className="material-symbols-outlined text-primary">mail</span>
                        Gửi Email
                    </Link>
                </div>
            </div>
        </section>
    );
}
