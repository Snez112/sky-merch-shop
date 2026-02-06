import { UserPlus, Sparkles, ShoppingCart, Heart } from "@/components/icons";

export default function HowItWorks() {
    const steps = [
        {
            icon: UserPlus,
            title: "1. Tạo Friend Code",
            desc: "Tạo mã QR hoặc Link Kết Bạn trong game Sky."
        },
        {
            icon: Sparkles,
            title: "2. Đặt Candle Note",
            desc: "Đặt một note nến tại vị trí chỉ định."
        },
        {
            icon: ShoppingCart,
            title: "3. Thanh Toán",
            desc: "Chọn gói phù hợp và hoàn tất thanh toán."
        },
        {
            icon: Heart,
            title: "4. Nhận Heart",
            desc: "Tim được gửi thẳng đến tượng nhiệm vụ tại home."
        }
    ];

    return (
        <section className="py-12 sm:py-16 md:py-20" id="how-it-works">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">Cách Thức Hoạt Động</h2>
                <p className="text-sm sm:text-base opacity-60">Quy trình đơn giản, nhanh chóng và hiệu quả</p>
            </div>
            <div className="relative flex flex-col md:flex-row justify-between gap-8 md:gap-10 items-center md:items-start">
                {steps.map((step, index) => {
                    const IconComponent = step.icon;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center text-center group z-10 text-foreground">
                            <div className="size-20 bg-white dark:bg-card-dark border-2 border-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-active:bg-primary group-hover:border-primary group-active:border-primary transition-all">
                                <IconComponent className="w-8 h-8 text-primary group-hover:text-white group-active:text-white transition-colors" strokeWidth={2} />
                            </div>
                            <h5 className="font-bold text-lg mb-2">{step.title}</h5>
                            <p className="text-sm opacity-60">{step.desc}</p>
                        </div>
                    );
                })}
                
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-[2px] bg-primary/10 -z-0"></div>
            </div>
        </section>
    );
}
