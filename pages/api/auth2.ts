import { NextApiRequest, NextApiResponse } from 'next';
import { encodePayload, getBCAuth, setSession } from '../../lib/auth';

// Install callback for the second app registration.
// See lib/auth.ts CLIENT_ID_2/CLIENT_SECRET_2.
export default async function auth2(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getBCAuth(req.query, 'secondary');
        const encodedContext = encodePayload(session); // Signed JWT to validate/ prevent tampering

        await setSession(session);
        res.redirect(302, `/?context=${encodedContext}`);
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
