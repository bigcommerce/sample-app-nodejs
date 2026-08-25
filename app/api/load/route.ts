import { NextRequest, NextResponse } from 'next/server';
import { encodePayload, getBCVerify, setSession } from '../../../lib/auth';

const buildRedirectUrl = (url: string, encodedContext: string) => {
    const [path, query = ''] = url.split('?');
    const queryParams = new URLSearchParams(`context=${encodedContext}&${query}`);

    return `${path}?${queryParams}`;
}

export async function GET(req: NextRequest) {
    try {
        // Verify when app loaded (launch)
        const query = Object.fromEntries(req.nextUrl.searchParams);
        const session = await getBCVerify(query);
        const encodedContext = encodePayload(session); // Signed JWT to validate/ prevent tampering

        await setSession(session);

        return NextResponse.redirect(new URL(buildRedirectUrl(session.url, encodedContext), req.url));
    } catch (error) {
        const { message, response } = error;

        return NextResponse.json({ message }, { status: response?.status || 500 });
    }
}
