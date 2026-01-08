import { cachedReq } from "@/lib/ultil";
import Link from "next/link";
import ProductCard from "./product-card";

export default async function ProductSection() {
    const res = await cachedReq(`/api/sheet`);
    const previewProducts = res.data;
    console.log(previewProducts);

    const productCount = previewProducts.length;
    const gridColsClass = {
        1: 'md:grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4',
        5: 'md:grid-cols-5'
    }[Math.min(productCount, 5)] || 'md:grid-cols-3';

    return (
        <section className="py-20 md:py-28 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Products</h2>
                    <p className="text-lg text-muted-foreground">Discover our most popular celestial merchandise</p>
                </div>

                <div className={`grid grid-cols-1 ${gridColsClass} gap-4 md:gap-6 mb-8 md:mb-12`}>
                    {previewProducts.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
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