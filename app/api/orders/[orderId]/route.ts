import { NextRequest, NextResponse } from 'next/server';
import { bigcommerceClient, getSession } from '../../../../lib/auth';

interface RouteContext {
    params: Promise<{ orderId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
    const { orderId } = await params;

    try {
        const { accessToken, storeHash } = await getSession(req.nextUrl.searchParams.get('context'));
        const bigcommerce = bigcommerceClient(accessToken, storeHash, 'v2');

        const data = await bigcommerce.get(`/orders/${orderId}`);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const { message, response } = error;

        return NextResponse.json({ message }, { status: response?.status || 500 });
    }
}
