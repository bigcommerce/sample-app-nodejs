import { NextRequest, NextResponse } from 'next/server';
import { bigcommerceClient, getSession } from '../../../../lib/auth';

interface RouteContext {
    params: Promise<{ pid: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
    const { pid } = await params;

    try {
        const { accessToken, storeHash } = await getSession(req.nextUrl.searchParams.get('context'));
        const bigcommerce = bigcommerceClient(accessToken, storeHash);

        const { data } = await bigcommerce.get(`/catalog/products/${pid}`);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const { message, response } = error;

        return NextResponse.json({ message }, { status: response?.status || 500 });
    }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
    const { pid } = await params;
    const body = await req.json();

    try {
        const { accessToken, storeHash } = await getSession(req.nextUrl.searchParams.get('context'));
        const bigcommerce = bigcommerceClient(accessToken, storeHash);

        const { data } = await bigcommerce.put(`/catalog/products/${pid}`, body);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const { message, response } = error;

        return NextResponse.json({ message }, { status: response?.status || 500 });
    }
}
