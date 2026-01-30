import { cachedReq } from "@/lib/utils";

interface PriceEntry {
    AMOUNT: number;
    PRICE: number;
}

interface PricingData {
    pricePerHeart: number;
    getPrice: (amount: number) => number;
}

/**
 * Fetch and parse pricing data from PRICE sheet
 */
export async function fetchPricing(): Promise<PricingData> {
    try {
        const priceRes = await cachedReq(`/api/sheet?sheet_name=PRICE`);
        const priceData: PriceEntry[] = priceRes.data || [];
        // Calculate price per heart from first entry
        let pricePerHeart = 3000; // Default fallback
        if (priceData.length > 0) {
            const firstItem = priceData[0];
            if (firstItem.AMOUNT && firstItem.PRICE) {
                pricePerHeart = Math.round(firstItem.PRICE / firstItem.AMOUNT);
            }
        }

        // Helper function to get price for any amount
        const getPrice = (amount: number): number => {
            // Check if exact amount exists in sheet
            const exactMatch = priceData.find((item) => item.AMOUNT === amount);
            if (exactMatch) {
                return exactMatch.PRICE;
            }
            // Otherwise calculate based on price per heart
            return Math.round(amount * pricePerHeart);
        };

        return {
            pricePerHeart,
            getPrice,
        };
    } catch (error) {
        console.error("Error fetching pricing:", error);
        // Return fallback pricing
        return {
            pricePerHeart: 3000,
            getPrice: (amount) => amount * 3000,
        };
    }
}
