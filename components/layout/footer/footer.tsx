import { Award, Zap, Lock, Truck } from "lucide-react"

export default function Footer() {
    const features = [
        {
            icon: Award,
            title: "Official-Inspired",
            description: "Officially inspired merchandise celebrating Sky: Children of the Light",
        },
        {
            icon: Zap,
            title: "Premium Quality",
            description: "High-quality materials and careful craftsmanship in every product",
        },
        {
            icon: Lock,
            title: "Secure Payment",
            description: "Safe and secure checkout with trusted payment methods",
        },
        {
            icon: Truck,
            title: "Fast Shipping",
            description: "Quick and reliable delivery to your doorstep worldwide",
        },
    ]

    return (
        <section className="py-20 md:py-[2rem] bg-gradient-to-b from-blue-50/50 to-background">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Us</h2>
                    <p className="text-lg text-muted-foreground">We're committed to providing the best experience</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div key={index} className="text-center space-y-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                                    <Icon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="font-bold text-foreground text-lg">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm">{feature.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
