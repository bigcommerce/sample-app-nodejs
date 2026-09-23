import { NextApiRequest, NextApiResponse } from 'next';
import { getBCVerify, removeDataStore } from '../../lib/auth';

// Uninstall callback for the second app registration.
// See lib/auth.ts CLIENT_ID_2/CLIENT_SECRET_2.
export default async function uninstall2(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getBCVerify(req.query, 'secondary');

        await removeDataStore(session);
        res.status(200).end();
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
