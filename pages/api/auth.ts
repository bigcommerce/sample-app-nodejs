import { NextApiRequest, NextApiResponse } from 'next';
import { getBCAuth } from '../../lib/auth';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    try {
        await getBCAuth(req.query);

        res.redirect(302, '/');
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
