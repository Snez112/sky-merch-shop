export default function FAQSection() {
    const features = [
        {
            icon: "bolt",
            title: "Giao Hàng Nhanh & Tự Động",
            desc: "Hầu hết đơn hàng bắt đầu trong 1-2 giờ. Chúng tôi đảm bảo lịch trình giao hàng ổn định phù hợp cơ chế game."
        },
        {
            icon: "security",
            title: "An Toàn & Không Ban",
            desc: "Phương pháp tuân thủ TOS game. Sử dụng tài khoản thật để gửi tim, đảm bảo an toàn 100% cho tài khoản chính của bạn."
        },
        {
            icon: "support",
            title: "Hỗ Trợ Tốt Nhất",
            desc: "Đội ngũ hỗ trợ túc trực 24/7 sẵn sàng giúp bạn giải quyết mọi vấn đề hoặc theo dõi đơn hàng."
        },
        {
            icon: "replay",
            title: "Chính Sách Hoàn Tiền",
            desc: "Nếu không thể giao hàng vì bất kỳ lý do gì, chúng tôi sẽ hoàn tiền đầy đủ, không hỏi thêm."
        }
    ];

    return (
        <section className="py-12 sm:py-16 md:py-20 border-t border-primary/5" id="faq">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">Tại Sao Nên Chọn Chúng Tôi?</h2>
                <p className="text-sm sm:text-base opacity-60">Được tin tưởng bởi hàng ngàn người chơi sky mỗi tháng</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                {features.map((feature, index) => (
                    <div key={index} className="bg-primary/5 p-8 rounded-xl flex gap-6 items-start group transition-all hover:bg-primary/10">
                        <div className="size-16 bg-white dark:bg-[#221010] rounded-full flex items-center justify-center text-primary shadow-sm flex-shrink-0 group-hover:bg-primary group-active:bg-primary transition-all">
                            <span className="material-symbols-outlined group-hover:text-white group-active:text-white transition-colors">{feature.icon}</span>
                        </div>
                        <div>
                            <h6 className="font-bold text-xl mb-2">{feature.title}</h6>
                            <p className="opacity-60 leading-relaxed">{feature.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
