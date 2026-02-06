import { cachedReq } from '@/lib/utils/format';
import { parseVietnameseDateTime } from '@/lib/utils/date';
import { sanitizeCode } from '@/lib/security/sanitize';
import { ORDER_STATUS, OrderRow, SheetResponse } from '@/types/order';
import { ORDER_EXPIRY_MINUTES } from '@/lib/config';
import { checkTask } from "@/services/task/check-task";
import { sendToSheet } from "@/services/sheet/send-to-sheet";

export interface CheckOrderStatusParams {
  code: string;
}

export interface CheckOrderStatusResponse {
  status: string;
  data: OrderRow | null;
  remainingSeconds?: number;
  message?: string;
}

/**
 * Check order status and sync with external API
 * This service handles:
 * 1. Fetching order from Google Sheets
 * 2. Checking external API for task progress
 * 3. Syncing alreadySent if API has newer data
 * 4. Calculating remaining time for pending orders
 * 
 * @param params - Order status check parameters
 * @returns Order status with data and remaining time
 */
export async function checkOrderStatus(
  params: CheckOrderStatusParams
): Promise<CheckOrderStatusResponse> {
  const { code } = params;

  if (!code) {
    throw new Error('Order code is required');
  }

  // Sanitize code input
  const sanitizedCode = sanitizeCode(code);

  // Get environment variables for task checking
  const creator = process.env.CREATER || "";
  const userid = process.env.USERID || "";
  const token = process.env.TOKEN || "";

  try {
    // Get orders from Google Sheet and check task status in parallel
    const [sheetResponse, taskRes] = await Promise.all([
      cachedReq<SheetResponse<OrderRow>>('/api/sheet?sheet_name=LIST'),
      checkTask({
        creator,
        code: sanitizedCode,
        userid,
        token,
      }).catch(e => {
        console.error("CheckTask Error:", e);
        return { success: false };
      })
    ]);

    const response = sheetResponse;
    const sheetData = response?.data;
    
    if (!sheetData || !Array.isArray(sheetData)) {
      throw new Error('Failed to fetch order data');
    }

    // Find order by code AND orderStatus = "removed" (case-insensitive)
    let order = sheetData.find((row: OrderRow) => 
      row.CODE === sanitizedCode && 
      row.ORDER_STATUS?.toLowerCase() === ORDER_STATUS.REMOVED
    );

    if (!order) {
      // Check if code exists with different status
      let anyOrder = sheetData.find((row: OrderRow) => row.CODE === sanitizedCode);

      if (anyOrder) {
        // Code exists but not removed - calculate remaining time
        let remainingSeconds: number | undefined;
        
        if (anyOrder.TIME_CREATE) {
          try {
            const timeCreate = parseVietnameseDateTime(anyOrder.TIME_CREATE);
            const now = new Date();
            const elapsedSeconds = (now.getTime() - timeCreate.getTime()) / 1000;
            const totalSeconds = ORDER_EXPIRY_MINUTES * 60;
            remainingSeconds = Math.max(0, Math.floor(totalSeconds - elapsedSeconds));
          } catch (error) {
            console.error('Error parsing TIME_CREATE:', error);
            // Fallback to full time if parsing fails
            remainingSeconds = ORDER_EXPIRY_MINUTES * 60;
          }
        }

        // --- SYNC LOGIC START ---
        // If external API has data, check if we need to sync
        if (anyOrder && taskRes?.success && 'data' in taskRes && taskRes.data) {
          const apiAlreadySent = Number(taskRes.data.alreadySent || 0);
          const sheetAlreadySent = Number(anyOrder.ALREADYSENT || 0);
          
          // If API has more progress than sheet, update local data & sync back
          if (apiAlreadySent > sheetAlreadySent) {
            // 1. Update local object to return fresh data immediately
            anyOrder = { ...anyOrder, ALREADYSENT: apiAlreadySent };
            
            // 2. Fire-and-forget sync to Google Sheet
            sendToSheet({
              operation: 'UPDATE',
              code: anyOrder.CODE,
              updates: {
                alreadySent: apiAlreadySent
              }
            } as any).catch(err => console.error("Sync Sheet Error:", err));
            
            console.log(`Synced order ${anyOrder.CODE}: Sheet=${sheetAlreadySent} -> API=${apiAlreadySent}`);
          }
        }
        // --- SYNC LOGIC END ---
        
        return {
          status: anyOrder.ORDER_STATUS?.toLowerCase() || ORDER_STATUS.PENDING,
          data: anyOrder,
          remainingSeconds
        };
      }
      
      // Code doesn't exist at all
      return {
        status: ORDER_STATUS.NOT_FOUND,
        data: null
      };
    }

    // Return removed order
    return {
      status: ORDER_STATUS.REMOVED,
      message: 'This order code has expired or been removed',
      data: order
    };

  } catch (error: any) {
    console.error('Error in checkOrderStatus:', error);
    throw new Error(error.message || 'Failed to check order status');
  }
}
