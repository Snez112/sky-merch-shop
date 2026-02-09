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
    { minAmount: 0, multiplier: 3.0 },   // Bronze (default)
];

/**
 * Get the appropriate tier for a given amount
 */
function getTier(amount: number): TierConfig {
    // Find the highest tier that the amount qualifies for
    for (const tier of PRICING_TIERS) {
        if (amount >= tier.minAmount) {
            return tier;
        }
    }
    // Fallback to lowest tier (should never happen with minAmount: 0)
    return PRICING_TIERS[PRICING_TIERS.length - 1];
}

/**
 * Custom rounding logic based on amount
 * Matches timsieunhanh's rounding behavior
 */
function customRound(price: number, amount: number): number {
    if (amount < 100) {
        // Round to nearest 100
        return Math.ceil(price / 100) * 100;
    } else if (amount < 200) {
        // Round to nearest 500
        return Math.ceil(price / 500) * 500;
    } else {
        // Round to nearest 1000
        return Math.ceil(price / 1000) * 1000;
    }
}

/**
 * Calculate tiered price for a given amount
 * 
 * @param amount - Number of hearts to purchase
 * @param pricePerHeart - Base price per heart from Google Sheets
 * @param sheetAmount - Amount value from sheet (used as multiplier base if >= 4)
 * @returns Final price after applying tier multiplier and custom rounding
 */
export function calculateTieredPrice(
    amount: number,
    pricePerHeart: number,
    sheetAmount: number
): number {
    // If sheetAmount >= 4, use it as a fixed multiplier instead of tiered pricing
    if (sheetAmount >= 4) {
        const basePrice = amount * pricePerHeart;
        const finalPrice = basePrice / sheetAmount;
        return customRound(finalPrice, amount);
    }

    // Otherwise, use tiered pricing
    const tier = getTier(amount);
    const basePrice = amount * pricePerHeart;
    const finalPrice = basePrice / tier.multiplier;
    
    return customRound(finalPrice, amount);
}

/**
 * Apply coupon discount to a price
 * 
 * @param basePrice - Base price before discount
 * @param discountMultiplier - Discount multiplier from coupon (e.g., 5, 3.2)
 * @returns Price after applying discount
 * 
 * @example
 * applyDiscount(100000, 5) // Returns 20000 (100000 / 5)
 */
export function applyDiscount(basePrice: number, discountMultiplier: number): number {
  if (discountMultiplier <= 0) {
    return basePrice;
  }
  
  // Apply discount by dividing base price by multiplier
  const discountedPrice = basePrice / discountMultiplier;
  
  // Round to nearest 100
  return Math.ceil(discountedPrice / 100) * 100;
}
