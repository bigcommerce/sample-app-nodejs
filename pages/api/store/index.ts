import { NextApiRequest, NextApiResponse } from 'next';
import { decode, getCookie } from '../../../lib/cookie';

export default async function store(req: NextApiRequest, res: NextApiResponse) {
    try {
        const cookies = getCookie(req);
        const { storeId } = (cookies && decode(cookies)) ?? null;

        res.status(200).json({ storeId });
    } catch (error) {
        res.status(500).end('Authentication failed, please re-install');
    }
}
