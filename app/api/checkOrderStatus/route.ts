import { cachedReq } from '@/lib/utils/format';
import { parseVietnameseDateTime } from '@/lib/utils/date';
import { NextRequest, NextResponse } from 'next/server';
import { withSecurity } from '@/lib/security';
import { sanitizeCode } from '@/lib/security/sanitize';
import { ORDER_STATUS, OrderRow, SheetResponse } from '@/types/order';
import { ORDER_EXPIRY_MINUTES } from '@/lib/config';
import checkTask from "@/hooks/checkTask";
import { sendToSheet } from "@/services/sheet/send-to-sheet";

async function handler(req: NextRequest) {
    try {
        const { code } = await req.json();

        if (!code) {
            return NextResponse.json(
                { error: 'Order code is required' },
                { status: 400 }
            );
        }

        // Sanitize code input
        const sanitizedCode = sanitizeCode(code);

        // Get orders from Google Sheet via /api/sheet
        // Get orders from Google Sheet via /api/sheet
        const [sheetResponse, taskRes] = await Promise.all([
            cachedReq<SheetResponse<OrderRow>>('/api/sheet?sheet_name=LIST'),
                 checkTask(
                    process.env.CREATER || "", 
                    sanitizedCode, 
                    process.env.USERID || "", 
                    process.env.TOKEN || ""
                ).catch(e => {
                    console.error("CheckTask Error:", e);
                    return { success: false };
                })
            
        ]);
        const response = sheetResponse;
        // Extract data array from response
        const sheetData = response?.data;
        
        if (!sheetData || !Array.isArray(sheetData)) {
            return NextResponse.json(
                { error: 'Failed to fetch order data' },
                { status: 500 }
            );
        }
        // Find order by code AND orderStatus = "removed" (case-insensitive)
        let order = sheetData.find((row: OrderRow) => 
            row.CODE === sanitizedCode && 
            row.ORDER_STATUS?.toLowerCase() === ORDER_STATUS.REMOVED
        );
        if (!order) {
            // Check if code exists with different status
            // Change const to let to allow modification
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
                if (anyOrder && taskRes?.success && taskRes.data) {
                    const apiAlreadySent = Number(taskRes.data.alreadySent || 0);
                    const sheetAlreadySent = Number(anyOrder.ALREADYSENT || 0);
                    // If API has more progress than sheet, update local data & sync back
                    if (apiAlreadySent > sheetAlreadySent) {
                        
                        // 1. Update local object to return fresh data immediately
                        anyOrder = { ...anyOrder, ALREADYSENT: apiAlreadySent };
                        
                        // 2. Fire-and-forget sync to Google Sheet
                        // Use casting as any to matching the updated SheetRowData interface
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
                
                return NextResponse.json({
                    status: anyOrder.ORDER_STATUS?.toLowerCase() || ORDER_STATUS.PENDING,
                    data: anyOrder,
                    remainingSeconds
                });
            }
            
            // Code doesn't exist at all
            return NextResponse.json({
                status: ORDER_STATUS.NOT_FOUND,
                data: null
            });
        }

        // Return removed order
        return NextResponse.json({
            status: ORDER_STATUS.REMOVED,
            message: 'This order code has expired or been removed',
            data: order
        });

    } catch (error: any) {
        console.error('Error in checkOrderStatus API:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// Export with security middleware
export const POST = withSecurity(handler, {
    rateLimitTier: 'relaxed',
    skipDomainValidation: true,
});
