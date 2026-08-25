import { NextRequest, NextResponse } from 'next/server';
import { getBCVerify, removeDataStore } from '../../../lib/auth';

export async function GET(req: NextRequest) {
    try {
        const query = Object.fromEntries(req.nextUrl.searchParams);
        const session = await getBCVerify(query);

        await removeDataStore(session);

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        const { message, response } = error;

        return NextResponse.json({ message }, { status: response?.status || 500 });
    }
}
