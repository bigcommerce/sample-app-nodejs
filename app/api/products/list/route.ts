import { NextRequest, NextResponse } from 'next/server';
import { bigcommerceClient, getSession } from '../../../../lib/auth';

export async function GET(req: NextRequest) {
    try {
        const { accessToken, storeHash } = await getSession(req.nextUrl.searchParams.get('context'));
        const bigcommerce = bigcommerceClient(accessToken, storeHash);
        const { page, limit, sort, direction } = Object.fromEntries(req.nextUrl.searchParams);
        const params = new URLSearchParams({ page, limit, ...(sort && { sort, direction }) }).toString();

        const response = await bigcommerce.get(`/catalog/products?${params}`);

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        const { message, response } = error;

        return NextResponse.json({ message }, { status: response?.status || 500 });
    }
}
