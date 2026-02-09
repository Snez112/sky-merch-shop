/**
 * Pricing Helpers - Tiered Pricing Logic
 * 
 * Logic adapted from timsieunhanh with dynamic base price from Google Sheets
 */

interface TierConfig {
    minAmount: number;
    multiplier: number;
}

/**
 * Fixed tier configuration
 * Higher tiers = better discount (higher multiplier = lower price per unit)
 */
export const PRICING_TIERS: TierConfig[] = [
    { minAmount: 360, multiplier: 3.6 }, // Platinum
    { minAmount: 170, multiplier: 3.4 }, // Gold
    { minAmount: 100, multiplier: 3.3 }, // Silver
    { minAmount: 0, multiplier: 3.0 },   // Basic
];

/**
 * Custom rounding logic with quantity-based rules
 * 
 * For ODD quantities (hearts):
 * - Hundreds digit 0-4: Round down to nearest 1000
 * - Hundreds digit 5-8: Round to 500
 * - Hundreds digit 9: Round up to nearest 1000
 * 
 * For EVEN quantities (hearts):
 * - Preserve hundreds digit, round tens digit only
 * - Tens digit 0-4: Round down (keep base)
 * - Tens digit 5-9: Round to 50
 * 
 * Examples (odd quantity - e.g. 51 hearts):
 * - 16,234 → 16,000
 * - 16,567 → 16,500
 * - 16,789 → 16,500
 * - 16,923 → 17,000
 * 
 * Examples (even quantity - e.g. 50 hearts):
 * - 16,234 → 16,200 (preserve 200, tens=3 → keep)
 * - 16,567 → 16,550 (preserve 500, tens=6 → +50)
 * - 16,789 → 16,750 (preserve 700, tens=8 → +50)
 * - 16,923 → 16,900 (preserve 900, tens=2 → keep)
 */
export function customRound(
    price: number, 
    quantity: number, 
    forceTensRounding: boolean = false
): number {
    // Round tens digit only if explicit flag is true OR quantity is even
    // (Logic: preserve hundreds, round tens digit only)
    if (forceTensRounding) {
        const tens = Math.floor(price / 10) % 10; // Get tens digit
        const base = Math.floor(price / 100) * 100; // Round down to hundreds

        if (tens < 5) return base; // 0-4 → keep base
        if (tens >= 5 && tens <= 8) return base + 50;
        return base + 100; // >=9 → add 100
    }else{
    // Odd quantity (default): custom rounding to 1000/500
    const hundreds = Math.floor(price / 100) % 10;
    const base = Math.floor(price / 1000) * 1000;

    if (hundreds < 5) return base;
    if (hundreds >= 5 && hundreds <= 8) return base + 500;
    return base + 1000;
    }
}

/**
 * Get tier multiplier based on amount
 * 
 * @param amount - Number of hearts/items
 * @returns Multiplier for the tier (3.0, 3.3, 3.4, or 3.6)
 */
export function getTierMultiplier(amount: number): number {
    const tier = PRICING_TIERS.find((t) => amount >= t.minAmount);
    return tier?.multiplier || 3.0;
}

/**
 * Calculate price using tiered pricing logic
 * 
 * Formula: (amount × pricePerHeart) / multiplier
 * Then apply custom rounding based on quantity
 * 
 * @param amount - Number of hearts/items to purchase
 * @param pricePerHeart - Base price per heart from Google Sheets
 * @param sheetAmount - The AMOUNT value from the first row of the sheet
 * @returns Final price after tiered calculation and custom rounding
 */
export function calculateTieredPrice(
    amount: number, // số lượng từ sheet
    pricePerHeart: number,
    sheetAmount: number
): number {
    let multiplier: number;
    let forceTensRounding = false;

    if (sheetAmount >= 4) {
        multiplier = sheetAmount;
        forceTensRounding = true; // Fixed multiplier -> Always use tens rounding
    } else {
        multiplier = getTierMultiplier(amount);
    }

    const rawPrice = (amount * pricePerHeart) / multiplier;
    return customRound(rawPrice, amount, forceTensRounding);
}
