import { formatDateTime } from "@/lib/utils";
import { sendToSheet } from "@/services/sheet/send-to-sheet";
import { isValidGenerateCode } from "@/lib/validation";
import { cachedReq } from "@/lib/utils";
import { sanitizeCode, sanitizeNumber } from "@/lib/security/sanitize";

export interface CreateDraftOrderParams {
  code: string;
  quantity: number;
  productPrice: number;
  productName: string;
}

export interface CreateDraftOrderResponse {
  success: boolean;
  data: {
    code: string;
    target: number;
    alreadySent: number;
    money: number;
    orderStatus: string;
    timeCreate: string;
  };
}

/**
 * Create a draft order with "Pending" status
 * This service handles:
 * 1. Input validation and sanitization
 * 2. Code format validation
 * 3. Duplicate code checking
 * 4. Creating draft order in Google Sheets
 * 
 * @param params - Draft order parameters
 * @returns Draft order data
 */
export async function createDraftOrder(
  params: CreateDraftOrderParams
): Promise<CreateDraftOrderResponse> {
  let { code, quantity, productPrice, productName } = params;

  // Sanitize inputs
  const sanitizedCode = sanitizeCode(code);
  const sanitizedQuantity = sanitizeNumber(quantity, { integer: true, min: 1 });
  const sanitizedProductPrice = sanitizeNumber(productPrice, { min: 0 });

  // Validate required fields after sanitization
  if (!sanitizedCode || sanitizedQuantity === null || sanitizedProductPrice === null) {
    throw new Error("Missing or invalid required fields: code, quantity, productPrice");
  }

  // Now we can safely use the sanitized values
  code = sanitizedCode;
  quantity = sanitizedQuantity;
  productPrice = sanitizedProductPrice;

  // Validate required fields
  if (!code || !quantity || !productPrice) {
    throw new Error("Missing or invalid required fields: code, quantity, productPrice");
  }

  // Validate code format (12 characters, uppercase)
  if (!isValidGenerateCode(code)) {
    throw new Error("Invalid code format. Code must be 12 uppercase characters (A-Z, 0-9)");
  }

  // Check for duplicate code in existing orders (case-insensitive)
  try {
    const sheetData = await cachedReq(`/api/sheet?sheet_name=LIST`);
    
    const existingOrders = Array.isArray(sheetData.data) ? sheetData.data : [];
    
    // Check if code already exists (case-insensitive comparison)
    const isDuplicate = existingOrders.some((order: any) => {
      const orderCode = order.CODE || order.code;
      const match = orderCode && orderCode.toUpperCase() === code.toUpperCase();
      return match;
    });
    
    if (isDuplicate) {
      throw new Error("This code has already been used. Please use a different code.");
    }
  } catch (error: any) {
    // If it's our duplicate error, rethrow it
    if (error.message.includes("already been used")) {
      throw error;
    }
    console.error("Error checking for duplicate codes:", error);
    // Continue anyway - don't block order creation if sheet check fails
  }

  // Calculate target (số Tim bonus)
  const totalPrice = productPrice * quantity;
  const target = quantity;

  // Prepare draft order data
  const now = new Date();
  const sheetData = {
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
