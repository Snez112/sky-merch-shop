/**
 * Test file to validate tiered pricing logic with quantity-based rounding
 * Run: npx tsx lib/pricing-test.ts
 */

import {
    PRICING_TIERS,
    customRound,
    getTierMultiplier,
    calculateTieredPrice,
} from "./pricing-helpers";

console.log("=== TIERED PRICING TEST ===\n");

// Test 1: Custom Rounding - ODD quantities
console.log("1. Custom Rounding Tests (ODD quantities - 1000/500 rounding):");
const oddRoundingTests = [
    { input: 16234, quantity: 51, expected: 16000, desc: "hundreds=2 (0-4)" },
    { input: 16567, quantity: 51, expected: 16500, desc: "hundreds=5" },
    { input: 16789, quantity: 51, expected: 16500, desc: "hundreds=7 (6-8)" },
    { input: 16923, quantity: 51, expected: 17000, desc: "hundreds=9" },
];

oddRoundingTests.forEach(({ input, quantity, expected, desc }) => {
    const result = customRound(input, quantity);
    const status = result === expected ? "✅" : "❌";
    console.log(`  ${status} ${input} (qty: ${quantity}) → ${result} (expected: ${expected}) - ${desc}`);
});

// Test 2: Custom Rounding - EVEN quantities
console.log("\n2. Custom Rounding Tests (EVEN quantities - preserve hundreds, round tens):");
const evenRoundingTests = [
    { input: 16234, quantity: 50, expected: 16200, desc: "16,234 → 16,200 (tens=3 <5)" },
    { input: 16567, quantity: 50, expected: 16550, desc: "16,567 → 16,550 (tens=6 ≥5)" },
    { input: 16789, quantity: 50, expected: 16750, desc: "16,789 → 16,750 (tens=8 ≥5)" },
    { input: 16923, quantity: 50, expected: 16900, desc: "16,923 → 16,900 (tens=2 <5)" },
];

evenRoundingTests.forEach(({ input, quantity, expected, desc }) => {
    const result = customRound(input, quantity);
    const status = result === expected ? "✅" : "❌";
    console.log(`  ${status} ${input} (qty: ${quantity}) → ${result} (expected: ${expected}) - ${desc}`);
});

// Test 3: Tier Multipliers
console.log("\n3. Tier Multiplier Tests:");
const tierTests = [
    { amount: 50, expected: 3.0, tier: "Basic" },
    { amount: 100, expected: 3.3, tier: "Silver" },
    { amount: 150, expected: 3.3, tier: "Silver" },
    { amount: 170, expected: 3.4, tier: "Gold" },
    { amount: 300, expected: 3.4, tier: "Gold" },
    { amount: 360, expected: 3.6, tier: "Platinum" },
    { amount: 500, expected: 3.6, tier: "Platinum" },
];

tierTests.forEach(({ amount, expected, tier }) => {
    const result = getTierMultiplier(amount);
    const status = result === expected ? "✅" : "❌";
    console.log(`  ${status} ${amount} hearts → ${result}x (${tier})`);
});

// Test 4: Full Price Calculation with ODD/EVEN comparison
console.log("\n4. Full Price Calculation (pricePerHeart = 3000):");
console.log("  Amount | O/E  | Tier      | Multiplier | Raw Price  | Final Price | Rounding");
console.log("  -------|------|-----------|------------|------------|-------------|----------");

const pricePerHeart = 1000;
const priceTests = [49, 50, 99, 100, 149, 150, 169, 170, 199, 200, 299, 300, 359, 360, 399, 400, 499, 500];

priceTests.forEach((amount) => {
    const multiplier = getTierMultiplier(amount);
    const rawPrice = (amount * pricePerHeart) / multiplier;
    const finalPrice = calculateTieredPrice(amount, pricePerHeart, 1); // sheetAmount < 4 -> tiers
    const isEven = amount % 2 === 0;
    const roundingType = isEven ? "xx50/xx00" : "x500/x000";
    
    const tierName = PRICING_TIERS.find(t => amount >= t.minAmount)?.minAmount;
    const tierLabel = 
        tierName === 360 ? "Platinum" :
        tierName === 170 ? "Gold" :
        tierName === 100 ? "Silver" : "Basic";
    
    console.log(
        `  ${amount.toString().padStart(6)} | ${(isEven ? "Even" : "Odd ").padEnd(4)} | ${tierLabel.padEnd(9)} | ${multiplier.toFixed(1).padStart(10)} | ${Math.round(rawPrice).toString().padStart(10)} | ${finalPrice.toString().padStart(11)} | ${roundingType}`
    );
});

console.log("\n=== KEY INSIGHTS ===");
console.log("• ODD heart quantities: Round to 1000s or 500 (cleaner, psychological pricing)");
console.log("• EVEN heart quantities: Preserve hundreds, round tens only (e.g. 16,567→16,550)");
console.log("• Higher tiers = better discounts (higher multiplier)");
// Test 5: Sheet Amount Logic (Conditional Multiplier)
console.log("\n5. Sheet Amount Logic Logic (Conditional Condition):");
console.log("   • If sheetAmount < 4  → Use Dynamic Tiers (3.0 - 3.6)");
console.log("   • If sheetAmount >= 4 → Use Fixed Multiplier = sheetAmount");
console.log("  -------------------------------------------------------------");

const testSheetAmounts = [3, 4.5]; // Test cases: <4, =4, >4
const testQty = 100; // Fixed quantity to compare results

testSheetAmounts.forEach((sheetAmt) => {
    const finalPrice = calculateTieredPrice(testQty, pricePerHeart, sheetAmt);
    let expectedMultiplier;
    let logicType;
    let roundingType;

    if (sheetAmt >= 4) {
        expectedMultiplier = sheetAmt;
        logicType = `Fixed (Amt=${sheetAmt})`;
        roundingType = "Forced Tens";
    } else {
        expectedMultiplier = getTierMultiplier(testQty); // 3.3 for qty 100
        logicType = "Dynamic Tier";
        roundingType = testQty % 2 === 0 ? "Tens (Even)" : "Hundreds (Odd)";
    }

    const raw = (testQty * pricePerHeart) / expectedMultiplier;
    // We manually invoke customRound here to verify expected value
    // Pass true for forceTens if sheetAmt >= 4
    const rounded = customRound(raw, testQty, sheetAmt >= 4);
    
    // Validate
    const correct = finalPrice === rounded ? "✅" : "❌";

    console.log(
        `  ${correct} SheetAmt: ${sheetAmt.toString().padEnd(2)} | Logic: ${logicType.padEnd(16)} | Multiplier: ${expectedMultiplier.toFixed(1)} | Rounding: ${roundingType.padEnd(12)} | Price: ${finalPrice}`
    );
});

console.log("\n=== TEST COMPLETE ===");

