import { formatDateTime } from "@/lib/utils/date";
import { sendToSheet } from "@/services/sheet/send-to-sheet";
import type { DraftOrderParams, DraftOrderResponse, SheetRowData } from "@/types";

/**
 * Create a draft order with "Pending" status
 * This is called immediately when user confirms purchase, before payment
 * 
 * @param params - Order parameters from form
 * @returns Draft order data
 */
export async function createDraftOrder(
  params: DraftOrderParams
): Promise<DraftOrderResponse> {
  const { code, quantity, productPrice } = params;

  // Calculate target (số Tim bonus)
  // Formula: (Total Price / 1000) * 3
  const totalPrice = productPrice * quantity;
  const target = Math.floor((totalPrice / 1000) * 3);

  // Prepare draft order data
  const now = new Date();
  const sheetData: SheetRowData = {
    code,
    target,
    alreadySent: 0, // No Tim sent yet
    money: totalPrice,
    bankCode: "", // Will be filled after payment verification
    refCode: "", // Will be filled after payment verification
    timeCreate: formatDateTime(now),
    orderStatus: "Pending", // Draft status
    bankTime: "", // Will be filled after payment verification
    doneTime: "", // Will be filled when task is completed
  };


  // Save draft order to Google Sheets
  try {
    await sendToSheet(sheetData);

    return {
      success: true,
      data: {
        code: sheetData.code,
        target: sheetData.target,
        alreadySent: sheetData.alreadySent,
        money: sheetData.money,
        orderStatus: sheetData.orderStatus,
        timeCreate: sheetData.timeCreate,
      },
    };
  } catch (error: any) {
    console.error("Error creating draft order:", error);
    throw new Error(`Failed to create draft order: ${error.message}`);
  }
}
