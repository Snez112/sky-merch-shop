import { NextRequest, NextResponse } from "next/server";
import { fetchPricing } from "@/lib/pricing";

/**
 * GET /api/pricing?quantity=X
 * Calculate price for given quantity of hearts
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const quantityParam = searchParams.get("quantity");

    if (!quantityParam) {
      return NextResponse.json(
        { error: "Missing quantity parameter" },
        { status: 400 }
      );
    }

    const quantity = parseInt(quantityParam);
    
    if (isNaN(quantity) || quantity <= 0) {
      return NextResponse.json(
        { error: "Invalid quantity" },
        { status: 400 }
      );
    }

    // Fetch pricing from sheet
    const pricingData = await fetchPricing();
    const price = pricingData.getPrice(quantity);

    return NextResponse.json({
      quantity,
      price,
      pricePerHeart: pricingData.pricePerHeart,
    });
  } catch (error: any) {
    console.error("Error calculating price:", error);
    return NextResponse.json(
      { error: "Failed to calculate price" },
      { status: 500 }
    );
  }
}
