import axios from "axios";

/**
 * Update coupon usage in Google Sheets
 * 
 * @param couponCode - usage to increment
 */
export async function updateCouponUsage(couponCode: string) {
  const gsheetBase = process.env.GSHEET_WEBAPP_URL;
  if (!gsheetBase) {
    console.error("Missing GSHEET_WEBAPP_URL");
    return;
  }

  try {
    const response = await axios({
      url: gsheetBase,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: {
        action: "UPDATE_COUPON",
        code: couponCode,
        increment: 1
      },
    });

    console.log("Coupon usage updated:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating coupon usage:", error);
    // Don't throw error to avoid failing the order creation flow
    // Just log it
  }
}
