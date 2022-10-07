import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, setWelcome } from '../../../lib/auth';

export default async function removeWelcome(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { storeHash } = await getSession(req);

        setTimeout(() => {
            setWelcome(storeHash, false);
        }, 1000);

        res.status(200).json({});
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
