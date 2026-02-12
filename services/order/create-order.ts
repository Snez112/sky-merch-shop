import { formatDateTime } from "@/lib/utils/date";
import { sendToSheet } from "@/services/sheet/send-to-sheet";
import type { DraftOrderParams, DraftOrderResponse, SheetRowData } from "@/types";

/**
 * Create an order after payment verification
 * This is called AFTER successful payment is confirmed
 * 
 * @param params - Order parameters from payment verification
 * @returns Order data
 */
export async function createOrder(
  params: DraftOrderParams
): Promise<DraftOrderResponse> {
  const { code, quantity, productPrice, target: explicitTarget, money: explicitMoney } = params;

  // Calculate target (số Tim bonus) or use explicit value
  // Formula: (Total Price / 1000) * 3
  const totalPrice = explicitMoney ?? (productPrice * quantity);
  const target = quantity;

  // Prepare confirmed order data
  const now = new Date();
  const sheetData: SheetRowData = {
    code,
    target,
    alreadySent: 0, // No Tim sent yet
    money: totalPrice,
    bankCode: params.bankCode || "", 
    refCode: params.refCode || "", 
    timeCreate: formatDateTime(now),
    orderStatus: params.orderStatus || "Pending", 
    bankTime: params.bankTime || "", 
    doneTime: "", // Will be filled when task is completed
    coupon: params.coupon || "",
    discount: params.discount,
  };

try {
    // If coupon was used, update usage if not CTV type
    if (params.coupon) {
       try {
         // We need to check the coupon TYPE to decide whether to decrement usage
         // Re-fetch coupon details or trust that only valid non-CTV coupons reach here?
         // Safer to re-fetch or use a dedicated service that handles this logic.
         // Since we don't have a "getCoupon" service yet, we'll fetch via the public API or use updateCouponUsage which hits the sheet.
         // But updateCouponUsage just increments/decrements blindy.
         // Let's import updateCouponUsage first.
         const { updateCouponUsage } = await import("@/services/coupon/update-usage");
         
         // Fetch coupon info to check type
         // Optimization: We could have passed the type from verifyPayment if we had it there.
         // For now, let's fetch it again to be safe. 
         // BUT, fetching inside createOrder might be slow.
         // Let's check if we can get the type from the Sheet or just call a new action "DECREMENT_IF_NOT_CTV"?
         // The current update-usage.ts sends action: "UPDATE_COUPON" and increment: 1. 
         // Logic for checking type *should* be in the Google App Script ideally.
         // However, the user asked us to implement logic here. 
         
         // Let's fetch the coupon details first to check TYPE.
         // We can reuse the logic from validate-coupon but it's an API route.
         // Let's create a helper or just fetch the sheet data here.
         // Actually, calling the validate-coupon API internally is robust enough.
         
         const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
         const validateRes = await fetch(`${baseUrl}/api/validate-coupon?code=${params.coupon}`);
         const validateData = await validateRes.json();
         
         if (validateData.valid && validateData.coupon) {
            if (validateData.coupon.type !== 'CTV') {
                await updateCouponUsage(params.coupon);
                console.log(`Decremented usage for coupon ${params.coupon} (Type: ${validateData.coupon.type})`);
            } else {
                console.log(`Skipped usage decrement for CTV coupon ${params.coupon}`);
            }
         }
       } catch (err) {
         console.error("Failed to update coupon usage:", err);
         // Don't fail the order creation
       }
    }
    
    await sendToSheet(sheetData);

    return {
      success: true,
      data: {
        code: sheetData.code,
        target: sheetData.target || target,
        alreadySent: sheetData.alreadySent || 0,
        money: sheetData.money || totalPrice,
        orderStatus: sheetData.orderStatus || "Created",
        timeCreate: sheetData.timeCreate ? sheetData.timeCreate.toString() : formatDateTime(now),
      },
    };
  } catch (error: any) {
    console.error("Error creating order:", error);
    throw new Error(`Failed to create order: ${error.message}`);
  }
}
