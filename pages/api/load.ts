import { NextApiRequest, NextApiResponse } from 'next';
import { encodePayload, getBCVerify, setSession } from '../../lib/auth';

export default async function load(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Verify when app loaded (launch)
        const session = await getBCVerify(req.query);
        const storeHash = session?.context?.split('/')[1] || '';
        const encodedContext = encodePayload(storeHash); // Signed JWT to validate/ prevent tampering

        await setSession(session);
        res.redirect(302, `/?context=${encodedContext}`);
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
