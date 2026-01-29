import axios from "axios";

interface SheetRowData {
  code: string;
  target: number;
  alreadySent: number;
  money: number;
  bankCode: string;
  refCode: string;
  timeCreate: string;
  orderStatus: string;
  bankTime: string;
  doneTime: string;
}

export default async function sendToSheet(sheetData: SheetRowData) {
  const gsheetBase = process.env.GSHEET_WEBAPP_URL;
  if (!gsheetBase) throw new Error("Missing GSHEET_WEBAPP_URL");

  try {
    const response = await axios({
      url: gsheetBase,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: {
        ...sheetData
      },
    });


    return response.data;
  } catch (error: any) {
    console.error("Error sending to sheet:", error);
    throw new Error(`Failed to send to sheet: ${error.message}`);
  }
}
