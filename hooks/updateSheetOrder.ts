import axios from "axios";

interface UpdateOrderParams {
  code: string;
  updates: {
    orderStatus?: string;
    bankCode?: string;
    refCode?: string;
    bankTime?: string;
    doneTime?: string;
    alreadySent?: number;
  };
}

interface UpdateOrderResponse {
  success: boolean;
  message: string;
}

/**
 * Update existing order in Google Sheets by code
 * Used to update draft orders after payment verification
 * 
 * @param params - Code to identify order and fields to update
 * @returns Update response
 */
export default async function updateSheetOrder(
  params: UpdateOrderParams
): Promise<UpdateOrderResponse> {
  const gsheetBase = process.env.GSHEET_WEBAPP_URL;
  if (!gsheetBase) throw new Error("Missing GSHEET_WEBAPP_URL");

  const { code, updates } = params;

  try {
    const response = await axios({
      url: gsheetBase,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: {
        operation: "UPDATE", // Tell Apps Script this is an update
        code, // Identify which row to update
        updates, // Fields to update
      },
    });


    return response.data;
  } catch (error: any) {
    console.error("Error updating sheet order:", error);
    throw new Error(`Failed to update sheet order: ${error.message}`);
  }
}
