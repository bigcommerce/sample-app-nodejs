import { NextRequest, NextResponse } from 'next/server';
import { bigcommerceClient, getSession } from '../../../lib/auth';

export async function GET(req: NextRequest) {
    try {
        const { accessToken, storeHash } = await getSession(req.nextUrl.searchParams.get('context'));
        const bigcommerce = bigcommerceClient(accessToken, storeHash);

        const { data } = await bigcommerce.get('/catalog/summary');

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const { message, response } = error;

        return NextResponse.json({ message }, { status: response?.status || 500 });
    }
}
