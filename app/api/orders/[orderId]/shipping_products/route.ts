import { NextRequest, NextResponse } from 'next/server';
import { bigcommerceClient, getSession } from '../../../../../lib/auth';

interface RouteContext {
    params: Promise<{ orderId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
    const { orderId } = await params;

    try {
        const { accessToken, storeHash } = await getSession(req.nextUrl.searchParams.get('context'));
        const bigcommerce = bigcommerceClient(accessToken, storeHash, 'v2');

        const shipping_addresses = await bigcommerce.get(`/orders/${orderId}/shipping_addresses`);
        const products = await bigcommerce.get(`/orders/${orderId}/products`);

        return NextResponse.json({ shipping_addresses, products }, { status: 200 });
    } catch (error) {
        const { message, response } = error;

        return NextResponse.json({ message }, { status: response?.status || 500 });
    }
}
