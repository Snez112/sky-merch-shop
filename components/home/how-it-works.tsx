export default function HowItWorks() {
    const steps = [
        {
            icon: "person_add",
            title: "1. Create Friend Code",
            desc: "Generate a QR or Friend Link in Sky game."
        },
        {
            icon: "candle",
            title: "2. Place Candle Note",
            desc: "Place a message note or memory candle."
        },
        {
            icon: "shopping_cart",
            title: "3. Purchase",
            desc: "Select your pack and complete payment."
        },
        {
            icon: "favorite",
            title: "4. Get Heart",
            desc: "Hearts delivered to your constellation daily."
        }
    ];

    return (
        <section className="py-20" id="how-it-works">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4">How It Works</h2>
                <p className="opacity-60">Simple 4-step process to light up your game</p>
            </div>
            <div className="relative flex flex-col md:flex-row justify-between gap-10 items-start">
                {steps.map((step, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center text-center group z-10 text-foreground">
                        <div className="size-20 bg-white dark:bg-[#2d1818] border-2 border-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:border-primary group-hover:bg-primary/5 transition-all">
                            <span className="material-symbols-outlined text-3xl text-primary">{step.icon}</span>
                        </div>
                        <h5 className="font-bold text-lg mb-2">{step.title}</h5>
                        <p className="text-sm opacity-60">{step.desc}</p>
                    </div>
                ))}
                
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-[2px] bg-primary/10 -z-0"></div>
            </div>
        </section>
    );
}
