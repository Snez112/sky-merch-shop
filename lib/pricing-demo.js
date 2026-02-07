/**
 * Simple test to validate pricing logic
 * Run: node lib/pricing-demo.js
 */

// Pricing tiers
const PRICING_TIERS = [
    { minAmount: 360, multiplier: 3.6 },
    { minAmount: 170, multiplier: 3.4 },
    { minAmount: 100, multiplier: 3.3 },
    { minAmount: 0, multiplier: 3.0 },
];

// Custom rounding function with quantity-based logic
function customRound(price, quantity) {
    // Even quantity: preserve hundreds, round tens digit only
    if (quantity % 2 === 0) {
        const tens = Math.floor(price / 10) % 10; // Get tens digit
        const base = Math.floor(price / 100) * 100; // Round down to hundreds

        if (tens < 5) return base; // 0-4 → keep base
        return base + 50; // 5-9 → add 50
    }
    
    // Odd quantity: custom rounding to 1000/500
    const hundreds = Math.floor(price / 100) % 10;
    const base = Math.floor(price / 1000) * 1000;

    if (hundreds < 5) return base;
    if (hundreds >= 5 && hundreds <= 8) return base + 500;
    return base + 1000;
}

// Get tier multiplier
function getTierMultiplier(amount) {
    const tier = PRICING_TIERS.find((t) => amount >= t.minAmount);
    return tier?.multiplier || 3.0;
}

// Calculate tiered price
function calculateTieredPrice(amount, pricePerHeart) {
    const multiplier = getTierMultiplier(amount);
    const rawPrice = (amount * pricePerHeart) / multiplier;
    return customRound(rawPrice, amount);
}

// Run tests
console.log("=== TIERED PRICING DEMO ===\n");

const pricePerHeart = 3000;
// Mix of odd and even numbers to test both rounding types
const testAmounts = [49, 50, 99, 100, 149, 150, 169, 170, 199, 200, 299, 300, 359, 360, 399, 400, 499, 500];

console.log("Price Calculation (pricePerHeart = 3000):");
console.log("Amount | O/E  | Tier      | Multiplier | Raw Price  | Final Price | Rounding Type");
console.log("-------|------|-----------|------------|------------|-------------|---------------");

testAmounts.forEach((amount) => {
    const multiplier = getTierMultiplier(amount);
    const rawPrice = (amount * pricePerHeart) / multiplier;
    const finalPrice = calculateTieredPrice(amount, pricePerHeart);
    const isEven = amount % 2 === 0;
    const roundingType = isEven ? "xx50/xx00" : "x500/x000";
    
    const tierName = 
        amount >= 360 ? "Platinum" :
        amount >= 170 ? "Gold" :
        amount >= 100 ? "Silver" : "Basic";
    
    console.log(
        `${amount.toString().padStart(6)} | ${(isEven ? "Even" : "Odd ").padEnd(4)} | ${tierName.padEnd(9)} | ${multiplier.toFixed(1).padStart(10)} | ${Math.round(rawPrice).toString().padStart(10)} | ${finalPrice.toString().padStart(11)} | ${roundingType}`
    );
});

console.log("\n=== KEY INSIGHTS ===");
console.log(`• Tier thresholds: 0 (Basic), 100 (Silver), 170 (Gold), 360 (Platinum)`);
console.log(`• Higher tiers = better discounts`);
console.log(`• ODD heart quantities: Round to 1000s or 500 (e.g. 16,567→16,500)`);
console.log(`• EVEN heart quantities: Preserve hundreds, round tens (e.g. 16,567→16,550)`);
console.log(`• Exact matches from sheet will override these calculations`);
