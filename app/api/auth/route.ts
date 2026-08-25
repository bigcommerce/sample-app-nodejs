import { NextRequest, NextResponse } from 'next/server';
import { encodePayload, getBCAuth, setSession } from '../../../lib/auth';

export async function GET(req: NextRequest) {
    try {
        // Authenticate the app on install
        const query = Object.fromEntries(req.nextUrl.searchParams);
        const session = await getBCAuth(query);
        const encodedContext = encodePayload(session); // Signed JWT to validate/ prevent tampering

        await setSession(session);

        return NextResponse.redirect(new URL(`/?context=${encodedContext}`, req.url));
    } catch (error) {
        const { message, response } = error;

        return NextResponse.json({ message }, { status: response?.status || 500 });
    }
}
