import { cachedReq } from '@/lib/ultil';
import { NextRequest, NextResponse } from 'next/server';
import { withSecurity } from '@/lib/security';
import { sanitizeCode } from '@/lib/security/sanitize';

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
        const sheetData = await cachedReq<any>(
            '/api/sheet?sheet_name=Orders',
            'GET'
        );

        if (!sheetData || !Array.isArray(sheetData)) {
            return NextResponse.json(
                { error: 'Failed to fetch order data' },
                { status: 500 }
            );
        }

        // Find order by code
        const order = sheetData.find((row: any) => row.code === sanitizedCode);

        if (!order) {
            return NextResponse.json({
                status: 'not_found',
                data: null
            });
        }

        // Return order status
        return NextResponse.json({
            status: order.status || 'pending', // 'pending', 'completed', 'removed', 'expired'
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
