import { cachedReq } from "@/lib/ultil";
import Link from "next/link";

export default async function ProductSection() {
    const res = await cachedReq(`/api/sheet`);
    const previewProducts = res.data;
    console.log(previewProducts);
    return (
        <section className="py-20 md:py-28 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Products</h2>
                    <p className="text-lg text-muted-foreground">Discover our most popular celestial merchandise</p>
                </div>

                <div className={`grid md:grid-cols-3 lg:grid-cols-${previewProducts.length} gap-6 mb-12`}>
                    {previewProducts.map((product: any) => (
                        <Link key={product.id} href={`/product/${product.id}`}>
                            <div className="group cursor-pointer">
                                <div className="relative overflow-hidden rounded-lg bg-muted mb-4 h-full flex items-center justify-center">
                                    <div className="text-muted-foreground text-center">
                                        <img src={'/heart-sky.png'} alt='heart-sky' className="w-24 h-24" />
                                        <p className="text-sm">{product.name}</p>
                                    </div>
                                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                                </div>
                                <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">{product.category}</p>
                                <p className="text-lg font-bold text-primary">{product.price} VNĐ</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="/shop"
                        className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        View All Products
                    </Link>
                </div>
            </div>
        </section>
    )
}