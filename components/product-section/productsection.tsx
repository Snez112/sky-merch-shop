import { cachedReq } from "@/lib/utils";
import Link from "next/link";
import ProductCard from "./product-card";
import CustomTimButton from "./custom-tim-button";

export default async function ProductSection() {
    // Fetch pricing data from PRICE sheet
    const priceRes = await cachedReq(`/api/sheet?sheet_name=PRICE`);
    const priceData = priceRes.data || [];

    // Calculate price per Tim based on existing data
    // Find the price-per-tim ratio from the data
    let pricePerTim = 0;
    if (priceData.length > 0) {
        // Use the first entry to calculate the ratio
        const firstItem = priceData[0];
        if (firstItem.AMOUNT && firstItem.PRICE) {
            pricePerTim = firstItem.PRICE / firstItem.AMOUNT;
        }
    }
    
    // Define the Tim amounts you want to offer
    const timAmounts = [30, 60, 150, 300];
    
    // Create products based on the amounts
    const previewProducts = timAmounts.map((amount) => {
        // Check if this amount exists in priceData
        const existingPrice = priceData.find((item: any) => item.AMOUNT === amount);
        const price = existingPrice ? existingPrice.PRICE : Math.round(amount * pricePerTim);
        
        return {
            id: `tim-${amount}`,
            name: `${amount} Tim`,
            category: 'Sky Merchandise',
            price: price,
            amount: amount
        };
    });

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

                <div className="text-center flex items-center justify-center gap-4">
                    <Link
                        href="/shop"
                        className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        View All Products
                    </Link>
                    <CustomTimButton />
                </div>
            </div>
        </section>
    )
}