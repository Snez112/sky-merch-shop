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


  // Save order to Google Sheets
  try {
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
