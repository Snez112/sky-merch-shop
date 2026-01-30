import { fetchPricing } from "@/lib/pricing";
import FastBuyCardClient from "./fast-buy-card-client";


export default async function FastBuyCard() {
    // Fetch pricing from PRICE sheet
    const pricing = await fetchPricing();

    return <FastBuyCardClient pricePerHeart={pricing.pricePerHeart} />;
}
