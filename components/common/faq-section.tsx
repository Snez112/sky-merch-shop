export default function FAQSection() {
    const features = [
        {
            icon: "airport_shuttle",
            title: "Fast Delivery",
            desc: "Most orders start within 12-24 hours. We ensure a consistent delivery schedule to match game mechanics."
        },
        {
            icon: "verified_user",
            title: "Safe & No Ban",
            desc: "Our methods are compliant with game spirit. We use real accounts to send hearts, ensuring 100% safety for your main account."
        },
        {
            icon: "support_agent",
            title: "Best Support",
            desc: "Our team is available through Discord and Facebook to help you with any issues or tracking your delivery."
        },
        {
            icon: "payments",
            title: "Refund Policy",
            desc: "If we can't deliver your order for any reason, we offer a full refund, no questions asked."
        }
    ];

    return (
        <section className="py-20 border-t border-primary/5" id="faq">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4">Why Choose Us?</h2>
                <p className="opacity-60">Trusted by thousands of Sky: Children of the Light fans</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                    <div key={index} className="bg-primary/5 p-8 rounded-xl flex gap-6 items-start text-foreground">
                        <div className="bg-white dark:bg-[#221010] p-4 rounded-full text-primary shadow-sm">
                            <span className="material-symbols-outlined">{feature.icon}</span>
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
