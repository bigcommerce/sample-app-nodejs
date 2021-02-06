import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../../lib/auth';

export default async function store(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { storeId } = await getSession(req);

        res.status(200).json({ storeId });
    } catch (error) {
        res.status(500).end('Authentication failed, please re-install');
    }
}
