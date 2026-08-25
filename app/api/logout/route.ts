import { NextRequest, NextResponse } from 'next/server';
import { getSession, logoutUser } from '../../../lib/auth';

export async function GET(req: NextRequest) {
    try {
        const session = await getSession(req.nextUrl.searchParams.get('context'));

        await logoutUser(session);

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        const { message, response } = error;

        return NextResponse.json({ message }, { status: response?.status || 500 });
    }
}
