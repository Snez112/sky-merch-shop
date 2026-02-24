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
 * Custom rounding logic - ported from timsieunhanh original
 * Rounds based on the hundreds digit:
 * - 0-4xx → round down to nearest 1000
 * - 5xx-8xx → round to x,500
 * - 9xx → round up to next 1000
 */
function customRound(price: number): number {
    const hundreds = Math.floor(price / 100) % 10;
    const base = Math.floor(price / 1000) * 1000;
    if (hundreds < 5) return base;
    if (hundreds <= 8) return base + 500;
    return base + 1000;
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
        return customRound(finalPrice);
    }

    // Otherwise, use tiered pricing
    const tier = getTier(amount);
    const basePrice = amount * pricePerHeart;
    const finalPrice = basePrice / tier.multiplier;
    
    return customRound(finalPrice);
}

/**
 * Get the effective multiplier for a given amount based on tiers or sheet config
 */
export function getApplicableMultiplier(amount: number, sheetAmount: number): number {
    if (sheetAmount >= 4) {
        return sheetAmount;
    }
    return getTier(amount).multiplier;
}

/**
 * Calculate the best price by comparing tier/sheet multiplier with coupon discount
 * 
 * @param amount - Number of hearts
 * @param pricePerHeart - Base price per heart
 * @param sheetAmount - Sheet amount config
 * @param couponDiscount - Optional coupon discount multiplier
 * @returns Object containing final price and which discount was applied
 */
export function calculateBestPrice(
    amount: number,
    pricePerHeart: number,
    sheetAmount: number,
    couponDiscount: number = 0
): { price: number, appliedMultiplier: number, isCouponApplied: boolean } {
    // 1. Get current system multiplier (Tier or Sheet)
    const currentMultiplier = getApplicableMultiplier(amount, sheetAmount);
    
    // 2. Compare with coupon discount
    // Use the larger multiplier for better discount
    const effectiveMultiplier = Math.max(currentMultiplier, couponDiscount);
    
    // 3. Calculate price
    const baseTotal = amount * pricePerHeart;
    const finalPriceRaw = baseTotal / effectiveMultiplier;
    
    // 4. Round
    const finalPrice = customRound(finalPriceRaw);
    
    return {
        price: finalPrice,
        appliedMultiplier: effectiveMultiplier,
        isCouponApplied: couponDiscount > currentMultiplier
    };
}

/**
 * Apply coupon discount to a price
 * @deprecated Use calculateBestPrice instead for correct multiplier comparison
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
