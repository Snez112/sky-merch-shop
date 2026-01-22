import axios from "axios";
import type { UpdateOrderParams, UpdateOrderResponse } from "@/types";

/**
 * Update existing order in Google Sheets by code
 * Used to update draft orders after payment verification
 * 
 * @param params - Code to identify order and fields to update
 * @returns Update response
 */
export async function updateSheetOrder(
  params: UpdateOrderParams
): Promise<UpdateOrderResponse> {
  const gsheetBase = process.env.NEXT_PUBLIC_GSHEET_WEBAPP_URL;
  if (!gsheetBase) throw new Error("Missing NEXT_PUBLIC_GSHEET_WEBAPP_URL");

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
