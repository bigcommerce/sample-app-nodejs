import { NextApiRequest, NextApiResponse } from 'next';
import { encodePayload, getBCVerify, setSession } from '../../lib/auth';

export default async function load(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Verify when app loaded (launch)
        const session = await getBCVerify(req.query);
        const encodedContext = encodePayload(session); // Signed JWT to validate/ prevent tampering
        const isBaseUrl = session.url === '/';

        await setSession(session);

        res.redirect(302, `${isBaseUrl ? '' : session.url}/?context=${encodedContext}`)
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
