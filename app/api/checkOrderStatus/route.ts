import { cachedReq, parseVietnameseDateTime } from '@/lib/utils/format';
import { NextRequest, NextResponse } from 'next/server';
import { withSecurity } from '@/lib/security';
import { sanitizeCode } from '@/lib/security/sanitize';
import { ORDER_STATUS, OrderRow, SheetResponse } from '@/types/order';
import { ORDER_EXPIRY_MINUTES } from '@/lib/config';

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
        const response = await cachedReq<SheetResponse<OrderRow>>(
            '/api/sheet?sheet_name=LIST'
        );
        // Extract data array from response
        const sheetData = response?.data;
        
        if (!sheetData || !Array.isArray(sheetData)) {
            return NextResponse.json(
                { error: 'Failed to fetch order data' },
                { status: 500 }
            );
        }
        // Find order by code AND orderStatus = "removed" (case-insensitive)
        const order = sheetData.find((row: OrderRow) => 
            row.CODE === sanitizedCode && 
            row.ORDER_STATUS?.toLowerCase() === ORDER_STATUS.REMOVED
        );
        if (!order) {
            // Check if code exists with different status
            const anyOrder = sheetData.find((row: OrderRow) => row.CODE === sanitizedCode);
            
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
